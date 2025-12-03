// src/screens/CorporateDashboard.tsx

import { Feather } from "@expo/vector-icons";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../Services/firebaseConfig";

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
  hasPark?: boolean;
}

interface ParkItem {
  id: string;
  companyId: string;
  circleCenter: { latitude: number; longitude: number } | null;
  circleRadius: number;
  pois: any[];
  updatedAt: any;
}

export default function CorporateDashboard({
  onNavigate,
  onLogout,
}: CorporateDashboardProps) {
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [parks, setParks] = useState<ParkItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const uid = auth.currentUser?.uid ?? null;

  // ============================================================
  // MÉTRICAS
  // ============================================================

  const totalActiveVisitors = useMemo(
    () => companies.reduce((sum, c) => sum + (c.activeVisitors || 0), 0),
    [companies]
  );

  const totalAlerts = useMemo(
    () => companies.reduce((sum, c) => sum + (c.alerts || 0), 0),
    [companies]
  );

  const activeCompanies = useMemo(
    () => companies.filter((c) => c.status === "active").length,
    [companies]
  );

  // ============================================================
  // OBTENER EMPRESA ACTUAL
  // ============================================================

  const fetchUserCompany = async () => {
    if (!uid) return;

    try {
      const docRef = doc(db, "companies", uid);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const data = snapshot.data() as CompanyItem;

       const companyData = snapshot.data() as any;

setCompanies([
  {
    id: uid,
    name: companyData.companyName ?? "Sin nombre",
    location: companyData.address ?? "Sin ubicación",
    activeVisitors: companyData.activeVisitors ?? 0,
    totalVisitors: companyData.totalVisitors ?? 0,
    alerts: companyData.alerts ?? 0,
    status: companyData.status ?? "active",
    staff: companyData.staff ?? 0,
    lastUpdate: companyData.lastUpdate ?? "Sin datos",
    hasPark: companyData.hasPark ?? false,
  },
]);



      }
    } catch (e) {
      console.log("Error cargando compañía:", e);
    }
  };

  // ============================================================
  // OBTENER PARQUES ASOCIADOS A LA EMPRESA
  // ============================================================

  const fetchUserParks = async () => {
    if (!uid) return;

    try {
      const q = query(collection(db, "parks"), where("companyId", "==", uid));
      const querySnapshot = await getDocs(q);

      const parksList: ParkItem[] = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as ParkItem[];

      setParks(parksList);
    } catch (e) {
      console.log("Error cargando parques:", e);
    }
  };

  useEffect(() => {
    fetchUserCompany();
    fetchUserParks();
  }, []);

  // ============================================================
  // FILTRO
  // ============================================================

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) =>
      c.name ? c.name.toLowerCase().includes(searchQuery.toLowerCase()) : false
    );
  }, [searchQuery, companies]);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Panel Corporativo</Text>
          <Text style={styles.headerSubtitle}>Gestión de Empresas</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => onNavigate("corporate-notifications")}
          >
            <Feather name="bell" size={20} color="#1a1a1a" />
            {totalAlerts > 0 && <View style={styles.alertDot} />}
          </TouchableOpacity>

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
        contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
      >
        {/* SEARCH + ADD */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Feather name="search" size={18} color="#86868b" />
            <TextInput
              placeholder="Buscar empresa..."
              placeholderTextColor="#86868b"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => onNavigate("mapView")}
          >
            <Feather name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* LISTA EMPRESA + PARQUE */}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>Empresas y Parques</Text>

          {filteredCompanies.map((company) => {
            const park = parks.find((p) => p.companyId === company.id);

            return (
              <View key={company.id} style={styles.companyCard}>
                {/* HEADER */}
                <View style={styles.companyHeader}>
                  <View style={styles.companyIconBox}>
                    <Feather name="briefcase" size={22} color="#1E90FF" />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.companyName}>{company.name}</Text>

                    <View style={styles.locationRow}>
                      <Feather name="map-pin" size={12} color="#86868b" />
                      <Text style={styles.locationText}>
                        {company.location || "Sin ubicación"}
                      </Text>
                    </View>
                  </View>

                  <Feather
                    name="chevron-right"
                    size={20}
                    color="#86868b"
                    onPress={() => onNavigate("mapView")}
                  />
                </View>

                {/* PARQUE */}
                <View style={{ marginTop: 10 }}>
                  {park ? (
                    <View style={styles.parkBox}>
                      <Feather
                        name="map"
                        size={18}
                        color="#2E8B57"
                        style={{ marginRight: 6 }}
                      />

                      <View style={{ flex: 1 }}>
                        <Text style={styles.parkTitle}>
                          Parque registrado
                        </Text>
                        <Text style={styles.parkSubtitle}>
                          {park.pois.length} puntos asignados
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => onNavigate("mapView")}
                        style={styles.editMapBtn}
                      >
                        <Text style={styles.editMapText}>Editar</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => onNavigate("mapView")}
                      style={styles.createParkBtn}
                    >
                      <Feather name="plus" size={16} color="#1E90FF" />
                      <Text style={styles.createParkText}>
                        Crear mapa del parque
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Feather name="log-out" size={16} color="#ff3b30" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ============================================================
   ESTILOS
============================================================ */

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

  headerTitle: { fontSize: 20, fontWeight: "700", color: "#1a1a1a" },
  headerSubtitle: { fontSize: 13, color: "#86868b" },

  headerActions: { flexDirection: "row", gap: 10 },

  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#f5f5f7",
    alignItems: "center",
    justifyContent: "center",
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
    paddingHorizontal: 20,
    marginTop: 10,
    gap: 10,
  },

  statCard: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },

  statLabel: { color: "#86868b", fontSize: 13 },
  statValue: { color: "#1a1a1a", fontSize: 22, fontWeight: "700" },

  searchRow: { flexDirection: "row", gap: 10, marginTop: 20 },

  searchContainer: {
    flex: 1,
    backgroundColor: "#f5f5f7",
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 46,
    flexDirection: "row",
    alignItems: "center",
  },

  searchInput: { flex: 1, marginLeft: 8, color: "#1a1a1a" },

  addBtn: {
    width: 46,
    height: 46,
    backgroundColor: "#1E90FF",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#1a1a1a",
  },

  companyCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#e5e5ea",
    padding: 16,
    marginTop: 12,
  },

  companyHeader: { flexDirection: "row", alignItems: "center" },

  companyIconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#1E90FF15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  companyName: { fontSize: 16, fontWeight: "600", color: "#1a1a1a" },

  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  locationText: { color: "#86868b", marginLeft: 4, fontSize: 12 },

  parkBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E8B5715",
    padding: 12,
    borderRadius: 16,
  },

  parkTitle: { fontSize: 14, fontWeight: "600", color: "#1a1a1a" },
  parkSubtitle: { fontSize: 12, color: "#2E8B57" },

  editMapBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#2E8B57",
    borderRadius: 10,
  },

  editMapText: { fontSize: 12, color: "#fff" },

  createParkBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E90FF15",
    padding: 12,
    borderRadius: 14,
  },

  createParkText: {
    color: "#1E90FF",
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "600",
  },

  logoutBtn: {
    marginTop: 30,
    alignSelf: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ff3b30",
    alignItems: "center",
  },

  logoutText: { color: "#ff3b30", marginLeft: 6, fontWeight: "600" },
});
