import { Feather } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

interface WelcomeProps {
  onGetStarted: () => void;
}

export default function Welcome({ onGetStarted }: WelcomeProps) {
  return (
    <View style={styles.container}>
      {/* Fondo con imagen */}
      <ImageBackground
  source={require("../../assets/images/mountain-bg.jpg")}
  style={styles.background}
  imageStyle={{ opacity: 0.25 }}
>


        {/* Contenido principal */}
        <View style={styles.overlay}>
          {/* LOGO */}
          <Animated.View
            entering={FadeInDown.duration(600)}
            style={styles.logoContainer}
          >
            <Image
              source={require("../../assets/images/logo2.png")}
              style={styles.logo}
            />
          </Animated.View>

          {/* Título */}
          <Animated.Text
            entering={FadeInUp.duration(600).delay(200)}
            style={styles.title}
          >
            SafeStep
          </Animated.Text>

          {/* Subtítulo con ícono */}
          <Animated.View
            entering={FadeInUp.duration(600).delay(400)}
            style={styles.subtitleRow}
          >
            <Feather name="activity" size={18} color="#fff" />
            <Text style={styles.subtitle}>Explora con confianza</Text>
          </Animated.View>

          {/* Botón */}
          <Animated.View
            entering={FadeInUp.duration(600).delay(600)}
            style={styles.buttonContainer}
          >
            <TouchableOpacity style={styles.button} onPress={onGetStarted}>
              <Text style={styles.buttonText}>Comenzar</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}>
              Protegiendo excursionistas desde 2025
            </Text>
          </Animated.View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: {
    flex: 1,
    backgroundColor: "#2E8B57",
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 60,
  },
  logoContainer: {
    marginTop: 100,
    alignItems: "center",
  },
  logo: { width: 120, height: 120, resizeMode: "contain" },
  title: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  subtitle: { color: "rgba(255,255,255,0.8)", fontSize: 14 },
  buttonContainer: {
    width: "80%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  buttonText: {
    color: "#2E8B57",
    fontWeight: "bold",
    fontSize: 16,
  },
  footerText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    marginTop: 10,
  },
});
