import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TabBarProps {
  activeTab: "home" | "places" | "qr" | "map" | "corporation"; // Asegúrate de incluir "corporation"
  onTabChange: (tab: "home" | "places" | "qr" | "map" | "corporation") => void;
  variant: "hiker" | "company"; // Diferenciar entre Hiker y Company
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange, variant }) => {
  return (
    <View style={[styles.tabBar, variant === "company" ? styles.companyTab : styles.hikerTab]}>
      {/* Home Tab */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => onTabChange("home")}
      >
        <Ionicons
          name="home-outline"
          size={24}
          color={activeTab === "home" ? "#2E8B57" : "#86868b"}
        />
        <Text
          style={[styles.tabLabel, activeTab === "home" && styles.activeTabLabel]}
        >
          Inicio
        </Text>
      </TouchableOpacity>

      {/* Map Tab (only for Company) */}
      {variant === "company" && (
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => onTabChange("map")}
        >
          <Ionicons
            name="map-outline"
            size={24}
            color={activeTab === "map" ? "#2E8B57" : "#86868b"}
          />
          <Text
            style={[styles.tabLabel, activeTab === "map" && styles.activeTabLabel]}
          >
            Mapa
          </Text>
        </TouchableOpacity>
      )}

      {/* Corporation Tab (only for Company) */}
      {variant === "company" && (
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => onTabChange("corporation")}
        >
          <Ionicons
            name="business-outline"
            size={24}
            color={activeTab === "corporation" ? "#2E8B57" : "#86868b"}
          />
          <Text
            style={[styles.tabLabel, activeTab === "corporation" && styles.activeTabLabel]}
          >
            Corporación
          </Text>
        </TouchableOpacity>
      )}

      {/* Places Tab (only for Hiker) */}
      {variant === "hiker" && (
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => onTabChange("places")}
        >
          <Ionicons
            name="location-outline"
            size={24}
            color={activeTab === "places" ? "#2E8B57" : "#86868b"}
          />
          <Text
            style={[styles.tabLabel, activeTab === "places" && styles.activeTabLabel]}
          >
            Lugares
          </Text>
        </TouchableOpacity>
      )}

      {/* QR Tab (only for Hiker) */}
      {variant === "hiker" && (
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => onTabChange("qr")}
        >
          <Ionicons
            name="qr-code-outline"
            size={24}
            color={activeTab === "qr" ? "#2E8B57" : "#86868b"}
          />
          <Text
            style={[styles.tabLabel, activeTab === "qr" && styles.activeTabLabel]}
          >
            QR
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  tabButton: {
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 12,
    color: "#86868b",
    marginTop: 4,
  },
  activeTabLabel: {
    color: "#2E8B57",
    fontWeight: "600",
  },
  hikerTab: {
    backgroundColor: "#f5f5f7",
  },
  companyTab: {
    backgroundColor: "#f5f5f7",
  },
});

export default TabBar;
