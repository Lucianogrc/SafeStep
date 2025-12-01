import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface CompanyProfileAdminProps {
  onBack: () => void;
}

// 🟩 MOCK DATA (luego lo conectamos a Firebase)
const companyData = {
  id: "C-001",
  name: "Parque Nacional Verde",
  description:
    "Reserva natural protegida con más de 500 hectáreas de bosque tropical",
  location: {
    address: "San José, Costa Rica",
    coordinates: "9.9281° N, 84.0907° W",
  },
  contact: {
    phone: "+506 2222-3333",
    email: "info@parqueverde.cr",
    website: "www.parqueverde.cr",
  },
  staff: {
    total: 8,
    superadmin: 1,
    admin: 2,
    rangers: 4,
    operators: 1,
  },
  settings: {
    alertsEnabled: true,
    autoCheckOut: true,
    maxVisitors: 50,
  },
  stats: {
    activeVisitors: 12,
    totalVisits: 234,
    alertsToday: 1,
  },
  status: "active",
};

export default function CompanyProfileAdmin({ onBack }: CompanyProfileAdminProps) {
  const [alertsEnabled, setAlertsEnabled] = useState(
    companyData.settings.alertsEnabled
  );
  const [autoCheckOut, setAutoCheckOut] = useState(
    companyData.settings.autoCheckOut
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Feather name="chevron-left" size={22} color="#1a1a1a" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Perfil de Empresa</Text>

        <TouchableOpacity style={styles.iconBtn}>
          <Feather name="edit-2" size={20} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* COMPANY HEADER CARD */}
        <View style={styles.cardBlue}>
          <View style={styles.companyHeader}>
            <View style={styles.iconLarge}>
              <Feather name="briefcase" size={40} color="#1E90FF" />
            </View>

            <View style={{ flex: 1 }}>
              <View style={styles.companyTitleRow}>
                <Text style={styles.companyName}>{companyData.name}</Text>

                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Activo</Text>
                </View>
              </View>

              <Text style={styles.companyDescription}>
                {companyData.description}
              </Text>

              <Text style={styles.companyId}>ID: {companyData.id}</Text>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: "#1E90FF" }]}>
                {companyData.stats.activeVisitors}
              </Text>
              <Text style={styles.statLabel}>Activos</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statValue}>{companyData.stats.totalVisits}</Text>
              <Text style={styles.statLabel}>Visitas</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statValue}>{companyData.staff.total}</Text>
              <Text style={styles.statLabel}>Personal</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: "#FF7F11" }]}>
                {companyData.stats.alertsToday}
              </Text>
              <Text style={styles.statLabel}>Alertas</Text>
            </View>
          </View>
        </View>

        {/* LOCATION */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="location-outline" size={20} color="#1E90FF" />
            <Text style={styles.cardTitle}>Ubicación</Text>
          </View>

          <View style={{ marginTop: 6 }}>
            <Text style={styles.label}>Dirección</Text>
            <Text style={styles.value}>{companyData.location.address}</Text>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>Coordenadas</Text>
            <Text style={styles.value}>{companyData.location.coordinates}</Text>
          </View>
        </View>

        {/* CONTACT INFO */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="phone" size={20} color="#1E90FF" />
            <Text style={styles.cardTitle}>Datos de Contacto</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Teléfono</Text>
            <Text style={styles.value}>{companyData.contact.phone}</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{companyData.contact.email}</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Sitio web</Text>
            <Text style={[styles.value, { color: "#1E90FF" }]}>
              {companyData.contact.website}
            </Text>
          </View>
        </View>

        {/* STAFF */}
        <View style={styles.card}>
          <View style={styles.cardHeaderBetween}>
            <View style={styles.cardHeader}>
              <Feather name="users" size={20} color="#1E90FF" />
              <Text style={styles.cardTitle}>Personal Asignado</Text>
            </View>

            <TouchableOpacity style={styles.manageBtn}>
              <Text style={styles.manageBtnText}>Gestionar</Text>
            </TouchableOpacity>
          </View>

          {Object.entries(companyData.staff).map(([role, count]) => (
            <View key={role} style={styles.staffRow}>
              <Text style={styles.value}>{role}</Text>
              <View style={styles.badgeGrey}>
                <Text style={styles.badgeTextBlack}>{count}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* SETTINGS */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="settings" size={20} color="#1E90FF" />
            <Text style={styles.cardTitle}>Configuración</Text>
          </View>

          {/* Alerts */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.value}>Alertas automáticas</Text>
              <Text style={styles.label}>Notificar eventos importantes</Text>
            </View>

            <TouchableOpacity
              onPress={() => setAlertsEnabled(!alertsEnabled)}
            >
              <Ionicons
                name={alertsEnabled ? "toggle" : "toggle-outline"}
                size={44}
                color={alertsEnabled ? "#2E8B57" : "#ccc"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.separator} />

          {/* Auto check out */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.value}>Check-out automático</Text>
              <Text style={styles.label}>Cerrar visita tras 8 horas</Text>
            </View>

            <TouchableOpacity
              onPress={() => setAutoCheckOut(!autoCheckOut)}
            >
              <Ionicons
                name={autoCheckOut ? "toggle" : "toggle-outline"}
                size={44}
                color={autoCheckOut ? "#1E90FF" : "#ccc"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.separator} />

          {/* Max visitors */}
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.value}>Máx. visitantes</Text>
              <Text style={styles.label}>Capacidad del parque</Text>
            </View>

            <Text style={styles.value}>{companyData.settings.maxVisitors}</Text>
          </View>
        </View>

        {/* DANGER ZONE */}
        <View style={styles.cardDanger}>
          <View style={styles.cardHeader}>
            <Feather name="alert-circle" size={20} color="#ff3b30" />
            <Text style={styles.cardTitle}>Zona de Peligro</Text>
          </View>

          <Text style={styles.label}>
            Las acciones en esta sección son irreversibles.
          </Text>

          <TouchableOpacity style={styles.dangerBtn}>
            <Text style={styles.dangerBtnText}>Desactivar Empresa</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

//
// 🎨  ESTILOS — profesional, limpio, igual al Figma
//
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f7" },

  header: {
    paddingTop: 60,
    paddingBottom: 14,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backBtn: {
    padding: 8,
    backgroundColor: "#f5f5f7",
    borderRadius: 100,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  iconBtn: {
    padding: 8,
    backgroundColor: "#f5f5f7",
    borderRadius: 100,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#e5e5ea",
  },
  cardBlue: {
    backgroundColor: "#1E90FF15",
    borderRadius: 22,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#1E90FF20",
  },
  cardDanger: {
    backgroundColor: "#ffe7e7",
    borderRadius: 22,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ffb3b3",
  },

  companyHeader: { flexDirection: "row", gap: 16 },
  iconLarge: {
    width: 70,
    height: 70,
    backgroundColor: "#1E90FF25",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  companyTitleRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  companyName: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  companyDescription: { color: "#86868b", fontSize: 13, marginTop: 4 },
  companyId: { color: "#86868b", fontSize: 11, marginTop: 4 },

  badge: {
    backgroundColor: "#2E8B57",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "600" },

  statsGrid: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
  },
  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    marginHorizontal: 3,
  },
  statLabel: { fontSize: 11, color: "#86868b" },
  statValue: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  cardHeader: { flexDirection: "row", gap: 8, alignItems: "center" },
  cardHeaderBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { fontSize: 15, fontWeight: "600", color: "#1a1a1a" },

  label: { color: "#86868b", fontSize: 12 },
  value: { color: "#1a1a1a", fontSize: 14 },

  separator: {
    height: 1,
    backgroundColor: "#e5e5ea",
    marginVertical: 8,
  },

  manageBtn: {
    backgroundColor: "#f5f5f7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  manageBtnText: { fontSize: 12, fontWeight: "600", color: "#1a1a1a" },

  staffRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f7",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  badgeGrey: {
    backgroundColor: "#ddd",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeTextBlack: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1a1a1a",
  },

  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },

  dangerBtn: {
    backgroundColor: "#fff",
    borderColor: "#ff3b30",
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  dangerBtnText: {
    color: "#ff3b30",
    fontWeight: "700",
    fontSize: 14,
  },
});
