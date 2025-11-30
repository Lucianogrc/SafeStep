// src/controllers/QRController.ts
import { QRService } from "../Services/QRService";

export class QRController {
  static async saveUserQR(userId: string, qrValue: string) {
    return QRService.saveUserQR(userId, qrValue);
  }
}
