// src/Services/AuthService.ts
import { getAuth, signInWithEmailAndPassword, signOut, User } from "firebase/auth";

export class AuthService {
  static async login(email: string, password: string): Promise<User> {
    const auth = getAuth();
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  }

  static async logout(): Promise<void> {
    const auth = getAuth();
    await signOut(auth);
  }

  static getCurrentUser(): User | null {
    const auth = getAuth();
    return auth.currentUser;
  }
}
