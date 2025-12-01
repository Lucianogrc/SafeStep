// src/screens/HikerCompanyDetail.tsx
import { Feather, Ionicons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { db } from "../Services/firebaseConfig";

interface HikerCompanyDetailProps {
  companyId: string;
  onBack: () => void;
}

interface CompanyData {
  companyName: string;
  email?: string;
  phone?: string;
  description?: string;
}

interface CompanyLocation {
  latitude: number;
  longitude: number;
  updatedAt?: any;
}

export default function HikerCompanyDetail({
  companyId,
  onBack,
}: HikerCompanyDetailProps) {
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [location, setLocation] = useState<CompanyLocation | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        console.log("[HIKER_COMPANY_DETAIL] companyId:", companyId);

        // info de la empresa
        const companyRef = doc(db, "companies", companyId);
        const snap = await getDoc(companyRef);
        if (snap.exists()) {
          const data = snap.data() as any;
          setCompany({
            companyName: data.companyName ?? "Empresa",
            email: data.email ?? "",
            phone: data.phone ?? "",
            description: data.description ?? "",
          });
        }

        // ubicación de la empresa
        const locRef = doc(db, "companiesLocations", companyId);
        const locSnap = await getDoc(locRef);
        if (locSnap.exists()) {
          const data = locSnap.data() as any;
          setLocation({
            latitude: data.latitude,
            longitude: data.longitude,
            updatedAt: data.updatedAt,
          });
        }

        console.log(
          "[HIKER_COMPANY_DETAIL] datos:",
          company,
          "loc:",
          location
        );
      } catch (err) {
        console.log("[HIKER_COMPANY_DETAIL] Error:", err);
        Alert.alert("Error", "No se pudo cargar la información del lugar.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [companyId]);

  const handleViewLocation = () => {
    if (!location) {
      Alert.alert(
        "Sin ubicación",
        "Esta empresa aún no tiene una ubicación registrada."
      );
      return;
    }

    const { latitude, longitude, updatedAt } = location;
    const dateText = updatedAt?.toDate
      ? updatedAt
          .toDate()
          .toLocaleString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
      : "sin fecha";

    Alert.alert(
      "Ubicación de la empresa",
      `Lat: ${latitude.toFixed(6)}\nLng: ${longitude.toFixed(
        6
      )}\n\nÚltima actualización: ${dateText}`
    );

    // Aquí en el futuro puedes navegar a tu pantalla de mapa
    // y centrar en estas coordenadas.
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  if (!company) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "#1a1a1a" }}>
          No se encontró información de esta empresa.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
          <Feather name="arrow-left" size={22} color="#1a1a1a" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{company.companyName}</Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* Datos básicos */}
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <Ionicons name="business-outline" size={24} color="#1E90FF" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.title}>{company.companyName}</Text>
              <Text style={styles.subtitle}>Parque / Empresa registrada</Text>
            </View>
          </View>

          {company.description ? (
            <Text style={styles.description}>{company.description}</Text>
          ) : (
            <Text style={styles.description}>
              Esta empresa aún no ha agregado una descripción.
            </Text>
          )}
        </View>

        {/* Contacto */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Contacto</Text>

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={18} color="#86868b" />
            <Text style={styles.infoText}>
              {company.email || "No especificado"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={18} color="#86868b" />
            <Text style={styles.infoText}>
              {company.phone || "No especificado"}
            </Text>
          </View>
        </View>

        {/* Ubicación */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ubicación</Text>

          {location ? (
            <>
              <Text style={styles.infoText}>
                Lat: {location.latitude.toFixed(6)}
              </Text>
              <Text style={styles.infoText}>
                Lng: {location.longitude.toFixed(6)}
              </Text>
              {location.updatedAt?.toDate && (
                <Text style={styles.infoHint}>
                  Actualizado el{" "}
                  {location.updatedAt
                    .toDate()
                    .toLocaleString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                </Text>
              )}
            </>
          ) : (
            <Text style={styles.infoText}>
              Esta empresa aún no ha registrado su ubicación.
            </Text>
          )}

          <TouchableOpacity
            style={styles.locationBtn}
            onPress={handleViewLocation}
          >
            <Ionicons
              name="location-outline"
              size={18}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.locationBtnText}>Ver ubicación</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f7" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
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
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#1a1a1a" },
  iconBtn: {
    backgroundColor: "#f5f5f7",
    padding: 8,
    borderRadius: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: "600", color: "#1a1a1a" },
  subtitle: { fontSize: 13, color: "#86868b" },
  description: { marginTop: 8, color: "#1a1a1a", fontSize: 14 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoText: { marginLeft: 6, color: "#1a1a1a" },
  infoHint: { marginTop: 4, color: "#86868b", fontSize: 12 },
  locationBtn: {
    marginTop: 14,
    backgroundColor: "#1E90FF",
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  locationBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
});
