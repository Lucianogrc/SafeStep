// src/screens/HikerHome.tsx
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
import { auth, db } from "../Services/firebaseConfig";

interface HikerHomeProps {
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

interface HikerPlace {
  companyId: string;
  companyName: string;
  active?: boolean;
  lastCheckInAt?: any;
}

export default function HikerHome({ onNavigate, onLogout }: HikerHomeProps) {
  const [brazaletConnected, setBrazaletConnected] = useState(false);
  const [hasPlaces, setHasPlaces] = useState(false);
  const [places, setPlaces] = useState<HikerPlace[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [loadingName, setLoadingName] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log("[HIKER_HOME] No hay usuario logueado");
          return;
        }

        console.log("[HIKER_HOME] UID actual:", user.uid);

        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const data = snap.data() as any;
          console.log("[HIKER_HOME] Documento de usuario:", data);

          setUserName(data.fullName || "Hiker");
          setBrazaletConnected(data.brazaletActive || false);

          // 🔹 Normalizamos places: debe ser un ARRAY de objetos
          const rawPlaces: any[] = Array.isArray(data.places) ? data.places : [];
          console.log("[HIKER_HOME] places crudos de Firestore:", rawPlaces);

          const userPlaces: HikerPlace[] = rawPlaces.map((p) => ({
            companyId: p.companyId,
            companyName: p.companyName,
            active: p.active ?? false,
            lastCheckInAt: p.lastCheckInAt,
          }));

          console.log("[HIKER_HOME] places parseados:", userPlaces);

          setPlaces(userPlaces);
          setHasPlaces(userPlaces.length > 0);
        } else {
          console.log("[HIKER_HOME] No existe doc de usuario");
          setUserName("Hiker");
        }
      } catch (err) {
        console.log("❌ Error al obtener nombre/places:", err);
        setUserName("Hiker");
      } finally {
        setLoadingName(false);
      }
    };

    fetchUserData();
  }, []);

  // 🔗 Llevar al QR
  const goToQR = () => {
    onNavigate("qr");
  };

  // Solo usamos esto para poner primero los activos
  const activePlaces = places.filter((p) => p.active);

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
                  : "Activa tu código QR para comenzar"}
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
          {/* 🚨 SOS */}
          <Animated.View entering={FadeInDown.delay(150).duration(400)}>
            <TouchableOpacity
              onPress={() => onNavigate("emergency")}
              activeOpacity={0.8}
              style={styles.sosCard}
            >
              <View style={styles.sosIcon}>
                <Ionicons
                  name="alert-circle-outline"
                  size={28}
                  color="#FF3B30"
                />
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
              <View>
                {/* Lugares activos */}
                {activePlaces.length > 0 &&
                  activePlaces.map((p, index) => (
                    <TouchableOpacity
                      key={`active-${p.companyId}-${index}`}
                      style={styles.placeCard}
                      activeOpacity={0.9}
                      onPress={() => onNavigate(`company-${p.companyId}`)}
                    >
                      <View style={styles.placeIcon}>
                        <Ionicons
                          name="map-outline"
                          size={22}
                          color="#1E90FF"
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.placeName}>
                          {p.companyName}
                        </Text>
                        <Text style={styles.placeMeta}>
                          Activo actualmente
                        </Text>
                      </View>
                      <View style={styles.badgeActive}>
                        <Text style={styles.badgeActiveText}>Activo</Text>
                      </View>
                    </TouchableOpacity>
                  ))}

                {/* Resto de lugares (historial) */}
                {places
                  .filter((p) => !p.active)
                  .map((p, index) => (
                    <TouchableOpacity
                      key={`history-${p.companyId}-${index}`}
                      style={styles.placeHistoryCard}
                      activeOpacity={0.9}
                      onPress={() => onNavigate(`company-${p.companyId}`)}
                    >
                      <View style={styles.placeIconMuted}>
                        <Ionicons
                          name="map-outline"
                          size={22}
                          color="#b0b0b0"
                        />
                      </View>
                      <View>
                        <Text style={styles.placeName}>{p.companyName}</Text>
                        <Text style={styles.placeMeta}>Visita anterior</Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#86868b"
                        style={{ marginLeft: "auto" }}
                      />
                    </TouchableOpacity>
                  ))}
              </View>
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
                  Recuerda escanear tu QR en cada punto de control para
                  mantenerte visible y seguro.
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

  // Cards de lugares
  placeCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e5ea",
  },
  placeHistoryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  placeIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#E6F0FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  placeIconMuted: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#f5f5f7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  placeName: { fontWeight: "600", color: "#1a1a1a", fontSize: 15 },
  placeMeta: { color: "#86868b", fontSize: 13, marginTop: 2 },

  badgeActive: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#2E8B5715",
  },
  badgeActiveText: { color: "#2E8B57", fontSize: 12, fontWeight: "500" },

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
