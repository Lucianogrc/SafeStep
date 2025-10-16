import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface CompanyRegisterProps {
  onBack: () => void;
  onComplete: () => void;
}

const steps = [
  { id: "email", title: "Correo electrónico", icon: "mail-outline" },
  { id: "password", title: "Contraseña", icon: "lock-closed-outline" },
  { id: "confirmPassword", title: "Confirmar contraseña", icon: "lock-closed-outline" },
  { id: "basic", title: "Información básica", icon: "business-outline" },
  { id: "contact", title: "Datos de contacto", icon: "call-outline" },
  { id: "details", title: "Detalles adicionales", icon: "document-text-outline" },
];

export default function CompanyRegister({ onBack, onComplete }: CompanyRegisterProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    phone: "",
    address: "",
    website: "",
    description: "",
  });

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({});
  };

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) => password.length >= 8;

  const validateStep = () => {
    if (step.id === "email" && !validateEmail(formData.email)) {
      setErrors({ email: "Correo inválido" });
      return false;
    }
    if (step.id === "password" && !validatePassword(formData.password)) {
      setErrors({ password: "Debe tener mínimo 8 caracteres" });
      return false;
    }
    if (
      step.id === "confirmPassword" &&
      formData.confirmPassword !== formData.password
    ) {
      setErrors({ confirmPassword: "Las contraseñas no coinciden" });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    else onComplete();
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    else onBack();
  };

  const canContinue =
    (step.id === "email" && validateEmail(formData.email)) ||
    (step.id === "password" && validatePassword(formData.password)) ||
    (step.id === "confirmPassword" &&
      formData.confirmPassword === formData.password) ||
    (step.id === "basic" && formData.companyName.trim() !== "") ||
    (step.id === "contact" &&
      formData.phone.trim() !== "" &&
      formData.address.trim() !== "") ||
    (step.id === "details" && formData.description.trim() !== "");

  return (
    <LinearGradient colors={["#FFFFFF", "#E6F0FF"]} style={{ flex: 1, paddingTop: 50 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back-outline" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.stepText}>
          {currentStep + 1} / {steps.length}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Step Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name={step.icon as any} size={30} color="#1E90FF" />
          </View>
          <Text style={styles.stepTitle}>{step.title}</Text>
        </View>

        {/* Email */}
        {step.id === "email" && (
          <>
            <TextInput
              style={styles.input}
              placeholder="contacto@empresa.com"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(t) => updateField("email", t)}
            />
            {errors.email && (
              <Text style={styles.errorText}>
                <Ionicons name="alert-circle-outline" size={14} color="#FF3B30" /> {errors.email}
              </Text>
            )}
          </>
        )}

        {/* Password */}
        {step.id === "password" && (
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="********"
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={(t) => updateField("password", t)}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#86868b"
              />
            </TouchableOpacity>
            {errors.password && (
              <Text style={styles.errorText}>
                <Ionicons name="alert-circle-outline" size={14} color="#FF3B30" /> {errors.password}
              </Text>
            )}
          </View>
        )}

        {/* Confirm Password */}
        {step.id === "confirmPassword" && (
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              secureTextEntry={!showConfirmPassword}
              value={formData.confirmPassword}
              onChangeText={(t) => updateField("confirmPassword", t)}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#86868b"
              />
            </TouchableOpacity>
            {errors.confirmPassword && (
              <Text style={styles.errorText}>
                <Ionicons name="alert-circle-outline" size={14} color="#FF3B30" /> {errors.confirmPassword}
              </Text>
            )}
          </View>
        )}

        {/* Basic Info */}
        {step.id === "basic" && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la empresa"
              value={formData.companyName}
              onChangeText={(t) => updateField("companyName", t)}
            />
            <View style={styles.logoContainer}>
              <View style={styles.logoPreview}>
                {logoPreview ? (
                  <Image source={{ uri: logoPreview }} style={styles.logoImage} />
                ) : (
                  <Ionicons name="image-outline" size={32} color="#86868b" />
                )}
              </View>
              <TouchableOpacity style={styles.logoButton}>
                <Text style={styles.logoButtonText}>Seleccionar imagen</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Contact */}
        {step.id === "contact" && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(t) => updateField("phone", t)}
            />
            <TextInput
              style={[styles.input, { height: 90 }]}
              placeholder="Dirección completa"
              multiline
              value={formData.address}
              onChangeText={(t) => updateField("address", t)}
            />
          </>
        )}

        {/* Details */}
        {step.id === "details" && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Sitio web (opcional)"
              value={formData.website}
              onChangeText={(t) => updateField("website", t)}
            />
            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="Describe tu empresa y servicios..."
              multiline
              maxLength={200}
              value={formData.description}
              onChangeText={(t) => updateField("description", t)}
            />
          </>
        )}
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, { opacity: canContinue ? 1 : 0.5 }]}
          disabled={!canContinue}
          onPress={handleNext}
        >
          <Text style={styles.continueText}>
            {currentStep === steps.length - 1
              ? "Crear cuenta de empresa"
              : "Continuar"}
          </Text>
          <Ionicons
            name={
              currentStep === steps.length - 1
                ? "checkmark-outline"
                : "arrow-forward-outline"
            }
            size={20}
            color="white"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  stepText: { color: "#86868b", fontSize: 14 },
  progressContainer: {
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    marginHorizontal: 20,
    marginTop: 8,
  },
  progressFill: {
    height: 4,
    backgroundColor: "#1E90FF",
    borderRadius: 2,
  },
  scrollContainer: { paddingHorizontal: 24, paddingBottom: 100 },
  iconContainer: { alignItems: "center", marginBottom: 20 },
  iconCircle: {
    backgroundColor: "#1E90FF20",
    padding: 16,
    borderRadius: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
    marginTop: 12,
  },
  input: {
    backgroundColor: "#f5f5f7",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginVertical: 6,
  },
  inputWrapper: { position: "relative", marginBottom: 10 },
  eyeIcon: { position: "absolute", right: 16, top: 18 },
  errorText: { color: "#FF3B30", marginTop: 4, fontSize: 13 },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  logoPreview: {
    width: 70,
    height: 70,
    backgroundColor: "#f5f5f7",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  logoImage: { width: 70, height: 70, borderRadius: 16 },
  logoButton: {
    borderWidth: 1,
    borderColor: "#1E90FF40",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  logoButtonText: { color: "#1E90FF", fontWeight: "500" },
  footer: { padding: 20 },
  continueButton: {
    backgroundColor: "#1E90FF",
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
  },
  continueText: { color: "white", fontSize: 16, fontWeight: "600" },
});
