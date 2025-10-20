import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../firebaseConfig";

interface CompanyRegisterProps {
  onBack: () => void;
  onComplete: () => void;
}

type StepType = "email" | "password" | "text" | "tel" | "url" | "consent";

interface StepDef {
  id:
    | "email"
    | "password"
    | "confirmPassword"
    | "companyName"
    | "industry"
    | "address"
    | "city"
    | "contactName"
    | "phone"
    | "website"
    | "description"
    | "consent";
  title: string;
  icon: keyof typeof Feather.glyphMap;
  type: StepType;
}

const steps: StepDef[] = [
  { id: "email", title: "Correo de la empresa", icon: "mail", type: "email" },
  { id: "password", title: "Crea una contraseña", icon: "lock", type: "password" },
  { id: "confirmPassword", title: "Confirma tu contraseña", icon: "lock", type: "password" },
  { id: "companyName", title: "Nombre de la empresa", icon: "briefcase", type: "text" },
  { id: "industry", title: "Industria o sector", icon: "grid", type: "text" },
  { id: "address", title: "Dirección completa", icon: "map-pin", type: "text" },
  { id: "city", title: "Ciudad donde opera", icon: "home", type: "text" },
  { id: "contactName", title: "Nombre del contacto principal", icon: "user", type: "text" },
  { id: "phone", title: "Teléfono de contacto", icon: "phone", type: "tel" },
  { id: "website", title: "Sitio web (opcional)", icon: "globe", type: "url" },
  { id: "description", title: "Describe tu empresa y servicios", icon: "file-text", type: "text" },
  { id: "consent", title: "Términos y políticas", icon: "shield", type: "consent" },
];

