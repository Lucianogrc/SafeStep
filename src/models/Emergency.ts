export interface Emergency {
  id: string;
  userId: string;
  timestamp: number;
  latitude: number;
  longitude: number;
  resolved: boolean;
}
