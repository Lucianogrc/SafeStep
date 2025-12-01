import { getAuth } from "firebase/auth";
import {
    addDoc,
    collection,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { Notification } from "../models/Notification";
import { db } from "./firebaseConfig";

const COLLECTION = "notifications";

const NotificationService = {
  async getCurrentUserNotifications(): Promise<Notification[]> {
    const auth = getAuth();
    if (!auth.currentUser) return [];

    const q = query(
      collection(db, COLLECTION),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Notification[];
  },

  subscribeCurrentUserNotifications(
    onChange: (notifications: Notification[]) => void
  ): () => void {
    const auth = getAuth();
    if (!auth.currentUser) {
      onChange([]);
      return () => {};
    }

    const q = query(
      collection(db, COLLECTION),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Notification[];
      onChange(arr);
    });
  },

  async markAllAsReadForCurrentUser() {
    const auth = getAuth();
    if (!auth.currentUser) return;

    const q = query(
      collection(db, COLLECTION),
      where("userId", "==", auth.currentUser.uid),
      where("read", "==", false)
    );

    const snap = await getDocs(q);
    const batchPromises = snap.docs.map((d) =>
      updateDoc(d.ref, { read: true })
    );
    await Promise.all(batchPromises);
  },

  async sendNotificationToUser(
    userId: string,
    payload: { title: string; message: string; icon?: string; color?: string }
  ) {
    await addDoc(collection(db, COLLECTION), {
      userId,
      title: payload.title,
      message: payload.message,
      icon: payload.icon || "alert-circle",
      color: payload.color || "#1E90FF",
      read: false,
      createdAt: Date.now(),
    });
  },
};

export default NotificationService;
