import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router"; // ✅ navegación moderna de Expo Router
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { auth, db } from "../firebaseConfig";

interface HikerHomeProps {
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

export default function HikerHome({ onNavigate, onLogout }: HikerHomeProps) {
  const [brazaletConnected, setBrazaletConnected] = useState(false);
  const [hasPlaces, setHasPlaces] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [loadingName, setLoadingName] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const data = snap.data();
          setUserName(data.fullName || "Hiker");
          setBrazaletConnected(data.brazaletActive || false);
          setHasPlaces(data.places?.length > 0 || false);
        } else {
          setUserName("Hiker");
        }
      } catch (err) {
        console.log("❌ Error al obtener nombre:", err);
        setUserName("Hiker");
      } finally {
        setLoadingName(false);
      }
    };

    fetchUserData();
  }, []);

  // 🔗 Llevar al QR (pantalla fuera de tabs)
  const goToQR = () => {
    router.push("/qr");
  };

  return (
    <LinearGradient
      colors={["#FFFFFF", "#F5F5F7"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          {loadingName ? (
            <ActivityIndicator size="small" color="#2E8B57" />
          ) : (
            <>
              <Text style={styles.headerTitle}>
                Hola, {userName ?? "Hiker"} 👋
              </Text>
              <Text style={styles.headerSubtitle}>
                {brazaletConnected
                  ? "¡Listo para tu próxima aventura!"
                  : "Activa tu brazalete para comenzar"}
              </Text>
            </>
          )}
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => onNavigate("notifications")}
          >
            <Ionicons name="notifications-outline" size={22} color="#1a1a1a" />
            <View style={styles.dot} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => onNavigate("hiker-profile")}
          >
            <Ionicons name="person-outline" size={22} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <View style={styles.content}>
          {/* 🔗 SafeBrazalet */}
          <Animated.View entering={FadeInDown.duration(400)}>
            <TouchableOpacity
              style={[
                styles.card,
                brazaletConnected ? styles.brazaletActive : styles.brazaletInactive,
              ]}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor: brazaletConnected
                          ? "#FF7F1115"
                          : "#f0f0f0",
                      },
                    ]}
                  >
                    <Ionicons
                      name="bluetooth-outline"
                      size={26}
                      color={brazaletConnected ? "#FF7F11" : "#b0b0b0"}
                    />
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.cardTitle}>SafeBrazalet</Text>
                    <Text style={styles.cardSubtitle}>
                      {brazaletConnected
                        ? "Conectado y listo"
                        : "Aún no vinculado"}
                    </Text>
                  </View>
                </View>
                {brazaletConnected && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Activo</Text>
                  </View>
                )}
              </View>

              {brazaletConnected ? (
                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Ionicons
                      name="battery-half-outline"
                      size={16}
                      color="#86868b"
                    />
                    <Text style={styles.statLabel}>Batería</Text>
                    <Text style={styles.statValue}>85%</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Ionicons
                      name="location-outline"
                      size={16}
                      color="#86868b"
                    />
                    <Text style={styles.statLabel}>GPS</Text>
                    <Text style={[styles.statValue, { color: "#2E8B57" }]}>
                      Excelente
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.unlinkedContainer}>
                  <Ionicons name="qr-code-outline" size={40} color="#FF7F11" />
                  <Text style={styles.unlinkedText}>
                    Escanea tu QR en un punto autorizado para activar tu
                    brazalete y comenzar tu aventura.
                  </Text>
                  <TouchableOpacity style={styles.connectBtn} onPress={goToQR}>
                    <Text style={styles.connectBtnText}>Escanear QR</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* 🚨 SOS */}
          <Animated.View entering={FadeInDown.delay(150).duration(400)}>
            <TouchableOpacity
              onPress={() => onNavigate("emergency")}
              activeOpacity={0.8}
              style={styles.sosCard}
            >
              <View style={styles.sosIcon}>
                <Ionicons name="alert-circle-outline" size={28} color="#FF3B30" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sosTitle}>SOS Emergencia</Text>
                <Text style={styles.sosSubtitle}>
                  Activar alerta de emergencia
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#86868b" />
            </TouchableOpacity>
          </Animated.View>

          {/* 🗺️ Lugares registrados */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Lugares registrados</Text>
            </View>

            {hasPlaces ? (
              <View>{/* Próximamente lista de lugares */}</View>
            ) : (
              <View style={styles.emptyCard}>
                <Ionicons name="map-outline" size={40} color="#86868b" />
                <Text style={styles.emptyTitle}>Sin lugares registrados</Text>
                <Text style={styles.emptyText}>
                  Escanea un QR en tu primer punto de senderismo para registrar
                  tus rutas y desbloquear tus estadísticas.
                </Text>
                <TouchableOpacity style={styles.exploreBtn} onPress={goToQR}>
                  <Ionicons
                    name="qr-code-outline"
                    size={18}
                    color="#2E8B57"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.exploreText}>Escanear mi primer QR</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>

          {/* ✅ Consejo */}
          <Animated.View entering={FadeInDown.delay(450).duration(400)}>
            <View style={styles.tipCard}>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#2E8B57"
              />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.tipTitle}>Consejo de seguridad</Text>
                <Text style={styles.tipText}>
                  Mantén tu brazalete cargado y recuerda escanear tu QR en cada
                  punto de control para mantenerte visible y seguro.
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#1a1a1a" },
  headerSubtitle: { color: "#86868b", fontSize: 13 },
  headerIcons: { flexDirection: "row", gap: 10 },
  iconButton: {
    backgroundColor: "#f5f5f7",
    borderRadius: 50,
    padding: 8,
    position: "relative",
  },
  dot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: "#FF7F11",
    borderRadius: 4,
  },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  brazaletActive: { backgroundColor: "#FF7F1110", borderColor: "#FF7F1120" },
  brazaletInactive: { backgroundColor: "#f5f5f7", borderColor: "#ddd" },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontWeight: "600", color: "#1a1a1a" },
  cardSubtitle: { color: "#86868b", fontSize: 13 },
  badge: {
    backgroundColor: "#2E8B5715",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: { color: "#2E8B57", fontSize: 12, fontWeight: "500" },
  statsRow: { flexDirection: "row", gap: 10 },
  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    alignItems: "flex-start",
  },
  statLabel: { fontSize: 11, color: "#86868b" },
  statValue: { fontSize: 16, fontWeight: "600", color: "#1a1a1a" },
  connectBtn: {
    backgroundColor: "#FF7F11",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },
  connectBtnText: { color: "#fff", fontWeight: "600" },
  unlinkedContainer: { alignItems: "center", paddingVertical: 16 },
  unlinkedText: {
    color: "#555",
    textAlign: "center",
    fontSize: 13,
    marginTop: 8,
    marginHorizontal: 10,
  },
  sosCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FF3B3020",
    backgroundColor: "#FF3B3010",
    marginBottom: 20,
  },
  sosIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#FF3B3020",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  sosTitle: { fontWeight: "600", color: "#1a1a1a" },
  sosSubtitle: { fontSize: 13, color: "#86868b" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: { fontWeight: "600", color: "#1a1a1a", fontSize: 16 },
  emptyCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
  },
  emptyTitle: { fontWeight: "600", color: "#1a1a1a", marginTop: 10 },
  emptyText: {
    color: "#86868b",
    textAlign: "center",
    fontSize: 13,
    marginVertical: 8,
  },
  exploreBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2E8B5720",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 4,
  },
  exploreText: { color: "#2E8B57", fontWeight: "600" },
  tipCard: {
    flexDirection: "row",
    backgroundColor: "#2E8B5710",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2E8B5720",
    padding: 14,
    marginTop: 20,
  },
  tipTitle: { color: "#1a1a1a", fontWeight: "600" },
  tipText: { color: "#86868b", fontSize: 13, marginTop: 2 },
});
