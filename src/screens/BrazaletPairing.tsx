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

interface BrazaletPairingProps {
  onBack: () => void;
}

export default function BrazaletPairing({ onBack }: BrazaletPairingProps) {
  const [searching, setSearching] = useState(false);
  const [connected, setConnected] = useState(false);
  const [beaconActive, setBeaconActive] = useState(false);
  const [batteryLevel] = useState(87);
  const [volume, setVolume] = useState(70);

  useEffect(() => {
    if (searching) {
      const timer = setTimeout(() => {
        setSearching(false);
        setConnected(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [searching]);

  const handleConnect = () => setSearching(true);
  const handleDisconnect = () => setConnected(false);
  const toggleBeacon = () => setBeaconActive(!beaconActive);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={onBack}>
          <Feather name="arrow-left" size={22} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SafeBrazalet</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Estado: no conectado */}
        {!connected && !searching && (
          <Animated.View entering={FadeInUp.duration(300)}>
            <View style={styles.centered}>
              <View style={styles.deviceCircle}>
                <Feather name="bluetooth" size={60} color="#FF7F11" />
              </View>
              <Text style={styles.title}>Pulsera no conectada</Text>
              <Text style={styles.subtitle}>
                Conecta tu SafeBrazalet para acceder a funciones de seguridad avanzadas
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Características</Text>

              <View style={styles.featureRow}>
                <View style={[styles.iconBadge, { backgroundColor: "#1E90FF15" }]}>
                  <Feather name="map" size={16} color="#1E90FF" />
                </View>
                <View>
                  <Text style={styles.featureTitle}>GPS Satelital</Text>
                  <Text style={styles.featureDesc}>Seguimiento en tiempo real</Text>
                </View>
              </View>

              <View style={styles.featureRow}>
                <View style={[styles.iconBadge, { backgroundColor: "#FF7F1115" }]}>
                  <Feather name="radio" size={16} color="#FF7F11" />
                </View>
                <View>
                  <Text style={styles.featureTitle}>Baliza de emergencia</Text>
                  <Text style={styles.featureDesc}>Luz y sonido activables</Text>
                </View>
              </View>

              <View style={styles.featureRow}>
                <View style={[styles.iconBadge, { backgroundColor: "#2E8B5715" }]}>
                  <Feather name="battery" size={16} color="#2E8B57" />
                </View>
                <View>
                  <Text style={styles.featureTitle}>Batería de larga duración</Text>
                  <Text style={styles.featureDesc}>Hasta 72 horas de uso continuo</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.connectBtn} onPress={handleConnect}>
              <Feather name="bluetooth" size={18} color="#fff" />
              <Text style={styles.connectText}> Buscar dispositivo</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Estado: buscando */}
        {searching && (
          <View style={styles.centered}>
            <Animated.View entering={FadeInUp.duration(300)}>
              <View style={[styles.deviceCircle, { backgroundColor: "#1E90FF15" }]}>
                <Feather name="bluetooth" size={60} color="#1E90FF" />
              </View>
              <Text style={styles.title}>Buscando dispositivos...</Text>
              <Text style={styles.subtitle}>
                Asegúrate de que tu SafeBrazalet esté encendido
              </Text>
            </Animated.View>
          </View>
        )}

        {/* Estado: conectado */}
        {connected && (
          <Animated.View entering={FadeInUp.duration(400)}>
            <View style={styles.centered}>
              <View style={[styles.deviceCircle, { backgroundColor: "#2E8B5715" }]}>
                <Feather name="check-circle" size={50} color="#2E8B57" />
              </View>
              <Text style={styles.title}>Conexión exitosa</Text>
              <Text style={styles.badge}>SafeBrazalet SB-2024-5678</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Estado del dispositivo</Text>

              {/* Nivel de batería */}
              <View style={styles.statusRow}>
                <View style={styles.rowLeft}>
                  <Feather name="battery" size={18} color="#2E8B57" />
                  <Text style={styles.rowLabel}>Batería</Text>
                </View>
                <Text style={styles.rowValue}>{batteryLevel}%</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.statusRow}>
                <View style={styles.rowLeft}>
                  <Feather name="map-pin" size={18} color="#1E90FF" />
                  <Text style={styles.rowLabel}>Señal GPS</Text>
                </View>
                <Text style={[styles.badgeSmall, { color: "#2E8B57" }]}>Excelente</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.statusRow}>
                <View style={styles.rowLeft}>
                  <Feather name="bluetooth" size={18} color="#1E90FF" />
                  <Text style={styles.rowLabel}>Conexión</Text>
                </View>
                <Text style={[styles.badgeSmall, { color: "#1E90FF" }]}>Conectado</Text>
              </View>
            </View>

            {/* Baliza */}
            <View style={styles.card}>
              <View style={styles.statusRow}>
                <Text style={styles.cardTitle}>Baliza de emergencia</Text>
                <TouchableOpacity onPress={toggleBeacon}>
                  <Feather
                    name={beaconActive ? "toggle-right" : "toggle-left"}
                    size={40}
                    color={beaconActive ? "#FF7F11" : "#ccc"}
                  />
                </TouchableOpacity>
              </View>

              {beaconActive && (
                <View style={styles.beaconActive}>
                  <Feather name="zap" size={20} color="#FF7F11" />
                  <Text style={styles.beaconText}>
                    Baliza activada - Visible y audible
                  </Text>
                </View>
              )}

              <Text style={styles.tipText}>
                Activa la baliza para ser localizado visualmente y por sonido en caso de emergencia
              </Text>
            </View>

            <TouchableOpacity style={styles.disconnectBtn} onPress={handleDisconnect}>
              <Text style={styles.disconnectText}>Desconectar dispositivo</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f7" },
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
  iconBtn: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 40,
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#1a1a1a" },
  centered: { alignItems: "center", marginBottom: 20 },
  deviceCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FF7F1110",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: { fontSize: 18, fontWeight: "600", color: "#1a1a1a" },
  subtitle: {
    color: "#86868b",
    textAlign: "center",
    fontSize: 14,
    marginTop: 6,
    maxWidth: 260,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#1a1a1a" },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
  iconBadge: { padding: 8, borderRadius: 10 },
  featureTitle: { color: "#1a1a1a", fontSize: 14, fontWeight: "500" },
  featureDesc: { color: "#86868b", fontSize: 12 },
  connectBtn: {
    backgroundColor: "#FF7F11",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  connectText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  badge: {
    backgroundColor: "#2E8B5715",
    color: "#2E8B57",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 13,
    fontWeight: "600",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  rowLabel: { color: "#1a1a1a", fontSize: 14 },
  rowValue: { color: "#86868b", fontSize: 14 },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 8 },
  badgeSmall: { fontSize: 12, fontWeight: "600" },
  beaconActive: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FF7F1110",
    padding: 10,
    borderRadius: 12,
    marginTop: 8,
  },
  beaconText: { color: "#FF7F11", fontSize: 13 },
  tipText: {
    color: "#86868b",
    fontSize: 12,
    marginTop: 10,
    lineHeight: 18,
  },
  disconnectBtn: {
    borderWidth: 1.5,
    borderColor: "#FF7F11",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  disconnectText: { color: "#FF7F11", fontWeight: "600" },
});
