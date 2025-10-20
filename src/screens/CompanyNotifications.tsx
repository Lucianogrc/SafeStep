// src/screens/CompanyNotifications.tsx
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

interface CompanyNotificationsProps {
  onBack: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  icon: string;
  color: string;
  unread: boolean;
}

export default function CompanyNotifications({ onBack }: CompanyNotificationsProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // 🔹 En el futuro aquí podrás conectar Firestore para cargar notificaciones por empresa
  useEffect(() => {
    // Ejemplo:
    // const companyId = auth.currentUser?.uid;
    // const q = query(collection(db, "companyNotifications"), where("companyId", "==", companyId));
    // const snapshot = await getDocs(q);
    // setNotifications(snapshot.docs.map(doc => doc.data() as NotificationItem));
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, unread: false }));
    setNotifications(updated);
  };

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

        {notifications.length > 0 ? (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markRead}>Marcar leídas</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 80 }} />
        )}
      </View>

      {/* Lista */}
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <Animated.View entering={FadeInUp.duration(400)}>
            <View style={styles.emptyContainer}>
              <View style={styles.emptyCircle}>
                <Feather name="bell-off" size={40} color="#bbb" />
              </View>
              <Text style={styles.emptyTitle}>Sin notificaciones</Text>
              <Text style={styles.emptyText}>
                Aquí aparecerán alertas, visitantes y actualizaciones de tu empresa.
              </Text>
            </View>
          </Animated.View>
        ) : (
          notifications.map((n, i) => (
            <Animated.View
              key={n.id}
              entering={FadeInUp.duration(300).delay(i * 100)}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.card,
                  { backgroundColor: n.unread ? "#fff" : "#f5f5f7" },
                ]}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${n.color}15` },
                  ]}
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
          ))
        )}
      </ScrollView>
    </View>
  );
}

// 🎨 Estilos
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
  markRead: { color: "#1E90FF", fontSize: 13, fontWeight: "500" },
  badge: {
    backgroundColor: "#FF7F11",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: { color: "#fff", fontWeight: "600", fontSize: 12 },
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
  emptyContainer: { alignItems: "center", marginTop: 100, paddingHorizontal: 30 },
  emptyCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#e5e5ea",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emptyTitle: { color: "#1a1a1a", fontSize: 16, fontWeight: "600" },
  emptyText: { color: "#86868b", textAlign: "center", fontSize: 14, marginTop: 4 },
});
