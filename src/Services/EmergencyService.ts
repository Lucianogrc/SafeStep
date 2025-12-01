import { getAuth } from "firebase/auth";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { Emergency } from "../models/Emergency";
import { db } from "./firebaseConfig";

const COLLECTION = "emergencies";

const EmergencyService = {
  // Crear SOS para el usuario actual
  async createSOSForCurrentUser(lat: number, lng: number) {
    const auth = getAuth();
    if (!auth.currentUser) throw new Error("No hay usuario autenticado");

    const uid = auth.currentUser.uid;

    // intentamos leer rol desde colección users/companies
    let role: "hiker" | "company" = "hiker";
    const userSnap = await getDoc(doc(db, "users", uid));
    if (userSnap.exists()) {
      const data = userSnap.data() as any;
      if (data.role === "company") role = "company";
    }

    await addDoc(collection(db, COLLECTION), {
      userId: uid,
      userRole: role,
      latitude: lat,
      longitude: lng,
      status: "active",
      createdAt: Date.now(),
      resolvedAt: null,
    });
  },

  // Lista simple de emergencias activas
  async getActiveEmergencies(): Promise<Emergency[]> {
    const q = query(
      collection(db, COLLECTION),
      where("status", "==", "active"),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Emergency[];
  },

  // Suscripción para dashboard de empresa
  subscribeActiveEmergencies(
    onChange: (events: Emergency[]) => void
  ): () => void {
    const q = query(
      collection(db, COLLECTION),
      where("status", "==", "active"),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Emergency[];
      onChange(arr);
    });
  },

  // Marcar emergencia como resuelta
  async resolveEmergency(id: string) {
    const ref = doc(db, COLLECTION, id);
    await updateDoc(ref, {
      status: "resolved",
      resolvedAt: Date.now(),
    });
  },
};

export default EmergencyService;
