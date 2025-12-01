import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface CorporateDashboardProps {
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

type CompanyStatus = "active" | "inactive";

interface CompanyItem {
  id: string;
  name: string;
  location: string;
  activeVisitors: number;
  totalVisitors: number;
  alerts: number;
  status: CompanyStatus;
  staff: number;
  lastUpdate: string;
}

interface EventItem {
  id: number;
  type: "alert" | "visitor";
  company: string;
  message: string;
  time: string;
}

// 🔹 MOCK DATA (después se sustituye por datos de Firebase)
const mockCompanies: CompanyItem[] = [
  {
    id: "C-001",
    name: "Parque Nacional Verde",
    location: "San José, Costa Rica",
    activeVisitors: 12,
    totalVisitors: 234,
    alerts: 1,
    status: "active",
    staff: 8,
    lastUpdate: "Hace 5 min",
  },
  {
    id: "C-002",
    name: "Reserva Natural El Pino",
    location: "Heredia, Costa Rica",
    activeVisitors: 8,
    totalVisitors: 156,
    alerts: 0,
    status: "active",
    staff: 5,
    lastUpdate: "Hace 12 min",
  },
  {
    id: "C-003",
    name: "Bosque Protegido Aurora",
    location: "Cartago, Costa Rica",
    activeVisitors: 0,
    totalVisitors: 89,
    alerts: 0,
    status: "inactive",
    staff: 4,
    lastUpdate: "Hace 2 horas",
  },
  {
    id: "C-004",
    name: "Parque Ecológico Montaña Azul",
    location: "Alajuela, Costa Rica",
    activeVisitors: 15,
    totalVisitors: 312,
    alerts: 2,
    status: "active",
    staff: 10,
    lastUpdate: "Hace 3 min",
  },
];

const mockEvents: EventItem[] = [
  {
    id: 1,
    type: "alert",
    company: "Parque Nacional Verde",
    message: "Batería baja en visitante",
    time: "Hace 5 min",
  },
  {
    id: 2,
    type: "visitor",
    company: "Parque Ecológico Montaña Azul",
    message: "Nuevo visitante registrado",
    time: "Hace 8 min",
  },
  {
    id: 3,
    type: "alert",
    company: "Parque Ecológico Montaña Azul",
    message: "SOS activado - Juan Pérez",
    time: "Hace 15 min",
  },
];

export default function CorporateDashboard({
  onNavigate,
  onLogout,
}: CorporateDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // 🧮 Métricas globales
  const totalActiveVisitors = useMemo(
    () => mockCompanies.reduce((sum, c) => sum + c.activeVisitors, 0),
    []
  );
  const totalAlerts = useMemo(
    () => mockCompanies.reduce((sum, c) => sum + c.alerts, 0),
    []
  );
  const activeCompanies = useMemo(
    () => mockCompanies.filter((c) => c.status === "active").length,
    []
  );

  // 🔍 Filtro de empresas por nombre
  const filteredCompanies = useMemo(
    () =>
      mockCompanies.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Panel Corporativo</Text>
          <Text style={styles.headerSubtitle}>Gestión Multi-Empresa</Text>
        </View>

        <View style={styles.headerActions}>
          {/* Botón notificaciones corporativas */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => onNavigate("corporate-notifications")}
          >
            <Feather name="bell" size={20} color="#1a1a1a" />
            {totalAlerts > 0 && <View style={styles.alertDot} />}
          </TouchableOpacity>

          {/* Perfil corporativo */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => onNavigate("corporate-profile")}
          >
            <Feather name="user" size={20} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: "#1E90FF15" }]}>
          <Text style={styles.statLabel}>Visitantes</Text>
          <Text style={[styles.statValue, { color: "#1E90FF" }]}>
            {totalActiveVisitors}
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#2E8B5715" }]}>
          <Text style={styles.statLabel}>Empresas</Text>
          <Text style={[styles.statValue, { color: "#2E8B57" }]}>
            {activeCompanies}
          </Text>
        </View>
        <View
          style={[
            styles.statCard,
            totalAlerts > 0
              ? { backgroundColor: "#FF7F1115" }
              : { backgroundColor: "#f5f5f7" },
          ]}
        >
          <Text style={styles.statLabel}>Alertas</Text>
          <Text
            style={[
              styles.statValue,
              { color: totalAlerts > 0 ? "#FF7F11" : "#1a1a1a" },
            ]}
          >
            {totalAlerts}
          </Text>
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* SEARCH + ADD */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Feather
              name="search"
              size={18}
              color="#86868b"
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Buscar empresa..."
              placeholderTextColor="#b0b0b5"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => onNavigate("company-create")}
          >
            <Feather name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* COMPANIES LIST */}
        <View style={{ marginTop: 20 }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Empresas y Parques</Text>
            <TouchableOpacity style={styles.filterBtn}>
              <Feather name="filter" size={14} color="#1a1a1a" />
              <Text style={styles.filterText}>Filtrar</Text>
            </TouchableOpacity>
          </View>

          {filteredCompanies.map((company) => (
            <View
              key={company.id}
              style={[
                styles.companyCard,
                company.status === "inactive" && { opacity: 0.7 },
              ]}
            >
              <View style={styles.companyHeader}>
                <View style={styles.companyIconBox}>
                  <Feather
                    name="briefcase"
                    size={22}
                    color={
                      company.status === "active" ? "#1E90FF" : "#86868b"
                    }
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.companyTitleRow}>
                    <Text style={styles.companyName}>{company.name}</Text>
                    {company.status === "active" && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>Activo</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.locationRow}>
                    <Feather name="map-pin" size={12} color="#86868b" />
                    <Text style={styles.locationText}>
                      {company.location}
                    </Text>
                  </View>
                </View>

                <Feather name="chevron-right" size={18} color="#86868b" />
              </View>

              {/* Metrics */}
              <View style={styles.metricsRow}>
                <View style={[styles.metricBox, { backgroundColor: "#1E90FF10" }]}>
                  <Text style={styles.metricLabel}>Visitantes</Text>
                  <Text style={[styles.metricValue, { color: "#1E90FF" }]}>
                    {company.activeVisitors}
                  </Text>
                </View>

                <View style={[styles.metricBox, { backgroundColor: "#f5f5f7" }]}>
                  <Text style={styles.metricLabel}>Personal</Text>
                  <Text style={styles.metricValue}>{company.staff}</Text>
                </View>

                <View
                  style={[
                    styles.metricBox,
                    company.alerts > 0
                      ? { backgroundColor: "#FF7F1110" }
                      : { backgroundColor: "#f5f5f7" },
                  ]}
                >
                  <Text style={styles.metricLabel}>Alertas</Text>
                  <Text
                    style={[
                      styles.metricValue,
                      {
                        color:
                          company.alerts > 0 ? "#FF7F11" : "#1a1a1a",
                      },
                    ]}
                  >
                    {company.alerts}
                  </Text>
                </View>
              </View>

              {/* Last Update */}
              <View style={styles.lastUpdateRow}>
                <Text style={styles.lastUpdateText}>
                  Última actualización: {company.lastUpdate}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* RECENT EVENTS */}
        <View style={{ marginTop: 24 }}>
          <Text style={styles.sectionTitle}>Eventos Recientes</Text>

          {mockEvents.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventIconBox}>
                {event.type === "alert" ? (
                  <Feather name="alert-triangle" size={16} color="#FF7F11" />
                ) : (
                  <Feather name="users" size={16} color="#1E90FF" />
                )}
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.eventMessage}>{event.message}</Text>
                <Text style={styles.eventCompany}>{event.company}</Text>
              </View>

              <Text style={styles.eventTime}>{event.time}</Text>
            </View>
          ))}
        </View>

        {/* Opcional: botón de logout corporativo */}
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Feather name="log-out" size={16} color="#ff3b30" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f7",
  },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#86868b",
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#f5f5f7",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  alertDot: {
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
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  statLabel: {
    fontSize: 12,
    color: "#86868b",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
  },

  searchRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  searchContainer: {
    flex: 1,
    backgroundColor: "#f5f5f7",
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 46,
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1a1a1a",
  },
  addBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#1E90FF",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#f5f5f7",
  },
  filterText: {
    fontSize: 12,
    marginLeft: 4,
    color: "#1a1a1a",
  },

  companyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#e5e5ea",
    padding: 16,
    marginTop: 10,
  },
  companyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  companyIconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#1E90FF15",
    alignItems: "center",
    justifyContent: "center",
  },
  companyTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  companyName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: "#2E8B5715",
  },
  badgeText: {
    fontSize: 11,
    color: "#2E8B57",
    fontWeight: "600",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: "#86868b",
  },

  metricsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  metricBox: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  metricLabel: {
    fontSize: 11,
    color: "#86868b",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },

  lastUpdateRow: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 6,
  },
  lastUpdateText: {
    fontSize: 11,
    color: "#86868b",
  },

  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e5e5ea",
    padding: 12,
    marginTop: 8,
    gap: 10,
  },
  eventIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f5f5f7",
    alignItems: "center",
    justifyContent: "center",
  },
  eventMessage: {
    fontSize: 13,
    color: "#1a1a1a",
    marginBottom: 2,
  },
  eventCompany: {
    fontSize: 11,
    color: "#86868b",
  },
  eventTime: {
    fontSize: 11,
    color: "#86868b",
  },

  logoutBtn: {
    marginTop: 24,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ff3b30",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  logoutText: {
    fontSize: 13,
    color: "#ff3b30",
    fontWeight: "600",
    marginLeft: 6,
  },
});
