import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface WelcomeProps {
  onGetStarted: () => void;
}

export default function Welcome({ onGetStarted }: WelcomeProps) {
  return (
    <LinearGradient colors={["#2E8B57", "#1E90FF"]} style={styles.gradient}>
      {/* Fondo con imagen */}
      <ImageBackground
        source={require("../../assets/images/mountain-bg.jpg")}
        style={styles.background}
        imageStyle={{ opacity: 0.25 }}
      >
        <View style={styles.container}>
          {/* Logo */}
          <Image
  source={require("../../assets/images/logo2.png")}
  style={styles.logo}
  resizeMode="contain"
/>



          {/* Título */}
          <Text style={styles.title}>SafeStep</Text>

          {/* Subtítulo */}
          <View style={styles.subtitleContainer}>
            <Ionicons name="trail-sign-outline" size={18} color="white" />
            <Text style={styles.subtitle}>Explora con confianza</Text>
          </View>

          {/* Botón CTA */}
          <TouchableOpacity style={styles.button} onPress={onGetStarted}>
            <Text style={styles.buttonText}>Comenzar</Text>
          </TouchableOpacity>

          {/* Pie de página */}
          <Text style={styles.footerText}>
            Protegiendo excursionistas desde 2025
          </Text>
        </View>
      </ImageBackground>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: 16,
  },
  title: {
    fontSize: 48,
    color: "white",
    fontWeight: "700",
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  subtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginLeft: 6,
  },
  button: {
    marginTop: 60,
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 80,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: "#2E8B57",
    fontSize: 18,
    fontWeight: "600",
  },
  footerText: {
    marginTop: 20,
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    textAlign: "center",
  },
});