export default function CompanyRegisterPro({ onBack, onComplete }: CompanyRegisterProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    industry: "",
    address: "",
    city: "",
    contactName: "",
    phone: "",
    website: "",
    description: "",
    consent: false,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const step = steps[currentStep];
  const progress = useMemo(() => ((currentStep + 1) / steps.length) * 100, [currentStep]);

  const updateField = (val: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [step.id]: val ?? "",
    }));
  };

  const setError = (k: string, msg: string) => setErrors({ [k]: msg });
  const clearError = () => setErrors({});

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => password.length >= 8;

  const validateCurrentStep = () => {
    const id = step.id as keyof typeof formData;
    const value = formData[id];

    if (id === "email") {
      if (!value) return setError("email", "El correo es obligatorio"), false;
      if (!validateEmail(String(value))) return setError("email", "Correo inválido"), false;
    }
    if (id === "password") {
      if (!validatePassword(String(value))) return setError("password", "Debe tener al menos 8 caracteres"), false;
    }
    if (id === "confirmPassword") {
      if (value !== formData.password) return setError("confirmPassword", "Las contraseñas no coinciden"), false;
    }
    clearError();
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
    else setShowConfirmation(true);
  };

  const handleBackStep = () => {
    clearError();
    if (currentStep > 0) setCurrentStep((s) => s - 1);
    else onBack();
  };

  const handleFinish = async () => {
    try {
      if (!formData.email || !formData.password || !formData.companyName) {
        Alert.alert("Error", "Completa todos los campos requeridos");
        return;
      }

      const { email, password } = formData;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "companies", user.uid), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Registro exitoso", "Tu empresa ha sido registrada correctamente.");
      onComplete();
    } catch (err: any) {
      console.log("❌ Error:", err);
      if (err.code === "auth/email-already-in-use") {
        Alert.alert("Error", "Este correo ya está en uso. Inicia sesión o usa otro.");
      } else {
        Alert.alert("Error", err.message || "Error al crear la cuenta.");
      }
    }
  };

  const currentValue = formData[step.id as keyof typeof formData];
  const canContinue =
    step.type === "consent" ? formData.consent : !!currentValue || step.id === "website";

  // ✅ Pantalla final
  if (showConfirmation) {
    return (
      <LinearGradient colors={["#FFFFFF", "#E6F0FF"]} style={styles.container}>
        <View style={styles.centered}>
          <View style={styles.bigIcon}>
            <Ionicons name="business-outline" size={54} color="#fff" />
          </View>
          <View style={styles.circleCheck}>
            <Feather name="check" size={28} color="#1E90FF" />
          </View>

          <Text style={styles.titleCenter}>¡Tu empresa fue registrada!</Text>
          <Text style={styles.subtitleCenter}>
            Ahora puedes acceder al panel de empresas y publicar tus servicios.
          </Text>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleFinish}>
            <Ionicons name="log-in-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.primaryBtnText}>Ir al inicio</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  // ✅ Formulario paso a paso
  return (
    <LinearGradient colors={["#FFFFFF", "#E6F0FF"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackStep} style={styles.iconBtn}>
          <Feather name="arrow-left" size={22} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.stepText}>
          {currentStep + 1} de {steps.length}
        </Text>
      </View>

      <View style={styles.progressBarWrap}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} keyboardShouldPersistTaps="handled">
        <View style={styles.stepIcon}>
          <Feather name={step.icon} size={26} color="#1E90FF" />
        </View>
        <Text style={styles.title}>{step.title}</Text>

        {/* CAMPOS */}
        {["email", "password", "confirmPassword"].includes(step.id) ? (
          <>
            <View style={styles.inputWrap}>
              <Feather name={step.icon} size={18} color="#86868b" style={styles.inputLeftIcon} />
              <TextInput
                value={String(currentValue ?? "")}
                onChangeText={(t) => updateField(t)}
                placeholder={
                  step.id === "email"
                    ? "empresa@correo.com"
                    : "********"
                }
                secureTextEntry={
                  step.id === "password"
                    ? !showPassword
                    : step.id === "confirmPassword"
                    ? !showConfirmPassword
                    : false
                }
                autoCapitalize="none"
                keyboardType={step.id === "email" ? "email-address" : "default"}
                style={styles.input}
              />
              {step.id === "password" && (
                <TouchableOpacity
                  style={styles.inputRightIcon}
                  onPress={() => setShowPassword((v) => !v)}
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={18}
                    color="#86868b"
                  />
                </TouchableOpacity>
              )}
              {step.id === "confirmPassword" && (
                <TouchableOpacity
                  style={styles.inputRightIcon}
                  onPress={() => setShowConfirmPassword((v) => !v)}
                >
                  <Feather
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={18}
                    color="#86868b"
                  />
                </TouchableOpacity>
              )}
            </View>
            {errors[step.id] && <Text style={styles.errorText}>{errors[step.id]}</Text>}
          </>
        ) : step.type === "consent" ? (
          <TouchableOpacity
            onPress={() => updateField(!formData.consent)}
            style={[
              styles.consentRow,
              formData.consent && { borderColor: "#1E90FF", backgroundColor: "#1E90FF15" },
            ]}
          >
            <Feather
              name={formData.consent ? "check-square" : "square"}
              size={20}
              color={formData.consent ? "#1E90FF" : "#86868b"}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.consentTitle}>Acepto los términos de SafeStep Empresas</Text>
              <Text style={styles.consentText}>
                Autorizo el uso de mis datos para ofrecer servicios dentro de la plataforma.
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TextInput
            value={String(currentValue ?? "")}
            onChangeText={(t) => updateField(t)}
            placeholder={
              step.id === "website"
                ? "https://miempresa.com"
                : step.id === "phone"
                ? "+52 33 1234 5678"
                : ""
            }
            style={styles.input}
            keyboardType={
              step.type === "tel"
                ? "phone-pad"
                : step.type === "url"
                ? "url"
                : "default"
            }
          />
        )}

        {/* BOTONES */}
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
  iconBtn: { padding: 8, borderRadius: 999, backgroundColor: "rgba(0,0,0,0.05)" },
  stepText: { color: "#86868b" },
  progressBarWrap: {
    height: 4,
    backgroundColor: "#e6e6ea",
    borderRadius: 2,
    marginTop: 10,
  },
  progressBarFill: { height: 4, backgroundColor: "#1E90FF", borderRadius: 2 },
  scrollBody: { paddingTop: 22, paddingHorizontal: 20, paddingBottom: 10 },
  stepIcon: {
    alignSelf: "flex-start",
    backgroundColor: "#1E90FF15",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#1a1a1a" },
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
  primaryBtn: {
    marginTop: 20,
    backgroundColor: "#1E90FF",
    borderRadius: 16,
    minHeight: 52,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  errorText: { color: "red", fontSize: 12, marginTop: 4 },
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
  centered: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  bigIcon: {
    width: 112,
    height: 112,
    borderRadius: 28,
    backgroundColor: "#1E90FF",
    alignItems: "center",
    justifyContent: "center",
  },
  circleCheck: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1E90FF15",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  titleCenter: { fontSize: 20, fontWeight: "700", color: "#1a1a1a", marginTop: 14 },
  subtitleCenter: { color: "#86868b", textAlign: "center", marginTop: 8, lineHeight: 20 },
});

