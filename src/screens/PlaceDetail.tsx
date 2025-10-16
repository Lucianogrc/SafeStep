import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PlaceDetailProps {
  placeId: string;
  onBack: () => void;
}

const placesData = [
  {
    id: "1",
    name: "Parque Nacional Verde",
    address: "Av. Bosque 123, Zona Natural, Ciudad",
    phone: "+1 234 567 8900",
    website: "www.parqueverde.com",
    hours: "Lunes a Domingo: 8:00 AM – 6:00 PM",
    rating: 4.8,
    reviews: 342,
    status: "Abierto ahora",
    distance: "2.3 km",
    description:
      "Un hermoso parque nacional con extensas áreas verdes, senderos naturales y vistas panorámicas. Perfecto para caminatas, observación de aves y actividades al aire libre.",
    services: [
      "Guías certificados",
      "Primeros auxilios",
      "Camping",
      "Restaurante",
      "Estacionamiento",
    ],
    visits: [
      { date: "15 Dic 2024", duration: "3 h 45 min" },
      { date: "3 Nov 2024", duration: "2 h 30 min" },
      { date: "12 Oct 2024", duration: "4 h 15 min" },
    ],
  },
  {
    id: "2",
    name: "Reserva Natural El Pino",
    address: "Carretera Sierra 45, Montaña",
    phone: "+1 234 567 8901",
    website: "www.reservaelpino.com",
    hours: "Lunes a Domingo: 7:00 AM – 5:00 PM",
    rating: 4.6,
    reviews: 289,
    status: "Abierto ahora",
    distance: "5.1 km",
    description:
      "Una reserva con bosques frondosos, zonas de camping y senderos entre montañas. Ideal para pasar un fin de semana en contacto con la naturaleza.",
    services: ["Guías", "Camping", "Restaurante", "Zona de picnic"],
    visits: [
      { date: "9 Ene 2025", duration: "4 h 10 min" },
      { date: "18 Oct 2024", duration: "2 h 45 min" },
    ],
  },
  {
    id: "3",
    name: "Bosque Protegido Aurora",
    address: "Km 15 Ruta Ecológica, Valle Verde",
    phone: "+1 234 567 8902",
    website: "www.bosqueaurora.com",
    hours: "Martes a Domingo: 9:00 AM – 4:00 PM",
    rating: 4.9,
    reviews: 412,
    status: "Cerrado",
    distance: "8.7 km",
    description:
      "Un espacio protegido con un ecosistema único, ideal para caminatas ecológicas y observación de fauna. Incluye restaurante y personal de primeros auxilios.",
    services: ["Primeros auxilios", "Restaurante", "Estacionamiento"],
    visits: [
      { date: "5 Ene 2025", duration: "3 h 15 min" },
      { date: "12 Dic 2024", duration: "5 h 00 min" },
    ],
  },
];

