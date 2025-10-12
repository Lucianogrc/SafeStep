// src/screens/LogoutConfirmDialog.tsx
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

interface LogoutConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LogoutConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
}: LogoutConfirmDialogProps) {
  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="fade"
      onRequestClose={onCancel}
    >
      {/* Fondo difuminado */}
      <Pressable style={styles.backdrop} onPress={onCancel} />

      {/* Contenedor animado */}
      <View style={styles.centerContainer}>
        <Animated.View
          entering={ZoomIn.duration(300)}
          exiting={ZoomOut.duration(200)}
          style={styles.dialogBox}
        >
          {/* Ícono principal */}
          <View style={styles.iconCircle}>
            <Feather name="alert-circle" size={36} color="#ff3b30" />
          </View>

          {/* Título */}
          <Text style={styles.title}>¿Cerrar sesión?</Text>

          {/* Descripción */}
          <Text style={styles.description}>
            Tu sesión actual finalizará y volverás a la pantalla de inicio.
          </Text>

          {/* Botones */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.logoutBtn} onPress={onConfirm}>
              <Feather name="log-out" size={18} color="#fff" />
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  dialogBox: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#ff3b3015",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  description: {
    color: "#86868b",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 20,
  },
  buttonsContainer: { width: "100%", gap: 10 },
  logoutBtn: {
    backgroundColor: "#ff3b30",
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  logoutText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  cancelBtn: {
    borderColor: "#e5e5e5",
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelText: { color: "#1a1a1a", fontWeight: "600", fontSize: 15 },
});
