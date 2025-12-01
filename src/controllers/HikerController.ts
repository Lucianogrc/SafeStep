 // src/controllers/HikerController.ts
import { Hiker } from "../models/Hiker";
import EmergencyService from "../Services/EmergencyService";
import { HikerService } from "../Services/HikerService";
import LocationService from "../Services/LocationService";

const HikerController = {
  // Perfil actual del hiker
  async getCurrentHikerProfile(): Promise<Hiker | null> {
    return HikerService.getCurrentHiker();
  },

  // Actualizar datos del hiker
  async updateHikerProfile(
    data: Partial<Hiker>
  ): Promise<Hiker | null> {
    return HikerService.updateCurrentHiker(data);
  },

  // Guardar posición actual (para que la empresa vea hikers activos)
  async updateCurrentLocation(latitude: number, longitude: number) {
    await LocationService.updateCurrentUserLocation("hiker", {
      latitude,
      longitude,
    });
  },

  // Enviar SOS (desde botón de emergencia del hiker)
  async sendSOS(latitude: number, longitude: number) {
    await EmergencyService.createSOSForCurrentUser(latitude, longitude);
  },
};

export default HikerController;