export default function PlaceDetail({ placeId, onBack }: PlaceDetailProps) {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const place = placesData.find((p) => p.id === placeId);

  if (!place) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 50 }}>
          Lugar no encontrado.
        </Text>
        <TouchableOpacity onPress={onBack}>
          <Text style={{ color: "#1E90FF", textAlign: "center", marginTop: 20 }}>
            Volver
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCheckIn = () => {
    setIsCheckingIn(true);
    setTimeout(() => {
      setIsCheckingIn(false);
      alert("✅ Check-in realizado. ¡Seguimiento activado!");
    }, 1500);
  };

  const handleGetDirections = () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      place.name
    )}`;
    Linking.openURL(googleMapsUrl);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: "#2E8B57" }}>
  <View style={styles.headerWrapper}>
    <LinearGradient
      colors={["#2E8B57", "#1E90FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.header}
    >
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
      </TouchableOpacity>
    </LinearGradient>

    {/* 💡 Card flotante sobre el degradado */}
    <View style={styles.cardWrapper}>
      <View style={styles.placeCard}>
        <View style={styles.placeRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.placeTitle}>{place.name}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#FFB800" />
              <Text style={styles.ratingText}>{place.rating}</Text>
              <Text style={styles.reviewText}>({place.reviews})</Text>
              <Text style={styles.dot}>·</Text>
              <Text style={styles.reviewText}>{place.distance}</Text>
            </View>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{place.status}</Text>
          </View>
        </View>
      </View>
    </View>
  </View>
</SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <View style={styles.content}>
          {/* Botones principales */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.checkinBtn}
              onPress={handleCheckIn}
              disabled={isCheckingIn}
            >
              {isCheckingIn ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color="#fff"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.checkinText}>Check-in</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.directionsBtn}
              onPress={handleGetDirections}
            >
              <Ionicons
                name="navigate-outline"
                size={18}
                color="#1a1a1a"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.directionsText}>Cómo llegar</Text>
            </TouchableOpacity>
          </View>

          {/* Acerca de */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Acerca de</Text>
            <Text style={styles.cardText}>{place.description}</Text>
          </View>

          {/* Servicios */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Servicios disponibles</Text>
            <View style={styles.serviceWrap}>
              {place.services.map((srv) => (
                <View key={srv} style={styles.serviceBadge}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={14}
                    color="#2E8B57"
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.serviceText}>{srv}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Información de contacto */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información de contacto</Text>
            {[
              {
                icon: "location-outline",
                label: "Dirección",
                value: place.address,
              },
              { icon: "call-outline", label: "Teléfono", value: place.phone },
              { icon: "time-outline", label: "Horario", value: place.hours },
            ].map((item, index) => (
              <View key={index} style={styles.infoRow}>
                <Ionicons name={item.icon as any} size={20} color="#2E8B57" />
                <View style={styles.infoTextBlock}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={styles.infoText}>{item.value}</Text>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => Linking.openURL(`https://${place.website}`)}
            >
              <Ionicons name="globe-outline" size={20} color="#2E8B57" />
              <View style={styles.infoTextBlock}>
                <Text style={styles.infoLabel}>Sitio web</Text>
                <Text style={styles.linkText}>{place.website}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Historial de visitas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tu historial de visitas</Text>
            {place.visits.map((v, i) => (
              <View key={i} style={styles.visitCard}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={styles.visitIcon}>
                    <Ionicons name="calendar-outline" size={18} color="#2E8B57" />
                  </View>
                  <View>
                    <Text style={styles.visitDate}>{v.date}</Text>
                    <Text style={styles.visitDuration}>{v.duration}</Text>
                  </View>
                </View>
                <View style={styles.badgeOutline}>
                  <Text style={styles.badgeOutlineText}>Completada</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Nota de seguridad */}
          <View style={styles.safeCard}>
            <Text style={styles.safeText}>
              🛡️ Este lugar está asociado con SafeStep. Tu seguridad es nuestra
              prioridad.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerWrapper: {
    position: "relative",
    backgroundColor: "transparent",
  },
  header: {
    height: 240,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    overflow: "hidden",
  },
  backBtn: {
    position: "absolute",
    top: Platform.OS === "ios" ? 0 : 40,
    left: 20,
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardWrapper: {
    position: "absolute",
    bottom: -40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  placeCard: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 0,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  placeRow: { flexDirection: "row", justifyContent: "space-between" },
  placeTitle: { fontSize: 18, fontWeight: "600", color: "#1a1a1a" },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  ratingText: { fontSize: 13, fontWeight: "500" },
  reviewText: { fontSize: 13, color: "#86868b" },
  dot: { marginHorizontal: 5, color: "#86868b" },
  statusBadge: {
    backgroundColor: "#2E8B5715",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: { color: "#2E8B57", fontWeight: "600", fontSize: 12 },
  content: { paddingHorizontal: 20, paddingTop: 60 },
  actionRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  checkinBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2E8B57",
    borderRadius: 18,
    paddingVertical: 12,
    marginRight: 6,
  },
  checkinText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  directionsBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 18,
    paddingVertical: 12,
    marginLeft: 6,
  },
  directionsText: { color: "#1a1a1a", fontWeight: "500", fontSize: 15 },
  card: { backgroundColor: "#f5f5f7", borderRadius: 20, padding: 16, marginTop: 8 },
  cardTitle: { fontWeight: "600", marginBottom: 6, color: "#1a1a1a" },
  cardText: { color: "#86868b", fontSize: 14, lineHeight: 20 },
  section: { marginTop: 20 },
  sectionTitle: { fontWeight: "600", marginBottom: 10, color: "#1a1a1a" },
  serviceWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  serviceBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  serviceText: { color: "#1a1a1a", fontSize: 13 },
  infoRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
  infoTextBlock: { marginLeft: 10, flex: 1 },
  infoLabel: { color: "#1a1a1a", fontWeight: "500", marginBottom: 2 },
  infoText: { color: "#86868b" },
  linkText: { color: "#1E90FF", textDecorationLine: "underline" },
  visitCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f7",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  visitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2E8B5710",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  visitDate: { color: "#1a1a1a", fontWeight: "500" },
  visitDuration: { color: "#86868b", fontSize: 12 },
  badgeOutline: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignSelf: "center",
  },
  badgeOutlineText: { fontSize: 12, color: "#86868b" },
  safeCard: {
    backgroundColor: "#2E8B570D",
    borderWidth: 1,
    borderColor: "#2E8B5720",
    borderRadius: 20,
    padding: 16,
    marginTop: 25,
  },
  safeText: { color: "#86868b", textAlign: "center", lineHeight: 20 },
});
