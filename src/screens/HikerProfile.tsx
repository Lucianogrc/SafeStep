// src/screens/HikerProfile.tsx
import { Feather } from "@expo/vector-icons";
import { doc, getDoc, updateDoc } from "firebase/firestore";
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

interface HikerProfileProps {
  onBack: () => void;
  onLogout?: () => void;
}

export default function HikerProfile({ onBack, onLogout }: HikerProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    name: "",
    blood: "",
    emergency: "",
    weight: "",
    height: "",
    description: "",
  });

  const [edit, setEdit] = useState({ ...data });

  // 🟢 Cargar datos del usuario desde Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const userData = snap.data();
          setData({
            name: userData.fullName || "",
            blood: userData.blood || "",
            emergency: userData.emergency || "",
            weight: "",
            height: "",
            description: "",
          });
          setEdit({
            name: userData.fullName || "",
            blood: userData.blood || "",
            emergency: userData.emergency || "",
            weight: "",
            height: "",
            description: "",
          });
        }
      } catch (err) {
        console.log("❌ Error cargando perfil:", err);
        Alert.alert("Error", "No se pudieron cargar tus datos");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // 🟢 Guardar cambios en Firestore
  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        fullName: edit.name,
        blood: edit.blood,
        emergency: edit.emergency,
        weight: edit.weight,
        height: edit.height,
        description: edit.description,
      });

      setData(edit);
      setIsEditing(false);

      Alert.alert("✅ Cambios guardados", "Tu perfil se ha actualizado correctamente");
    } catch (err) {
      console.log("❌ Error al guardar perfil:", err);
      Alert.alert("Error", "No se pudieron guardar los cambios");
    }
  };

  const handleCancel = () => {
    setEdit({ ...data });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#2E8B57" />
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

        <Text style={styles.headerTitle}>Mi perfil</Text>

        <View style={{ flexDirection: "row", gap: 10 }}>
          {!isEditing && onLogout && (
            <TouchableOpacity
              onPress={onLogout}
              style={[styles.iconBtn, { backgroundColor: "#ff3b3010" }]}
            >
              <Feather name="log-out" size={20} color="#ff3b30" />
            </TouchableOpacity>
          )}
          {!isEditing ? (
            <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.iconBtn}>
              <Feather name="edit-2" size={20} color="#1a1a1a" />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + Nombre */}
        <Animated.View entering={FadeInUp.duration(400)}>
          <View style={styles.card}>
            <View style={{ alignItems: "center" }}>
              <View style={styles.avatarBox}>
                {avatar ? (
                  <Image source={{ uri: avatar }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarInitials}>
                      {data.name
                        ? data.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "?"}
                    </Text>
                  </View>
                )}
                {isEditing && (
                  <TouchableOpacity
                    onPress={() => console.log("Cambiar foto")}
                    style={styles.cameraBtn}
                  >
                    <Feather name="camera" size={16} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>

              {isEditing ? (
                <TextInput
                  style={styles.nameInput}
                  value={edit.name}
                  onChangeText={(v) => setEdit({ ...edit, name: v })}
                  placeholder="Tu nombre"
                />
              ) : (
                <Text style={styles.nameText}>{data.name || "Sin nombre"}</Text>
              )}
              <Text style={styles.badge}>Cuenta Hiker</Text>
            </View>
          </View>
        </Animated.View>

        {/* Información médica */}
        <Animated.View entering={FadeInUp.duration(400).delay(100)}>
          <Text style={styles.sectionTitle}>Información médica</Text>
          <View style={styles.card}>
            {/* Tipo de sangre */}
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.label}>Tipo de sangre</Text>
              {isEditing ? (
                <View style={styles.bloodGrid}>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.bloodBtn,
                        edit.blood === type && {
                          borderColor: "#2E8B57",
                          backgroundColor: "#2E8B5710",
                        },
                      ]}
                      onPress={() => setEdit({ ...edit, blood: type })}
                    >
                      <Text
                        style={[
                          styles.bloodText,
                          edit.blood === type && { color: "#2E8B57", fontWeight: "bold" },
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.infoRow}>
                  <Feather name="droplet" size={16} color="#86868b" />
                  <Text style={styles.infoText}>{data.blood || "No especificado"}</Text>
                </View>
              )}
            </View>

            {/* Peso */}
            <View style={styles.field}>
              <Text style={styles.label}>Peso (kg)</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={edit.weight}
                  onChangeText={(v) => setEdit({ ...edit, weight: v })}
                  keyboardType="numeric"
                  placeholder="Ej. 70"
                />
              ) : (
                <View style={styles.infoRow}>
                  <Feather name="activity" size={16} color="#86868b" />
                  <Text style={styles.infoText}>
                    {data.weight ? `${data.weight} kg` : "Sin registrar"}
                  </Text>
                </View>
              )}
            </View>

            {/* Altura */}
            <View style={styles.field}>
              <Text style={styles.label}>Altura (cm)</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={edit.height}
                  onChangeText={(v) => setEdit({ ...edit, height: v })}
                  keyboardType="numeric"
                  placeholder="Ej. 175"
                />
              ) : (
                <View style={styles.infoRow}>
                  <Feather name="bar-chart-2" size={16} color="#86868b" />
                  <Text style={styles.infoText}>
                    {data.height ? `${data.height} cm` : "Sin registrar"}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Animated.View>

        {/* Contacto */}
        <Animated.View entering={FadeInUp.duration(400).delay(200)}>
          <Text style={styles.sectionTitle}>Contacto de emergencia</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Teléfono</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={edit.emergency}
                onChangeText={(v) => setEdit({ ...edit, emergency: v })}
                keyboardType="phone-pad"
                placeholder="Ej. +52 3312345678"
              />
            ) : (
              <View style={styles.infoRow}>
                <Feather name="phone" size={16} color="#86868b" />
                <Text style={styles.infoText}>{data.emergency || "No registrado"}</Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Descripción */}
        <Animated.View entering={FadeInUp.duration(400).delay(300)}>
          <Text style={styles.sectionTitle}>Descripción personal</Text>
          <View style={styles.card}>
            {isEditing ? (
              <>
                <TextInput
                  style={[styles.input, { height: 100, textAlignVertical: "top" }]}
                  multiline
                  value={edit.description}
                  onChangeText={(v) => setEdit({ ...edit, description: v })}
                  placeholder="Escribe una breve bio..."
                  maxLength={150}
                />
                <Text style={styles.counter}>{edit.description.length}/150</Text>
              </>
            ) : (
              <Text style={styles.description}>
                {data.description || "Agrega una breve descripción sobre ti."}
              </Text>
            )}
          </View>
        </Animated.View>

        {/* Acciones */}
        {isEditing ? (
          <View style={styles.editActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveText}>Guardar cambios</Text>
            </TouchableOpacity>
          </View>
        ) : (
          onLogout && (
            <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
              <Feather name="log-out" size={18} color="#ff3b30" />
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            </TouchableOpacity>
          )
        )}
      </ScrollView>
    </View>
  );
}

