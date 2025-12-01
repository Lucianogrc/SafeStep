// src/screens/MonitoringMap.tsx
import { Feather } from "@expo/vector-icons";
import {
    collection,
    doc,
    getDoc,
    onSnapshot,
    QuerySnapshot,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { auth, db } from "../firebaseConfig";

interface MonitoringMapProps {
  onBack: () => void;
}

type GPSStatus = "active" | "weak" | "lost";

interface ActiveVisitor {
  id: string;
  name: string;
  photo?: string;
  bloodType?: string;
  checkIn?: string;
  duration?: string;
  gpsStatus?: GPSStatus;
  battery?: number;
  location?: {
    lat: number;
    lng: number;
  };
  zone?: string;
  distanceFromEntry?: string;
  alerts?: number;
  phone?: string;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function MonitoringMap({ onBack }: MonitoringMapProps) {
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [activeVisitors, setActiveVisitors] = useState<ActiveVisitor[]>([]);
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(
    null
  );
  const [isFullscreen, setIsFullscreen] = useState(false);

  const selectedVisitor = useMemo(
    () => activeVisitors.find((v) => v.id === selectedVisitorId) || null,
    [activeVisitors, selectedVisitorId]
  );

  // ⚙️ Cargar companyId del usuario actual y sus visitantes activos
  useEffect(() => {
    let unsubscribeVisitors: (() => void) | undefined;

    const init = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }

        // 1. Obtener companyId del usuario
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setLoading(false);
          return;
        }

        const userData = userSnap.data() as { companyId?: string };
        if (!userData.companyId) {
          setLoading(false);
          return;
        }

        setCompanyId(userData.companyId);

        // 2. Suscribirse a companies/{companyId}/activeVisitors
        const visitorsCol = collection(
          db,
          "companies",
          userData.companyId,
          "activeVisitors"
        );

        unsubscribeVisitors = onSnapshot(
          visitorsCol,
          (snap: QuerySnapshot) => {
            const list: ActiveVisitor[] = [];
            snap.forEach((docSnap) => {
              const data = docSnap.data() as any;
              list.push({
                id: docSnap.id,
                name: data.name || "Visitante sin nombre",
                photo: data.photo || undefined,
                bloodType: data.bloodType || data.blood || undefined,
                gpsStatus: (data.gpsStatus as GPSStatus) || "active",
                battery:
                  typeof data.battery === "number" ? data.battery : undefined,
                location: data.location
                  ? {
                      lat: data.location.lat,
                      lng: data.location.lng,
                    }
                  : undefined,
                zone: data.zone || undefined,
                distanceFromEntry: data.distanceFromEntry || undefined,
                duration: data.duration || undefined,
                alerts:
                  typeof data.alerts === "number" ? data.alerts : undefined,
                phone: data.phone || undefined,
                checkIn: data.checkIn || undefined,
              });
            });
            setActiveVisitors(list);
            setLoading(false);
          },
          (err) => {
            console.log("❌ Error suscribiendo activeVisitors:", err);
            setLoading(false);
          }
        );
      } catch (err) {
        console.log("❌ Error en MonitoringMap init:", err);
        setLoading(false);
      }
    };

    init();

    return () => {
      if (unsubscribeVisitors) unsubscribeVisitors();
    };
  }, []);

  // 🌍 Región inicial del mapa
  const initialRegion: Region = useMemo(() => {
    const withLocation = activeVisitors.filter((v) => v.location);
    if (withLocation.length > 0 && withLocation[0].location) {
      const { lat, lng } = withLocation[0].location;
      return {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
    }

    // Fallback genérico (ej. Costa Rica)
    return {
      latitude: 9.9281,
      longitude: -84.0907,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };
  }, [activeVisitors]);

  // 📞 Llamar al hiker
  const handleCallVisitor = () => {
    if (!selectedVisitor?.phone) {
      Alert.alert(
        "Sin teléfono",
        "Este visitante no tiene un teléfono registrado."
      );
      return;
    }
    Linking.openURL(`tel:${selectedVisitor.phone}`).catch(() => {
      Alert.alert("Error", "No se pudo abrir la app de teléfono.");
    });
  };

  // 🚨 Botón de alerta general (placeholder)
  const handleGlobalAlert = () => {
    Alert.alert(
      "Alerta general",
      "Aquí iría la lógica para enviar una alerta global a todos los visitantes."
    );
  };

  // 🎛 Filtros (placeholder)
  const handleFilterPress = () => {
    Alert.alert(
      "Filtros",
      "Aquí puedes implementar un modal o bottom sheet con filtros avanzados."
    );
  };

  const gpsActiveCount = activeVisitors.filter(
    (v) => v.gpsStatus === "active"
  ).length;
  const withAlertsCount = activeVisitors.filter(
    (v) => (v.alerts || 0) > 0
  ).length;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E8B57" />
        <Text style={styles.loadingText}>Cargando monitoreo en vivo...</Text>
      </View>
    );
  }

  if (!companyId) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          No se encontró empresa asociada al usuario.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER (se oculta en fullscreen) */}
      {!isFullscreen && (
        <View style={styles.headerWrapper}>
          <View style={styles.headerBar}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                onPress={onBack}
                style={styles.iconButton}
                activeOpacity={0.8}
              >
                <Feather name="arrow-left" size={20} color="#1a1a1a" />
              </TouchableOpacity>
              <View>
                <Text style={styles.headerTitle}>Monitoreo en Vivo</Text>
                <Text style={styles.headerSubtitle}>
                  {activeVisitors.length} visitantes activos
                </Text>
              </View>
            </View>

            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={handleFilterPress}
                style={styles.iconButton}
                activeOpacity={0.8}
              >
                <Feather name="filter" size={20} color="#1a1a1a" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsFullscreen((prev) => !prev)}
                style={styles.iconButton}
                activeOpacity={0.8}
              >
                <Feather
                  name={isFullscreen ? "minimize-2" : "maximize-2"}
                  size={20}
                  color="#1a1a1a"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.statCardGreen]}>
              <Text style={styles.statLabel}>GPS activo</Text>
              <Text style={[styles.statValue, { color: "#2E8B57" }]}>
                {gpsActiveCount}
              </Text>
            </View>
            <View style={[styles.statCard, styles.statCardOrange]}>
              <Text style={styles.statLabel}>Con alertas</Text>
              <Text style={[styles.statValue, { color: "#FF7F11" }]}>
                {withAlertsCount}
              </Text>
            </View>
            <View style={[styles.statCard, styles.statCardGray]}>
              <Text style={styles.statLabel}>Total</Text>
              <Text style={[styles.statValue, { color: "#1a1a1a" }]}>
                {activeVisitors.length}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* MAPA */}
      <View
        style={[
          styles.mapWrapper,
          isFullscreen ? { top: 0 } : { top: 140 }, // altura del header+stats aprox
        ]}
      >
        <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={initialRegion}
          showsUserLocation={false}
          showsMyLocationButton={false}
          showsCompass={false}
        >
          {activeVisitors.map((visitor) => {
            if (!visitor.location) return null;
            return (
              <Marker
                key={visitor.id}
                coordinate={{
                  latitude: visitor.location.lat,
                  longitude: visitor.location.lng,
                }}
                onPress={() => setSelectedVisitorId(visitor.id)}
              >
                <View style={styles.markerOuter}>
                  <View style={styles.markerInner}>
                    {visitor.photo ? (
                      <Image
                        source={{ uri: visitor.photo }}
                        style={styles.markerImage}
                      />
                    ) : (
                      <Text style={styles.markerInitials}>
                        {visitor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </Text>
                    )}
                  </View>
                  <View
                    style={[
                      styles.markerStatusDot,
                      (visitor.alerts || 0) > 0
                        ? { backgroundColor: "#FF7F11" }
                        : { backgroundColor: "#2E8B57" },
                    ]}
                  />
                </View>
              </Marker>
            );
          })}
        </MapView>

        {/* Botón alerta general (cuando NO hay visitor seleccionado) */}
        {!selectedVisitor && (
          <View style={styles.globalAlertWrapper}>
            <TouchableOpacity
              onPress={handleGlobalAlert}
              style={styles.globalAlertButton}
              activeOpacity={0.9}
            >
              <Feather name="alert-triangle" size={18} color="#fff" />
              <Text style={styles.globalAlertText}>Enviar alerta general</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* PANEL INFERIOR DETALLE VISITOR */}
        {selectedVisitor && (
          <View style={styles.bottomSheet}>
            {/* Header del panel */}
            <View style={styles.sheetHeader}>
              <View style={styles.sheetUserRow}>
                <View style={styles.sheetAvatarWrapper}>
                  {selectedVisitor.photo ? (
                    <Image
                      source={{ uri: selectedVisitor.photo }}
                      style={styles.sheetAvatar}
                    />
                  ) : (
                    <View style={styles.sheetAvatarPlaceholder}>
                      <Text style={styles.sheetAvatarInitials}>
                        {selectedVisitor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>
                <View>
                  <Text style={styles.sheetName}>{selectedVisitor.name}</Text>
                  <Text style={styles.sheetId}>{selectedVisitor.id}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedVisitorId(null)}
                style={styles.iconButton}
              >
                <Feather
                  name="chevron-down"
                  size={20}
                  color="#1a1a1a"
                  style={{ transform: [{ rotate: "90deg" }] }}
                />
              </TouchableOpacity>
            </View>

            {/* Indicadores */}
            <View style={styles.sheetStatsRow}>
              <View style={styles.sheetStatCard}>
                {selectedVisitor.gpsStatus === "active" ? (
                  <Feather name="wifi" size={16} color="#2E8B57" />
                ) : (
                  <Feather name="wifi-off" size={16} color="#FF7F11" />
                )}
                <View>
                  <Text style={styles.sheetStatLabel}>GPS</Text>
                  <Text style={styles.sheetStatValue}>
                    {selectedVisitor.gpsStatus === "active"
                      ? "Activo"
                      : "Débil"}
                  </Text>
                </View>
              </View>
              <View style={styles.sheetStatCard}>
                <Feather
                  name="battery"
                  size={16}
                  color={
                    (selectedVisitor.battery || 0) < 20
                      ? "#FF3B30"
                      : "#2E8B57"
                  }
                />
                <View>
                  <Text style={styles.sheetStatLabel}>Batería</Text>
                  <Text style={styles.sheetStatValue}>
                    {selectedVisitor.battery != null
                      ? `${selectedVisitor.battery}%`
                      : "-"}
                  </Text>
                </View>
              </View>
              <View style={styles.sheetStatCard}>
                <View style={styles.bloodBadge}>
                  <Text style={styles.bloodBadgeText}>
                    {selectedVisitor.bloodType || "?"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Info de ubicación */}
            <View style={styles.sheetInfoBox}>
              <View style={styles.sheetInfoRow}>
                <Text style={styles.sheetInfoLabel}>Zona actual</Text>
                <Text style={styles.sheetInfoValue}>
                  {selectedVisitor.zone || "-"}
                </Text>
              </View>
              <View style={styles.sheetInfoRow}>
                <Text style={styles.sheetInfoLabel}>Distancia</Text>
                <Text style={styles.sheetInfoValue}>
                  {selectedVisitor.distanceFromEntry || "-"}
                </Text>
              </View>
              <View style={styles.sheetInfoRow}>
                <Text style={styles.sheetInfoLabel}>Duración</Text>
                <Text style={styles.sheetInfoValue}>
                  {selectedVisitor.duration || "-"}
                </Text>
              </View>
            </View>

            {/* Alertas */}
            {(selectedVisitor.alerts || 0) > 0 && (
              <View style={styles.sheetAlertBox}>
                <Feather name="alert-triangle" size={16} color="#FF3B30" />
                <Text style={styles.sheetAlertText}>
                  {selectedVisitor.alerts}{" "}
                  {selectedVisitor.alerts === 1
                    ? "alerta activa"
                    : "alertas activas"}
                </Text>
              </View>
            )}

            {/* Botones de acción */}
            <View style={styles.sheetActionsRow}>
              <TouchableOpacity
                style={[styles.sheetButton, styles.sheetButtonOutline]}
                onPress={handleCallVisitor}
                activeOpacity={0.9}
              >
                <Feather
                  name="phone"
                  size={18}
                  color="#1a1a1a"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.sheetButtonOutlineText}>Llamar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sheetButton, styles.sheetButtonPrimary]}
                activeOpacity={0.9}
                onPress={() =>
                  Alert.alert(
                    "Mensaje",
                    "Aquí podrías abrir un chat interno o redirigir a WhatsApp."
                  )
                }
              >
                <Feather
                  name="message-square"
                  size={18}
                  color="#fff"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.sheetButtonPrimaryText}>Mensaje</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

// 🎨 Estilos inspirados en tu Figma
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f7",
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    color: "#86868b",
    textAlign: "center",
  },
  headerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
    paddingBottom: 12,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    zIndex: 10,
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#86868b",
  },
  iconButton: {
    backgroundColor: "#f5f5f7",
    padding: 8,
    borderRadius: 50,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  statCard: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  statCardGreen: {
    backgroundColor: "rgba(46,139,87,0.05)",
    borderColor: "rgba(46,139,87,0.2)",
  },
  statCardOrange: {
    backgroundColor: "rgba(255,127,17,0.05)",
    borderColor: "rgba(255,127,17,0.2)",
  },
  statCardGray: {
    backgroundColor: "#f5f5f7",
    borderColor: "rgba(0,0,0,0.05)",
  },
  statLabel: {
    fontSize: 11,
    color: "#86868b",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  mapWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  markerOuter: {
    alignItems: "center",
  },
  markerInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#fff",
    overflow: "hidden",
    backgroundColor: "#1E90FF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  markerImage: {
    width: "100%",
    height: "100%",
  },
  markerInitials: {
    color: "#fff",
    fontWeight: "700",
  },
  markerStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#fff",
    marginTop: -4,
  },
  globalAlertWrapper: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
  },
  globalAlertButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF3B30",
    paddingVertical: 14,
    borderRadius: 18,
    shadowColor: "#FF3B30",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  globalAlertText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: "#ffffffEE",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sheetUserRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sheetAvatarWrapper: {
    width: 56,
    height: 56,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#2E8B5710",
    justifyContent: "center",
    alignItems: "center",
  },
  sheetAvatar: {
    width: "100%",
    height: "100%",
  },
  sheetAvatarPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  sheetAvatarInitials: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E8B57",
  },
  sheetName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  sheetId: {
    fontSize: 12,
    color: "#86868b",
  },
  sheetStatsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  sheetStatCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 8,
    borderRadius: 14,
    backgroundColor: "#f5f5f7",
  },
  sheetStatLabel: {
    fontSize: 11,
    color: "#86868b",
  },
  sheetStatValue: {
    fontSize: 13,
    color: "#1a1a1a",
  },
  bloodBadge: {
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  bloodBadgeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  sheetInfoBox: {
    backgroundColor: "#f5f5f7",
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
  },
  sheetInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  sheetInfoLabel: {
    fontSize: 12,
    color: "#86868b",
  },
  sheetInfoValue: {
    fontSize: 13,
    color: "#1a1a1a",
  },
  sheetAlertBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 10,
    borderRadius: 16,
    backgroundColor: "#ffecec",
    borderWidth: 1,
    borderColor: "#ffb3b3",
    marginBottom: 10,
  },
  sheetAlertText: {
    fontSize: 13,
    color: "#FF3B30",
  },
  sheetActionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  sheetButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 16,
  },
  sheetButtonOutline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  sheetButtonOutlineText: {
    color: "#1a1a1a",
    fontWeight: "500",
  },
  sheetButtonPrimary: {
    backgroundColor: "#1E90FF",
  },
  sheetButtonPrimaryText: {
    color: "#fff",
    fontWeight: "600",
  },
});
