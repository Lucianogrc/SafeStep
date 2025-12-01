// src/models/Location.ts

export interface LocationData {
  userId: string;                    // uid del usuario (hiker o empresa)
  role: "hiker" | "company";
  latitude: number;
  longitude: number;
  updatedAt: any;                    // Firestore Timestamp
  companyName?: string;              // solo cuando role === "company"
}
