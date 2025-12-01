import { Feather } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { db } from "../firebaseConfig";

interface Props {
  hikerId: string;       // UID del usuario
  onBack: () => void;
  onViewMap: (uid: string) => void;
}

export default function HikerProfileDetail({ hikerId, onBack, onViewMap }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const ref = doc(db, "users", hikerId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setData(snap.data());
        }
      } catch (e) {
        console.log("❌ Error cargando usuario:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loadingBox}>
        <Text>No se encontraron datos</Text>
      </View>
    );
  }

  // Normalizar datos
  const allergies =
    data.allergies && data.allergies !== "Ninguna"
      ? [data.allergies]
      : ["Ninguna"];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Feather name="arrow-left" size={22} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil del Visitante</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* CARD PERFIL */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Image
              source={{
                uri: "https://ui-avatars.com/api/?name=" + data.fullName,
              }}
              style={styles.avatar}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{data.fullName}</Text>
              <Text style={styles.email}>{data.email}</Text>

              <View style={styles.badgesRow}>
                <View style={[styles.badge, { backgroundColor: "#2E8B5715" }]}>
                  <Text style={[styles.badgeText, { color: "#2E8B57" }]}>
                    {data.age || "—"} años
                  </Text>
                </View>

                <View style={[styles.badge, { backgroundColor: "#ff000015" }]}>
                  <Text style={[styles.badgeText, { color: "#d10000" }]}>
                    Tipo: {data.blood}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* CONTACTO */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Contacto</Text>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Emergencia:</Text>
            <Text style={styles.value}>{data.emergency || "—"}</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Dirección:</Text>
            <Text style={[styles.value, { textAlign: "right" }]}>
              {data.address || "—"}
            </Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Ciudad:</Text>
            <Text style={styles.value}>{data.location || "—"}</Text>
          </View>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => Linking.openURL(`tel:${data.emergency}`)}
          >
            <Feather name="phone" size={18} color="#fff" />
            <Text style={styles.primaryBtnText}>Llamar</Text>
          </TouchableOpacity>
        </View>

        {/* INFORMACIÓN MÉDICA */}
        <View style={[styles.card, { backgroundColor: "#ffe6e6" }]}>
          <Text style={styles.sectionTitle}>Información Médica</Text>

          <Text style={styles.label}>Alergias:</Text>
          <View style={{ flexDirection: "row", marginTop: 4 }}>
            {allergies.map((a, i) => (
              <View key={i} style={styles.allergyBadge}>
                <Text style={styles.allergyText}>{a}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 12 }} />

          <Text style={styles.label}>Descripción:</Text>
          <Text style={styles.value}>
            {data.description && data.description !== ""
              ? data.description
              : "Sin descripción"}
          </Text>
        </View>

        {/* BOTÓN MAPA */}
        <TouchableOpacity
          style={styles.primaryBtnLarge}
          onPress={() => onViewMap(hikerId)}
        >
          <Feather name="map" size={20} color="#fff" />
          <Text style={styles.primaryBtnText}>Ver Mapa en Vivo</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ███████████████████████ STYLES ███████████████████████ */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f7" },

  loadingBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backBtn: {
    backgroundColor: "#f5f5f7",
    padding: 8,
    borderRadius: 40,
  },

  headerTitle: { fontSize: 18, fontWeight: "600", color: "#1a1a1a" },

  scroll: { padding: 20, paddingBottom: 120 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },

  row: { flexDirection: "row", alignItems: "center", gap: 15 },

  avatar: { width: 80, height: 80, borderRadius: 20 },

  name: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  email: { fontSize: 13, color: "#86868b", marginTop: 2 },

  badgesRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },

  badge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 10,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },

  label: { fontSize: 13, color: "#86868b" },
  value: { fontSize: 14, color: "#1a1a1a" },

  separator: {
    height: 1,
    backgroundColor: "#e5e5ea",
    marginVertical: 10,
  },

  allergyBadge: {
    backgroundColor: "#ffcccc",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 6,
  },

  allergyText: { color: "#b30000", fontWeight: "600", fontSize: 12 },

  primaryBtn: {
    marginTop: 16,
    backgroundColor: "#1E90FF",
    borderRadius: 14,
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  primaryBtnLarge: {
    backgroundColor: "#1E90FF",
    borderRadius: 16,
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },

  primaryBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
