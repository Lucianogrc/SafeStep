import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import QRCode from "react-native-qrcode-svg"; // ✅ QR real
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import TabBar from "../../components/ui/TabBar";

interface QRCodeScreenProps {
  onTabChange: (tab: string) => void;
}

export default function QRCodeScreen({ onTabChange }: QRCodeScreenProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const rotation = useSharedValue(0);

  // ⚙️ ID único del usuario (puedes obtenerlo de Firebase más adelante)
  const userId = "HST-2024-001234";

  const handleRegenerate = () => {
    setIsRegenerating(true);
    rotation.value = withTiming(rotation.value + 360, { duration: 800 });
    setTimeout(() => {
      setIsRegenerating(false);
      Alert.alert("Éxito", "Código QR actualizado correctamente ✅");
    }, 1500);
  };

  const handleSaveToWallet = () => {
    Alert.alert("Guardado", "QR guardado en Apple Wallet");
  };

  const handleShare = () => {
    Alert.alert("Compartir", "Compartiendo código QR...");
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#fff", "#f5f5f7"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoRow}>
            <Image
              source={require("../../assets/images/logo2.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Mi Código QR</Text>
          </View>
          <Text style={styles.userId}>ID: {userId}</Text>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* QR Code Card */}
          <View style={styles.card}>
            <Animated.View style={[styles.qrWrapper, animatedStyle]}>
              <View style={styles.qrBox}>
                {/* ✅ QR real escaneable */}
                <QRCode
                  value={`https://safestep.app/user/${userId}`} // puedes usar el ID o una URL real
                  size={200}
                  color="#1a1a1a"
                  backgroundColor="#fff"
                  logoSize={50}
                  logoBackgroundColor="transparent"
                />
              </View>
            </Animated.View>

            <View style={styles.qrTextBlock}>
              <Text style={styles.userName}>Juan Pérez García</Text>
              <Text style={styles.userRole}>Hiker SafeStep</Text>
            </View>
          </View>

          {/* Instructions */}
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

          {/* Action Buttons */}
          <View style={{ marginTop: 10 }}>
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
              <TouchableOpacity style={[styles.secondaryButton]} onPress={handleSaveToWallet}>
                <Ionicons name="wallet-outline" size={18} color="#1a1a1a" style={{ marginRight: 6 }} />
                <Text style={styles.secondaryText}>Wallet</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.secondaryButton]} onPress={handleShare}>
                <Ionicons name="share-outline" size={18} color="#1a1a1a" style={{ marginRight: 6 }} />
                <Text style={styles.secondaryText}>Compartir</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Security Note */}
          <View style={styles.securityCard}>
            <Text style={styles.securityText}>
              🔒 Tu información personal está protegida. Solo las empresas autorizadas pueden acceder
              a tus datos médicos en caso de emergencia.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* TabBar */}
      <TabBar activeTab="qr" onTabChange={onTabChange} variant="hiker" />

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
  headerContent: { alignItems: "center" },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  logo: { width: 32, height: 32 },
  title: { fontSize: 18, fontWeight: "600", color: "#1a1a1a" },
  userId: { color: "#86868b", fontSize: 13, marginTop: 4 },

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
