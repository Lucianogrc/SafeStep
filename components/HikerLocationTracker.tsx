// components/HikerLocationTracker.tsx
import React, { useEffect } from "react";
import * as Location from "expo-location";
import { auth } from "../src/Services/firebaseConfig";
import LocationService from "../src/Services/LocationService";

const HikerLocationTracker: React.FC = () => {
  useEffect(() => {
    let intervalId: any = null; // usamos any para evitar el error de Timeout / number

    const startLocationUpdates = async () => {
      try {
        const user = auth.currentUser;
        console.log("[HIKER_TRACKER] UID actual:", user?.uid);

        if (!user) {
          console.log(
            "[HIKER_TRACKER] No hay usuario autenticado, no se trackea ubicación"
          );
          return;
        }

        console.log("[HIKER_TRACKER] Solicitando permisos de ubicación...");
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          console.log(
            "[HIKER_TRACKER] Permiso de ubicación denegado, no se enviará ubicación"
          );
          return;
        }

        const sendLocationOnce = async () => {
          try {
            const loc = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });

            console.log(
              "[HIKER_TRACKER] Ubicación obtenida:",
              loc.coords
            );

            console.log("[HIKER_TRACKER] Enviando ubicación a Firestore…");
            await LocationService.updateCurrentUserLocation("hiker", {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            });

            console.log(
              "[HIKER_TRACKER] Ubicación de hiker guardada en locations"
            );
          } catch (e) {
            console.log(
              "[HIKER_TRACKER] Error enviando ubicación:",
              e
            );
          }
        };

        // Enviar una vez al arrancar
        await sendLocationOnce();

        // Y luego cada 30 segundos
        intervalId = setInterval(sendLocationOnce, 30000);
      } catch (err) {
        console.log("[HIKER_TRACKER] Error general en tracking:", err);
      }
    };

    startLocationUpdates();

    return () => {
      if (intervalId) {
        console.log("[HIKER_TRACKER] Limpiando intervalo de ubicación");
        clearInterval(intervalId);
      }
    };
  }, []);

  // No renderiza nada, solo hace side-effects
  return null;
};

export default HikerLocationTracker;
