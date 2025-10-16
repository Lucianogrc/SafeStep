import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Animated,
    Linking,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import TabBar from "../../components/ui/TabBar";

interface PlacesProps {
  onTabChange: (tab: string) => void;
  onNavigateToDetail: (placeId: string) => void;
}

const mockPlaces = [
  {
    id: "1",
    name: "Parque Nacional Verde",
    address: "Av. Bosque 123, Zona Natural",
    hours: "8:00 AM - 6:00 PM",
    rating: 4.8,
    status: "Abierto ahora",
    distance: "2.3 km",
    lat: 19.4326,
    lng: -99.1332,
    services: ["Guías", "Primeros auxilios", "Camping"],
  },
  {
    id: "2",
    name: "Reserva Natural El Pino",
    address: "Carretera Sierra 45, Montaña",
    hours: "7:00 AM - 5:00 PM",
    rating: 4.6,
    status: "Abierto ahora",
    distance: "5.1 km",
    lat: 19.4426,
    lng: -99.1432,
    services: ["Guías", "Camping"],
  },
  {
    id: "3",
    name: "Bosque Protegido Aurora",
    address: "Km 15 Ruta Ecológica",
    hours: "9:00 AM - 4:00 PM",
    rating: 4.9,
    status: "Cerrado",
    distance: "8.7 km",
    lat: 19.4226,
    lng: -99.1232,
    services: ["Primeros auxilios", "Restaurante"],
  },
];

export default function Places({ onTabChange, onNavigateToDetail }: PlacesProps) {
  const [selectedPlace, setSelectedPlace] = useState<typeof mockPlaces[0] | null>(
    null
  );

  const openGoogleMaps = (lat: number, lng: number, name: string) => {
    const url = `https://www.google.com/maps?q=${lat},${lng} (${encodeURIComponent(
      name
    )})`;
    Linking.openURL(url);
  };

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

        <TextInput
          placeholder="Buscar parques..."
          placeholderTextColor="#86868b"
          style={styles.searchInput}
        />
      </View>

      {/* MAP MOCK */}
      <View style={styles.mapContainer}>
        <View style={styles.mapGrid} />

        {mockPlaces.map((place, index) => (
          <TouchableOpacity
            key={place.id}
            style={[
              styles.pin,
              {
                top: 150 + index * 80,
                left: 80 + index * 40,
                backgroundColor:
                  place.status === "Abierto ahora" ? "#2E8B57" : "#86868b",
              },
            ]}
            onPress={() => setSelectedPlace(place)}
          >
            <Ionicons name="location" size={20} color="#fff" />
          </TouchableOpacity>
        ))}

        {/* User location */}
        <View style={styles.userDotContainer}>
          <View style={styles.userDot} />
        </View>
      </View>

      {/* CARD FLOTANTE */}
      {selectedPlace && (
        <Animated.View style={styles.bottomCard}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardTitle}>{selectedPlace.name}</Text>
                <View
                  style={[
                    styles.badge,
                    selectedPlace.status === "Abierto ahora"
                      ? styles.badgeOpen
                      : styles.badgeClosed,
                  ]}
                >
                  <Text
                    style={
                      selectedPlace.status === "Abierto ahora"
                        ? styles.badgeTextOpen
                        : styles.badgeTextClosed
                    }
                  >
                    {selectedPlace.status}
                  </Text>
                </View>
              </View>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#FFB800" />
                <Text style={styles.rating}>{selectedPlace.rating}</Text>
                <Text style={styles.dot}>·</Text>
                <Text style={styles.rating}>{selectedPlace.distance}</Text>
              </View>
              <View style={styles.ratingRow}>
                <Ionicons name="time-outline" size={14} color="#86868b" />
                <Text style={styles.hours}>{selectedPlace.hours}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSelectedPlace(null)}
            >
              <Ionicons name="close" size={20} color="#1a1a1a" />
            </TouchableOpacity>
          </View>

          {/* Servicios */}
          <View style={styles.serviceRow}>
            {selectedPlace.services.map((srv) => (
              <View key={srv} style={styles.serviceBadge}>
                <Text style={styles.serviceText}>{srv}</Text>
              </View>
            ))}
          </View>

          {/* BOTONES */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => onNavigateToDetail(selectedPlace.id)}
            >
              <Text style={styles.primaryBtnText}>Ver detalles</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() =>
                openGoogleMaps(
                  selectedPlace.lat,
                  selectedPlace.lng,
                  selectedPlace.name
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
        </Animated.View>
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
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: "600", color: "#1a1a1a" },
  iconBtn: {
    backgroundColor: "#f5f5f7",
    borderRadius: 30,
    padding: 8,
  },
  searchInput: {
    backgroundColor: "#f5f5f7",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 42,
    marginBottom: 10,
    color: "#1a1a1a",
  },

  mapContainer: {
    flex: 1,
    backgroundColor: "#E8F5E9",
  },
  mapGrid: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#E8F5E9",
    backgroundImage:
      "linear-gradient(#2E8B57 1px, transparent 1px), linear-gradient(90deg, #2E8B57 1px, transparent 1px)",
  } as any,
  pin: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  userDotContainer: {
    position: "absolute",
    top: "55%",
    left: "50%",
    transform: [{ translateX: -6 }, { translateY: -6 }],
  },
  userDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1E90FF",
    borderWidth: 2,
    borderColor: "#fff",
  },

  bottomCard: {
  position: "absolute",
  bottom: 60, // ✅ Pegada al TabBar
  left: 0,
  right: 0,
  backgroundColor: "#fff",
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  paddingHorizontal: 20,
  paddingTop: 20,
  paddingBottom: 30, // 👈 pequeño espacio interno para que los botones no se escondan
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
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#1a1a1a" },
  badge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  badgeOpen: { backgroundColor: "#2E8B5715" },
  badgeClosed: { backgroundColor: "#f2f2f2" },
  badgeTextOpen: { color: "#2E8B57", fontSize: 12 },
  badgeTextClosed: { color: "#86868b", fontSize: 12 },
  closeBtn: {
    backgroundColor: "#f5f5f7",
    borderRadius: 20,
    padding: 6,
  },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  rating: { fontSize: 13, color: "#86868b", marginLeft: 4 },
  dot: { color: "#86868b", marginHorizontal: 3 },
  hours: { fontSize: 13, color: "#86868b", marginLeft: 4 },

  serviceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
    gap: 8,
  },
  serviceBadge: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  serviceText: { color: "#1a1a1a", fontSize: 13 },

  btnRow: { flexDirection: "row", gap: 10, marginTop: 10 },
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
});
