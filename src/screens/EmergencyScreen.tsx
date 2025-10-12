// src/screens/EmergencyScreen.tsx
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface EmergencyScreenProps {
  onBack: () => void;
}

export default function EmergencyScreen({ onBack }: EmergencyScreenProps) {
  const [activating, setActivating] = useState(false);
  const [activated, setActivated] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sendingSignal, setSendingSignal] = useState(false);

  useEffect(() => {
    if (activating && !activated) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setActivated(true);
            setSendingSignal(true);
            setTimeout(() => setSendingSignal(false), 3000);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [activating, activated]);

  const handleActivate = () => setActivating(true);
  const handleCancel = () => {
    setActivating(false);
    setActivated(false);
    setProgress(0);
    setSendingSignal(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          disabled={activating && !activated}
          style={[styles.iconBtn, activating && !activated && { opacity: 0.5 }]}
        >
          <Feather name="arrow-left" size={22} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergencia SOS</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 24, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Estado inicial */}
        {!activating && !activated && (
          <Animated.View entering={FadeInUp.duration(400)} style={styles.centered}>
            <View style={styles.alertCircle}>
              <Feather name="alert-circle" size={64} color="#FF7F11" />
            </View>

            <Text style={styles.title}>Botón de Emergencia</Text>
            <Text style={styles.subtitle}>
              Al activar este botón, se enviará tu ubicación exacta y tus datos médicos al
              equipo de emergencias del parque.
            </Text>

            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Feather name="wifi" size={16} color="#1E90FF" />
                <Text style={styles.infoText}>Conexión satelital activa</Text>
              </View>
              <View style={styles.infoRow}>
                <Feather name="shield" size={16} color="#2E8B57" />
                <Text style={styles.infoText}>Datos médicos incluidos</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.activateBtn} onPress={handleActivate}>
              <Text style={styles.activateText}>Activar alerta de emergencia</Text>
            </TouchableOpacity>

            <Text style={styles.warningText}>
              Solo usa en situaciones de emergencia real
            </Text>
          </Animated.View>
        )}

        {/* Activando */}
        {activating && !activated && (
          <Animated.View entering={FadeInUp.duration(400)} style={styles.centered}>
            <View style={styles.alertCircle}>
              <Feather name="radio" size={64} color="#FF7F11" />
            </View>
            <Text style={styles.title}>Activando emergencia...</Text>
            <Text style={styles.subtitle}>Preparando señal de emergencia</Text>

            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress}%</Text>

            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Activado */}
        {activated && (
          <Animated.View entering={FadeInUp.duration(400)} style={styles.centered}>
            <View style={[styles.alertCircle, { backgroundColor: "#2E8B5715" }]}>
              <Feather name="check-circle" size={64} color="#2E8B57" />
            </View>

            <Text style={styles.title}>¡Alerta enviada!</Text>
            <Text style={styles.subtitle}>
              Tu señal de emergencia fue enviada correctamente. El equipo de rescate fue
              notificado de tu ubicación.
            </Text>

            {sendingSignal && (
              <View style={styles.sendingBox}>
                <Feather name="wifi" size={16} color="#1E90FF" />
                <Text style={styles.sendingText}>Transmitiendo vía satélite...</Text>
              </View>
            )}

            <View style={styles.detailBox}>
              <Text style={styles.detailTitle}>Ubicación enviada</Text>
              <Text style={styles.detailText}>40.7128° N, 74.0060° W</Text>

              <Text style={styles.detailTitle}>Datos médicos</Text>
              <Text style={styles.detailText}>Tipo O+, sin alergias conocidas</Text>

              <Text style={styles.detailTitle}>Tiempo estimado</Text>
              <Text style={styles.detailText}>Ayuda en camino: ~15 minutos</Text>
            </View>

            <TouchableOpacity style={styles.doneBtn} onPress={handleCancel}>
              <Text style={styles.doneText}>Entendido</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5F0" },
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
  centered: { alignItems: "center", justifyContent: "center", marginTop: 40 },
  alertCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#FF7F1115",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#1a1a1a", marginBottom: 6 },
  subtitle: {
    textAlign: "center",
    color: "#86868b",
    fontSize: 14,
    marginBottom: 20,
    maxWidth: 300,
  },
  infoBox: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    width: "100%",
    marginBottom: 20,
  },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  infoText: { color: "#1a1a1a", fontSize: 14 },
  activateBtn: {
    backgroundColor: "#FF7F11",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
  },
  activateText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  warningText: { color: "#86868b", fontSize: 12, marginTop: 10 },
  progressBar: {
    width: "100%",
    height: 10,
    borderRadius: 8,
    backgroundColor: "#f5f5f7",
    overflow: "hidden",
    marginTop: 20,
  },
  progressFill: { height: "100%", backgroundColor: "#FF7F11" },
  progressText: { color: "#86868b", marginTop: 8 },
  cancelBtn: {
    marginTop: 24,
    borderWidth: 2,
    borderColor: "#FF7F11",
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
    width: "100%",
  },
  cancelText: { color: "#FF7F11", fontWeight: "600" },
  sendingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1E90FF15",
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  sendingText: { color: "#1E90FF", fontSize: 14 },
  detailBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    width: "100%",
    marginBottom: 20,
  },
  detailTitle: {
    color: "#86868b",
    fontSize: 13,
    marginTop: 8,
  },
  detailText: {
    color: "#1a1a1a",
    fontSize: 14,
    marginTop: 4,
  },
  doneBtn: {
    backgroundColor: "#2E8B57",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
  },
  doneText: { color: "#fff", fontWeight: "700" },
});
