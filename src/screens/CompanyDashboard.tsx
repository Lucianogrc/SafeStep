// src/screens/CompanyDashboard.tsx

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TabBar from "../../components/ui/TabBar";
import { auth, db } from "../Services/firebaseConfig";

interface CompanyDashboardProps {
  onNavigate: (screen: string) => void;
  onTabChange?: (tab: string) => void;
  onLogout: () => void;
  onOpenHiker?: (hiker: any) => void; // 👈 nuevo
}

export default function CompanyDashboard({
  onNavigate,
  onTabChange,
  onLogout, // (por si luego lo usas en un botón del header)
  onOpenHiker,
}: CompanyDashboardProps) {
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeHikers, setActiveHikers] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  // 🔹 Obtener nombre de empresa
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const ref = doc(db, "companies", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as any;
          setCompanyName(data.companyName || "Empresa");
        } else {
          setCompanyName("Empresa");
        }
      } catch (err) {
        console.log("❌ Error al obtener datos de empresa:", err);
        setCompanyName("Empresa");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  // 🔹 Leer hikers activos en tiempo real
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = collection(db, "companies", user.uid, "activeHikers");
    const unsub = onSnapshot(ref, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      console.log("[DASHBOARD] activeHikers snapshot:", list);
      setActiveHikers(list as any[]);
    });

    return unsub;
  }, []);

  // 🔹 Estadísticas (simplificadas)
  const stats = {
    today: activeHikers.length,
    active: activeHikers.filter((v) => v.status === "activo").length,
    week: activeHikers.length,
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={["#1E90FF", "#1E90FF"]} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text style={styles.companyName}>Hola, {companyName}</Text>
                <Text style={styles.companySub}>Panel empresarial</Text>
              </>
            )}
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              onPress={() => onNavigate("company-notifications")}
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

        {/* STATISTICS */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Hoy</Text>
            <Text style={styles.statValue}>{stats.today}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Activos</Text>
            <Text style={[styles.statValue, { color: "#1E90FF" }]}>
              {stats.active}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Semana</Text>
            <Text style={styles.statValue}>{stats.week}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <View style={styles.content}>
          {/* 🔹 Botón que abre la pantalla de escaneo */}
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => onNavigate("company-scan-qr")}
            activeOpacity={0.9}
          >
            <Ionicons name="qr-code-outline" size={22} color="#fff" />
            <Text style={styles.scanText}>Escanear código QR</Text>
          </TouchableOpacity>

          {activeHikers.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="information-circle-outline"
                size={48}
                color="#1E90FF"
              />
              <Text style={styles.emptyTitle}>Aún no hay visitantes activos</Text>
              <Text style={styles.emptyText}>
                Escanea el QR de un visitante para registrarlo como activo en tu
                parque.
              </Text>
            </View>
          ) : (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Hikers activos</Text>
              {activeHikers.map((v, i) => (
                <TouchableOpacity
                  key={v.id ?? i}
                  style={styles.visitorCard}
                  activeOpacity={0.9}
                  onPress={() => {
                    console.log("[DASHBOARD] Click en hiker:", v);
                    onOpenHiker && onOpenHiker(v);
                  }}
                >
                  <Ionicons
                    name="person-outline"
                    size={22}
                    color="#1E90FF"
                    style={{ marginRight: 10 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.visitorName}>{v.name}</Text>
                    <Text style={styles.visitorInfo}>
                      {v.blood || "N/A"}{" "}
                      {v.checkInAt?.toDate
                        ? "• " +
                          v.checkInAt
                            .toDate()
                            .toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                        : ""}
                    </Text>
                  </View>
                  <Text style={styles.visitorStatus}>
                    {(v.status || "activo").toString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <TabBar
        activeTab="home"
        onTabChange={onTabChange || (() => {})}
        variant="company"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f7" },
  header: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20 },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  companyName: { color: "#fff", fontWeight: "600", fontSize: 18 },
  companySub: { color: "#fff", opacity: 0.8, fontSize: 13 },
  headerIcons: { flexDirection: "row", gap: 10 },
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
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
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
  scanText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 16,
  },
  emptyState: { alignItems: "center", marginTop: 60, paddingHorizontal: 20 },
  emptyTitle: {
    color: "#1a1a1a",
    fontWeight: "600",
    fontSize: 18,
    marginTop: 10,
  },
  emptyText: {
    color: "#86868b",
    textAlign: "center",
    marginTop: 6,
    fontSize: 13,
  },
  section: { marginTop: 20 },
  sectionTitle: {
    fontWeight: "600",
    color: "#1a1a1a",
    fontSize: 16,
    marginBottom: 8,
  },
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
  visitorName: { color: "#1a1a1a", fontWeight: "500", fontSize: 15 },
  visitorInfo: { color: "#86868b", fontSize: 13, marginTop: 2 },
  visitorStatus: { color: "#1E90FF", fontWeight: "600", fontSize: 13 },
});
