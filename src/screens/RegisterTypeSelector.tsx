import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface RegisterTypeSelectorProps {
  onBack: () => void;
  onSelectType: (type: "hiker" | "company") => void;
}

export default function RegisterTypeSelector({
  onBack,
  onSelectType,
}: RegisterTypeSelectorProps) {
  return (
    <View style={styles.container}>
      {/* Botón atrás */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Feather name="arrow-left" size={22} color="#1a1a1a" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.inner}>
        {/* Logo y texto */}
        <Animated.View
          entering={FadeInUp.duration(500)}
          style={styles.header}
        >
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>
            Selecciona el tipo de cuenta que deseas crear
          </Text>
        </Animated.View>

        {/* Opción Hiker */}
        <Animated.View
          entering={FadeInUp.duration(500).delay(100)}
          style={styles.optionContainer}
        >
          <TouchableOpacity
            style={[styles.optionButton, { borderColor: "#2E8B57" }]}
            activeOpacity={0.8}
            onPress={() => onSelectType("hiker")}
          >
            <View style={[styles.iconBox, { backgroundColor: "#2E8B5715" }]}>
              <Feather name="user" size={32} color="#2E8B57" />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Cuenta de Hiker</Text>
              <Text style={styles.optionSubtitle}>
                Para excursionistas y visitantes de parques naturales
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Opción Empresa */}
        <Animated.View
          entering={FadeInUp.duration(500).delay(200)}
          style={styles.optionContainer}
        >
          <TouchableOpacity
            style={[styles.optionButton, { borderColor: "#1E90FF" }]}
            activeOpacity={0.8}
            onPress={() => onSelectType("company")}
          >
            <View style={[styles.iconBox, { backgroundColor: "#1E90FF15" }]}>
              <MaterialCommunityIcons
                name="office-building"
                size={32}
                color="#1E90FF"
              />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Cuenta de Empresa</Text>
              <Text style={styles.optionSubtitle}>
                Para administradores de parques y áreas naturales
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Nota inferior */}
        <Animated.Text
          entering={FadeInUp.duration(500).delay(300)}
          style={styles.footerText}
        >
          Al crear una cuenta, aceptas nuestros términos de servicio y política
          de privacidad
        </Animated.Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inner: {
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: "#f5f5f7",
    borderRadius: 50,
    padding: 8,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 10,
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  subtitle: {
    color: "#86868b",
    fontSize: 14,
    textAlign: "center",
  },
  optionContainer: {
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderRadius: 24,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  optionText: { flex: 1 },
  optionTitle: { fontSize: 16, fontWeight: "600", color: "#1a1a1a" },
  optionSubtitle: { fontSize: 13, color: "#86868b" },
  footerText: {
    color: "#86868b",
    fontSize: 12,
    textAlign: "center",
    marginTop: 30,
  },
});
