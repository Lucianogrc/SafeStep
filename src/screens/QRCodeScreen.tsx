import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import ViewShot from "react-native-view-shot";
import { db } from "../firebaseConfig";

// ✅ Tipo explícito para el ref del componente ViewShot
type CustomViewShotRef = {
  capture: () => Promise<string>;
};

export default function QRCodeScreen() {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [userName, setUserName] = useState("Cargando...");
  const [userId, setUserId] = useState("");
  const [qrValue, setQrValue] = useState("");
  const rotation = useSharedValue(0);
  const qrRef = useRef<CustomViewShotRef | null>(null);

  // 🔹 Carga los datos del usuario autenticado desde Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          setUserName(data.fullName || "Usuario");
          setUserId(data.userId || `HST-${Date.now().toString(36).toUpperCase()}`);
          setQrValue(data.qrValue || data.userId || currentUser.uid);
        }
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      }
    };
    fetchUserData();
  }, []);

  // 🔄 Rotación animada al regenerar
  const handleRegenerate = () => {
    setIsRegenerating(true);
    rotation.value = withTiming(rotation.value + 360, { duration: 800 });
    setTimeout(() => {
      setIsRegenerating(false);
      Alert.alert("Éxito", "Código QR actualizado correctamente ✅");
    }, 1500);
  };

  // 💾 Guardar el QR en la galería (simula "Wallet")
  const handleSaveToWallet = async () => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Activa los permisos de galería para guardar tu QR.");
      return;
    }

    if (qrRef.current) {
      const uri = await qrRef.current.capture();
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("SafeStepQRs", asset, false);
      Alert.alert("Guardado", "Tu código QR se guardó en la galería 📸");
    }
  } catch (err) {
    Alert.alert("Error", "No se pudo guardar el QR 😢");
    console.error(err);
  }
};

  // 📤 Compartir el QR por WhatsApp o cualquier app
  const handleShare = async () => {
    try {
      if (qrRef.current) {
        const uri = await qrRef.current.capture();
        await Sharing.shareAsync(uri, {
          dialogTitle: "Compartir tu código QR SafeStep",
        });
      }
    } catch (err) {
      Alert.alert("Error", "No se pudo compartir el QR 😢");
      console.error(err);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={["#fff", "#f5f5f7"]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (router.canGoBack()) router.back();
              else router.push("/(tabs)");
            }}
          >
            <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Ionicons name="location-outline" size={20} color="#2E8B57" />
            <Text style={styles.title}>Mi Código QR</Text>
          </View>

          <View style={{ width: 30 }} />
        </View>

        <Text style={styles.userId}>ID: {userId || "Cargando..."}</Text>
      </LinearGradient>

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* QR CARD */}
          <View style={styles.card}>
            <Animated.View style={[styles.qrWrapper, animatedStyle]}>
              <ViewShot ref={qrRef} options={{ format: "png", quality: 1.0 }}>
                <View style={styles.qrBox}>
                  {qrValue ? (
                    <QRCode
                      value={`https://safestep.app/user/${qrValue}`}
                      size={200}
                      color="#1a1a1a"
                      backgroundColor="#fff"
                    />
                  ) : (
                    <ActivityIndicator color="#2E8B57" size="large" />
                  )}
                </View>
              </ViewShot>
            </Animated.View>

            <View style={styles.qrTextBlock}>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.userRole}>Hiker SafeStep</Text>
            </View>
          </View>

          {/* INSTRUCTIONS */}
          <View style={styles.instructionsCard}>
            <View style={styles.instructionsRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="qr-code-outline" size={20} color="#2E8B57" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.instructionsTitle}>¿Cómo usar tu código QR?</Text>
                <View style={{ marginTop: 6 }}>
                  {[
                    "Muestra este código en el punto de acceso del parque",
                    "El personal escaneará tu código para registrar tu ingreso",
                    "Tu información médica estará disponible en caso de emergencia",
                  ].map((text, i) => (
                    <View key={i} style={styles.instructionsItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={14}
                        color="#2E8B57"
                        style={{ marginRight: 6 }}
                      />
                      <Text style={styles.instructionsText}>{text}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* ACTION BUTTONS */}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#fff", borderColor: "#2E8B5720" }]}
            onPress={handleRegenerate}
            disabled={isRegenerating}
            activeOpacity={0.9}
          >
            {isRegenerating ? (
              <ActivityIndicator color="#2E8B57" />
            ) : (
              <>
                <Ionicons name="refresh" size={18} color="#2E8B57" style={{ marginRight: 6 }} />
                <Text style={styles.actionText}>Actualizar código</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.row}>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleSaveToWallet}>
              <Ionicons name="wallet-outline" size={18} color="#1a1a1a" style={{ marginRight: 6 }} />
              <Text style={styles.secondaryText}>Wallet</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={18} color="#1a1a1a" style={{ marginRight: 6 }} />
              <Text style={styles.secondaryText}>Compartir</Text>
            </TouchableOpacity>
          </View>

          {/* SECURITY NOTE */}
          <View style={styles.securityCard}>
            <Text style={styles.securityText}>
              🔒 Tu información personal está protegida. Solo las empresas autorizadas pueden acceder
              a tus datos médicos en caso de emergencia.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f7" },
  header: {
    paddingTop: 70,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  backButton: {
    backgroundColor: "#f5f5f7",
    padding: 8,
    borderRadius: 50,
  },
  headerContent: { flexDirection: "row", alignItems: "center", gap: 6 },
  title: { fontSize: 18, fontWeight: "600", color: "#1a1a1a" },
  userId: { textAlign: "center", color: "#86868b", fontSize: 13, marginTop: 8 },
  content: { paddingHorizontal: 20, marginTop: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  qrWrapper: { alignItems: "center", justifyContent: "center" },
  qrBox: {
    aspectRatio: 1,
    width: "100%",
    borderWidth: 4,
    borderColor: "#2E8B57",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  qrTextBlock: { alignItems: "center", marginTop: 12 },
  userName: { color: "#1a1a1a", fontWeight: "600", fontSize: 16 },
  userRole: { color: "#86868b", fontSize: 13 },
  instructionsCard: {
    backgroundColor: "#2E8B5710",
    borderColor: "#2E8B5720",
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginTop: 20,
  },
  instructionsRow: { flexDirection: "row", gap: 12 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2E8B5710",
    alignItems: "center",
    justifyContent: "center",
  },
  instructionsTitle: { color: "#1a1a1a", fontWeight: "600", fontSize: 15 },
  instructionsItem: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  instructionsText: { color: "#86868b", fontSize: 13, flex: 1 },
  actionButton: {
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 20,
  },
  actionText: { color: "#2E8B57", fontWeight: "600" },
  row: { flexDirection: "row", gap: 10, marginTop: 10 },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  secondaryText: { color: "#1a1a1a", fontWeight: "500" },
  securityCard: {
    backgroundColor: "#f5f5f7",
    borderRadius: 16,
    padding: 14,
    marginTop: 20,
  },
  securityText: { textAlign: "center", color: "#86868b", fontSize: 12, lineHeight: 18 },
});
