import { getAuth } from "firebase/auth";
import {
    collection,
    doc,
    DocumentData,
    onSnapshot,
    QuerySnapshot,
    setDoc,
} from "firebase/firestore";
import { LocationData } from "../models/Location";
import { db } from "./firebaseConfig";

const LocationService = {
  // Actualiza ubicación del usuario actual (hiker o empresa)
  async updateCurrentUserLocation(
    role: "hiker" | "company",
    coords: { latitude: number; longitude: number }
  ) {
    const auth = getAuth();
    if (!auth.currentUser) throw new Error("No hay usuario autenticado");

    const uid = auth.currentUser.uid;
    const now = Date.now();

    if (role === "hiker") {
      const ref = doc(db, "hikersLocations", uid);
      await setDoc(
        ref,
        {
          userId: uid,
          role: "hiker",
          latitude: coords.latitude,
          longitude: coords.longitude,
          updatedAt: now,
        },
        { merge: true }
      );
    } else {
      const ref = doc(db, "companiesLocations", uid);
      await setDoc(
        ref,
        {
          companyId: uid,
          latitude: coords.latitude,
          longitude: coords.longitude,
          updatedAt: now,
        },
        { merge: true }
      );
    }
  },

  // Suscripción a empresas (para el mapa de Hiker)
  subscribeCompaniesLocations(
    onChange: (items: LocationData[]) => void
  ): () => void {
    const colRef = collection(db, "companiesLocations");
    return onSnapshot(colRef, (snap: QuerySnapshot<DocumentData>) => {
      const arr: LocationData[] = snap.docs.map((docSnap) => {
        const d = docSnap.data() as any;
        return {
          id: docSnap.id,
          userId: d.companyId,
          role: "company",
          latitude: d.latitude,
          longitude: d.longitude,
          name: d.companyName,
          updatedAt: d.updatedAt || 0,
        };
      });
      onChange(arr);
    });
  },

  // Suscripción a hikers (para que la empresa vea quién está activo)
  subscribeHikersLocations(
    onChange: (items: LocationData[]) => void
  ): () => void {
    const colRef = collection(db, "hikersLocations");
    return onSnapshot(colRef, (snap: QuerySnapshot<DocumentData>) => {
      const arr: LocationData[] = snap.docs.map((docSnap) => {
        const d = docSnap.data() as any;
        return {
          id: docSnap.id,
          userId: d.userId,
          role: "hiker",
          latitude: d.latitude,
          longitude: d.longitude,
          name: d.fullName,
          updatedAt: d.updatedAt || 0,
        };
      });
      onChange(arr);
    });
  },
};

export default LocationService;
