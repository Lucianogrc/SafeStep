// src/screens/MapView.tsx

import { Feather, Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
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
import RNMapView, { Circle, MapPressEvent, Marker, Region } from "react-native-maps";
import { auth, db } from "../Services/firebaseConfig";

interface MapViewProps {
  onBack: () => void;
}

type PoiType = "route" | "aid" | "checkpoint" | "safe";

interface Poi {
  id: string;
  type: PoiType;
  name: string;
  latitude: number;
  longitude: number;
}

export default function MapViewScreen({ onBack }: MapViewProps) {
  const [region, setRegion] = useState<Region | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const [circleCenter, setCircleCenter] = useState<{ latitude: number; longitude: number } | null>(null);
  const [circleRadius, setCircleRadius] = useState<number>(300);

  const [pois, setPois] = useState<Poi[]>([]);
  const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [poiName, setPoiName] = useState("");
  const [poiType, setPoiType] = useState<PoiType>("route");

  // ===================================================================
  // LOAD USER LOCATION + PARK DATA
  // ===================================================================
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permiso denegado", "No podemos obtener tu ubicación.");
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        const user = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };

        setUserLocation(user);
        setRegion({
          latitude: user.latitude,
          longitude: user.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        // Load park data
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const snapshot = await getDoc(doc(db, "parks", uid));
        if (snapshot.exists()) {
          const data = snapshot.data();
          setCircleCenter(data.circleCenter || null);
          setCircleRadius(data.circleRadius || 300);
          setPois(data.pois || []);

          if (data.circleCenter) {
            setRegion({
              latitude: data.circleCenter.latitude,
              longitude: data.circleCenter.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        }
      } catch (e) {
        console.log("Error loading location:", e);
      }
    })();
  }, []);

  // ===================================================================
  // HANDLE MAP PRESS
  // ===================================================================
  const handlePressMap = (e: MapPressEvent) => {
    if (!isEditing) return;

    const { latitude, longitude } = e.nativeEvent.coordinate;

    if (!circleCenter) {
      setCircleCenter({ latitude, longitude });
      return;
    }

    const dist = getDistance(circleCenter.latitude, circleCenter.longitude, latitude, longitude);
    if (dist > circleRadius) {
      Alert.alert("Fuera del parque", "Los puntos deben estar dentro del área.");
      return;
    }

    setSelectedPoi({
      id: Date.now().toString(),
      type: poiType,
      name: "",
      latitude,
      longitude,
    });

    setPoiName("");
    setModalVisible(true);
  };

  // ===================================================================
  // SAVE OR DELETE POI
  // ===================================================================
  const savePoi = () => {
    if (!poiName.trim()) {
      Alert.alert("Nombre vacío", "Debes poner un nombre.");
      return;
    }
    if (!selectedPoi) return;

    const updatedPoi = {
      ...selectedPoi,
      name: poiName.trim(),
      type: poiType,
    };

    const exists = pois.some((p) => p.id === selectedPoi.id);

    if (exists) {
      // EDIT
      setPois(pois.map((p) => (p.id === selectedPoi.id ? updatedPoi : p)));
    } else {
      // NEW
      setPois([...pois, updatedPoi]);
    }

    setModalVisible(false);
    setSelectedPoi(null);
  };

  const deletePoi = (id: string) => {
    setPois(pois.filter((p) => p.id !== id));
    setModalVisible(false);
    setSelectedPoi(null);
  };

  // ===================================================================
  // DELETE AREA
  // ===================================================================
  const deleteCircle = () => {
    setCircleCenter(null);
    setCircleRadius(300);
    setPois([]);
  };

  // ===================================================================
  // SAVE PARK
  // ===================================================================
  const savePark = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || !circleCenter) {
      Alert.alert("Faltan datos", "Debes asignar un área primero.");
      return;
    }

    try {
      await setDoc(doc(db, "parks", uid), {
        companyId: uid,
        circleCenter,
        circleRadius,
        pois,
        updatedAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "companies", uid), {
        hasPark: true,
        status: "active",
        parkUpdatedAt: serverTimestamp(),
      });

      Alert.alert("Parque guardado", "El parque se guardó correctamente.");
      onBack();
    } catch (e) {
      Alert.alert("Error", "No se pudo guardar.");
      console.log(e);
    }
  };

  // ===================================================================
  // RENDER
  // ===================================================================
  return (
    <View style={{ flex: 1 }}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>

        <Text style={styles.title}>Editor del Parque</Text>

        <View style={{ flexDirection: "row", gap: 10 }}>
          {circleCenter && (
            <TouchableOpacity onPress={deleteCircle} style={styles.deleteAreaBtn}>
              <Ionicons name="trash" size={20} color="#ff3b30" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => setIsEditing(!isEditing)}
            style={[styles.editBtn, isEditing && { backgroundColor: "#1E90FF20" }]}
          >
            <Ionicons name={isEditing ? "checkmark" : "create-outline"} size={22} color="#1E90FF" />
            <Text style={styles.editText}>{isEditing ? "Listo" : "Editar"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MAP */}
      {region && (
        <RNMapView
          style={{ flex: 1 }}
          region={region}
          onRegionChangeComplete={setRegion}
          onPress={handlePressMap}
        >
          {/* USER LOCATION */}
          {userLocation && (
            <Marker coordinate={userLocation} pinColor="#1E90FF" title="Estás aquí" />
          )}

          {/* AREA */}
          {circleCenter && (
            <Circle
              center={circleCenter}
              radius={circleRadius}
              fillColor="rgba(30,144,255,0.15)"
              strokeColor="rgba(30,144,255,0.6)"
            />
          )}

          {/* POIS */}
          {pois.map((poi) => (
            <Marker
              key={poi.id}
              coordinate={{ latitude: poi.latitude, longitude: poi.longitude }}
              onPress={() => {
                setSelectedPoi(poi);
                setPoiName(poi.name);
                setPoiType(poi.type);
                setModalVisible(true);
              }}
            >
              <View style={styles.poiMarker}>
                <Feather name={getIcon(poi.type)} size={16} color="#fff" />
              </View>
            </Marker>
          ))}
        </RNMapView>
      )}

      {/* RADIUS CONTROLS */}
      {circleCenter && (
        <View style={styles.radiusBox}>
          <TouchableOpacity
            style={styles.radiusBtn}
            onPress={() => setCircleRadius(circleRadius + 50)}
          >
            <Feather name="plus" size={18} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radiusBtn}
            onPress={() => setCircleRadius(Math.max(100, circleRadius - 50))}
          >
            <Feather name="minus" size={18} />
          </TouchableOpacity>
        </View>
      )}

      {/* FOOTER */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          {circleCenter
            ? "Toca dentro del área para agregar puntos."
            : "Toca el mapa para definir el área del parque."}
        </Text>

        <TouchableOpacity style={styles.saveBtn} onPress={savePark}>
          <Text style={styles.saveText}>Guardar Parque</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL */}
      {modalVisible && selectedPoi && (
        <Modal animationType="fade" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>
                {selectedPoi.name ? "Editar punto" : "Nuevo punto"}
              </Text>

              {/* Nombre */}
              <TextInput
                placeholder="Nombre del punto"
                value={poiName}
                onChangeText={setPoiName}
                style={styles.input}
              />

              {/* Tipo */}
              <Text style={styles.modalSubtitle}>Tipo</Text>

              <View style={styles.typeRow}>
                <PoiTypeButton label="Ruta" icon="navigation" type="route" selected={poiType} setSelected={setPoiType} />
                <PoiTypeButton label="Botiquín" icon="heart" type="aid" selected={poiType} setSelected={setPoiType} />
                <PoiTypeButton label="Control" icon="shield" type="checkpoint" selected={poiType} setSelected={setPoiType} />
                <PoiTypeButton label="Segura" icon="alert-circle" type="safe" selected={poiType} setSelected={setPoiType} />
              </View>

              {/* BOTONES */}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: "#ccc" }]}
                  onPress={() => {
                    setModalVisible(false);
                    setSelectedPoi(null);
                  }}
                >
                  <Text style={styles.btnText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: "#1E90FF" }]}
                  onPress={savePoi}
                >
                  <Text style={[styles.btnText, { color: "#fff" }]}>Guardar</Text>
                </TouchableOpacity>
              </View>

              {/* ELIMINAR */}
              <TouchableOpacity
                style={styles.deletePoiBtn}
                onPress={() => {
                  deletePoi(selectedPoi.id);
                }}
              >
                <Feather name="trash-2" size={16} color="#ff3b30" />
                <Text style={{ color: "#ff3b30", marginLeft: 6 }}>Eliminar punto</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

    </View>
  );
}

