import { Feather } from "@expo/vector-icons";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { auth, db } from "../firebaseConfig";
import LogoutConfirmDialog from "./LogoutConfirmDialog";

interface CompanyProfileProps {
  onBack: () => void;
  onLogout?: () => void;
}

export default function CompanyProfile({ onBack, onLogout }: CompanyProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const [companyData, setCompanyData] = useState({
    companyName: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    description: "",
    logoUrl: "",
  });

  const [editData, setEditData] = useState({ ...companyData });
  const [recentVisitors, setRecentVisitors] = useState<any[]>([]);

  // 🟢 Cargar datos desde Firestore
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const companyRef = doc(db, "companies", user.uid);
        const snap = await getDoc(companyRef);

        if (snap.exists()) {
          const data = snap.data();
          setCompanyData({
            companyName: data.companyName || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
            website: data.website || "",
            description: data.description || "",
            logoUrl: data.logoUrl || "",
          });
          setEditData({
            companyName: data.companyName || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
            website: data.website || "",
            description: data.description || "",
            logoUrl: data.logoUrl || "",
          });
        }

        // 🔹 Cargar visitantes recientes
        const visitorsRef = collection(db, "companies", user.uid, "visitors");
        const q = query(visitorsRef, orderBy("checkIn", "desc"), limit(4));
        const snapVisitors = await getDocs(q);
        const visitorsList = snapVisitors.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecentVisitors(visitorsList);
      } catch (err) {
        console.log("❌ Error cargando perfil de empresa:", err);
        Alert.alert("Error", "No se pudieron cargar los datos de la empresa");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  // 🟢 Guardar cambios en Firestore
  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const companyRef = doc(db, "companies", user.uid);
      await updateDoc(companyRef, {
        companyName: editData.companyName,
        email: editData.email,
        phone: editData.phone,
        address: editData.address,
        website: editData.website,
        description: editData.description,
      });

      setCompanyData(editData);
      setIsEditing(false);
      Alert.alert("✅ Guardado", "Los cambios se han actualizado correctamente");
    } catch (err) {
      console.log("❌ Error al guardar:", err);
      Alert.alert("Error", "No se pudieron guardar los cambios");
    }
  };

  const handleCancel = () => {
    setEditData({ ...companyData });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
          <Feather name="arrow-left" size={22} color="#1a1a1a" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Perfil de Empresa</Text>

        <View style={styles.headerIcons}>
          {!isEditing && onLogout && (
            <TouchableOpacity
              onPress={() => setShowLogoutDialog(true)}
              style={styles.logoutBtn}
            >
              <Feather name="log-out" size={20} color="#ff3b30" />
            </TouchableOpacity>
          )}
          {!isEditing ? (
            <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.iconBtn}>
              <Feather name="edit" size={20} color="#1a1a1a" />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 32 }} />
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo y nombre */}
        <Animated.View entering={FadeInUp.duration(400)} style={styles.centered}>
          <View style={styles.logoWrapper}>
            <View style={styles.logoContainer}>
              {companyData.logoUrl ? (
                <Image source={{ uri: companyData.logoUrl }} style={styles.logoImage} />
              ) : (
                <Feather name="image" size={40} color="#1E90FF" />
              )}
            </View>
          </View>

          {isEditing ? (
            <TextInput
              value={editData.companyName}
              onChangeText={(text) => setEditData({ ...editData, companyName: text })}
              style={styles.inputName}
            />
          ) : (
            <Text style={styles.name}>{companyData.companyName}</Text>
          )}

          <View style={styles.badge}>
            <Text style={styles.badgeText}>Cuenta Empresa</Text>
          </View>
        </Animated.View>

        {/* Información de contacto */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.section}>
          <Text style={styles.sectionTitle}>Información de contacto</Text>

          <View style={styles.infoCard}>
            {/* Email */}
            <View style={styles.infoRow}>
              <Feather name="mail" size={16} color="#86868b" />
              {isEditing ? (
                <TextInput
                  style={styles.inputField}
                  value={editData.email}
                  onChangeText={(text) => setEditData({ ...editData, email: text })}
                />
              ) : (
                <Text style={styles.infoText}>{companyData.email}</Text>
              )}
            </View>

            <View style={styles.divider} />

            {/* Teléfono */}
            <View style={styles.infoRow}>
              <Feather name="phone" size={16} color="#86868b" />
              {isEditing ? (
                <TextInput
                  style={styles.inputField}
                  value={editData.phone}
                  onChangeText={(text) => setEditData({ ...editData, phone: text })}
                />
              ) : (
                <Text style={styles.infoText}>{companyData.phone}</Text>
              )}
            </View>

            <View style={styles.divider} />

            {/* Dirección */}
            <View style={styles.infoRow}>
              <Feather name="map-pin" size={16} color="#86868b" />
              {isEditing ? (
                <TextInput
                  style={[styles.inputField, { height: 60 }]}
                  value={editData.address}
                  multiline
                  onChangeText={(text) => setEditData({ ...editData, address: text })}
                />
              ) : (
                <Text style={styles.infoText}>{companyData.address}</Text>
              )}
            </View>

            <View style={styles.divider} />

            {/* Sitio web */}
            <View style={styles.infoRow}>
              <Feather name="globe" size={16} color="#86868b" />
              {isEditing ? (
                <TextInput
                  style={styles.inputField}
                  value={editData.website}
                  onChangeText={(text) => setEditData({ ...editData, website: text })}
                />
              ) : (
                <Text style={[styles.infoText, { color: "#1E90FF" }]}>
                  {companyData.website}
                </Text>
              )}
            </View>
          </View>
        </Animated.View>

        {/* Descripción */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>

          {isEditing ? (
            <View style={styles.descBox}>
              <TextInput
                style={[styles.inputField, { height: 100 }]}
                value={editData.description}
                multiline
                onChangeText={(text) => {
                  if (text.length <= 200) setEditData({ ...editData, description: text });
                }}
              />
              <Text style={styles.counter}>{editData.description.length}/200</Text>
            </View>
          ) : (
            <Text style={styles.infoText}>
              {companyData.description || "Agrega una breve descripción sobre tu empresa."}
            </Text>
          )}
        </Animated.View>

        {/* Botones de edición */}
        {isEditing && (
          <View style={styles.editActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Feather name="x" size={16} color="#1a1a1a" />
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Feather name="save" size={16} color="#fff" />
              <Text style={styles.saveText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Visitantes recientes */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.section}>
          <Text style={styles.sectionTitle}>Visitantes recientes</Text>

          {recentVisitors.length === 0 ? (
            <Text style={{ color: "#86868b" }}>No hay visitantes recientes.</Text>
          ) : (
            recentVisitors.map((v) => (
              <View key={v.id} style={styles.visitorCard}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {v.name?.split(" ").map((n: string) => n[0]).join("")}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.visitorName}>{v.name}</Text>
                  <Text style={styles.visitorTime}>
                    {v.checkIn?.toDate
                      ? v.checkIn.toDate().toLocaleString()
                      : "Sin fecha"}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    v.status === "Activo" ? styles.activeBadge : styles.completedBadge,
                  ]}
                >
                  <Text
                    style={
                      v.status === "Activo" ? styles.activeText : styles.completedText
                    }
                  >
                    {v.status === "Activo" ? "Activo" : "Salió"}
                  </Text>
                </View>
              </View>
            ))
          )}
        </Animated.View>
      </ScrollView>

      <LogoutConfirmDialog
        isOpen={showLogoutDialog}
        onConfirm={() => {
          setShowLogoutDialog(false);
          setTimeout(() => onLogout?.(), 200);
        }}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f7" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  iconBtn: {
    backgroundColor: "#f5f5f7",
    padding: 8,
    borderRadius: 40,
  },
  headerIcons: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoutBtn: {
    backgroundColor: "#ff3b3010",
    padding: 8,
    borderRadius: 40,
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#1a1a1a" },
  centered: { alignItems: "center", marginBottom: 20 },
  logoWrapper: { marginBottom: 10 },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: "#EAF6EF",
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: { width: "100%", height: "100%", borderRadius: 30 },
  name: { fontSize: 18, color: "#1a1a1a", fontWeight: "600" },
  inputName: {
    fontSize: 18,
    color: "#1a1a1a",
    backgroundColor: "#f5f5f7",
    borderRadius: 12,
    padding: 10,
    textAlign: "center",
  },
  badge: {
    backgroundColor: "#1E90FF15",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 6,
  },
  badgeText: { color: "#1E90FF", fontSize: 13, fontWeight: "500" },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#1a1a1a", marginBottom: 8 },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  infoRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 10 },
  infoText: { color: "#1a1a1a", flex: 1 },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 6 },
  inputField: {
    flex: 1,
    backgroundColor: "#f5f5f7",
    borderRadius: 10,
    padding: 8,
    fontSize: 14,
    color: "#1a1a1a",
  },
  descBox: { backgroundColor: "#fff", borderRadius: 16, padding: 12 },
  counter: { textAlign: "right", fontSize: 12, color: "#86868b", marginTop: 4 },
  editActions: { flexDirection: "row", gap: 10, marginVertical: 20 },
  cancelBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#e5e5e5",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#1E90FF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
  },
  cancelText: { color: "#1a1a1a", fontWeight: "600" },
  saveText: { color: "#fff", fontWeight: "600" },
  visitorCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginTop: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1E90FF15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: { color: "#1E90FF", fontWeight: "700" },
  visitorName: { color: "#1a1a1a", fontSize: 15 },
  visitorTime: { color: "#86868b", fontSize: 13 },
  statusBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  activeBadge: { backgroundColor: "#1E90FF15" },
  completedBadge: { backgroundColor: "#e5e5ea" },
  activeText: { color: "#1E90FF", fontWeight: "500", fontSize: 12 },
  completedText: { color: "#666", fontWeight: "500", fontSize: 12 },
});
