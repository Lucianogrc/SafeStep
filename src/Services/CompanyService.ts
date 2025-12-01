// src/Services/CompanyService.ts
import {
    addDoc,
    collection,
    doc,
    getDoc,
    onSnapshot,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";
import { Company } from "../models/Company";
import { Emergency } from "../models/Emergency";
import { Hiker } from "../models/Hiker";
import { LocationData } from "../models/Location";
import { auth, db } from "./firebaseConfig";

const CompanyService = {
  // 🔹 Obtener perfil de la empresa autenticada
  async getCurrentCompany(): Promise<Company | null> {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    const ref = doc(db, "companies", currentUser.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    return snap.data() as Company;
  },

  // 🔹 Actualizar perfil de la empresa autenticada
  async updateCurrentCompany(
    data: Partial<Company>
  ): Promise<Company | null> {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    const ref = doc(db, "companies", currentUser.uid);

    await setDoc(
      ref,
      {
        ...data,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as Company) : null;
  },

  // 🔹 Suscribir a ubicaciones de hikers (para el mapa / radar)
  subscribeHikersLocations(
    onChange: (locations: LocationData[]) => void
  ): () => void {
    const ref = collection(db, "hikersLocations");
    return onSnapshot(ref, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      onChange(list as LocationData[]);
    });
  },

  // 🔹 Suscribir a emergencias activas
  subscribeActiveEmergencies(
    onChange: (events: Emergency[]) => void
  ): () => void {
    const ref = collection(db, "emergencies");
    return onSnapshot(ref, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      onChange(list as Emergency[]);
    });
  },

  // ✅ NUEVO: registrar hiker activo para la empresa actual
  async addActiveHikerForCurrentCompany(hiker: Hiker) {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Usuario de empresa no autenticado");

    const ref = collection(
      db,
      "companies",
      currentUser.uid,
      "activeHikers"
    );

    const data = {
      hikerUid: hiker.uid,
      name: hiker.fullName,
      blood: hiker.blood ?? "",
      emergency: hiker.emergency ?? "",
      qrValue: hiker.qrValue ?? "",
      status: "activo",
      checkInAt: serverTimestamp(),
    };

    await addDoc(ref, data);
    return data;
  },

  // ✅ NUEVO: suscripción a hikers activos para la empresa
  subscribeActiveHikersForCurrentCompany(
    callback: (items: any[]) => void
  ): () => void {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Usuario de empresa no autenticado");

    const ref = collection(
      db,
      "companies",
      currentUser.uid,
      "activeHikers"
    );

    return onSnapshot(ref, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(list);
    });
  },
};

export default CompanyService;
