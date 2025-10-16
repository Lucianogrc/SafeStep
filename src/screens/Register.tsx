import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type StepType = "email" | "password" | "text" | "number" | "tel" | "select" | "consent";

interface StepDef {
  id:
    | "email"
    | "password"
    | "confirmPassword"
    | "name"
    | "age"
    | "blood"
    | "allergies"
    | "emergency"
    | "address"
    | "location"
    | "idNumber"
    | "consent";
  title: string;
  icon: keyof typeof Feather.glyphMap;
  type: StepType;
  optional?: boolean;
}

interface RegisterProps {
  onBack: () => void;
  onComplete: () => void;
}

const steps: StepDef[] = [
  { id: "email", title: "Correo electrónico", icon: "mail", type: "email" },
  { id: "password", title: "Contraseña", icon: "lock", type: "password" },
  { id: "confirmPassword", title: "Confirmar contraseña", icon: "lock", type: "password" },
  { id: "name", title: "¿Cuál es tu nombre completo?", icon: "user", type: "text" },
  { id: "age", title: "¿Cuál es tu edad?", icon: "calendar", type: "number" },
  { id: "blood", title: "Tipo de sangre", icon: "droplet", type: "select" },
  { id: "allergies", title: "¿Tienes alergias?", icon: "alert-circle", type: "text" },
  { id: "emergency", title: "Contacto de emergencia", icon: "phone", type: "tel" },
  { id: "address", title: "Dirección o ubicación de casa", icon: "map-pin", type: "text" },
  { id: "location", title: "Ciudad", icon: "home", type: "text" },
  { id: "idNumber", title: "Número de identificación", icon: "credit-card", type: "text", optional: true },
  { id: "consent", title: "Consentimiento de datos", icon: "shield", type: "consent" },
];

