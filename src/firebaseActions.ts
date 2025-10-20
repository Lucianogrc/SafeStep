import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import {
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";
import { Alert } from "react-native";
import { auth, db } from "./firebaseConfig";

// 🟢 Tipado de los datos del formulario de registro
interface HikerFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  name: string;
  age?: string;
  blood?: string;
  allergies?: string;
  emergency?: string;
  address?: string;
  location?: string;
  idNumber?: string;
  consent?: boolean;
  onComplete?: () => void;
}

// 🟢 Generador de ID y QR únicos
const generateUniqueId = () => {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `HST-${new Date().getFullYear()}-${randomPart}`;
};

// 🟢 Función para registrar nuevo usuario tipo Hiker
export const registerHiker = async (formData: HikerFormData) => {
  try {
    // 1️⃣ Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );
    const user = userCredential.user;

    // 2️⃣ Generar ID y valor QR únicos
    const userId = generateUniqueId();
    const qrValue = `${userId}-${Math.random().toString(36).substring(2, 10)}`;

    // 3️⃣ Guardar información adicional en Firestore
    const userData = {
      fullName: formData.name,
      email: formData.email,
      age: formData.age || "",
      blood: formData.blood || "",
      allergies: formData.allergies || "",
      emergency: formData.emergency || "",
      address: formData.address || "",
      location: formData.location || "",
      idNumber: formData.idNumber || "",
      consent: formData.consent || false,
      role: "hiker",
      userId, // ✅ ID único
      qrValue, // ✅ Valor QR permanente
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, "users", user.uid), userData);

    // 4️⃣ Guardar datos localmente para persistencia
    await AsyncStorage.setItem("userData", JSON.stringify({
      uid: user.uid,
      ...userData,
    }));

    // 5️⃣ Mostrar alerta de bienvenida
    Alert.alert("Cuenta creada", "Bienvenido a SafeStep 🌿", [
      { text: "Continuar", onPress: formData.onComplete },
    ]);
  } catch (error: any) {
    console.error("❌ Error registrando hiker:", error);

    if (error.code === "auth/email-already-in-use") {
      Alert.alert("Error", "Este correo ya está en uso. Inicia sesión o usa otro correo.");
    } else if (error.code === "auth/invalid-email") {
      Alert.alert("Error", "El correo electrónico no es válido.");
    } else {
      Alert.alert("Error", "No se pudo crear la cuenta. Intenta nuevamente.");
    }

    throw error;
  }
};

// 🟣 Tipado del resultado del inicio de sesión
export interface SignInResult {
  uid: string;
  role: "hiker" | "company";
  email: string | null;
  fullName?: string;
  userId?: string;
  qrValue?: string;
}

// 🟣 Función para iniciar sesión
export const signInUser = async (
  email: string,
  password: string
): Promise<SignInResult> => {
  try {
    // 1️⃣ Autenticación con Firebase
    const cred = await signInWithEmailAndPassword(auth, email, password);

    // 2️⃣ Obtener datos del usuario desde Firestore
    let role: "hiker" | "company" = "hiker";
    let fullName = "";
    let userId = "";
    let qrValue = "";

    try {
      const snap = await getDoc(doc(db, "users", cred.user.uid));
      if (snap.exists()) {
        const data = snap.data() as {
          role?: "hiker" | "company";
          fullName?: string;
          userId?: string;
          qrValue?: string;
        };

        if (data?.role === "company") role = "company";
        fullName = data?.fullName || "";
        userId = data?.userId || "";
        qrValue = data?.qrValue || "";

        // 💾 Guarda sesión localmente
        await AsyncStorage.setItem(
          "userData",
          JSON.stringify({
            uid: cred.user.uid,
            email: cred.user.email,
            role,
            fullName,
            userId,
            qrValue,
          })
        );
      }
    } catch (err) {
      console.log("⚠️ No se pudo obtener el rol del usuario:", err);
    }

    return {
      uid: cred.user.uid,
      role,
      email: cred.user.email,
      fullName,
      userId,
      qrValue,
    };
  } catch (error: any) {
    console.error("❌ Error iniciando sesión:", error);

    if (error.code === "auth/invalid-credential") {
      Alert.alert("Error", "Correo o contraseña incorrectos.");
    } else {
      Alert.alert("Error", error.message || "No se pudo iniciar sesión.");
    }

    throw error;
  }
};

// 🔴 Función para cerrar sesión completamente
export const logout = async () => {
  try {
    await signOut(auth);
    await AsyncStorage.removeItem("userData");
  } catch (error) {
    console.error("Error cerrando sesión:", error);
  }
};

// 🟢 Recuperar usuario guardado localmente (al abrir la app)
export const getStoredUser = async () => {
  try {
    const stored = await AsyncStorage.getItem("userData");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error leyendo usuario local:", error);
    return null;
  }
};
