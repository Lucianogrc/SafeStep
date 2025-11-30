// src/Services/QRService.ts
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { QRCodeData } from "../models/QRCode";
import { db } from "./firebaseConfig";

export class QRService {
  /**
   * Guarda el valor del QR dentro del documento del usuario
   * y devuelve la info del QR.
   */
  static async saveUserQR(userId: string, qrValue: string): Promise<QRCodeData> {
    const data: QRCodeData = {
      id: userId,
      userId,
      qrValue,
      createdAt: serverTimestamp() as any,
    };

    await updateDoc(doc(db, "users", userId), {
      userId: data.userId,
      qrValue: data.qrValue,
    });

    return data;
  }
}
