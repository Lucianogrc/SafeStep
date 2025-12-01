import { Company } from "../models/Company";
import { Emergency } from "../models/Emergency";
import { LocationData } from "../models/Location";

// 👇 TODO usa siempre "Services" con S mayúscula
import CompanyService from "../Services/CompanyService";
import EmergencyService from "../Services/EmergencyService";
import LocationService from "../Services/LocationService";

const CompanyController = {
  async getCurrentCompanyProfile(): Promise<Company | null> {
    return CompanyService.getCurrentCompany();
  },

  async updateCompanyProfile(
    data: Partial<Company>
  ): Promise<Company | null> {
    return CompanyService.updateCurrentCompany(data);
  },

  // Hikers activos cerca de la empresa
  subscribeToActiveHikers(
    onChange: (locations: LocationData[]) => void
  ): () => void {
    return LocationService.subscribeHikersLocations(onChange);
  },

  // Emergencias activas (para dashboard de empresa)
  subscribeToEmergencies(
    onChange: (events: Emergency[]) => void
  ): () => void {
    return EmergencyService.subscribeActiveEmergencies(onChange);
  },
};

export default CompanyController;
