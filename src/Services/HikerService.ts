// src/Services/HikerService.ts
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
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
      qrCodeId: "", // luego lo llenamos cuando generes el QR
    };

    await setDoc(doc(db, "users", uid), hikerDoc as any);

    return uid;
  }
}
