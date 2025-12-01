import {
    Feather
} from "@expo/vector-icons";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface VisitConfirmationProps {
  onViewMap: () => void;
  onClose: () => void;
}

const visitData = {
  hikerName: "Juan Pérez Mora",
  parkName: "Parque Nacional Verde",
  checkInTime: "10:30 AM",
  checkInDate: "19 Nov 2024",
  estimatedDuration: "4 horas",
};

export default function VisitConfirmation({
  onViewMap,
  onClose,
}: VisitConfirmationProps) {
  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
        <Feather name="x" size={24} color="#1a1a1a" />
      </TouchableOpacity>

      {/* Content */}
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingTop: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.successIconWrapper}>
          <View style={styles.successIconCircle}>
            <Feather name="check-circle" size={70} color="#fff" />
          </View>
        </View>

        {/* Success Message */}
        <View style={styles.successTextBlock}>
          <Text style={styles.title}>¡Visita Registrada!</Text>
          <Text style={styles.subtitle}>
            El visitante ha sido conectado exitosamente
          </Text>
        </View>

        {/* Details Card */}
        <View style={styles.card}>
          {/* Visitor */}
          <View style={styles.row}>
            <View style={[styles.iconSquare, { backgroundColor: "#2E8B5715" }]}>
              <Feather name="check-circle" size={22} color="#2E8B57" />
            </View>
            <View>
              <Text style={styles.label}>Visitante</Text>
              <Text style={styles.value}>{visitData.hikerName}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Location */}
          <View style={styles.row}>
            <View style={[styles.iconSquare, { backgroundColor: "#1E90FF15" }]}>
              <Feather name="map-pin" size={22} color="#1E90FF" />
            </View>
            <View>
              <Text style={styles.label}>Empresa/Parque</Text>
              <Text style={styles.value}>{visitData.parkName}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Time */}
          <View style={styles.row}>
            <View style={[styles.iconSquare, { backgroundColor: "#FF7F1115" }]}>
              <Feather name="clock" size={22} color="#FF7F11" />
            </View>
            <View>
              <Text style={styles.label}>Hora de entrada</Text>
              <Text style={styles.value}>
                {visitData.checkInTime} • {visitData.checkInDate}
              </Text>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity style={styles.mapButton} onPress={onViewMap}>
            <Feather name="map" size={20} color="#fff" />
            <Text style={styles.mapButtonText}>Ver Mapa en Vivo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f7" },

  closeBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 100,
    elevation: 5,
  },

  successIconWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },

  successIconCircle: {
    width: 130,
    height: 130,
    borderRadius: 100,
    backgroundColor: "#2E8B57",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },

  successTextBlock: {
    alignItems: "center",
    marginBottom: 20,
  },

  title: { fontSize: 22, fontWeight: "700", color: "#1a1a1a" },
  subtitle: { fontSize: 14, color: "#86868b", marginTop: 6 },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 10,
  },

  row: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  iconSquare: {
    width: 46,
    height: 46,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  label: { fontSize: 12, color: "#86868b" },
  value: { fontSize: 15, color: "#1a1a1a", fontWeight: "600" },

  divider: { height: 1, backgroundColor: "#eee", marginVertical: 15 },

  mapButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  mapButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  closeButton: {
    marginTop: 10,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#555",
    fontSize: 16,
    fontWeight: "600",
  },
});
