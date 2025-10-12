// src/screens/HikerHome.tsx
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface HikerHomeProps {
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

export default function HikerHome({ onNavigate, onLogout }: HikerHomeProps) {
  const [qrGenerated] = useState(true);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Hola, Juan</Text>
          <Text style={styles.headerSubtitle}>Listo para tu aventura</Text>
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity
            onPress={() => onNavigate("notifications")}
            style={styles.iconBtn}
          >
            <Feather name="bell" size={20} color="#1a1a1a" />
            <View style={styles.dot} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onNavigate("hiker-profile")}
            style={styles.iconBtn}
          >
            <Feather name="user" size={20} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
      >
        {/* QR Card */}
        <Animated.View entering={FadeInUp.duration(500)}>
          <View style={styles.qrCard}>
            <View style={styles.qrHeader}>
              <MaterialCommunityIcons
                name="qrcode"
                size={22}
                color="#fff"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.qrHeaderText}>Mi código QR</Text>
            </View>

            <View style={styles.qrBox}>
              <MaterialCommunityIcons
                name="qrcode"
                size={120}
                color="#1a1a1a"
              />
            </View>

            <Text style={styles.qrHint}>Escanéame al ingresar al parque</Text>
            <Text style={styles.qrId}>ID: #SH-2024-1234</Text>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInUp.duration(600).delay(100)}>
          <Text style={styles.sectionTitle}>Acciones rápidas</Text>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onNavigate("map")}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.iconBubble, { backgroundColor: "#2E8B5710" }]}>
                <Feather name="map-pin" size={22} color="#2E8B57" />
              </View>
              <View>
                <Text style={styles.actionTitle}>Ver mapa del parque</Text>
                <Text style={styles.actionSubtitle}>
                  Rutas y puntos de interés
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color="#86868b" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <View style={styles.actionLeft}>
              <View style={[styles.iconBubble, { backgroundColor: "#1E90FF10" }]}>
                <MaterialCommunityIcons
                  name="terrain"
                  size={22}
                  color="#1E90FF"
                />
              </View>
              <View>
                <Text style={styles.actionTitle}>Lugares disponibles</Text>
                <Text style={styles.actionSubtitle}>12 parques cerca de ti</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color="#86868b" />
          </TouchableOpacity>
        </Animated.View>

        {/* Emergency Button */}
        <Animated.View entering={FadeInUp.duration(600).delay(200)}>
          <TouchableOpacity
            onPress={() => onNavigate("emergency")}
            style={styles.emergencyBtn}
          >
            <Feather name="shield" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.emergencyText}>Botón de emergencia SOS</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Stats */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(300)}
          style={styles.statsRow}
        >
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Visitas totales</Text>
            <Text style={styles.statValueGreen}>24</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>SafeBrazalet</Text>
            <Text style={styles.statValue}>No conectado</Text>
          </View>
        </Animated.View>

        {/* Profile Info */}
        <Animated.View entering={FadeInUp.duration(600).delay(400)}>
          <Text style={styles.sectionTitle}>Mi perfil</Text>

          <View style={styles.profileCard}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Nombre completo</Text>
              <Text style={styles.rowValue}>Juan Pérez</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Tipo de sangre</Text>
              <Text style={styles.rowValue}>O+</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Contacto emergencia</Text>
              <Text style={styles.rowValue}>+1 234 567 8900</Text>
            </View>

            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => onNavigate("hiker-profile")}
            >
              <Text style={styles.editText}>Editar información</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f7" },

  // Header
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
  headerTitle: { fontSize: 20, color: "#1a1a1a", fontWeight: "600" },
  headerSubtitle: { color: "#86868b", fontSize: 13 },
  headerIcons: { flexDirection: "row", gap: 10 },
  iconBtn: {
    backgroundColor: "#f5f5f7",
    padding: 10,
    borderRadius: 50,
    position: "relative",
  },
  dot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF7F11",
  },

  // QR card
  qrCard: {
    backgroundColor: "#2E8B57",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  qrHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  qrHeaderText: { color: "#fff", fontWeight: "600" },
  qrBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 10,
  },
  qrHint: { color: "#fff", fontSize: 14 },
  qrId: { color: "#fff", fontSize: 12, opacity: 0.8, marginTop: 4 },

  // Actions
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginTop: 30,
    marginBottom: 10,
  },
  actionBtn: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  actionLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBubble: {
    padding: 10,
    borderRadius: 12,
  },
  actionTitle: { color: "#1a1a1a", fontWeight: "500" },
  actionSubtitle: { color: "#86868b", fontSize: 13 },

  // Emergency button
  emergencyBtn: {
    backgroundColor: "#FF7F11",
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  emergencyText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  // Stats
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    flex: 1,
    padding: 16,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  statLabel: { color: "#86868b", fontSize: 13, marginBottom: 6 },
  statValueGreen: { color: "#2E8B57", fontSize: 22, fontWeight: "700" },
  statValue: { color: "#1a1a1a", fontSize: 14 },

  // Profile
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  rowLabel: { color: "#86868b", fontSize: 13 },
  rowValue: { color: "#1a1a1a", fontWeight: "500" },
  divider: { height: 1, backgroundColor: "#f0f0f0", marginVertical: 4 },
  editBtn: {
    borderWidth: 2,
    borderColor: "#2E8B57",
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 10,
  },
  editText: { color: "#2E8B57", fontWeight: "600" },
});
