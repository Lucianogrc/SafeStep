// src/screens/MapView.tsx
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface MapViewProps {
  onBack: () => void;
}

export default function MapView({ onBack }: MapViewProps) {
  const [selectedPoi, setSelectedPoi] = useState<string | null>(null);

  const pois = [
    { id: "1", type: "route", name: "Ruta Principal", x: 45, y: 30, color: "#2E8B57" },
    { id: "2", type: "aid", name: "Botiquín #1", x: 60, y: 50, color: "#FF7F11" },
    { id: "3", type: "checkpoint", name: "Punto Control A", x: 30, y: 60, color: "#1E90FF" },
    { id: "4", type: "safe", name: "Zona Segura", x: 70, y: 40, color: "#2E8B57" },
    { id: "5", type: "aid", name: "Botiquín #2", x: 50, y: 75, color: "#FF7F11" },
  ];

  const renderIcon = (type: string, color: string) => {
    switch (type) {
      case "route":
        return <Feather name="navigation" size={18} color="#fff" />;
      case "aid":
        return <Feather name="heart" size={18} color="#fff" />;
      case "checkpoint":
        return <Feather name="shield" size={18} color="#fff" />;
      case "safe":
        return <Feather name="alert-circle" size={18} color="#fff" />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
          <Feather name="arrow-left" size={22} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mapa del Parque</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Feather name="layers" size={20} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      {/* Mapa simulado */}
      <View style={styles.mapArea}>
        {pois.map((poi) => (
          <TouchableOpacity
            key={poi.id}
            activeOpacity={0.9}
            onPress={() => setSelectedPoi(poi.id)}
            style={[
              styles.poi,
              {
                backgroundColor: poi.color,
                left: `${poi.x}%`,
                top: `${poi.y}%`,
              },
            ]}
          >
            {renderIcon(poi.type, poi.color)}
          </TouchableOpacity>
        ))}

        {/* Ubicación actual */}
        <View style={styles.userDot}>
          <View style={styles.userPulse} />
        </View>
      </View>

      {/* Controles del mapa */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn}>
          <Feather name="plus" size={18} color="#1a1a1a" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn}>
          <Feather name="minus" size={18} color="#1a1a1a" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlBtn, { marginTop: 8 }]}>
          <Feather name="navigation" size={18} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      {/* Info del punto seleccionado */}
      {selectedPoi && (
        <Animated.View entering={FadeInUp.duration(400)} style={styles.poiCard}>
          <View style={styles.poiHeader}>
            <View>
              <Text style={styles.poiName}>
                {pois.find((p) => p.id === selectedPoi)?.name}
              </Text>
              <Text style={styles.poiDistance}>A 250m de tu ubicación</Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedPoi(null)}>
              <Feather name="x" size={20} color="#86868b" />
            </TouchableOpacity>
          </View>

          <Text style={styles.poiCoords}>Coordenadas: 40.7128° N, 74.0060° W</Text>
          <TouchableOpacity style={styles.directionBtn}>
            <Text style={styles.directionText}>Obtener direcciones</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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
  mapArea: {
    flex: 1,
    backgroundColor: "#E8F5E9",
  },
  poi: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  userDot: {
    position: "absolute",
    left: "50%",
    top: "45%",
    transform: [{ translateX: -6 }, { translateY: -6 }],
    width: 12,
    height: 12,
    backgroundColor: "#1E90FF",
    borderRadius: 6,
    borderWidth: 3,
    borderColor: "#fff",
  },
  userPulse: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#1E90FF30",
    top: -4,
    left: -4,
  },
  controls: {
    position: "absolute",
    right: 20,
    top: 120,
    alignItems: "center",
  },
  controlBtn: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 30,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  poiCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
    minHeight: height * 0.22,
  },
  poiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  poiName: { color: "#1a1a1a", fontSize: 16, fontWeight: "600" },
  poiDistance: { color: "#2E8B57", fontSize: 13, marginTop: 2 },
  poiCoords: { color: "#86868b", fontSize: 13, marginTop: 12 },
  directionBtn: {
    marginTop: 16,
    backgroundColor: "#2E8B57",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  directionText: { color: "#fff", fontWeight: "600", fontSize: 15 },
});
