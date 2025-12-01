import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface GlobalAlertsProps {
  onBack: () => void;
  // Navegaciones opcionales, para conectar después
  onViewMap?: (alertId: string) => void;
  onOpenHiker?: (hikerId: string) => void;
  onOpenPark?: (parkId: string) => void;
}

// ⚙️ Config de tipos de alerta
const alertTypeConfig = {
  sos: {
    label: "SOS",
    color: "#FF3B30",
    icon: "alert-triangle" as const,
    priority: "critical" as const,
  },
  battery: {
    label: "Batería Baja",
    color: "#FF7F11",
    icon: "alert-circle" as const,
    priority: "warning" as const,
  },
  gps: {
    label: "GPS Perdido",
    color: "#FF7F11",
    icon: "alert-circle" as const,
    priority: "warning" as const,
  },
  timeout: {
    label: "Tiempo Excedido",
    color: "#1E90FF",
    icon: "info" as const,
    priority: "info" as const,
  },
  zone: {
    label: "Zona de Riesgo",
    color: "#FF3B30",
    icon: "alert-triangle" as const,
    priority: "critical" as const,
  },
};

type AlertTypeKey = keyof typeof alertTypeConfig;

// 🔁 Mock de alertas (más adelante se reemplaza por Firebase)
const alerts = [
  {
    id: "A-2024-001",
    type: "sos" as AlertTypeKey,
    hikerName: "Juan Pérez Mora",
    hikerId: "H-2024-1234",
    parkName: "Parque Nacional Verde",
    parkId: "C-001",
    message: "Botón SOS activado",
    location: "9.9281° N, 84.0907° W",
    time: "Hace 2 min",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    status: "active" as "active" | "resolved",
    contactPhone: "+506 8765-4321",
  },
  {
    id: "A-2024-002",
    type: "zone" as AlertTypeKey,
    hikerName: "Carlos López",
    hikerId: "H-2024-1235",
    parkName: "Parque Ecológico Montaña Azul",
    parkId: "C-004",
    message: "Ingreso a zona de riesgo detectado",
    location: "9.9305° N, 84.0892° W",
    time: "Hace 8 min",
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    status: "active",
    contactPhone: "+506 8765-4322",
  },
  {
    id: "A-2024-003",
    type: "battery" as AlertTypeKey,
    hikerName: "María García",
    hikerId: "H-2024-1236",
    parkName: "Parque Nacional Verde",
    parkId: "C-001",
    message: "Batería del brazalete al 15%",
    location: "9.9290° N, 84.0900° W",
    time: "Hace 15 min",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    status: "active",
    contactPhone: "+506 8765-4323",
  },
  {
    id: "A-2024-004",
    type: "gps" as AlertTypeKey,
    hikerName: "Ana Martínez",
    hikerId: "H-2024-1237",
    parkName: "Reserva Natural El Pino",
    parkId: "C-002",
    message: "Señal GPS perdida hace 10 minutos",
    location: "9.9275° N, 84.0915° W",
    time: "Hace 25 min",
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    status: "active",
    contactPhone: "+506 8765-4324",
  },
  {
    id: "A-2024-005",
    type: "timeout" as AlertTypeKey,
    hikerName: "Luis Hernández",
    hikerId: "H-2024-1238",
    parkName: "Parque Ecológico Montaña Azul",
    parkId: "C-004",
    message: "Visita excedió tiempo estimado (6 horas)",
    location: "9.9300° N, 84.0885° W",
    time: "Hace 1 hora",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    status: "resolved",
    contactPhone: "+506 8765-4325",
  },
  {
    id: "A-2024-006",
    type: "sos" as AlertTypeKey,
    hikerName: "Sofia Castro",
    hikerId: "H-2024-1239",
    parkName: "Bosque Protegido Aurora",
    parkId: "C-003",
    message: "Botón SOS activado",
    location: "9.9265° N, 84.0920° W",
    time: "Hace 3 horas",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    status: "resolved",
    contactPhone: "+506 8765-4326",
  },
];

