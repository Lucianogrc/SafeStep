import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ActionSheetIOS,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface StaffManagementProps {
  onBack: () => void;
}

// 🟩 MOCK STAFF (luego conectamos Firebase)
const staffMembers = [
  {
    id: "S-001",
    name: "Carlos Rodríguez",
    email: "carlos@parqueverde.cr",
    phone: "+506 8765-4321",
    role: "superadmin",
    status: "active",
    lastActive: "Hace 5 min",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  },
  {
    id: "S-002",
    name: "María González",
    email: "maria@parqueverde.cr",
    phone: "+506 8765-4322",
    role: "admin",
    status: "active",
    lastActive: "Hace 15 min",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
  {
    id: "S-003",
    name: "Juan Pérez",
    email: "juan@parqueverde.cr",
    phone: "+506 8765-4323",
    role: "admin",
    status: "active",
    lastActive: "Hace 1 hora",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    id: "S-004",
    name: "Ana Martínez",
    email: "ana@parqueverde.cr",
    phone: "+506 8765-4324",
    role: "ranger",
    status: "active",
    lastActive: "Hace 30 min",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  },
  {
    id: "S-005",
    name: "Luis Hernández",
    email: "luis@parqueverde.cr",
    phone: "+506 8765-4325",
    role: "ranger",
    status: "active",
    lastActive: "Hace 2 horas",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  },
  {
    id: "S-006",
    name: "Sofia Castro",
    email: "sofia@parqueverde.cr",
    phone: "+506 8765-4326",
    role: "ranger",
    status: "inactive",
    lastActive: "Hace 2 días",
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
  },
];

const roleConfig = {
  superadmin: { label: "Superadministrador", color: "#FF7F11", icon: "shield" },
  admin: { label: "Administrador", color: "#1E90FF", icon: "shield-check" },
  ranger: { label: "Guardabosques", color: "#2E8B57", icon: "user" },
  operator: { label: "Operador", color: "#86868b", icon: "settings" },
};

export default function StaffManagement({ onBack }: StaffManagementProps) {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string | null>(null);

  const filteredStaff = staffMembers.filter((member) => {
    const matchesText =
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = filterRole ? member.role === filterRole : true;

    return matchesText && matchesRole;
  });

  // 📌 Roles totals (superadmin, admin, etc.)
  const roleStats = Object.keys(roleConfig).reduce((acc: any, role) => {
    acc[role] = staffMembers.filter((s) => s.role === role).length;
    return acc;
  }, {});

  // 📌 Press avatar menu
  const openMenu = (member: any) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancelar", "Editar", "Eliminar"],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        title: member.name,
      },
      (index) => {
        if (index === 1) console.log("Editar", member.id);
        if (index === 2) console.log("Eliminar", member.id);
      }
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Feather name="chevron-left" size={22} color="#1a1a1a" />
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>Gestión de Personal</Text>
          <Text style={styles.headerSubtitle}>
            {staffMembers.length} miembros
          </Text>
        </View>

        <TouchableOpacity style={styles.addBtn}>
          <Feather name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ROLE STATS */}
        <View style={styles.roleGrid}>
          {Object.entries(roleConfig).map(([role, cfg]) => (
            <TouchableOpacity
              key={role}
              style={[
                styles.roleCard,
                filterRole === role && styles.roleCardActive,
              ]}
              onPress={() => setFilterRole(filterRole === role ? null : role)}
            >
              <Feather
                name={cfg.icon as any}
                size={18}
                color={cfg.color}
                style={{ alignSelf: "center" }}
              />
              <Text style={[styles.roleCount, { color: cfg.color }]}>
                {roleStats[role]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color="#86868b" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar personal..."
            style={styles.searchInput}
          />
        </View>

        {/* EMPTY */}
        {filteredStaff.length === 0 && (
          <View style={styles.emptyCard}>
            <Feather name="users" size={40} color="#86868b" />
            <Text style={styles.emptyText}>No se encontraron resultados</Text>
          </View>
        )}

        {/* STAFF LIST */}
        {filteredStaff.map((member, i) => {
          const cfg = roleConfig[member.role as keyof typeof roleConfig];


          return (
            <Animated.View
              entering={FadeInUp.delay(i * 80)}
              key={member.id}
              style={[
                styles.staffCard,
                member.status !== "active" && { opacity: 0.6 },
              ]}
            >
              {/* Photo */}
              <TouchableOpacity onPress={() => openMenu(member)}>
                <View style={styles.avatarWrap}>
                  <Image source={{ uri: member.photo }} style={styles.avatar} />
                  {member.status === "active" && <View style={styles.dot} />}
                </View>
              </TouchableOpacity>

              {/* Info */}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.name}>{member.name}</Text>
                <Text style={styles.email}>{member.email}</Text>

                {/* Role */}
                <View style={styles.roleRow}>
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: cfg.color },
                    ]}
                  >
                    <Feather
                      name={cfg.icon as any}
                      size={12}
                      color="#fff"
                      style={{ marginRight: 4 }}
                    />
                    <Text style={styles.badgeText}>{cfg.label}</Text>
                  </View>

                  {member.status === "active" && (
                    <View style={styles.badgeGreen}>
                      <Text style={styles.badgeGreenText}>Activo</Text>
                    </View>
                  )}
                </View>

                {/* Last active */}
                <Text style={styles.lastActive}>
                  Última actividad: {member.lastActive}
                </Text>
              </View>

              {/* MENU BUTTON */}
              <TouchableOpacity onPress={() => openMenu(member)}>
                <Feather name="more-vertical" size={20} color="#86868b" />
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
}

//
// 🎨 ESTILOS PROFESIONALES SAFE STEP
//
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f7" },

  header: {
    paddingTop: 60,
    paddingBottom: 14,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backBtn: {
    padding: 10,
    backgroundColor: "#f5f5f7",
    borderRadius: 100,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  headerSubtitle: { fontSize: 13, color: "#86868b" },

  addBtn: {
    width: 40,
    height: 40,
    backgroundColor: "#1E90FF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  roleGrid: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  roleCard: {
    width: "23%",
    backgroundColor: "#f5f5f7",
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  roleCardActive: {
    backgroundColor: "#1E90FF15",
    borderColor: "#1E90FF",
  },
  roleCount: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 4,
  },

  searchBox: {
    marginTop: 20,
    backgroundColor: "#f5f5f7",
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#1a1a1a",
  },

  emptyCard: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: { color: "#86868b", marginTop: 10 },

  staffCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e5ea",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },

  avatarWrap: { position: "relative" },
  avatar: { width: 65, height: 65, borderRadius: 18 },
  dot: {
    width: 16,
    height: 16,
    backgroundColor: "#2E8B57",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#fff",
    position: "absolute",
    bottom: -4,
    right: -4,
  },

  name: { fontSize: 16, fontWeight: "700", color: "#1a1a1a" },
  email: { color: "#86868b", fontSize: 13, marginTop: 2 },

  roleRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },

  badge: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
  },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "600" },

  badgeGreen: {
    backgroundColor: "#2E8B5715",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeGreenText: { color: "#2E8B57", fontSize: 11, fontWeight: "600" },

  lastActive: {
    fontSize: 11,
    color: "#86868b",
    marginTop: 6,
  },
});
