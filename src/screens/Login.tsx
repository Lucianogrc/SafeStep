import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { signInUser } from "../firebaseActions";


interface LoginProps {
  onBack: () => void;
  onLoginHiker: () => void;
  onLoginCompany: () => void;
  onRegister: () => void;
}

export default function Login({
  onBack,
  onLoginHiker,
  onLoginCompany,
  onRegister,
}: LoginProps) {
  const [userType, setUserType] = useState<"hiker" | "company">("hiker");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Inicio de sesión real con Firebase ---
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Por favor ingresa tus credenciales.");
      return;
    }

    try {
      setLoading(true);
      console.log("🟢 Iniciando sesión con:", email);
      const uid = await signInUser(email.trim(), password);

      console.log("✅ Sesión iniciada. UID:", uid);

      // ✅ Según el tipo de usuario, abre el flujo correcto
      if (userType === "company") onLoginCompany();
      else onLoginHiker();
    } catch (err: any) {
      console.error("❌ Error en login:", err);
      Alert.alert("No se pudo iniciar sesión", err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Botón atrás */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Feather name="arrow-left" size={22} color="#1a1a1a" />
      </TouchableOpacity>

      {/* Logo y título */}
      <Animated.View entering={FadeInUp.duration(400)} style={styles.header}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Iniciar sesión</Text>
        <Text style={styles.subtitle}>Accede a tu cuenta de SafeStep</Text>
      </Animated.View>

      {/* Selector de tipo de usuario */}
<Animated.View
  entering={FadeInUp.duration(400).delay(100)}
  style={styles.selectorRow}
>
  <TouchableOpacity
    style={[
      styles.selectorButton,
      userType === "hiker" && styles.selectorActiveHiker,
    ]}
    onPress={() => setUserType("hiker")}
  >
    <Feather
      name="user"
      size={18}
      color={userType === "hiker" ? "#2E8B57" : "#86868b"}
    />
    <Text
      style={[
        styles.selectorText,
        { color: userType === "hiker" ? "#2E8B57" : "#86868b" },
      ]}
    >
      Hiker
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[
      styles.selectorButton,
      userType === "company" && styles.selectorActiveCompany,
    ]}
    onPress={() => setUserType("company")}
  >
    <MaterialCommunityIcons
      name="office-building"
      size={18}
      color={userType === "company" ? "#1E90FF" : "#86868b"}
    />
    <Text
      style={[
        styles.selectorText,
        { color: userType === "company" ? "#1E90FF" : "#86868b" },
      ]}
    >
      Empresa
    </Text>
  </TouchableOpacity>
</Animated.View>


      {/* Formulario */}
      <Animated.View
        entering={FadeInUp.duration(400).delay(200)}
        style={styles.form}
      >
        <View>
          <Text style={styles.label}>Correo electrónico</Text>
          <View style={styles.inputContainer}>
            <Feather name="mail" size={18} color="#86868b" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="tu@email.com"
              placeholderTextColor="#86868b"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View>
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputContainer}>
            <Feather name="lock" size={18} color="#86868b" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#86868b"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        <TouchableOpacity>
          <Text
            style={[
              styles.forgot,
              { color: userType === "hiker" ? "#2E8B57" : "#1E90FF" },
            ]}
          >
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Acciones */}
      <Animated.View
        entering={FadeInUp.duration(400).delay(300)}
        style={styles.actions}
      >
        <TouchableOpacity
          style={[
            styles.loginButton,
            { backgroundColor: userType === "hiker" ? "#2E8B57" : "#1E90FF" },
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginText}>
            {loading ? "Entrando..." : "Iniciar sesión"}
          </Text>
        </TouchableOpacity>

        <View style={styles.registerRow}>
          <Text style={styles.registerLabel}>¿No tienes cuenta?</Text>
          <TouchableOpacity onPress={onRegister}>
            <Text
              style={[
                styles.registerLink,
                { color: userType === "hiker" ? "#2E8B57" : "#1E90FF" },
              ]}
            >
              Crear cuenta
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: "#f5f5f7",
    borderRadius: 50,
    padding: 8,
  },
  header: { alignItems: "center", marginTop: 100, marginBottom: 30 },
  logo: { width: 70, height: 70, marginBottom: 10, resizeMode: "contain" },
  title: { fontSize: 22, fontWeight: "600", color: "#1a1a1a" },
  subtitle: { fontSize: 14, color: "#86868b", textAlign: "center" },

  /** 🔹 Selector actualizado */
  selectorRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    paddingHorizontal: 30, // evita que toquen los bordes del celular
  },
  selectorButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 14,
    paddingVertical: 8, // más compacto
    paddingHorizontal: 20,
    marginHorizontal: 10, // espacio entre botones
    backgroundColor: "#fff",
    width: 180, // tamaño más pequeño
    elevation: 2,
  },
  selectorActiveHiker: {
    borderColor: "#2E8B57",
    backgroundColor: "#E6F4EA",
  },
  selectorActiveCompany: {
    borderColor: "#1E90FF",
    backgroundColor: "#E6F0FF",
  },
  selectorText: {
    marginLeft: 6,
    fontWeight: "500",
    fontSize: 14,
  },

  form: { gap: 16, paddingHorizontal: 20 },
  label: { color: "#1a1a1a", fontSize: 14, marginBottom: 6 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f7",
    borderRadius: 16,
    paddingHorizontal: 10,
  },
  icon: { marginRight: 8 },
  input: {
    flex: 1,
    height: 50,
    color: "#1a1a1a",
  },
  forgot: { fontSize: 13, marginTop: 6, textAlign: "right" },
  actions: { marginTop: 20, paddingHorizontal: 20 },
  loginButton: {
    height: 55,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  loginText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  registerLabel: { color: "#86868b" },
  registerLink: { fontWeight: "bold", marginLeft: 4 },
});
