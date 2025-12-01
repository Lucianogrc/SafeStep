import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface VisitItem {
  id: string;
  parkName?: string;
  hikerName?: string;
  hikerId?: string;
  checkIn: string;
  checkOut: string | null;
  date: string;
  duration: string;
  alerts: number;
  status: "active" | "completed";
}

interface VisitHistoryProps {
  onBack: () => void;
  userType: "hiker" | "company";
  visits?: VisitItem[];  // 🔵 Esto permite recibir datos reales de Firebase
}

export default function VisitHistory({
  onBack,
  userType,
  visits = [],
}: VisitHistoryProps) {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const filtered = visits.filter((v) =>
    filter === "all" ? true : v.status === filter
  );

  const activeCount = visits.filter((v) => v.status === "active").length;
  const completedCount = visits.filter((v) => v.status === "completed").length;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Feather name="x" size={22} color="#1a1a1a" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Historial de Visitas</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: "#2E8B5715" }]}>
          <Text style={styles.statLabel}>Activas</Text>
          <Text style={[styles.statValue, { color: "#2E8B57" }]}>
            {activeCount}
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: "#f5f5f7" }]}>
          <Text style={styles.statLabel}>Completadas</Text>
          <Text style={styles.statValue}>{completedCount}</Text>
        </View>
      </View>

      {/* FILTER TABS */}
      <View style={styles.tabsRow}>
        {["all", "active", "completed"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[
              styles.tabButton,
              filter === t && styles.tabButtonActive,
            ]}
            onPress={() => setFilter(t as any)}
          >
            <Text
              style={[
                styles.tabText,
                filter === t && styles.tabTextActive,
              ]}
            >
              {t === "all" ? "Todas" : t === "active" ? "Activas" : "Completadas"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CONTENT */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons
              name="calendar-outline"
              size={50}
              color="#86868b"
              style={{ marginBottom: 10 }}
            />
            <Text style={{ color: "#86868b" }}>
              No hay visitas en esta categoría
            </Text>
          </View>
        ) : (
          filtered.map((v, i) => (
            <TouchableOpacity key={v.id} style={styles.visitCard}>
              <View style={styles.visitHeader}>
                <View>
                  <Text style={styles.visitTitle}>
                    {userType === "hiker" ? v.parkName : v.hikerName}
                  </Text>
                  <Text style={styles.visitId}>{v.id}</Text>
                </View>
                <Feather name="chevron-right" size={20} color="#86868b" />
              </View>

              {/* DATE & DURATION */}
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Ionicons name="calendar-outline" size={16} color="#86868b" />
                  <View>
                    <Text style={styles.infoLabel}>Fecha</Text>
                    <Text style={styles.infoValue}>{v.date}</Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <Feather name="clock" size={16} color="#86868b" />
                  <View>
                    <Text style={styles.infoLabel}>Duración</Text>
                    <Text style={styles.infoValue}>{v.duration}</Text>
                  </View>
                </View>
              </View>

              {/* ALERTS */}
              {v.alerts > 0 && (
                <View style={styles.alertRow}>
                  <Feather name="alert-circle" size={16} color="#FF7F11" />
                  <Text style={styles.alertText}>
                    {v.alerts} alerta{v.alerts > 1 ? "s" : ""} registrada
                  </Text>
                </View>
              )}

              {/* COMPLETED */}
              {v.status === "completed" && (
                <View style={styles.completedRow}>
                  <Feather name="check-circle" size={16} color="#2E8B57" />
                  <Text style={styles.completedText}>Visita completada</Text>

                  <Text style={styles.checkTimes}>
                    {v.checkIn} — {v.checkOut}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f7" },

  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    padding: 8,
    backgroundColor: "#f5f5f7",
    borderRadius: 100,
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#1a1a1a" },

  statsRow: {
    flexDirection: "row",
    gap: 14,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 18,
  },
  statLabel: { fontSize: 13, color: "#86868b" },
  statValue: { fontSize: 26, fontWeight: "700", color: "#1a1a1a" },

  tabsRow: {
    flexDirection: "row",
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: "#e9e9eb",
    borderRadius: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: "#fff",
    borderRadius: 14,
  },
  tabText: { color: "#86868b", fontWeight: "500" },
  tabTextActive: { color: "#1a1a1a", fontWeight: "700" },

  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    marginTop: 20,
  },

  visitCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 16,
  },
  visitHeader: { flexDirection: "row", justifyContent: "space-between" },
  visitTitle: { fontSize: 16, fontWeight: "600", color: "#1a1a1a" },
  visitId: { fontSize: 12, color: "#86868b" },

  infoGrid: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoLabel: { fontSize: 12, color: "#86868b" },
  infoValue: { fontSize: 14, color: "#1a1a1a" },

  alertRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 10,
  },
  alertText: { color: "#FF7F11", fontSize: 13 },

  completedRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  completedText: { color: "#2E8B57", fontSize: 13, fontWeight: "600" },
  checkTimes: { fontSize: 12, color: "#86868b" },
});
