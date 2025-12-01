// src/screens/CompanyScanQRScreen.tsx

import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import React, { useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { auth, db } from "../Services/firebaseConfig";
import { HikerService } from "../Services/HikerService";

interface CompanyScanQRScreenProps {
  onBack: () => void;
}

export default function CompanyScanQRScreen({ onBack }: CompanyScanQRScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);

  // 🔐 Flag para evitar lecturas múltiples del mismo QR
  const isProcessing = useRef(false);

  // Extraer el qrValue tipo "HST-XXXXXX" del texto del QR
  const extractQrValue = (raw: string): string | null => {
    if (!raw) return null;

    // 1) Si el QR es una URL tipo https://safestep.app/user/HST-XXXXXX
    const parts = raw.split("/");
    const last = parts[parts.length - 1];
    if (last.startsWith("HST-")) return last;

    // 2) Fallback: buscar patrón HST-XXXXX dentro del texto
    const match = raw.match(/HST-[A-Z0-9]+/i);
    return match ? match[0] : null;
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (isProcessing.current) {
      console.log("[SCAN] Ignorado porque ya se está procesando otro QR");
      return;
    }
    isProcessing.current = true;
    setLoading(true);

    console.log("[SCAN] RAW data:", data);

    try {
      const qrValue = extractQrValue(data);
      console.log("[SCAN] qrValue extraído:", qrValue);

      if (!qrValue) {
        Alert.alert(
          "QR no válido",
          "No se encontró un código HST-XXXXXX en el QR."
        );
        return;
      }

      const company = auth.currentUser;
      if (!company) {
        Alert.alert("Error", "No hay una empresa autenticada.");
        return;
      }

      // Buscar hiker por qrValue en Firestore
      const hiker = await HikerService.getHikerByQrValue(qrValue);
      console.log("[SCAN] Hiker encontrado:", hiker);

      if (!hiker) {
        Alert.alert(
          "No encontrado",
          "No se encontró ningún hiker con este código QR."
        );
        return;
      }

      // Evitar duplicados en activeHikers
      const activeRef = collection(db, "companies", company.uid, "activeHikers");
      const q = query(
        activeRef,
        where("hikerUid", "==", hiker.uid),
        where("status", "==", "activo")
      );
      const activeSnap = await getDocs(q);

      if (!activeSnap.empty) {
        console.log("[SCAN] Hiker ya estaba activo");
        Alert.alert(
          "Ya activo",
          `${hiker.fullName} ya está registrado como activo en tu parque.`
        );
        return;
      }

      // Guardar como activo dentro de la empresa
      const newDoc = await addDoc(activeRef, {
        hikerUid: hiker.uid,
        name: hiker.fullName,
        blood: hiker.blood ?? "",
        status: "activo",
        checkInAt: serverTimestamp(),
      });

      console.log("[SCAN] Hiker agregado a activeHikers con id:", newDoc.id);

      // 🔥 Registrar lugar en el documento del usuario (users/{uid}.places[])
      try {
        const companyRef = doc(db, "companies", company.uid);
        const companySnap = await getDoc(companyRef);
        const companyData = companySnap.exists()
          ? (companySnap.data() as any)
          : null;
        const companyName = companyData?.companyName || "Parque";

        const userRef = doc(db, "users", hiker.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data() as any;

          // Si places no es un array, lo forzamos a []
          const rawPlaces: any[] = Array.isArray(userData.places)
            ? userData.places
            : [];

          console.log("[SCAN] places actuales en usuario:", rawPlaces);

          // ❌ NO usamos serverTimestamp() dentro del array (da error)
          const now = new Date();

          // Buscar si ya existe ese parque para este hiker
          const index = rawPlaces.findIndex(
            (p: any) => p.companyId === company.uid
          );

          let updatedPlaces: any[];

          if (index >= 0) {
            // ya existía este parque → solo actualizamos datos
            updatedPlaces = [...rawPlaces];
            updatedPlaces[index] = {
              ...updatedPlaces[index],
              active: true,
              lastCheckInAt: now,
            };
          } else {
            // nuevo parque para este hiker
            updatedPlaces = [
              ...rawPlaces,
              {
                companyId: company.uid,
                companyName,
                active: true,
                lastCheckInAt: now,
              },
            ];
          }

          console.log(
            "[SCAN] places que se escribirán en usuario:",
            updatedPlaces
          );

          await updateDoc(userRef, { places: updatedPlaces });
          console.log("[SCAN] places actualizados en usuario OK");
        } else {
          console.log("[SCAN] user doc no existe para hiker:", hiker.uid);
        }
      } catch (e) {
        console.log("[SCAN] Error actualizando places del usuario:", e);
      }

      Alert.alert(
        "Hiker registrado",
        `${hiker.fullName} ahora está activo en tu parque.`,
        [
          {
            text: "OK",
            onPress: () => {
              console.log("[SCAN] Volver al dashboard");
              onBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error al procesar QR:", error);
      Alert.alert("Error", "Ocurrió un problema al registrar al hiker.");
    } finally {
      setLoading(false);
      isProcessing.current = false;
    }
  };

  // ⛔️ Permisos de cámara
  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Necesitamos acceso a la cámara para escanear códigos QR.
        </Text>
        <TouchableOpacity
          style={styles.permissionBtn}
          onPress={requestPermission}
        >
          <Text style={styles.permissionBtnText}>Dar permiso</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header simple */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.headerBackBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Escanear código QR</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Cámara */}
      <View style={styles.cameraWrapper}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        />

        {/* Marco de guía */}
        <View style={styles.overlay}>
          <View style={styles.box} />
        </View>
      </View>

      {/* Estado */}
      <View style={styles.bottom}>
        {loading ? (
          <>
            <ActivityIndicator color="#1E90FF" />
            <Text style={styles.bottomText}>Procesando código...</Text>
          </>
        ) : (
          <Text style={styles.bottomText}>
            Apunta la cámara al código QR del hiker.
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#000",
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#444",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cameraWrapper: {
    flex: 1,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: 260,
    height: 260,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "#1E90FF",
    backgroundColor: "transparent",
  },
  bottom: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#000",
    borderTopWidth: 1,
    borderColor: "#111",
  },
  bottomText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  permissionText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 15,
    marginBottom: 16,
  },
  permissionBtn: {
    backgroundColor: "#1E90FF",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  permissionBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  backText: {
    color: "#fff",
    marginLeft: 6,
  },
});
