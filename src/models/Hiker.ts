// src/models/Hiker.ts
import { User } from "./User";

export interface Hiker extends User {
  fullName: string;
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

  // 🔹 Campo que usábamos en el service
  qrCodeId?: string;
}
