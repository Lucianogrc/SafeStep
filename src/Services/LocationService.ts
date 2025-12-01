// src/Services/LocationService.ts
import {
    collection,
    doc,
    getDoc,
    onSnapshot,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";
import { LocationData } from "../models/Location";
import { auth, db } from "./firebaseConfig";

interface Coords {
  latitude: number;
  longitude: number;
}

const LocationService = {
  // 🔹 Guarda la ubicación actual del usuario (hiker o company)
  async updateCurrentUserLocation(
    role: "hiker" | "company",
    coords: Coords
  ) {
    const user = auth.currentUser;
    if (!user) {
      console.log("[LOC] No hay usuario autenticado, no se guarda ubicación.");
      return;
    }

    console.log("[LOC] Actualizando ubicación en Firestore...", {
      role,
      coords,
    });

    const base: Omit<LocationData, "userId"> = {
      role,
      latitude: coords.latitude,
      longitude: coords.longitude,
      updatedAt: serverTimestamp() as any,
    };

    try {
      if (role === "company") {
        // obtenemos nombre de la empresa
        const companyRef = doc(db, "companies", user.uid);
        const snap = await getDoc(companyRef);
        const data = snap.exists() ? (snap.data() as any) : null;
        const companyName = data?.companyName || "Empresa";

        await setDoc(
          doc(db, "companiesLocations", user.uid),
          {
            ...base,
            companyName,
          },
          { merge: true }
        );

        console.log("[LOC] Ubicación de empresa guardada en companiesLocations");
      } else {
        await setDoc(
          doc(db, "locations", user.uid),
          base,
          { merge: true }
        );
        console.log("[LOC] Ubicación de hiker guardada en locations");
      }
    } catch (err) {
      console.log("[LOC] Error guardando ubicación:", err);
    }
  },

  // 🔹 Suscripción a ubicaciones de empresas (para mapa del hiker)
  subscribeCompaniesLocations(
    onChange: (items: LocationData[]) => void
  ): () => void {
    console.log("[LOC] Subscribiéndose a companiesLocations...");
    const colRef = collection(db, "companiesLocations");

    return onSnapshot(colRef, (snap) => {
      const list: LocationData[] = snap.docs.map((d) => {
        const data = d.data() as any;
        return {
          userId: d.id,
          role: "company",
          latitude: data.latitude,
          longitude: data.longitude,
          updatedAt: data.updatedAt,
          companyName: data.companyName,
        };
      });

      console.log("[LOC] companiesLocations escuchadas:", list.length);
      onChange(list);
    });
  },

  // 🔹 Suscripción a ubicaciones de hikers (para dashboard de empresa)
  subscribeHikersLocations(
    onChange: (items: LocationData[]) => void
  ): () => void {
    console.log("[LOC] Subscribiéndose a locations (hikers)...");
    const colRef = collection(db, "locations");

    return onSnapshot(colRef, (snap) => {
      const list: LocationData[] = snap.docs.map((d) => {
        const data = d.data() as any;
        return {
          userId: d.id,
          role: "hiker",
          latitude: data.latitude,
          longitude: data.longitude,
          updatedAt: data.updatedAt,
        };
      });

      console.log("[LOC] locations de hikers escuchadas:", list.length);
      onChange(list);
    });
  },
};

export default LocationService;
