import { Notification } from "../models/Notification";
import NotificationService from "../Services/NotificationService";

const NotificationController = {
  // Obtener las notificaciones del usuario logueado (una sola vez)
  async getMyNotifications(): Promise<Notification[]> {
    return NotificationService.getCurrentUserNotifications();
  },

  // Escuchar en tiempo real las notificaciones del usuario logueado
  subscribeToMyNotifications(
    onChange: (notifications: Notification[]) => void
  ): () => void {
    return NotificationService.subscribeCurrentUserNotifications(onChange);
  },
};

export default NotificationController;
