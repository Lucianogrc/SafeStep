import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import TabBar from "../../components/ui/TabBar";

interface CompanyDashboardProps {
  onNavigate: (screen: string) => void;
  onTabChange?: (tab: string) => void;
  onLogout: () => void;
}

export default function CompanyDashboard({
  onNavigate,
  onTabChange,
  onLogout,
}: CompanyDashboardProps) {
  const [showScanner, setShowScanner] = useState(false);

  const scanLine = useSharedValue(0);

  const animatedLine = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLine.value }],
  }));

  const startScanner = () => {
    setShowScanner(true);
    scanLine.value = withRepeat(withTiming(260, { duration: 2000 }), -1, true);
    setTimeout(() => {
      setShowScanner(false);
      alert("✅ Visitante registrado correctamente");
    }, 2500);
  };

  const activeVisitors = [
    { id: 1, name: "Juan Pérez", blood: "O+", status: "Activo", time: "2h 15m", checkIn: "10:30 AM" },
    { id: 2, name: "María García", blood: "A+", status: "Activo", time: "1h 30m", checkIn: "11:15 AM" },
    { id: 3, name: "Carlos López", blood: "Fuera", time: "3h 45m", checkIn: "09:00 AM" },
  ];

  const alerts = [
    { id: 1, type: "warning", message: "Batería baja - Carlos López", time: "Hace 15 min" },
    { id: 2, type: "info", message: "Nuevo visitante registrado", time: "Hace 30 min" },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#1E90FF", "#1E90FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.logoBox}>
            <Image
              source={require("../../assets/images/logo2.png")}
              style={styles.logo}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.companyName}>Parque Nacional</Text>
            <Text style={styles.companySub}>Dashboard empresarial</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              onPress={() => onNavigate("notifications")}
              style={styles.iconBtn}
            >
              <Ionicons name="notifications-outline" size={22} color="#fff" />
              {alerts.length > 0 && <View style={styles.dot} />}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onNavigate("company-profile")}
              style={styles.iconBtn}
            >
              <Ionicons name="person-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Hoy</Text>
            <Text style={styles.statValue}>24</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Activos</Text>
            <Text style={[styles.statValue, { color: "#2E8B57" }]}>
              {activeVisitors.filter((v) => v.status === "Activo").length}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Semana</Text>
            <Text style={styles.statValue}>156</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={styles.content}>
          {/* Scanner */}
          <TouchableOpacity
            style={styles.scanButton}
            onPress={startScanner}
            activeOpacity={0.9}
          >
            <Ionicons name="qr-code-outline" size={24} color="#fff" />
            <Text style={styles.scanText}>Abrir escáner QR</Text>
          </TouchableOpacity>

          {/* 🔹 Acceso directo al mapa */}
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => onTabChange?.("map")}
            activeOpacity={0.9}
          >
            <Ionicons name="map-outline" size={24} color="#1E90FF" />
            <Text style={styles.mapButtonText}>Ver mapa en vivo</Text>
          </TouchableOpacity>

          {/* Alerts */}
          {alerts.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Alertas y emergencias</Text>
              {alerts.map((alert) => (
                <View
                  key={alert.id}
                  style={[
                    styles.alertCard,
                    alert.type === "warning" && styles.alertWarning,
                  ]}
                >
                  <Ionicons
                    name={
                      alert.type === "warning"
                        ? "alert-circle-outline"
                        : "checkmark-circle-outline"
                    }
                    size={22}
                    color={alert.type === "warning" ? "#FF7F11" : "#1E90FF"}
                    style={{ marginRight: 10 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.alertMessage}>{alert.message}</Text>
                    <Text style={styles.alertTime}>{alert.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Visitors */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Visitantes activos</Text>
              <TouchableOpacity>
                <Text style={styles.sectionLink}>Ver todos</Text>
              </TouchableOpacity>
            </View>
            {activeVisitors.map((v, i) => (
              <View key={i} style={styles.visitorCard}>
                <View style={styles.visitorIcon}>
                  <Ionicons name="person-outline" size={22} color="#1E90FF" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.visitorRow}>
                    <Text style={styles.visitorName}>{v.name}</Text>
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor:
                            v.status === "Activo" ? "#2E8B5710" : "#eee",
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: v.status === "Activo" ? "#2E8B57" : "#86868b",
                          fontSize: 12,
                        }}
                      >
                        {v.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.visitorInfo}>
                    {v.blood} • {v.checkIn} • {v.time}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#86868b" />
              </View>
            ))}
          </View>

          {/* Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estadísticas rápidas</Text>
            <View style={styles.quickStats}>
              <View style={styles.quickCard}>
                <Ionicons name="trending-up" size={20} color="#2E8B57" />
                <Text style={styles.quickValue}>+12%</Text>
                <Text style={styles.quickLabel}>Esta semana</Text>
              </View>
              <View style={styles.quickCard}>
                <Ionicons name="calendar-outline" size={20} color="#1E90FF" />
                <Text style={styles.quickValue}>3.2h</Text>
                <Text style={styles.quickLabel}>Tiempo promedio</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal Scanner */}
      <Modal visible={showScanner} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escanear código QR</Text>
            <Text style={styles.modalSubtitle}>
              Posiciona el código dentro del marco
            </Text>

            <View style={styles.scannerFrame}>
              <Animated.View style={[styles.scanLine, animatedLine]} />
              <Ionicons
                name="qr-code-outline"
                size={120}
                color="#1a1a1a80"
                style={{ position: "absolute", opacity: 0.2 }}
              />
            </View>

            <View style={styles.scanStatus}>
              <ActivityIndicator size="small" color="#1E90FF" />
              <Text style={styles.scanTextStatus}>Buscando código QR...</Text>
            </View>
          </View>
        </View>
      </Modal>

      <TabBar activeTab="home" onTabChange={onTabChange || (() => {})} variant="company" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f7" },
  header: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20 },
  headerTop: { flexDirection: "row", alignItems: "center" },
  logoBox: {
    width: 48,
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  logo: { width: 30, height: 30 },
  companyName: { color: "#fff", fontWeight: "600", fontSize: 18 },
  companySub: { color: "#fff", opacity: 0.8, fontSize: 13 },
  headerIcons: { flexDirection: "row", gap: 8 },
  iconBtn: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 50,
    padding: 8,
  },
  dot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF7F11",
  },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 4,
  },
  statLabel: { color: "#86868b", fontSize: 12 },
  statValue: { color: "#1a1a1a", fontWeight: "600", fontSize: 20 },
  content: { paddingHorizontal: 20, marginTop: 20 },
  scanButton: {
    backgroundColor: "#1E90FF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 16,
    marginBottom: 16,
  },
  scanText: { color: "#fff", fontWeight: "600", marginLeft: 6, fontSize: 16 },
  mapButton: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#1E90FF40",
    marginBottom: 20,
  },
  mapButtonText: { color: "#1E90FF", fontWeight: "600", marginLeft: 6, fontSize: 15 },
  section: { marginTop: 15 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontWeight: "600", color: "#1a1a1a", fontSize: 16 },
  sectionLink: { color: "#1E90FF", fontSize: 14 },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  alertWarning: { backgroundColor: "#FF7F1110", borderColor: "#FF7F1120" },
  alertMessage: { color: "#1a1a1a", fontWeight: "500" },
  alertTime: { color: "#86868b", fontSize: 12 },
  visitorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  visitorIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#1E90FF15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  visitorRow: { flexDirection: "row", justifyContent: "space-between" },
  visitorName: { color: "#1a1a1a", fontWeight: "500", fontSize: 15 },
  visitorInfo: { color: "#86868b", fontSize: 13, marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  quickStats: { flexDirection: "row", justifyContent: "space-between" },
  quickCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    marginHorizontal: 4,
  },
  quickValue: { color: "#1a1a1a", fontWeight: "600", fontSize: 18 },
  quickLabel: { color: "#86868b", fontSize: 13 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: { color: "#1a1a1a", fontWeight: "600", fontSize: 18 },
  modalSubtitle: { color: "#86868b", fontSize: 13, marginBottom: 20 },
  scannerFrame: {
    width: 260,
    height: 260,
    borderRadius: 20,
    backgroundColor: "#2E8B5710",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  scanLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#1E90FF",
  },
  scanStatus: { flexDirection: "row", alignItems: "center", marginTop: 14 },
  scanTextStatus: { color: "#86868b", marginLeft: 6 },
});
