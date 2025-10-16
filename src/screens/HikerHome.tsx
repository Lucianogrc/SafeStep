import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface HikerHomeProps {
  onNavigate: (screen: string) => void;
  onTabChange?: (tab: string) => void;
  onLogout: () => void;
}

const mockPlaces = [
  { id: "1", name: "Parque Nacional Verde", lastVisit: "Hoy, 10:30 AM", visits: 5, status: "active" },
  { id: "2", name: "Reserva Natural El Pino", lastVisit: "15 Dic 2024", visits: 3, status: "completed" },
  { id: "3", name: "Bosque Protegido Aurora", lastVisit: "3 Nov 2024", visits: 2, status: "completed" },
];

export default function HikerHome({ onNavigate, onTabChange }: HikerHomeProps) {
  const [brazaletConnected] = useState(true);
  const hasPlaces = mockPlaces.length > 0;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={["#fff", "#f5f5f7"]} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Hola, Juan 👋</Text>
            <Text style={styles.headerSubtitle}>Listo para tu aventura</Text>
          </View>
          <View style={styles.icons}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => onNavigate("notifications")}
            >
              <Ionicons name="notifications-outline" size={22} color="#1a1a1a" />
              <View style={styles.dot} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => onNavigate("hiker-profile")}
            >
              <Ionicons name="person-outline" size={22} color="#1a1a1a" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* CONTENT */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.content}>
          {/* 🗺️ Lugares registrados */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lugares registrados</Text>
            {hasPlaces && (
              <TouchableOpacity onPress={() => onTabChange?.("places")}>
                <Text style={styles.sectionLink}>Ver todos</Text>
              </TouchableOpacity>
            )}
          </View>

          {hasPlaces ? (
            mockPlaces.map((place) => (
              <View key={place.id} style={styles.placeCard}>
                <TouchableOpacity
  onPress={() => onNavigate(`place-${place.id}`)} // 👈 pasa el ID dinámico
  activeOpacity={0.8}
  style={{ flexDirection: "row", alignItems: "center" }}
>

                  <View
                    style={[
                      styles.placeIcon,
                      { backgroundColor: place.status === "active" ? "#2E8B5715" : "#f5f5f7" },
                    ]}
                  >
                    <Ionicons
                      name="map-outline"
                      size={22}
                      color={place.status === "active" ? "#2E8B57" : "#86868b"}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={styles.placeHeader}>
                      <Text style={styles.placeTitle}>{place.name}</Text>
                      {place.status === "active" && (
                        <View style={styles.badgeSmall}>
                          <Text style={styles.badgeSmallText}>Activo</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.placeSubtitle}>
                      {place.lastVisit} • {place.visits} visitas
                    </Text>
                  </View>

                  <Ionicons name="chevron-forward" size={20} color="#86868b" />
                </TouchableOpacity>

                {/* 👇 Botón “Ver mapa en vivo” — abajo del Card */}
                {place.status === "active" && (
                  <View style={styles.mapContainer}>
                    <TouchableOpacity
                      style={styles.mapButton}
                      onPress={() => onNavigate("map")}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="map-outline" size={16} color="#1E90FF" style={{ marginRight: 6 }} />
                      <Text style={styles.mapText}>Ver mapa en vivo</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons name="map-outline" size={40} color="#86868b" />
              <Text style={styles.emptyTitle}>Sin lugares registrados</Text>
              <Text style={styles.emptyText}>
                Aún no tienes lugares registrados. Explora y presenta tu QR en un punto asociado.
              </Text>
              <TouchableOpacity
                style={styles.exploreBtn}
                onPress={() => onTabChange?.("places")}
              >
                <Text style={styles.exploreText}>Explorar lugares</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 🔗 SafeBrazalet */}
          <TouchableOpacity
            style={[
              styles.card,
              brazaletConnected ? styles.cardConnected : styles.cardDisconnected,
            ]}
            onPress={() => onNavigate("brazalet")}
          >
            <View style={styles.cardHeader}>
              <View style={styles.brazaletInfo}>
                <View
                  style={[
                    styles.brazaletIcon,
                    { backgroundColor: brazaletConnected ? "#FF7F1115" : "#e0e0e0" },
                  ]}
                >
                  <Ionicons
                    name="bluetooth-outline"
                    size={24}
                    color={brazaletConnected ? "#FF7F11" : "#9e9e9e"}
                  />
                </View>
                <View>
                  <Text style={styles.cardTitle}>SafeBrazalet</Text>
                  <Text style={styles.cardSubtitle}>
                    {brazaletConnected ? "Conectado" : "No conectado"}
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
              <View style={styles.brazaletStats}>
                <View style={styles.statBox}>
                  <Ionicons name="battery-half" size={14} color="#86868b" />
                  <Text style={styles.statLabel}>Batería</Text>
                  <Text style={styles.statValue}>85%</Text>
                </View>

                <View style={styles.statBox}>
                  <Ionicons name="location-outline" size={14} color="#86868b" />
                  <Text style={styles.statLabel}>GPS</Text>
                  <Text style={[styles.statValue, { color: "#2E8B57" }]}>Excelente</Text>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.connectButton}>
                <Text style={styles.connectButtonText}>Vincular pulsera</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          {/* 🚨 SOS */}
          <TouchableOpacity style={styles.sosBtn} onPress={() => onNavigate("emergency")}>
            <View style={styles.sosIcon}>
              <Ionicons name="alert-circle-outline" size={28} color="#FF3B30" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sosTitle}>SOS Emergencia</Text>
              <Text style={styles.sosSubtitle}>Activar alerta de emergencia</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#86868b" />
          </TouchableOpacity>

          {/* ✅ Consejo */}
          <View style={styles.tipCard}>
            <Ionicons name="checkmark-circle-outline" size={22} color="#2E8B57" />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.tipTitle}>Consejo de seguridad</Text>
              <Text style={styles.tipText}>
                Mantén tu brazalete cargado y actualiza tu información médica regularmente
                para una mejor asistencia en emergencias.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { paddingTop: 60, paddingBottom: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderColor: "#eee" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#1a1a1a" },
  headerSubtitle: { color: "#86868b", fontSize: 13 },
  icons: { flexDirection: "row", gap: 10 },
  iconBtn: { backgroundColor: "#f5f5f7", borderRadius: 50, padding: 8 },
  dot: { position: "absolute", top: 8, right: 8, width: 8, height: 8, backgroundColor: "#FF7F11", borderRadius: 4 },
  content: { paddingHorizontal: 20, paddingTop: 20 },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontWeight: "600", color: "#1a1a1a", fontSize: 16 },
  sectionLink: { color: "#2E8B57", fontWeight: "500" },

  placeCard: { borderRadius: 16, borderWidth: 1, borderColor: "#eee", backgroundColor: "#fff", padding: 12, marginTop: 10 },
  placeIcon: { width: 48, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 12 },
  placeHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  placeTitle: { color: "#1a1a1a", fontWeight: "500" },
  placeSubtitle: { color: "#86868b", fontSize: 13 },
  badgeSmall: { backgroundColor: "#2E8B5715", borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  badgeSmallText: { color: "#2E8B57", fontSize: 11 },
  mapContainer: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#eee" },
  mapButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 10, borderRadius: 10, backgroundColor: "#1E90FF15" },
  mapText: { color: "#1E90FF", fontWeight: "600" },

  emptyCard: { borderWidth: 1, borderColor: "#ccc", borderStyle: "dashed", borderRadius: 16, padding: 30, alignItems: "center", marginTop: 10 },
  emptyTitle: { fontWeight: "600", color: "#1a1a1a", marginTop: 10 },
  emptyText: { color: "#86868b", textAlign: "center", fontSize: 13, marginVertical: 8 },
  exploreBtn: { borderWidth: 1, borderColor: "#2E8B5720", borderRadius: 12, paddingHorizontal: 20, paddingVertical: 8 },
  exploreText: { color: "#2E8B57", fontWeight: "600" },

  card: { borderRadius: 20, padding: 18, marginTop: 25, borderWidth: 1 },
  cardConnected: { backgroundColor: "#FF7F1110", borderColor: "#FF7F1120" },
  cardDisconnected: { backgroundColor: "#f5f5f7", borderColor: "#ddd" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brazaletInfo: { flexDirection: "row", alignItems: "center", gap: 10 },
  brazaletIcon: { width: 48, height: 48, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  cardTitle: { fontWeight: "600", fontSize: 15, color: "#1a1a1a" },
  cardSubtitle: { color: "#86868b", fontSize: 13 },
  badge: { backgroundColor: "#2E8B5715", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { color: "#2E8B57", fontSize: 12, fontWeight: "500" },
  brazaletStats: { flexDirection: "row", gap: 10, marginTop: 15 },
  statBox: { flex: 1, backgroundColor: "#fff", borderRadius: 12, padding: 10, alignItems: "center" },
  statLabel: { fontSize: 12, color: "#86868b" },
  statValue: { fontSize: 16, fontWeight: "600", color: "#1a1a1a", marginTop: 2 },
  connectButton: { backgroundColor: "#FF7F11", borderRadius: 12, paddingVertical: 10, alignItems: "center", marginTop: 10 },
  connectButtonText: { color: "#fff", fontWeight: "600" },

  sosBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#FF3B3010", borderColor: "#FF3B3020", borderWidth: 1, borderRadius: 16, padding: 16, marginTop: 25 },
  sosIcon: { width: 54, height: 54, borderRadius: 16, backgroundColor: "#FF3B3020", alignItems: "center", justifyContent: "center", marginRight: 15 },
  sosTitle: { color: "#1a1a1a", fontWeight: "600" },
  sosSubtitle: { color: "#86868b", fontSize: 13 },

  tipCard: { flexDirection: "row", backgroundColor: "#2E8B570D", borderColor: "#2E8B5720", borderWidth: 1, borderRadius: 16, padding: 14, marginTop: 25 },
  tipTitle: { fontWeight: "600", color: "#1a1a1a" },
  tipText: { color: "#86868b", fontSize: 13, marginTop: 2 },
});
