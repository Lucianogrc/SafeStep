import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TabBar from "../../components/ui/TabBar";

interface CompanyMapProps {
  onTabChange: (tab: string) => void;
}

const mockVisitors = [
  {
    id: "1",
    name: "Juan Pérez",
    status: "active",
    battery: 85,
    signal: "excellent",
    lastUpdate: "Hace 2 min",
    bloodType: "O+",
    emergencyContact: "+1 234 567 8900",
  },
  {
    id: "2",
    name: "María González",
    status: "active",
    battery: 45,
    signal: "good",
    lastUpdate: "Hace 5 min",
    bloodType: "A+",
    emergencyContact: "+1 234 567 8901",
  },
  {
    id: "3",
    name: "Carlos López",
    status: "warning",
    battery: 15,
    signal: "weak",
    lastUpdate: "Hace 15 min",
    bloodType: "B+",
    emergencyContact: "+1 234 567 8902",
  },
];

const landmarks = [
  { id: "1", name: "Entrada Principal", icon: "log-in-outline" },
  { id: "2", name: "Botiquín 1", icon: "medkit-outline" },
  { id: "3", name: "Checkpoint A", icon: "pin-outline" },
  { id: "4", name: "Mirador", icon: "eye-outline" },
];

export default function CompanyMap({ onTabChange }: CompanyMapProps) {
  const [selectedVisitor, setSelectedVisitor] = useState<typeof mockVisitors[0] | null>(null);
  const [showLegend, setShowLegend] = useState(false);

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case "excellent":
        return "#2E8B57";
      case "good":
        return "#1E90FF";
      case "weak":
        return "#FF7F11";
      default:
        return "#86868b";
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mapa en vivo</Text>
          <Text style={styles.subtitle}>
            {mockVisitors.filter((v) => v.status === "active").length} visitantes activos
          </Text>
        </View>
        <TouchableOpacity onPress={() => setShowLegend(!showLegend)} style={styles.legendButton}>
          <Ionicons name="information-circle-outline" size={22} color="#1E90FF" />
          <Text style={styles.legendText}>Leyenda</Text>
        </TouchableOpacity>
      </View>

      {/* Map Background */}
      <LinearGradient colors={["#E8F5E9", "#F1F8E9", "#C8E6C9"]} style={styles.mapArea}>
        {/* Landmarks */}
        {landmarks.map((landmark, index) => (
          <TouchableOpacity
            key={landmark.id}
            style={[
              styles.landmark,
              {
                top: 100 + index * 70,
                left: 50 + index * 50,
              },
            ]}
          >
            
          </TouchableOpacity>
        ))}

        {/* Visitors */}
        {mockVisitors.map((visitor, index) => (
          <TouchableOpacity
            key={visitor.id}
            style={[
              styles.visitor,
              {
                top: 180 + index * 70,
                left: 100 + index * 40,
                backgroundColor: getSignalColor(visitor.signal),
              },
            ]}
            onPress={() => setSelectedVisitor(visitor)}
          >
            <Ionicons name="person-outline" size={20} color="#fff" />
            {visitor.status === "warning" && (
              <View style={styles.warningDot}>
                <Ionicons name="warning-outline" size={10} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </LinearGradient>

      {/* Legend Panel */}
      {showLegend && (
        <View style={styles.legendPanel}>
          <Text style={styles.legendTitle}>Leyenda</Text>
          <View style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: "#2E8B57" }]} />
            <Text>Señal excelente</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: "#1E90FF" }]} />
            <Text>Señal buena</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: "#FF7F11" }]} />
            <Text>Señal débil</Text>
          </View>
          <View style={styles.legendRow}>
            <Ionicons name="medkit-outline" size={14} color="#1a1a1a" />
            <Text>Botiquín</Text>
          </View>
          <View style={styles.legendRow}>
            <Ionicons name="pin-outline" size={14} color="#1a1a1a" />
            <Text>Checkpoint</Text>
          </View>
          <TouchableOpacity onPress={() => setShowLegend(false)} style={styles.closeLegend}>
            <Text style={{ color: "#1E90FF" }}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Visitor Detail Bottom Sheet */}
      {selectedVisitor && (
        <Animated.View style={styles.detailSheet}>
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.visitorName}>{selectedVisitor.name}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text
                  style={{
                    color:
                      selectedVisitor.status === "active" ? "#2E8B57" : "#FF7F11",
                    fontWeight: "600",
                  }}
                >
                  {selectedVisitor.status === "active" ? "Activo" : "Atención"}
                </Text>
                <Text style={{ color: "#86868b", fontSize: 12 }}>
                  {selectedVisitor.lastUpdate}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setSelectedVisitor(null)}>
              <Ionicons name="close" size={22} color="#1a1a1a" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="battery-half-outline" size={18} color="#86868b" />
            <Text style={styles.infoLabel}>Batería:</Text>
            <Text style={styles.infoValue}>{selectedVisitor.battery}%</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="wifi-outline" size={18} color="#86868b" />
            <Text style={styles.infoLabel}>Señal:</Text>
            <Text style={styles.infoValue}>{selectedVisitor.signal}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="heart-outline" size={18} color="#FF3B30" />
            <Text style={styles.infoLabel}>Tipo de sangre:</Text>
            <Text style={styles.infoValue}>{selectedVisitor.bloodType}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={18} color="#1E90FF" />
            <Text style={styles.infoLabel}>Emergencia:</Text>
            <Text style={styles.infoValue}>{selectedVisitor.emergencyContact}</Text>
          </View>

          {selectedVisitor.status === "warning" && (
            <TouchableOpacity style={styles.alertButton}>
              <Ionicons name="alert-circle-outline" size={18} color="#fff" />
              <Text style={styles.alertText}>Atender visitante</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      )}

      {/* TabBar */}
      <TabBar activeTab="map" onTabChange={onTabChange} variant="company" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  title: { fontSize: 18, fontWeight: "600", color: "#1a1a1a" },
  subtitle: { color: "#86868b", fontSize: 13 },
  legendButton: { flexDirection: "row", alignItems: "center", gap: 4 },
  legendText: { color: "#1E90FF", fontWeight: "500" },
  mapArea: { flex: 1, position: "relative" },
  landmark: { position: "absolute" },
  landmarkIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  visitor: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  warningDot: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#FF7F11",
    borderRadius: 8,
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  legendPanel: {
    position: "absolute",
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 8,
  },
  legendTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 6, marginVertical: 3 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  closeLegend: { marginTop: 10, alignSelf: "flex-end" },
  detailSheet: {
    position: "absolute",
    bottom: 70,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    elevation: 20,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  visitorName: { fontSize: 18, fontWeight: "600", color: "#1a1a1a" },
  infoRow: { flexDirection: "row", alignItems: "center", marginVertical: 5, gap: 6 },
  infoLabel: { color: "#86868b", fontSize: 13 },
  infoValue: { color: "#1a1a1a", fontWeight: "500" },
  alertButton: {
    marginTop: 15,
    backgroundColor: "#FF7F11",
    borderRadius: 12,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  alertText: { color: "#fff", fontWeight: "600" },
});
