import { Emergency } from "../models/Emergency";
import EmergencyService from "../Services/EmergencyService";

const EmergencyController = {
  // Crear SOS manual
  async createSOS(lat: number, lng: number) {
    await EmergencyService.createSOSForCurrentUser(lat, lng);
  },

  // Listar emergencias activas una sola vez
  async getActiveEmergencies(): Promise<Emergency[]> {
    return EmergencyService.getActiveEmergencies();
  },

  // Suscripción a emergencias en tiempo casi real
  subscribeToEmergencies(
    onChange: (events: Emergency[]) => void
  ): () => void {
    return EmergencyService.subscribeActiveEmergencies(onChange);
  },

  // Marcar emergencia como resuelta
  async resolveEmergency(id: string) {
    await EmergencyService.resolveEmergency(id);
  },
};

export default EmergencyController;
