// src/models/User.ts
export type UserRole = "hiker" | "company";

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  createdAt: any; // Firestore Timestamp o Date
}
