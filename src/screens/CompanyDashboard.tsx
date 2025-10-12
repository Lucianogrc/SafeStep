import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

interface CompanyDashboardProps {
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

const activeVisitors = [
  {
    id: 1,
    name: "Juan Pérez",
    blood: "O+",
    status: "active",
    time: "2h 15m",
    location: "Ruta Principal",
  },
  {
    id: 2,
    name: "María García",
    blood: "A+",
    status: "active",
    time: "1h 30m",
    location: "Mirador Norte",
  },
  {
    id: 3,
    name: "Carlos López",
    blood: "B+",
    status: "active",
    time: "45m",
    location: "Cascada Sur",
  },
  {
    id: 4,
    name: "Ana Martínez",
    blood: "AB+",
    status: "alert",
    time: "3h 05m",
    location: "Zona Boscosa",
  },
];

export default function CompanyDashboard({
  onNavigate,
  onLogout,
}: CompanyDashboardProps) {
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      Alert.alert("Escaneo completado");
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Image
             source={require("../../assets/images/logo.png")}
                style={styles.logo}
            />

            
          </View>
          <View>
            <Text style={styles.headerTitle}>Panel Administrativo</Text>
            <Text style={styles.headerSubtitle}>Parque Nacional Verde</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => onNavigate("company-profile")}>
            <Feather name="user" size={22} color="#fff" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onLogout}>
            <Feather name="log-out" size={22} color="#fff" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Visitantes activos</Text>
          <Text style={styles.statValue}>24</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Alertas hoy</Text>
          <Text style={styles.statValue}>1</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>En emergencia</Text>
          <Text style={styles.statValue}>0</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Escáner */}
        <Animated.View
  entering={FadeInUp.duration(400)}
  style={styles.scanCard}
>

          <MaterialCommunityIcons
            name="qrcode-scan"
            size={60}
            color="#fff"
            style={{ marginBottom: 10 }}
          />
          <Text style={styles.scanTitle}>Escanear código de visitante</Text>
          <Text style={styles.scanSubtitle}>
            Registra el ingreso de excursionistas
          </Text>

          <TouchableOpacity
            onPress={handleScan}
            disabled={scanning}
            style={styles.scanButton}
          >
            <Text style={styles.scanButtonText}>
              {scanning ? "Escaneando..." : "Abrir escáner"}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Acciones rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones rápidas</Text>

          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => onNavigate("map")}
          >
            <View style={styles.quickLeft}>
              <View style={[styles.iconCircle, { backgroundColor: "#1E90FF20" }]}>
                <Feather name="map-pin" size={22} color="#1E90FF" />
              </View>
              <View>
                <Text style={styles.quickTitle}>Ver mapa en vivo</Text>
                <Text style={styles.quickSubtitle}>Ubicación de visitantes</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => onNavigate("brazalet")}
          >
            <View style={styles.quickLeft}>
              <View style={[styles.iconCircle, { backgroundColor: "#FF7F1120" }]}>
                <Feather name="bluetooth" size={22} color="#FF7F11" />
              </View>
              <View>
                <Text style={styles.quickTitle}>Vincular SafeBrazalet</Text>
                <Text style={styles.quickSubtitle}>Conectar pulsera</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => onNavigate("notifications")}
          >
            <View style={styles.quickLeft}>
              <View style={[styles.iconCircle, { backgroundColor: "#2E8B5720" }]}>
                <Feather name="bell" size={22} color="#2E8B57" />
                <View style={styles.notificationDot} />
              </View>
              <View>
                <Text style={styles.quickTitle}>Notificaciones</Text>
                <Text style={styles.quickSubtitle}>3 nuevas alertas</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Visitantes activos */}
        <View style={styles.section}>
          <View style={styles.visitorsHeader}>
            <Text style={styles.sectionTitle}>Visitantes activos</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeVisitors.length}</Text>
            </View>
          </View>

          {activeVisitors.map((v) => (
            <TouchableOpacity key={v.id} style={styles.visitorCard}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {v.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Text>
              </View>
              <View style={styles.visitorInfo}>
                <Text style={styles.visitorName}>{v.name}</Text>
                <Text style={styles.visitorDetails}>
                  {v.blood} • {v.location} • {v.time}
                </Text>
              </View>
              {v.status === "alert" && (
                <View style={styles.alertBadge}>
                  <Text style={styles.alertText}>Alerta</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F7" },
  header: {
    backgroundColor: "#1E90FF",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  logoContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 6,
    marginRight: 10,
  },
  logo: { width: 40, height: 40 },
  headerTitle: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  headerSubtitle: { color: "#fff", opacity: 0.8, fontSize: 12 },
  headerRight: { flexDirection: "row", gap: 12 },
  icon: { marginHorizontal: 4 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  statCard: {
    backgroundColor: "#1E90FF",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  statLabel: { color: "#fff", fontSize: 10 },
  statValue: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  scroll: { flex: 1, paddingHorizontal: 16 },
  scanCard: {
    backgroundColor: "#2E8B57",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    marginVertical: 10,
  },
  scanTitle: { color: "#fff", fontSize: 16, fontWeight: "bold", marginTop: 10 },
  scanSubtitle: { color: "#fff", opacity: 0.8, fontSize: 13, marginBottom: 10 },
  scanButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  scanButtonText: { color: "#2E8B57", fontWeight: "bold" },
  section: { marginVertical: 15 },
  sectionTitle: { fontWeight: "bold", fontSize: 16, color: "#1a1a1a", marginBottom: 8 },
  quickButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  quickLeft: { flexDirection: "row", alignItems: "center" },
  iconCircle: { padding: 10, borderRadius: 15, marginRight: 10 },
  quickTitle: { color: "#1a1a1a", fontWeight: "500" },
  quickSubtitle: { color: "#888", fontSize: 12 },
  notificationDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    backgroundColor: "#FF7F11",
    borderRadius: 4,
  },
  visitorsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#2E8B5715",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: { color: "#2E8B57", fontWeight: "bold" },
  visitorCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 14,
    alignItems: "center",
    marginBottom: 8,
  },
  avatarCircle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#2E8B5715",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: { color: "#2E8B57", fontWeight: "bold" },
  visitorInfo: { flex: 1 },
  visitorName: { color: "#1a1a1a", fontWeight: "600" },
  visitorDetails: { color: "#86868b", fontSize: 12 },
  alertBadge: {
    backgroundColor: "#FF7F1115",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  alertText: { color: "#FF7F11", fontSize: 12 },
});
