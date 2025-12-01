// src/controllers/AuthController.ts
import { AuthService } from "../Services/AuthService";

export class AuthController {
  static async login(email: string, password: string) {
    return AuthService.login(email, password);
  }

  static async logout() {
    return AuthService.logout();
  }

  static currentUser() {
    return AuthService.getCurrentUser();
  }
}
