// src/controllers/QRController.ts
import CompanyService from "../Services/CompanyService";
import { HikerService } from "../Services/HikerService";

export class QRController {
  static async saveUserQR(userId: string, qrValue: string) {
    console.log("saveUserQR llamado con:", userId, qrValue);
    // Si luego quieres guardar algo más, puedes usar aquí un QRService
  }

  /**
   * Recibe el texto crudo del QR (URL o solo el código),
   * extrae el qrValue (HST-XXXXXX),
   * busca al hiker y lo registra como activo en la empresa actual.
   */
  static async checkInHikerFromQr(rawQrText: string) {
    if (!rawQrText) {
      throw new Error("Código QR vacío.");
    }

    let qrValue = rawQrText.trim();

    // Si viene en formato URL, me quedo con lo que va después del último '/'
    if (qrValue.includes("/")) {
      qrValue = qrValue.split("/").pop() || qrValue;
    }

    // Validar / normalizar formato HST-XXXXXX
    const match = qrValue.match(/HST-[A-Z0-9]+/i);
    if (match) {
      qrValue = match[0].toUpperCase();
    }

    if (!qrValue.startsWith("HST-")) {
      throw new Error("Formato de código QR no válido.");
    }

    // 1) Buscar hiker por qrValue
    const hiker = await HikerService.getHikerByQrValue(qrValue);
    if (!hiker) {
      throw new Error("No se encontró ningún hiker con este código QR.");
    }

    // 2) Registrar como activo en la empresa actual
    await CompanyService.addActiveHikerForCurrentCompany(hiker);

    return hiker;
  }
}

export default QRController;
