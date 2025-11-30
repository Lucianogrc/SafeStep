import { LocationData } from "../models/Location";
import LocationService from "../Services/LocationService";

const LocationController = {
  // Guardar localización actual del usuario
  async updateMyLocation(role: "hiker" | "company", lat: number, lng: number) {
    await LocationService.updateCurrentUserLocation(role, {
      latitude: lat,
      longitude: lng,
    });
  },

  // Suscripción a ubicaciones de empresas (mapa de Hiker)
  subscribeCompaniesLocations(
    onChange: (companies: LocationData[]) => void
  ): () => void {
    return LocationService.subscribeCompaniesLocations(onChange);
  },

  // Suscripción a ubicaciones de hikers (empresa)
  subscribeHikersLocations(
    onChange: (hikers: LocationData[]) => void
  ): () => void {
    return LocationService.subscribeHikersLocations(onChange);
  },
};

export default LocationController;