export default function Register({ onBack, onComplete }: RegisterProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    age: "",
    blood: "",
    allergies: "",
    emergency: "",
    address: "",
    location: "",
    idNumber: "",
    consent: false,
  });

  const step = steps[currentStep];
  const progress = useMemo(() => ((currentStep + 1) / steps.length) * 100, [currentStep]);

  // --- Validaciones básicas ---
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => password.length >= 8;

  const validateCurrentStep = () => {
    const id = step.id as keyof typeof formData;
    const value = formData[id];

    if (id === "email") {
      if (!value) return setError("email", "El correo electrónico es obligatorio"), false;
      if (!validateEmail(String(value))) return setError("email", "Formato de correo inválido"), false;
      clearError();
      return true;
    }
    if (id === "password") {
      if (!value) return setError("password", "La contraseña es obligatoria"), false;
      if (!validatePassword(String(value))) return setError("password", "Mínimo 8 caracteres"), false;
      clearError();
      return true;
    }
    if (id === "confirmPassword") {
      if (!value) return setError("confirmPassword", "Confirma tu contraseña"), false;
      if (value !== formData.password) return setError("confirmPassword", "Las contraseñas no coinciden"), false;
      clearError();
      return true;
    }
    clearError();
    return true;
  };

  const setError = (k: string, msg: string) => setErrors({ [k]: msg });
  const clearError = () => setErrors({});

  // --- UI helpers ---
  const updateField = (val: string | boolean) => {
    const id = step.id as keyof typeof formData;
    setFormData((p) => ({ ...p, [id]: val }));
    clearError();
  };
  const currentValue = formData[step.id as keyof typeof formData];
  const isOptional = step.optional;
  const canContinue = isOptional || (step.type === "consent" ? formData.consent : !!currentValue);

  // --- Navegación ---
  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
    else setShowConfirmation(true);
  };
  const handleBack = () => {
    clearError();
    if (currentStep > 0) setCurrentStep((s) => s - 1);
    else onBack();
  };

  // --- Pantalla de confirmación (sin animaciones) ---
  if (showConfirmation) {
    return (
      <LinearGradient colors={["#FFFFFF", "#F5F5F7"]} style={styles.container}>
        <View style={styles.centered}>
          <View style={styles.bigIcon}>
            <Ionicons name="qr-code-outline" size={54} color="#fff" />
          </View>
          <View style={{ height: 16 }} />
          <View style={styles.circleCheck}>
            <Feather name="check" size={28} color="#2E8B57" />
          </View>

          <Text style={styles.titleCenter}>¡Listo, tu perfil está configurado!</Text>
          <Text style={styles.subtitleCenter}>
            Ahora puedes generar tu código QR SafeStep y comenzar a explorar de forma segura.
          </Text>

          <TouchableOpacity style={styles.primaryBtn} onPress={onComplete}>
            <Ionicons name="qr-code" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.primaryBtnText}>Generar mi QR</Text>
          </TouchableOpacity>

          <Text style={styles.footerNote}>
            Tu información se comparte solo con administradores de parques cuando ingreses.
          </Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#FFFFFF", "#F5F5F7"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.iconBtn}>
          <Feather name="arrow-left" size={22} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.stepText}>
          {currentStep + 1} de {steps.length}
        </Text>
      </View>

      {/* Progress */}
      <View style={styles.progressBarWrap}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} keyboardShouldPersistTaps="handled">
        {/* Icono y título */}
        <View style={styles.stepIcon}>
          <Feather name={step.icon} size={26} color="#2E8B57" />
        </View>
        <Text style={styles.title}>{step.title}</Text>
        {isOptional && <Text style={styles.optional}>Opcional - Puedes omitir este paso</Text>}

        {/* Campo según tipo */}
        <View style={{ marginTop: 14 }}>
          {/* Email */}
          {step.id === "email" && (
            <>
              <View style={styles.inputWrap}>
                <Feather name="mail" size={18} color="#86868b" style={styles.inputLeftIcon} />
                <TextInput
                  value={String(currentValue ?? "")}
                  onChangeText={(t) => updateField(t)}
                  placeholder="ejemplo@correo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </>
          )}

          {/* Password */}
          {step.id === "password" && (
            <>
              <View style={styles.inputWrap}>
                <Feather name="lock" size={18} color="#86868b" style={styles.inputLeftIcon} />
                <TextInput
                  value={String(currentValue ?? "")}
                  onChangeText={(t) => updateField(t)}
                  placeholder="********"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  style={styles.input}
                />
                <TouchableOpacity style={styles.inputRightIcon} onPress={() => setShowPassword((v) => !v)}>
                  <Feather name={showPassword ? "eye-off" : "eye"} size={18} color="#86868b" />
                </TouchableOpacity>
              </View>
              <Text style={styles.hint}>Debe tener al menos 8 caracteres</Text>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </>
          )}

          {/* Confirm Password */}
          {step.id === "confirmPassword" && (
            <>
              <View style={styles.inputWrap}>
                <Feather name="lock" size={18} color="#86868b" style={styles.inputLeftIcon} />
                <TextInput
                  value={String(currentValue ?? "")}
                  onChangeText={(t) => updateField(t)}
                  placeholder="********"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  style={styles.input}
                />
                <TouchableOpacity
                  style={styles.inputRightIcon}
                  onPress={() => setShowConfirmPassword((v) => !v)}
                >
                  <Feather name={showConfirmPassword ? "eye-off" : "eye"} size={18} color="#86868b" />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </>
          )}

          {/* Select (Tipo de sangre) */}
          {step.type === "select" && step.id === "blood" && (
            <View style={styles.bloodGrid}>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => {
                const active = currentValue === type;
                return (
                  <TouchableOpacity
                    key={type}
                    onPress={() => updateField(type)}
                    style={[
                      styles.bloodBtn,
                      active && { borderColor: "#2E8B57", backgroundColor: "#2E8B5715" },
                    ]}
                  >
                    <Text style={[styles.bloodText, active && { color: "#2E8B57", fontWeight: "700" }]}>{type}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Consent */}
          {step.type === "consent" && (
            <View style={{ gap: 12 }}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Compartir información de seguridad</Text>
                <Text style={styles.cardText}>
                  Al aceptar, autorizas a SafeStep a compartir tu información médica y de contacto con empresas
                  administradoras de parques naturales.
                </Text>
                <Text style={styles.cardBullet}>• Nombre completo y edad</Text>
                <Text style={styles.cardBullet}>• Tipo de sangre y alergias</Text>
                <Text style={styles.cardBullet}>• Contacto de emergencia</Text>
                <Text style={styles.cardBullet}>• Ubicación en tiempo real</Text>
              </View>

              <TouchableOpacity
                onPress={() => updateField(!formData.consent)}
                style={[
                  styles.consentRow,
                  formData.consent && { borderColor: "#2E8B57", backgroundColor: "#2E8B5715" },
                ]}
              >
                <Feather
                  name={formData.consent ? "check-square" : "square"}
                  size={20}
                  color={formData.consent ? "#2E8B57" : "#86868b"}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.consentTitle}>Acepto compartir mi información</Text>
                  <Text style={styles.consentText}>He leído y acepto los términos de uso de SafeStep</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Otros campos de texto/num/tel */}
          {!["email", "password", "confirmPassword"].includes(step.id) &&
            step.type !== "select" &&
            step.type !== "consent" && (
              <TextInput
                value={String(currentValue ?? "")}
                onChangeText={(t) => updateField(t)}
                placeholder={
                  step.id === "name"
                    ? "Juan Pérez García"
                    : step.id === "age"
                    ? "25"
                    : step.id === "allergies"
                    ? "Ninguna, polen, medicamentos..."
                    : step.id === "emergency"
                    ? "+52 33 1234 5678"
                    : step.id === "address"
                    ? "Calle Principal 123, Col. Centro"
                    : step.id === "location"
                    ? "Ciudad de México, México"
                    : step.id === "idNumber"
                    ? "ABC123456"
                    : ""
                }
                keyboardType={
                  step.type === "number" ? "number-pad" : step.type === "tel" ? "phone-pad" : "default"
                }
                style={styles.input}
              />
            )}

          {/* Hints contextuales */}
          {step.id === "allergies" && <Text style={styles.hint}>Esta información es crucial en emergencias.</Text>}
          {step.id === "emergency" && (
            <Text style={styles.hint}>Número de un familiar o amigo para contacto de emergencia.</Text>
          )}
          {step.id === "age" && <Text style={styles.hint}>Debes ser mayor de 16 años para registrarte.</Text>}
        </View>

        {/* Botones */}
        <View style={{ height: 22 }} />
        <TouchableOpacity
          disabled={!canContinue}
          onPress={handleNext}
          style={[styles.primaryBtn, !canContinue && { opacity: 0.5 }]}
        >
          {currentStep === steps.length - 1 ? (
            <>
              <Feather name="check" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.primaryBtnText}>Completar registro</Text>
            </>
          ) : (
            <>
              <Text style={styles.primaryBtnText}>Continuar</Text>
              <Feather name="arrow-right" size={18} color="#fff" style={{ marginLeft: 8 }} />
            </>
          )}
        </TouchableOpacity>

        {isOptional && (
          <TouchableOpacity onPress={handleNext} style={{ paddingVertical: 12 }}>
            <Text style={styles.skipText}>Omitir este paso</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: Platform.select({ ios: 24, android: 24, default: 12 }) }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 54,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  iconBtn: { padding: 8, borderRadius: 999, backgroundColor: "rgba(0,0,0,0.05)" },
  stepText: { color: "#86868b" },
  progressBarWrap: {
    height: 4,
    backgroundColor: "#e6e6ea",
    borderRadius: 2,
    marginTop: 10,
    marginHorizontal: 0,
  },
  progressBarFill: { height: 4, backgroundColor: "#2E8B57", borderRadius: 2 },

  scrollBody: { paddingTop: 22, paddingHorizontal: 20, paddingBottom: 10 },
  stepIcon: {
    alignSelf: "flex-start",
    backgroundColor: "#2E8B5715",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#1a1a1a" },
  optional: { color: "#86868b", marginTop: 6 },

  inputWrap: { position: "relative", justifyContent: "center" },
  input: {
    backgroundColor: "#f5f5f7",
    borderRadius: 16,
    paddingHorizontal: 48,
    height: 56,
    fontSize: 16,
    color: "#1a1a1a",
  },
  inputLeftIcon: { position: "absolute", left: 14, zIndex: 1 },
  inputRightIcon: { position: "absolute", right: 14, zIndex: 1 },

  bloodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  bloodBtn: {
    width: "23%",
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  bloodText: { color: "#555" },

  card: { backgroundColor: "#f5f5f7", borderRadius: 16, padding: 14 },
  cardTitle: { color: "#1a1a1a", fontWeight: "700", marginBottom: 6 },
  cardText: { color: "#86868b", marginBottom: 8, lineHeight: 18 },
  cardBullet: { color: "#86868b", fontSize: 12, marginBottom: 2 },

  consentRow: {
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  consentTitle: { color: "#1a1a1a", fontWeight: "600" },
  consentText: { color: "#86868b", fontSize: 12 },

  primaryBtn: {
    marginTop: 10,
    backgroundColor: "#2E8B57",
    borderRadius: 16,
    minHeight: 52,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  skipText: { textAlign: "center", color: "#86868b" },

  hint: { color: "#86868b", marginTop: 8, fontSize: 12 },

  centered: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  bigIcon: {
    width: 112,
    height: 112,
    borderRadius: 28,
    backgroundColor: "#2E8B57",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  circleCheck: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2E8B5715",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  titleCenter: { fontSize: 20, fontWeight: "700", color: "#1a1a1a", marginTop: 14, textAlign: "center" },
  subtitleCenter: { color: "#86868b", textAlign: "center", marginTop: 8, lineHeight: 20 },
  footerNote: { color: "#86868b", fontSize: 12, marginTop: 12, textAlign: "center" },
});