/* ==========================================================
   SUBCOMPONENT
========================================================== */
function PoiTypeButton({
  label,
  icon,
  type,
  selected,
  setSelected,
}: {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  type: PoiType;
  selected: PoiType;
  setSelected: (value: PoiType) => void;
}) {
  return (
    <TouchableOpacity
      onPress={() => setSelected(type)}
      style={[
        styles.typeBtn,
        selected === type && {
          borderColor: "#1E90FF",
          backgroundColor: "#1E90FF20",
        },
      ]}
    >
      <Feather
        name={icon}
        size={18}
        color={selected === type ? "#1E90FF" : "#333"}
      />
      <Text
        style={[
          styles.typeBtnText,
          selected === type && { color: "#1E90FF" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ==========================================================
   HELPERS
========================================================== */
function getIcon(type: PoiType) {
  return {
    route: "navigation",
    aid: "heart",
    checkpoint: "shield",
    safe: "alert-circle",
  }[type];
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ==========================================================
   STYLES
========================================================== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    paddingTop: 60,
    paddingBottom: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconBtn: {
    backgroundColor: "#f5f5f7",
    padding: 10,
    borderRadius: 10,
  },

  deleteAreaBtn: {
    backgroundColor: "#FF3B3020",
    padding: 10,
    borderRadius: 10,
  },

  title: { fontSize: 18, fontWeight: "600" },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#f5f5f7",
  },

  editText: { fontSize: 14, color: "#1E90FF", fontWeight: "600" },

  radiusBox: {
    position: "absolute",
    right: 20,
    top: 140,
    alignItems: "center",
  },

  radiusBtn: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 30,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  infoBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  infoText: { color: "#86868b", textAlign: "center", fontSize: 13 },

  saveBtn: {
    marginTop: 12,
    backgroundColor: "#2E8B57",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  saveText: { color: "#fff", fontSize: 15, fontWeight: "600" },

  poiMarker: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#1E90FF",
    alignItems: "center",
    justifyContent: "center",
  },

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
  },

  modalTitle: { fontSize: 16, fontWeight: "600" },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },

  modalSubtitle: {
    fontWeight: "600",
    marginTop: 10,
  },

  typeRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 8,
  },

  typeBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  typeBtnText: { fontSize: 13 },

  modalButtons: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },

  btn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },

  btnText: { fontSize: 14, fontWeight: "600" },

  deletePoiBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
});
