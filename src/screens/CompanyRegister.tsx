// src/screens/CompanyRegister.tsx
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
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
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

interface CompanyRegisterProps {
  onBack: () => void;
  onComplete: () => void;
}

const steps = [
  { id: "email", title: "Correo electrónico", icon: "mail" },
  { id: "password", title: "Contraseña", icon: "lock" },
  { id: "confirmPassword", title: "Confirmar contraseña", icon: "lock" },
  { id: "basic", title: "Información básica", icon: "building" },
  { id: "contact", title: "Datos de contacto", icon: "phone" },
  { id: "details", title: "Detalles adicionales", icon: "file-text" },
];

export default function CompanyRegister({ onBack, onComplete }: CompanyRegisterProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const updateField = (v: any) => setFormData({ ...formData, [step.id]: v });

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
    else setShowConfirmation(true);
  };

  const handlePrev = () => {
    if (showConfirmation) {
      setShowConfirmation(false);
      return;
    }
    if (currentStep > 0) setCurrentStep((s) => s - 1);
    else onBack();
  };

  // ---------- Pantalla de confirmación ----------
  if (showConfirmation) {
    return (
      <View style={styles.confirmContainer}>
        <View style={styles.confirmInner}>
          <Animated.View
            entering={FadeInDown.duration(500)}
            style={{ alignItems: "center", marginBottom: 24 }}
          >
            <View style={[styles.qrShine, { backgroundColor: "#1E90FF" }]}>
              <MaterialCommunityIcons name="check-decagram" size={56} color="#fff" />
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.duration(400).delay(150)}
            style={{ alignItems: "center", marginBottom: 16, paddingHorizontal: 24 }}
          >
            <View style={styles.checkBubble}>
              <Feather name="check" size={28} color="#1E90FF" />
            </View>

            <Text style={[styles.confirmTitle, { marginTop: 8 }]}>
              ¡Cuenta empresarial creada!
            </Text>
            <Text style={styles.confirmSubtitle}>
              Tu empresa ya está registrada en SafeStep. Ahora puedes acceder al panel
              administrativo.
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.duration(400).delay(250)}
            style={{ width: "100%", paddingHorizontal: 20 }}
          >
            <TouchableOpacity style={styles.qrButtonBlue} onPress={onComplete}>
              <Feather name="arrow-right" size={20} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.qrButtonText}>Ir al panel</Text>
            </TouchableOpacity>

            <Text style={styles.confirmNote}>
              Puedes actualizar los datos de tu empresa desde el panel en cualquier momento.
            </Text>

            <TouchableOpacity onPress={handlePrev} style={styles.backGhost}>
              <Feather name="arrow-left" size={18} color="#86868b" />
              <Text style={styles.backGhostText}>Volver</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  }
  // ----------------------------------------------

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrev} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.stepText}>
          {currentStep + 1} / {steps.length}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack} />
      <View style={[styles.progressBarBlue, { width: `${progress}%` }]} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.duration(300)} style={{ marginTop: 90 }}>
          {/* Icono */}
          <View style={[styles.iconCircle, { backgroundColor: "#1E90FF15" }]}>
            <Feather name={step.icon as any} size={30} color="#1E90FF" />
          </View>

          <Text style={styles.title}>{step.title}</Text>

          {/* Campos por paso */}
          {step.id === "email" && (
            <TextInput
              style={styles.input}
              placeholder="contacto@empresa.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email || ""}
              onChangeText={(v) => updateField(v)}
            />
          )}

          {step.id === "password" && (
            <View>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="********"
                  secureTextEntry={!showPassword}
                  value={formData.password || ""}
                  onChangeText={(v) => updateField(v)}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#86868b"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.helper}>Debe tener al menos 8 caracteres.</Text>
            </View>
          )}

          {step.id === "confirmPassword" && (
            <View>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="********"
                  secureTextEntry={!showConfirmPassword}
                  value={formData.confirmPassword || ""}
                  onChangeText={(v) => updateField(v)}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Feather
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#86868b"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.helper}>Confirma la contraseña.</Text>
            </View>
          )}

          {step.id === "basic" && (
            <View>
              <TextInput
                style={styles.input}
                placeholder="Nombre de la empresa"
                value={formData.companyName || ""}
                onChangeText={(v) => setFormData({ ...formData, companyName: v })}
              />

              {/* Logo opcional */}
              <View style={{ alignItems: "center", marginTop: 20 }}>
                <View style={styles.logoBox}>
                  {logo ? (
                    <Image source={{ uri: logo }} style={{ width: "100%", height: "100%" }} />
                  ) : (
                    <Feather name="image" size={36} color="#86868b" />
                  )}
                </View>
                <TouchableOpacity
                  style={styles.logoButton}
                  onPress={() => console.log("Seleccionar logo (por implementar)")}
                >
                  <Text style={styles.logoText}>Subir logo (opcional)</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {step.id === "contact" && (
            <View>
              <TextInput
                style={styles.input}
                placeholder="Teléfono de contacto"
                keyboardType="phone-pad"
                value={formData.phone || ""}
                onChangeText={(v) => setFormData({ ...formData, phone: v })}
              />
              <TextInput
                style={[styles.input, { marginTop: 12 }]}
                placeholder="Dirección completa"
                multiline
                value={formData.address || ""}
                onChangeText={(v) => setFormData({ ...formData, address: v })}
              />
            </View>
          )}

          {step.id === "details" && (
            <View>
              <TextInput
                style={styles.input}
                placeholder="Sitio web (opcional)"
                value={formData.website || ""}
                onChangeText={(v) => setFormData({ ...formData, website: v })}
              />
              <TextInput
                style={[styles.input, { marginTop: 12, height: 100 }]}
                placeholder="Descripción breve (máx. 200 caracteres)"
                multiline
                maxLength={200}
                value={formData.description || ""}
                onChangeText={(v) => setFormData({ ...formData, description: v })}
              />
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextBtnBlue} onPress={handleNext}>
          <Text style={styles.nextText}>
            {currentStep === steps.length - 1 ? "Crear cuenta de empresa" : "Continuar"}
          </Text>
          <Feather
            name={currentStep === steps.length - 1 ? "check" : "arrow-right"}
            size={18}
            color="#fff"
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backBtn: {
    backgroundColor: "#f5f5f7",
    borderRadius: 40,
    padding: 8,
  },
  stepText: { color: "#86868b", fontSize: 13 },
  progressTrack: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#e5e5ea",
  },
  progressBarBlue: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 3,
    backgroundColor: "#1E90FF",
  },
  iconCircle: {
    alignSelf: "flex-start",
    borderRadius: 20,
    padding: 12,
    marginBottom: 20,
  },
  title: {
    color: "#1a1a1a",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f5f5f7",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 16,
    color: "#1a1a1a",
  },
  helper: {
    color: "#86868b",
    fontSize: 13,
    marginTop: 8,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f7",
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  logoBox: {
    width: 100,
    height: 100,
    backgroundColor: "#f5f5f7",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  logoButton: {
    backgroundColor: "#1E90FF15",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  logoText: { color: "#1E90FF", fontWeight: "600" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#fff",
  },
  nextBtnBlue: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E90FF",
    borderRadius: 16,
    paddingVertical: 14,
  },
  nextText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  // Confirmación
  confirmContainer: { flex: 1, backgroundColor: "#fff" },
  confirmInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  qrShine: {
    width: 128,
    height: 128,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  checkBubble: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: "#1E90FF15",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  confirmTitle: {
    color: "#1a1a1a",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  confirmSubtitle: {
    color: "#86868b",
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
  },
  qrButtonBlue: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#1E90FF",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  qrButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  confirmNote: {
    color: "#86868b",
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
  },
  backGhost: {
    marginTop: 12,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  backGhostText: { color: "#86868b", marginLeft: 6 },
});
