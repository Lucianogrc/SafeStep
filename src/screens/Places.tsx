import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Linking,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import TabBar from "../../components/ui/TabBar";
import { db } from "../firebaseConfig";

interface CompanyData {
  id: string;
  companyName: string;
  latitude: number;
  longitude: number;
}

interface PlacesProps {
  onTabChange: (tab: string) => void;
  onNavigateToDetail: (placeId: string) => void;
}

export default function Places({ onTabChange, onNavigateToDetail }: PlacesProps) {
  const [location, setLocation] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState<CompanyData[]>([]);
  const [search, setSearch] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<CompanyData | null>(null);

  // 🧭 Obtener ubicación actual del usuario
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Activa los permisos de ubicación para ver el mapa.");
        setLoading(false);
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      setLoading(false);
    })();
  }, []);

  // 🏢 Cargar empresas desde Firestore (companiesLocations)
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const snapshot = await getDocs(collection(db, "companiesLocations"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          companyName: doc.data().companyName?.trim() || "Empresa sin nombre",
          latitude: doc.data().latitude,
          longitude: doc.data().longitude,
        })) as CompanyData[];
        setPlaces(data);
      } catch (err) {
        console.error("Error cargando lugares:", err);
      }
    };
    fetchPlaces();
  }, []);

  // 🔍 Filtrar empresas por búsqueda
  const filteredPlaces = places.filter(
    (p) =>
      p.companyName &&
      p.companyName.toLowerCase().includes(search.toLowerCase())
  );

  // 🌍 Abrir ubicación en Google Maps
  const openGoogleMaps = (lat: number, lng: number, name: string) => {
    const url = `https://www.google.com/maps?q=${lat},${lng} (${encodeURIComponent(
      name
    )})`;
    Linking.openURL(url);
  };

  // 🕐 Mostrar loader mientras carga
  if (loading || !location) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2E8B57" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Lugares</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="filter-outline" size={20} color="#1a1a1a" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="list-outline" size={20} color="#1a1a1a" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={18}
            color="#86868b"
            style={{ marginRight: 6 }}
          />
          <TextInput
            placeholder="Buscar empresas..."
            placeholderTextColor="#86868b"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* MAPA CON MARCADORES */}
      <MapView
        style={styles.map}
        region={location}
        showsUserLocation
        showsMyLocationButton
        onPress={() => setSelectedPlace(null)}
      >
        {filteredPlaces.map((place) => (
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            title={place.companyName}
            description="Empresa registrada"
            pinColor="#2E8B57"
            onPress={() => setSelectedPlace(place)}
          />
        ))}
      </MapView>

      {/* CARD FLOTANTE AL SELECCIONAR */}
      {selectedPlace && (
        <View style={styles.bottomCard}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{selectedPlace.companyName}</Text>
              <Text style={styles.cardSubtitle}>Empresa registrada</Text>
            </View>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSelectedPlace(null)}
            >
              <Ionicons name="close" size={20} color="#1a1a1a" />
            </TouchableOpacity>
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => onNavigateToDetail(selectedPlace.id)}
            >
              <Text style={styles.primaryBtnText}>Más información</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() =>
                openGoogleMaps(
                  selectedPlace.latitude,
                  selectedPlace.longitude,
                  selectedPlace.companyName
                )
              }
            >
              <Ionicons
                name="navigate-outline"
                size={16}
                color="#1a1a1a"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.secondaryBtnText}>Cómo llegar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Mensaje si no hay empresas */}
      {!loading && places.length === 0 && (
        <View style={styles.noPlacesBox}>
          <Text style={styles.noPlacesText}>
            Aún no hay empresas registradas en el mapa.
          </Text>
        </View>
      )}

      {/* TAB BAR */}
      <TabBar
        activeTab="places"
        variant="hiker"
        onTabChange={(tab) => {
          if (tab === "home") onTabChange("home");
          if (tab === "places") onTabChange("places");
          if (tab === "qr") onTabChange("brazalet");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingBottom: 10,
    paddingHorizontal: 20,
    zIndex: 10,
    elevation: 8,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: "600", color: "#1a1a1a" },
  iconBtn: { backgroundColor: "#f5f5f7", borderRadius: 30, padding: 8 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f7",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#1a1a1a" },
  bottomCard: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#1a1a1a" },
  cardSubtitle: { color: "#86868b", fontSize: 13, marginTop: 2 },
  closeBtn: { backgroundColor: "#f5f5f7", borderRadius: 20, padding: 6 },
  btnRow: { flexDirection: "row", gap: 10, marginTop: 14 },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#2E8B57",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  primaryBtnText: { color: "#fff", fontWeight: "600" },
  secondaryBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  secondaryBtnText: { color: "#1a1a1a", fontWeight: "500" },
  noPlacesBox: {
    position: "absolute",
    top: "50%",
    alignSelf: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  noPlacesText: { color: "#86868b", fontSize: 14, textAlign: "center" },
});
