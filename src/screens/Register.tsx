import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

interface RegisterProps {
  onBack: () => void;
  onComplete: () => void; // Al tocar "Generar mi QR"
}

const steps = [
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
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [consent, setConsent] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const updateField = (v: any) => setFormData({ ...formData, [step.id]: v });

  const handleNext = () => {
    // Aquí podrías añadir validaciones específicas por paso si lo necesitas
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setShowConfirmation(true);
    }
  };

  const handlePrev = () => {
    if (showConfirmation) {
      setShowConfirmation(false);
      return;
    }
    if (currentStep > 0) setCurrentStep((s) => s - 1);
    else onBack();
  };

  // ---------- Pantalla de confirmación (con botón "Generar mi QR") ----------
  if (showConfirmation) {
    return (
      <View style={styles.confirmContainer}>
        <View style={styles.confirmInner}>
          <Animated.View
            entering={FadeInDown.duration(500)}
            style={{ alignItems: "center", marginBottom: 24 }}
          >
            <View style={styles.qrShine}>
              <MaterialCommunityIcons name="qrcode" size={56} color="#fff" />
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.duration(400).delay(150)}
            style={{ alignItems: "center", marginBottom: 16, paddingHorizontal: 24 }}
          >
            <View style={styles.checkBubble}>
              <Feather name="check" size={28} color="#2E8B57" />
            </View>

            <Text style={[styles.confirmTitle, { marginTop: 8 }]}>
              ¡Listo, tu perfil está configurado!
            </Text>
            <Text style={styles.confirmSubtitle}>
              Ahora puedes generar tu código QR SafeStep y comenzar a explorar de forma segura
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.duration(400).delay(250)}
            style={{ width: "100%", paddingHorizontal: 20 }}
          >
            <TouchableOpacity style={styles.qrButton} onPress={onComplete}>
              <MaterialCommunityIcons name="qrcode" size={22} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.qrButtonText}>Generar mi QR</Text>
            </TouchableOpacity>

            <Text style={styles.confirmNote}>
              Tu información está protegida y solo se compartirá con las empresas administradoras
              cuando ingreses a un parque
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
  // ------------------------------------------------------------------------

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

      {/* Progress track + bar */}
      <View style={styles.progressTrack} />
      <View style={[styles.progressBar, { width: `${progress}%` }]} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.duration(300)} style={{ marginTop: 90 }}>
          {/* Icono del paso */}
          <View style={styles.iconCircle}>
            <Feather name={step.icon as any} size={30} color="#2E8B57" />
          </View>

          {/* Título del paso */}
          <Text style={styles.title}>{step.title}</Text>

          {/* Campo según tipo */}
          {step.type === "select" && step.id === "blood" ? (
            <View style={styles.bloodGrid}>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => (
                <TouchableOpacity
                  key={b}
                  style={[
                    styles.bloodBtn,
                    formData.blood === b && {
                      borderColor: "#2E8B57",
                      backgroundColor: "#2E8B5710",
                    },
                  ]}
                  onPress={() => updateField(b)}
                >
                  <Text
                    style={[
                      styles.bloodText,
                      formData.blood === b && { color: "#2E8B57", fontWeight: "bold" },
                    ]}
                  >
                    {b}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : step.type === "consent" ? (
            <View style={styles.consentBox}>
              <Text style={styles.consentTitle}>Compartir información de seguridad</Text>
              <Text style={styles.consentText}>
                Al aceptar, autorizas a SafeStep a compartir tu información médica y de contacto
                con las empresas administradoras de los parques que visites.
              </Text>

              <View style={{ marginTop: 8 }}>
                <Text style={styles.consentBullets}>• Nombre completo y edad</Text>
                <Text style={styles.consentBullets}>• Tipo de sangre y alergias</Text>
                <Text style={styles.consentBullets}>• Contacto de emergencia</Text>
                <Text style={styles.consentBullets}>• Ubicación en tiempo real</Text>
              </View>

              <TouchableOpacity
                onPress={() => setConsent((c) => !c)}
                style={[
                  styles.consentToggle,
                  consent && { borderColor: "#2E8B57", backgroundColor: "#2E8B5710" },
                ]}
              >
                <Feather
                  name={consent ? "check-square" : "square"}
                  size={22}
                  color={consent ? "#2E8B57" : "#86868b"}
                />
                <Text style={styles.consentLabel}>Acepto compartir mi información</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TextInput
              style={styles.input}
              value={formData[step.id] || ""}
              onChangeText={(v) => updateField(v)}
              placeholder={
                step.id === "name" ? "Juan Pérez García" :
                step.id === "age" ? "25" :
                step.id === "allergies" ? "Ninguna, polen, medicamentos..." :
                step.id === "emergency" ? "+52 1 33 1234 5678" :
                step.id === "address" ? "Calle Principal 123, Col. Centro" :
                step.id === "location" ? "Guadalajara, Jalisco" :
                step.id === "idNumber" ? "ABC123456" :
                step.title
              }
              secureTextEntry={step.type === "password"}
              keyboardType={
                step.type === "email"
                  ? "email-address"
                  : step.type === "number"
                  ? "numeric"
                  : step.type === "tel"
                  ? "phone-pad"
                  : "default"
              }
              autoCapitalize={step.type === "email" ? "none" : "sentences"}
            />
          )}

          {/* Ayudas contextuales */}
          {step.id === "allergies" && (
            <Text style={styles.helper}>Esta información es crucial para emergencias médicas.</Text>
          )}
          {step.id === "emergency" && (
            <Text style={styles.helper}>
              Número de un familiar o amigo que podamos contactar en caso de emergencia.
            </Text>
          )}
          {step.id === "age" && (
            <Text style={styles.helper}>
              Debes ser mayor de 16 años para registrarte de forma independiente.
            </Text>
          )}
        </Animated.View>
      </ScrollView>

      {/* Botones inferiores */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextText}>
            {currentStep === steps.length - 1 ? "Completar registro" : "Continuar"}
          </Text>
          <Feather
            name={currentStep === steps.length - 1 ? "check" : "arrow-right"}
            size={18}
            color="#fff"
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>

        {step.optional && (
          <TouchableOpacity onPress={handleNext}>
            <Text style={styles.skipText}>Omitir este paso</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Layout base
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

  // Progreso
  progressTrack: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#e5e5ea",
  },
  progressBar: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 3,
    backgroundColor: "#2E8B57",
  },

  // Paso
  iconCircle: {
    alignSelf: "flex-start",
    backgroundColor: "#2E8B5715",
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
    marginTop: 10,
  },

  // Sangre
  bloodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  bloodBtn: {
    width: "22%",
    height: 50,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  bloodText: { color: "#555" },

  // Consentimiento
  consentBox: {
    backgroundColor: "#f5f5f7",
    borderRadius: 20,
    padding: 20,
  },
  consentTitle: { fontWeight: "600", fontSize: 16, color: "#1a1a1a", marginBottom: 6 },
  consentText: { color: "#86868b", fontSize: 13, marginBottom: 12 },
  consentBullets: { color: "#86868b", fontSize: 12, marginTop: 2 },
  consentToggle: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e5ea",
    borderRadius: 14,
    padding: 10,
    marginTop: 10,
  },
  consentLabel: { color: "#1a1a1a", marginLeft: 8 },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#fff",
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2E8B57",
    borderRadius: 16,
    paddingVertical: 14,
  },
  nextText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  skipText: { color: "#86868b", textAlign: "center", marginTop: 8 },

  // Confirmación (QR)
  confirmContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
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
    backgroundColor: "#2E8B57",
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
    backgroundColor: "#2E8B5715",
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
  qrButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#2E8B57",
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
    gap: 6,
  },
  backGhostText: { color: "#86868b", marginLeft: 6 },
});