const parkOptions = [
  { id: "all", label: "Todos los parques" },
  { id: "C-001", label: "Parque Nacional Verde" },
  { id: "C-002", label: "Reserva Natural El Pino" },
  { id: "C-003", label: "Bosque Protegido Aurora" },
  { id: "C-004", label: "Montaña Azul" },
];

const priorityOptions = [
  { id: "all", label: "Todas" },
  { id: "critical", label: "Crítica" },
  { id: "warning", label: "Advertencia" },
  { id: "info", label: "Información" },
];

export default function GlobalAlerts({
  onBack,
  onViewMap,
  onOpenHiker,
  onOpenPark,
}: GlobalAlertsProps) {
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");
  const [parkFilter, setParkFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const activeAlerts = alerts.filter((a) => a.status === "active");
  const criticalAlerts = activeAlerts.filter((a) => {
    const cfg = alertTypeConfig[a.type];
    return cfg.priority === "critical";
  });

  const filteredAlerts = alerts.filter((alert) => {
    const cfg = alertTypeConfig[alert.type];

    const matchesStatus =
      filter === "all" ? true : alert.status === filter;
    const matchesPark =
      parkFilter === "all" ? true : alert.parkId === parkFilter;
    const matchesPriority =
      priorityFilter === "all" ? true : cfg.priority === priorityFilter;

    return matchesStatus && matchesPark && matchesPriority;
  });

  const handleContact = (phone: string, name: string) => {
    Alert.alert(
      "Contactar visitante",
      `¿Quieres contactar a ${name}?\n\nTeléfono: ${phone}`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Copiar / Llamar",
          onPress: () => {
            console.log("Llamar a", phone);
            // Aquí luego: Linking.openURL(`tel:${phone}`)
          },
        },
      ]
    );
  };

  const cycleOption = (
    currentId: string,
    options: { id: string; label: string }[],
    setter: (v: string) => void
  ) => {
    const idx = options.findIndex((o) => o.id === currentId);
    const next = options[(idx + 1) % options.length];
    setter(next.id);
  };

  const parkLabel =
    parkOptions.find((p) => p.id === parkFilter)?.label || "Parque";
  const priorityLabel =
    priorityOptions.find((p) => p.id === priorityFilter)?.label || "Prioridad";

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
              <Feather name="chevron-left" size={22} color="#1a1a1a" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Panel Global de Alertas</Text>
              <Text style={styles.headerSubtitle}>Todas las empresas</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCritical]}>
            <Text style={styles.statLabel}>Críticas</Text>
            <Text style={[styles.statValue, { color: "#FF3B30" }]}>
              {criticalAlerts.length}
            </Text>
          </View>
          <View style={[styles.statCard, styles.statWarning]}>
            <Text style={styles.statLabel}>Activas</Text>
            <Text style={[styles.statValue, { color: "#FF7F11" }]}>
              {activeAlerts.length}
            </Text>
          </View>
          <View style={[styles.statCard, styles.statNeutral]}>
            <Text style={styles.statLabel}>Total</Text>
            <Text style={[styles.statValue, { color: "#1a1a1a" }]}>
              {alerts.length}
            </Text>
          </View>
        </View>

        {/* Filtros principales (tabs) */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[
              styles.tab,
              filter === "all" && styles.tabActive,
            ]}
            onPress={() => setFilter("all")}
          >
            <Text
              style={[
                styles.tabText,
                filter === "all" && styles.tabTextActive,
              ]}
            >
              Todas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              filter === "active" && styles.tabActive,
            ]}
            onPress={() => setFilter("active")}
          >
            <Text
              style={[
                styles.tabText,
                filter === "active" && styles.tabTextActive,
              ]}
            >
              Activas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              filter === "resolved" && styles.tabActive,
            ]}
            onPress={() => setFilter("resolved")}
          >
            <Text
              style={[
                styles.tabText,
                filter === "resolved" && styles.tabTextActive,
              ]}
            >
              Resueltas
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filtros avanzados (parque / prioridad) */}
        <View style={styles.advFiltersRow}>
          <TouchableOpacity
            style={styles.filterPill}
            onPress={() => cycleOption(parkFilter, parkOptions, setParkFilter)}
          >
            <Feather
              name="map-pin"
              size={14}
              color="#86868b"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.filterPillText} numberOfLines={1}>
              {parkLabel}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterPill}
            onPress={() =>
              cycleOption(priorityFilter, priorityOptions, setPriorityFilter)
            }
          >
            <Feather
              name="filter"
              size={14}
              color="#86868b"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.filterPillText} numberOfLines={1}>
              {priorityLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredAlerts.length === 0 && (
          <View style={styles.emptyCard}>
            <Feather name="alert-circle" size={40} color="#86868b" />
            <Text style={styles.emptyText}>
              No hay alertas en esta categoría
            </Text>
          </View>
        )}

        {filteredAlerts.map((alert, index) => {
          const cfg = alertTypeConfig[alert.type];
          const isActive = alert.status === "active";
          const isCritical = cfg.priority === "critical";

          return (
            <Animated.View
              key={alert.id}
              entering={FadeInUp.delay(index * 80)}
              style={[
                styles.alertCard,
                isActive && isCritical && styles.alertCardCritical,
                isActive && !isCritical && styles.alertCardWarning,
                !isActive && styles.alertCardResolved,
              ]}
            >
              {/* HEADER DE ALERTA */}
              <View style={styles.alertHeader}>
                <View style={styles.alertHeaderLeft}>
                  <View
                    style={[
                      styles.alertIconBox,
                      !isActive && { backgroundColor: "#e5e5ea" },
                    ]}
                  >
                    <Feather
                      name={cfg.icon}
                      size={22}
                      color={isActive ? cfg.color : "#86868b"}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={styles.badgeRow}>
                      <View
                        style={[
                          styles.badge,
                          { backgroundColor: cfg.color },
                        ]}
                      >
                        <Text style={styles.badgeText}>{cfg.label}</Text>
                      </View>
                      {!isActive && (
                        <View style={styles.badgeResolved}>
                          <Text style={styles.badgeResolvedText}>
                            Resuelta
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.alertMessage}>{alert.message}</Text>
                  </View>
                </View>
              </View>

              {/* INFO HIKER / PARQUE */}
              <View style={styles.infoBox}>
                {/* Hiker */}
                <TouchableOpacity
                  style={styles.infoRow}
                  onPress={() =>
                    onOpenHiker && onOpenHiker(alert.hikerId)
                  }
                  activeOpacity={0.7}
                >
                  <Feather name="user" size={16} color="#86868b" />
                  <View style={{ marginLeft: 8, flex: 1 }}>
                    <Text style={styles.infoTextMain}>
                      {alert.hikerName}
                    </Text>
                    <Text style={styles.infoTextSub}>{alert.hikerId}</Text>
                  </View>
                </TouchableOpacity>

                {/* Parque */}
                <TouchableOpacity
                  style={[styles.infoRow, { marginTop: 6 }]}
                  onPress={() =>
                    onOpenPark && onOpenPark(alert.parkId)
                  }
                  activeOpacity={0.7}
                >
                  <Feather name="map-pin" size={16} color="#86868b" />
                  <View style={{ marginLeft: 8, flex: 1 }}>
                    <Text style={styles.infoTextMain}>
                      {alert.parkName}
                    </Text>
                    <Text
                      style={[styles.infoTextSub, styles.infoMono]}
                    >
                      {alert.location}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Tiempo */}
                <View style={[styles.infoRow, { marginTop: 6 }]}>
                  <Feather name="clock" size={16} color="#86868b" />
                  <Text style={[styles.infoTextSub, { marginLeft: 8 }]}>
                    {alert.time}
                  </Text>
                </View>
              </View>

              {/* ACCIONES */}
              {isActive && (
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.actionBtnOutline]}
                    onPress={() =>
                      handleContact(
                        alert.contactPhone,
                        alert.hikerName
                      )
                    }
                    activeOpacity={0.8}
                  >
                    <Feather
                      name="phone"
                      size={16}
                      color="#1a1a1a"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.actionOutlineText}>Contactar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, styles.actionBtnPrimary]}
                    onPress={() =>
                      onViewMap && onViewMap(alert.id)
                    }
                    activeOpacity={0.8}
                  >
                    <Feather
                      name="navigation"
                      size={16}
                      color="#fff"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.actionPrimaryText}>Ver mapa</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
}