// 🧩 Estilos iguales a tu versión
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
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#1a1a1a" },
  iconBtn: {
    backgroundColor: "#f5f5f7",
    padding: 8,
    borderRadius: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  avatarBox: { position: "relative", marginBottom: 12 },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#2E8B5710",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: { width: 100, height: 100, borderRadius: 50 },
  avatarInitials: { fontSize: 28, color: "#2E8B57", fontWeight: "700" },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2E8B57",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  nameText: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  nameInput: {
    backgroundColor: "#f5f5f7",
    borderRadius: 14,
    padding: 10,
    textAlign: "center",
    width: "100%",
  },
  badge: {
    marginTop: 6,
    color: "#2E8B57",
    fontSize: 13,
    fontWeight: "600",
    backgroundColor: "#2E8B5715",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  sectionTitle: {
    color: "#1a1a1a",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 30,
    marginBottom: 10,
  },
  label: { color: "#86868b", fontSize: 13, marginBottom: 6 },
  input: {
    backgroundColor: "#f5f5f7",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
    fontSize: 15,
    color: "#1a1a1a",
  },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  infoText: { color: "#1a1a1a", fontSize: 15 },
  field: { marginTop: 10 },
  bloodGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  bloodBtn: {
    width: "22%",
    height: 40,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e5e5ea",
    alignItems: "center",
    justifyContent: "center",
  },
  bloodText: { color: "#555" },
  description: { color: "#1a1a1a", fontSize: 15, lineHeight: 22 },
  counter: { color: "#86868b", fontSize: 12, textAlign: "right", marginTop: 6 },
  editActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#f5f5f7",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelText: { color: "#1a1a1a", fontWeight: "600" },
  saveBtn: {
    flex: 1,
    backgroundColor: "#2E8B57",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "600" },
  logoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ff3b30",
    borderRadius: 14,
    paddingVertical: 12,
    marginTop: 20,
  },
  logoutText: { color: "#ff3b30", fontWeight: "600", marginLeft: 6 },
});
