import { Ionicons } from "@expo/vector-icons";
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { MapPressEvent, Marker } from "react-native-maps";
import TabBar from "../../components/ui/TabBar";
import { auth, db } from "../firebaseConfig";

interface CompanyMapProps {
  onTabChange: (tab: string) => void;
}

export default function CompanyMap({ onTabChange }: CompanyMapProps) {
  const [companyLocation, setCompanyLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [companyName, setCompanyName] = useState("");

  // 🔹 Cargar ubicación registrada
  useEffect(() => {
    const fetchCompanyLocation = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      try {
        const docRef = doc(db, "companiesLocations", uid);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setCompanyLocation({ latitude: data.latitude, longitude: data.longitude });
          setCompanyName(data.companyName || "");
        }
      } catch (error) {
        console.error("Error cargando ubicación de empresa:", error);
      }
    };

    fetchCompanyLocation();
  }, []);

  // 🔹 Al tocar el mapa
  const handleMapPress = (event: MapPressEvent) => {
    if (!isEditing) return;
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setCompanyLocation({ latitude, longitude });
    setShowNameModal(true); // mostrar formulario
  };

  // 🔹 Guardar en Firestore
  const saveCompanyData = async () => {
    if (!companyName.trim()) {
      Alert.alert("Nombre requerido", "Por favor ingresa el nombre de la empresa.");
      return;
    }

    try {
      const uid = auth.currentUser?.uid;
      if (!uid || !companyLocation) return;

      await setDoc(doc(db, "companiesLocations", uid), {
        companyId: uid,
        companyName: companyName.trim(),
        latitude: companyLocation.latitude,
        longitude: companyLocation.longitude,
        updatedAt: serverTimestamp(),
      });

      setShowNameModal(false);
      setIsEditing(false);
      Alert.alert("Ubicación registrada", "La ubicación y nombre de tu empresa han sido guardados.");
    } catch (error) {
      console.error("Error guardando ubicación:", error);
      Alert.alert("Error", "No se pudo guardar la información. Intenta nuevamente.");
    }
  };

  // 🔹 Eliminar ubicación
  const deleteCompanyLocation = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || !companyLocation) return;

    Alert.alert(
      "Eliminar ubicación",
      "¿Estás seguro de eliminar la ubicación de tu empresa?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "companiesLocations", uid));
              setCompanyLocation(null);
              setCompanyName("");
              setIsEditing(false);
              Alert.alert("Ubicación eliminada", "Tu empresa ha sido eliminada del mapa.");
            } catch (error) {
              console.error("Error eliminando ubicación:", error);
              Alert.alert("Error", "No se pudo eliminar la ubicación. Intenta nuevamente.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Ubicación de la Empresa</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {companyLocation && (
            <TouchableOpacity
              onPress={deleteCompanyLocation}
              style={[styles.editBtn, { backgroundColor: "#FF3B3015" }]}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              <Text style={[styles.editText, { color: "#FF3B30" }]}>Eliminar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => setIsEditing(!isEditing)}
            style={[styles.editBtn, isEditing && { backgroundColor: "#1E90FF20" }]}
          >
            <Ionicons
              name={isEditing ? "checkmark-circle-outline" : "location-outline"}
              size={22}
              color="#1E90FF"
            />
            <Text style={styles.editText}>
              {isEditing ? "Confirmar" : companyLocation ? "Editar" : "Marcar ubicación"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Mapa */}
      <MapView
        style={styles.map}
        onPress={handleMapPress}
        initialRegion={{
          latitude: companyLocation?.latitude || 20.6597,
          longitude: companyLocation?.longitude || -103.3496,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {companyLocation && (
          <Marker
            coordinate={companyLocation}
            title={companyName || "Tu empresa"}
            description="Ubicación registrada"
            pinColor="#1E90FF"
          />
        )}
      </MapView>

      {/* Texto informativo */}
      <View style={styles.infoBox}>
        {!companyLocation ? (
          <Text style={styles.infoText}>
            No tienes una ubicación registrada. Toca el mapa para marcarla.
          </Text>
        ) : (
          <Text style={styles.infoText}>
            {isEditing
              ? "Toca el mapa para actualizar la ubicación."
              : `Ubicación registrada: ${companyName || "Sin nombre"}`}
          </Text>
        )}
      </View>

      {/* Modal para ingresar nombre */}
      <Modal visible={showNameModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Nombre de la Empresa</Text>
            <TextInput
              placeholder="Ej. Café Hulum"
              placeholderTextColor="#aaa"
              value={companyName}
              onChangeText={setCompanyName}
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#ccc" }]}
                onPress={() => {
                  setShowNameModal(false);
                  setIsEditing(false);
                }}
              >
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#1E90FF" }]}
                onPress={saveCompanyData}
              >
                <Text style={[styles.btnText, { color: "#fff" }]}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* TabBar */}
      <TabBar variant="company" activeTab="map" onTabChange={onTabChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  title: { fontSize: 18, fontWeight: "600", color: "#1a1a1a" },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f5f5f7",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  editText: { color: "#1E90FF", fontWeight: "500", fontSize: 14 },
  map: { flex: 1 },
  infoBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  infoText: { color: "#86868b", textAlign: "center", fontSize: 13 },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },
  modalTitle: { fontSize: 16, fontWeight: "600", color: "#1a1a1a", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    color: "#1a1a1a",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 16,
  },
  btn: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  btnText: { fontSize: 14, fontWeight: "500" },
});