//
// 🎨 ESTILOS
//
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f7" },

  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  backBtn: {
    padding: 8,
    backgroundColor: "#f5f5f7",
    borderRadius: 999,
    marginRight: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  headerSubtitle: { fontSize: 13, color: "#86868b", marginTop: 2 },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 3,
  },
  statCritical: {
    backgroundColor: "#FF3B3015",
    borderWidth: 1,
    borderColor: "#FF3B3030",
  },
  statWarning: {
    backgroundColor: "#FF7F1115",
    borderWidth: 1,
    borderColor: "#FF7F1130",
  },
  statNeutral: {
    backgroundColor: "#f5f5f7",
    borderWidth: 1,
    borderColor: "#e5e5ea",
  },
  statLabel: { fontSize: 11, color: "#86868b", marginBottom: 4 },
  statValue: { fontSize: 22, fontWeight: "700" },

  tabsRow: {
    flexDirection: "row",
    marginTop: 14,
    backgroundColor: "#f5f5f7",
    borderRadius: 18,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 14,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#fff",
  },
  tabText: {
    fontSize: 13,
    color: "#86868b",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#1a1a1a",
    fontWeight: "600",
  },

  advFiltersRow: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  filterPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f7",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 3,
  },
  filterPillText: {
    fontSize: 12,
    color: "#1a1a1a",
    flexShrink: 1,
  },

  content: {
    flex: 1,
    marginTop: 6,
  },

  emptyCard: {
    marginTop: 24,
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e5ea",
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: "#86868b",
  },

  alertCard: {
    marginTop: 14,
    borderRadius: 22,
    padding: 16,
    borderWidth: 2,
  },
  alertCardCritical: {
    backgroundColor: "#FF3B3010",
    borderColor: "#FF3B3040",
  },
  alertCardWarning: {
    backgroundColor: "#ffffff",
    borderColor: "#FF7F1130",
  },
  alertCardResolved: {
    backgroundColor: "#f5f5f7",
    borderColor: "#e5e5ea",
    opacity: 0.8,
  },

  alertHeader: { marginBottom: 8 },
  alertHeaderLeft: { flexDirection: "row", alignItems: "flex-start" },

  alertIconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    elevation: 1,
  },

  badgeRow: { flexDirection: "row", marginBottom: 4 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "600",
  },
  badgeResolved: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#2E8B5715",
    marginLeft: 6,
  },
  badgeResolvedText: {
    fontSize: 11,
    color: "#2E8B57",
    fontWeight: "600",
  },

  alertMessage: {
    fontSize: 14,
    color: "#1a1a1a",
  },

  infoBox: {
    marginTop: 8,
    padding: 10,
    borderRadius: 16,
    backgroundColor: "#ffffffb0",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoTextMain: {
    fontSize: 14,
    color: "#1a1a1a",
  },
  infoTextSub: {
    fontSize: 12,
    color: "#86868b",
  },
  infoMono: {
    fontFamily: "Courier",
  },

  actionsRow: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 14,
    justifyContent: "center",
  },
  actionBtnOutline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e5ea",
    marginRight: 6,
  },
  actionBtnPrimary: {
    backgroundColor: "#1E90FF",
    marginLeft: 6,
  },
  actionOutlineText: {
    color: "#1a1a1a",
    fontSize: 14,
    fontWeight: "600",
  },
  actionPrimaryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
