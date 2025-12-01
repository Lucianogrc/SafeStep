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

  // Campo antiguo
  qrCodeId?: string;

  // Nuevo campo que usamos para buscar por QR (ej. "HST-XXXXXX")
  qrValue?: string;
}
