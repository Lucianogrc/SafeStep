// src/Services/HikerService.ts
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import { Hiker } from "../models/Hiker";
import { db } from "./firebaseConfig";

export interface RegisterHikerInput {
  email: string;
  password: string;
  name: string;
  age?: string;
  blood?: string;
  allergies?: string;
  emergency?: string;
  address?: string;
  location?: string;
  idNumber?: string;
  consent: boolean;
  height?: string;
  weight?: string;
}

export class HikerService {
  // 🔹 Registro de hiker
  static async registerHiker(input: RegisterHikerInput): Promise<string> {
    const auth = getAuth();
    const { email, password } = input;

    // 1) Crear usuario en Authentication
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    // 2) Guardar perfil en colección "users"
    const hikerDoc: Hiker = {
      uid,
      email,
      role: "hiker",
      createdAt: serverTimestamp() as any,
      fullName: input.name,
      age: input.age ?? "",
      blood: input.blood ?? "",
      allergies: input.allergies ?? "",
      emergency: input.emergency ?? "",
      address: input.address ?? "",
      location: input.location ?? "",
      idNumber: input.idNumber ?? "",
      consent: input.consent,
      height: input.height ?? "",
      weight: input.weight ?? "",
      qrCodeId: "",
      // El qrValue se genera luego en la pantalla de QR
      qrValue: "",
    };

    await setDoc(doc(db, "users", uid), hikerDoc as any);

    return uid;
  }

  // 🔹 Obtener el perfil del hiker autenticado
  static async getCurrentHiker(): Promise<Hiker | null> {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    const ref = doc(db, "users", currentUser.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const data = snap.data() as any;

    const hiker: Hiker = {
      uid: currentUser.uid,
      email: data.email,
      role: data.role,
      createdAt: data.createdAt,
      fullName: data.fullName,
      age: data.age,
      blood: data.blood,
      allergies: data.allergies,
      emergency: data.emergency,
      address: data.address,
      location: data.location,
      idNumber: data.idNumber,
      consent: data.consent,
      height: data.height,
      weight: data.weight,
      qrCodeId: data.qrCodeId,
      qrValue: data.qrValue,
    };

    return hiker;
  }

  // 🔹 Actualizar datos del hiker autenticado
  static async updateCurrentHiker(
    data: Partial<Hiker>
  ): Promise<Hiker | null> {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    const ref = doc(db, "users", currentUser.uid);

    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    const snap = await getDoc(ref);
    return (snap.data() as Hiker) ?? null;
  }

  // 🔹 Buscar un hiker por su qrValue (ej: "HST-XXXXXX")
  static async getHikerByQrValue(qrValue: string): Promise<Hiker | null> {
    const q = query(
      collection(db, "users"),
      where("qrValue", "==", qrValue),
      where("role", "==", "hiker")
    );

    const snap = await getDocs(q);
    if (snap.empty) return null;

    const docSnap = snap.docs[0];
    const data = docSnap.data() as any;

    const hiker: Hiker = {
      uid: docSnap.id,
      email: data.email,
      role: data.role,
      createdAt: data.createdAt,
      fullName: data.fullName,
      age: data.age,
      blood: data.blood,
      allergies: data.allergies,
      emergency: data.emergency,
      address: data.address,
      location: data.location,
      idNumber: data.idNumber,
      consent: data.consent,
      height: data.height,
      weight: data.weight,
      qrCodeId: data.qrCodeId,
      qrValue: data.qrValue,
    };

    return hiker;
  }
}
