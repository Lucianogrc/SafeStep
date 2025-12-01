import {
    Feather
} from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface QRScanResultProps {
  onConnect: () => void;
  onCancel: () => void;
}

const hikerData = {
  id: "H-2024-1234",
  name: "Juan Pérez Mora",
  photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  age: 32,
  bloodType: "O+",
  phone: "+506 8765-4321",
  emergencyContact: "María Pérez",
  emergencyPhone: "+506 8765-1234",
  allergies: ["Penicilina", "Mariscos"],
  conditions: ["Asma leve"],
  medications: ["Salbutamol PRN"],
  lastCheckIn: "10:30 AM",
  gpsStatus: "active",
  batteryLevel: 85,
};

export default function QRScanResult({ onConnect, onCancel }: QRScanResultProps) {
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Resultado del Escaneo</Text>

        <TouchableOpacity onPress={onCancel} style={styles.closeBtn}>
          <Feather name="x" size={22} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* HIKER CARD */}
        <View style={styles.card}>
          <View style={styles.profileContainer}>
            <View>
              <Image source={{ uri: hikerData.photo }} style={styles.avatar} />
              <View style={styles.checkBadge}>
                <Feather name="check-circle" size={16} color="#fff" />
              </View>
            </View>

            <Text style={styles.hikerName}>{hikerData.name}</Text>
            <Text style={styles.hikerId}>ID: {hikerData.id}</Text>

            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: "#2E8B5715" }]}>
                <Text style={[styles.badgeText, { color: "#2E8B57" }]}>
                  {hikerData.age} años
                </Text>
              </View>

              <View style={[styles.badge, { backgroundColor: "#ff000015" }]}>
                <Text style={[styles.badgeText, { color: "#c62828" }]}>
                  Tipo: {hikerData.bloodType}
                </Text>
              </View>
            </View>
          </View>

          {/* STATUS */}
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              {hikerData.gpsStatus === "active" ? (
                <Feather name="wifi" size={20} color="#2E8B57" />
              ) : (
                <Feather name="wifi-off" size={20} color="#86868b" />
              )}
              <View>
                <Text style={styles.statusLabel}>GPS</Text>
                <Text style={styles.statusValue}>
                  {hikerData.gpsStatus === "active" ? "Activo" : "Inactivo"}
                </Text>
              </View>
            </View>

            <View style={styles.statusItem}>
              <Feather name="clock" size={20} color="#1E90FF" />
              <View>
                <Text style={styles.statusLabel}>Hora</Text>
                <Text style={styles.statusValue}>{hikerData.lastCheckIn}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* CONTACT INFO */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Feather name="phone" size={20} color="#1E90FF" />
            <Text style={styles.sectionTitle}>Información de Contacto</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Teléfono personal</Text>
            <Text style={styles.infoValue}>{hikerData.phone}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Contacto emergencia</Text>
            <Text style={styles.infoValue}>{hikerData.emergencyContact}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tel. emergencia</Text>
            <Text style={styles.infoValue}>{hikerData.emergencyPhone}</Text>
          </View>
        </View>

        {/* MEDICAL INFO */}
        <View style={[styles.card, { backgroundColor: "#fdecea", borderColor: "#ffcdd2" }]}>
          <View style={styles.sectionHeader}>
            <Feather name="heart" size={20} color="#d32f2f" />
            <Text style={styles.sectionTitle}>Información Médica</Text>
          </View>

          {/* Allergies */}
          {hikerData.allergies.length > 0 && (
            <>
              <Text style={styles.infoLabel}>Alergias</Text>
              <View style={styles.badgeWrap}>
                {hikerData.allergies.map((a, i) => (
                  <View key={i} style={[styles.medBadge, { backgroundColor: "#ff000015" }]}>
                    <Feather name="alert-circle" size={14} color="#c62828" />
                    <Text style={styles.medBadgeText}>{a}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Conditions */}
          {hikerData.conditions.length > 0 && (
            <>
              <Text style={styles.infoLabel}>Condiciones médicas</Text>
              <View style={styles.badgeWrap}>
                {hikerData.conditions.map((c, i) => (
                  <View key={i} style={[styles.medBadge, { backgroundColor: "#ffa72620" }]}>
                    <Text style={[styles.medBadgeText, { color: "#ef6c00" }]}>{c}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Medications */}
          {hikerData.medications.length > 0 && (
            <>
              <Text style={styles.infoLabel}>Medicamentos</Text>
              <View style={styles.badgeWrap}>
                {hikerData.medications.map((m, i) => (
                  <View key={i} style={[styles.medBadge, { backgroundColor: "#1e90ff20" }]}>
                    <Text style={[styles.medBadgeText, { color: "#1e90ff" }]}>{m}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>

      {/* ACTION BUTTONS */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.connectBtn} onPress={onConnect}>
          <Feather name="check-circle" size={20} color="#fff" />
          <Text style={styles.connectText}>Conectar Visitante</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f7" },
  header: {
    height: 70,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  headerText: { fontSize: 18, fontWeight: "600", color: "#1a1a1a" },
  closeBtn: { position: "absolute", right: 16, top: 20 },

  scroll: { padding: 20 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 20,
  },

  profileContainer: { alignItems: "center", marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 100 },
  checkBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#2E8B57",
    width: 26,
    height: 26,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  hikerName: { fontSize: 18, fontWeight: "600", marginTop: 6 },
  hikerId: { fontSize: 12, color: "#777" },

  badgeRow: { flexDirection: "row", marginTop: 10, gap: 8 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { fontSize: 12, fontWeight: "500" },

  statusRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  statusItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  statusLabel: { fontSize: 12, color: "#777" },
  statusValue: { fontSize: 14, fontWeight: "500" },

  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#1a1a1a" },

  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  infoLabel: { fontSize: 13, color: "#666" },
  infoValue: { fontSize: 13, color: "#1a1a1a", fontWeight: "500" },

  divider: { height: 1, backgroundColor: "#eee", marginVertical: 10 },

  badgeWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  medBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  medBadgeText: { fontSize: 12, fontWeight: "500" },

  footer: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
    padding: 16,
  },
  connectBtn: {
    backgroundColor: "#1E90FF",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  connectText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  cancelBtn: {
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  cancelText: { fontSize: 16, color: "#444" },
});
