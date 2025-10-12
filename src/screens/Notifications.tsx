// src/screens/Notifications.tsx
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface NotificationsProps {
  onBack: () => void;
}

const notifications = [
  {
    id: 1,
    title: "Registro exitoso",
    message: "Has ingresado al Parque Nacional Verde",
    time: "Hace 2 horas",
    icon: "check-circle",
    color: "#2E8B57",
    unread: false,
  },
  {
    id: 2,
    title: "Punto de control alcanzado",
    message: "Has pasado por el Punto de Control A",
    time: "Hace 1 hora",
    icon: "map-pin",
    color: "#1E90FF",
    unread: true,
  },
  {
    id: 3,
    title: "SafeBrazalet conectado",
    message: "Dispositivo SB-2024-5678 vinculado correctamente",
    time: "Hace 3 horas",
    icon: "bluetooth",
    color: "#FF7F11",
    unread: true,
  },
  {
    id: 4,
    title: "Alerta de tiempo",
    message:
      "Has estado en el parque por más de 2 horas. Recuerda hidratarte.",
    time: "Hace 30 minutos",
    icon: "alert-circle",
    color: "#FF7F11",
    unread: true,
  },
  {
    id: 5,
    title: "Señal GPS estable",
    message: "Tu ubicación se está compartiendo correctamente",
    time: "Hace 5 minutos",
    icon: "shield",
    color: "#2E8B57",
    unread: false,
  },
  {
    id: 6,
    title: "Recordatorio de seguridad",
    message: "Mantén tu dispositivo cargado durante toda la excursión",
    time: "Hace 4 horas",
    icon: "shield",
    color: "#1E90FF",
    unread: false,
  },
];

export default function Notifications({ onBack }: NotificationsProps) {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
          <Feather name="arrow-left" size={22} color="#1a1a1a" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notificaciones</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity>
          <Text style={styles.markRead}>Marcar leídas</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de notificaciones */}
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Feather name="clock" size={14} color="#86868b" />
          <Text style={styles.sectionTitle}>Hoy</Text>
        </View>

        {notifications.slice(0, 4).map((n, i) => (
          <Animated.View key={n.id} entering={FadeInUp.duration(300).delay(i * 80)}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.card,
                { backgroundColor: n.unread ? "#fff" : "#f5f5f7" },
              ]}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: `${n.color}15` }]}
              >
                <Feather name={n.icon as any} size={20} color={n.color} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{n.title}</Text>
                  {n.unread && <View style={styles.dot} />}
                </View>
                <Text style={styles.cardMsg}>{n.message}</Text>
                <Text style={styles.cardTime}>{n.time}</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}

        <View style={[styles.sectionHeader, { marginTop: 30 }]}>
          <Feather name="clock" size={14} color="#86868b" />
          <Text style={styles.sectionTitle}>Anteriores</Text>
        </View>

        {notifications.slice(4).map((n, i) => (
          <Animated.View
            key={n.id}
            entering={FadeInUp.duration(300).delay((i + 4) * 80)}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.card,
                { backgroundColor: n.unread ? "#fff" : "#f5f5f7" },
              ]}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: `${n.color}15` }]}
              >
                <Feather name={n.icon as any} size={20} color={n.color} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{n.title}</Text>
                  {n.unread && <View style={styles.dot} />}
                </View>
                <Text style={styles.cardMsg}>{n.message}</Text>
                <Text style={styles.cardTime}>{n.time}</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}

        {notifications.length === 0 && (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyCircle}>

            </View>
            <Text style={styles.emptyTitle}>Sin notificaciones</Text>
            <Text style={styles.emptyText}>
              Aquí aparecerán tus alertas y actualizaciones
            </Text>
          </View>
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
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#1a1a1a" },
  headerCenter: { flexDirection: "row", alignItems: "center", gap: 6 },
  markRead: { color: "#2E8B57", fontSize: 13, fontWeight: "500" },
  badge: {
    backgroundColor: "#FF7F11",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: { color: "#fff", fontWeight: "600", fontSize: 12 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 20 },
  sectionTitle: { color: "#86868b", fontSize: 13 },
  card: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 18,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  iconContainer: {
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { color: "#1a1a1a", fontSize: 15, fontWeight: "500", flex: 1 },
  dot: { width: 6, height: 6, backgroundColor: "#1E90FF", borderRadius: 3 },
  cardMsg: { color: "#86868b", fontSize: 13, marginTop: 4 },
  cardTime: { color: "#86868b", fontSize: 12, marginTop: 4 },
  emptyContainer: { alignItems: "center", marginTop: 100 },
  emptyCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#e5e5ea",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emptyLogo: { width: 50, height: 50, opacity: 0.5 },
  emptyTitle: { color: "#1a1a1a", fontSize: 16, fontWeight: "600" },
  emptyText: { color: "#86868b", textAlign: "center", fontSize: 14, marginTop: 4 },
});
