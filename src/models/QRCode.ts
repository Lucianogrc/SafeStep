// src/models/QRCode.ts
export interface QRCodeData {
  // 🔹 Para poder usarlo como id de documento
  id?: string;

  userId: string;
  qrValue: string;
  createdAt: any; // Firestore Timestamp o Date
}
