// src/screens/CompanyHikerDetail.tsx
import { Feather, Ionicons } from "@expo/vector-icons";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
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
import { auth, db } from "../Services/firebaseConfig";
import HikerLocationMap from "./HikerLocationMap";

interface CompanyHikerDetailProps {
  hikerUid: string;
  activeDocId: string; // id del doc en companies/{companyId}/activeHikers
  onBack: () => void;
}

interface HikerData {
  fullName: string;
  blood?: string;
  emergency?: string;
  age?: string;
  description?: string;
}

interface HikerLocation {
  latitude: number;
  longitude: number;
  updatedAt?: any;
}

export default function CompanyHikerDetail({
  hikerUid,
  activeDocId,
  onBack,
}: CompanyHikerDetailProps) {
  const [loading, setLoading] = useState(true);
  const [hiker, setHiker] = useState<HikerData | null>(null);
  const [location, setLocation] = useState<HikerLocation | null>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        console.log("[COMPANY_HIKER_DETAIL] hikerUid:", hikerUid);

        // datos del hiker
        const userRef = doc(db, "users", hikerUid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data() as any;
          setHiker({
            fullName: data.fullName ?? "Hiker",
            blood: data.blood,
            emergency: data.emergency,
            age: data.age,
            description: data.description,
          });
        }

        // ubicación del hiker
        const locRef = doc(db, "locations", hikerUid);
        const locSnap = await getDoc(locRef);
        if (locSnap.exists()) {
          const data = locSnap.data() as any;
          setLocation({
            latitude: data.latitude,
            longitude: data.longitude,
            updatedAt: data.updatedAt,
          });
        }
      } catch (err) {
        console.log("[COMPANY_HIKER_DETAIL] Error:", err);
        Alert.alert("Error", "No se pudieron cargar los datos del hiker.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [hikerUid, activeDocId]);

  const handleViewLocation = () => {
    if (!location) {
      Alert.alert(
        "Sin ubicación",
        "Todavía no tenemos una ubicación registrada para este hiker."
      );
      return;
    }
    setShowMap(true);
  };

  // 🔻 Eliminar hiker activo (checkout)
  const handleRemoveActiveHiker = () => {
    const company = auth.currentUser;
    if (!company) {
      Alert.alert("Error", "No hay una empresa autenticada.");
      return;
    }

    Alert.alert(
      "Eliminar hiker activo",
      "¿Estás seguro de eliminar a este hiker de tu lista de activos?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              // 1) borrar de companies/{companyId}/activeHikers/{activeDocId}
              const activeRef = doc(
                db,
                "companies",
                company.uid,
                "activeHikers",
                activeDocId
              );
              await deleteDoc(activeRef);

              // 2) marcar como inactivo en users/{hikerUid}.places[]
              try {
                const userRef = doc(db, "users", hikerUid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                  const userData = userSnap.data() as any;
                  const currentPlaces: any[] = Array.isArray(userData.places)
                    ? userData.places
                    : [];

                  const updatedPlaces = currentPlaces.map((p) =>
                    p.companyId === company.uid
                      ? { ...p, active: false }
                      : p
                  );

                  await updateDoc(userRef, { places: updatedPlaces });
                }
              } catch (e) {
                console.log(
                  "[COMPANY_HIKER_DETAIL] Error actualizando places del usuario:",
                  e
                );
              }

              Alert.alert(
                "Hiker removido",
                "El hiker ha sido eliminado de tu lista de activos.",
                [{ text: "OK", onPress: onBack }]
              );
            } catch (err) {
              console.log("[COMPANY_HIKER_DETAIL] Error eliminando activo:", err);
              Alert.alert(
                "Error",
                "No se pudo eliminar al hiker de activos. Intenta de nuevo."
              );
            }
          },
        },
      ]
    );
  };

  // Si estamos mostrando el mapa de este hiker
  if (showMap && location) {
    return (
      <HikerLocationMap
        latitude={location.latitude}
        longitude={location.longitude}
        title={`Ubicación de ${hiker?.fullName ?? "Hiker"}`}
        onBack={() => setShowMap(false)}
      />
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  if (!hiker) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "#1a1a1a" }}>
          No se encontró información de este hiker.
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

        <Text style={styles.headerTitle}>{hiker.fullName}</Text>

        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={handleRemoveActiveHiker}
            style={styles.deleteBtn}
          >
            <Ionicons name="trash-outline" size={18} color="#FF3B30" />
            <Text style={styles.deleteText}>Eliminar activo</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* Datos principales */}
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <Ionicons name="person-outline" size={24} color="#1E90FF" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.title}>{hiker.fullName}</Text>
              <Text style={styles.subtitle}>Visitante activo</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="heart-outline" size={18} color="#86868b" />
            <Text style={styles.infoText}>
              Sangre: {hiker.blood || "No registrada"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={18} color="#86868b" />
            <Text style={styles.infoText}>
              Contacto emergencia: {hiker.emergency || "No registrado"}
            </Text>
          </View>

          {hiker.age && (
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={18} color="#86868b" />
              <Text style={styles.infoText}>Edad: {hiker.age}</Text>
            </View>
          )}

          {hiker.description && (
            <Text style={[styles.infoText, { marginTop: 8 }]}>
              {hiker.description}
            </Text>
          )}
        </View>

        {/* Ubicación */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ubicación del hiker</Text>

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

              {/* Botón para ver en mapa */}
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
                <Text style={styles.locationBtnText}>Ver en mapa</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.infoText}>
                Aún no se ha registrado la ubicación de este hiker.
              </Text>
            </>
          )}
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3B3015",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  deleteText: {
    color: "#FF3B30",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
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
