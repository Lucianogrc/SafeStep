 import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type TabKey = "home" | "places" | "qr";

interface TabBarProps {
  activeTab: TabKey;
  variant: "hiker" | "company";
  onTabChange: (tab: TabKey) => void;
}

export default function TabBar({
  activeTab,
  variant,
  onTabChange,
}: TabBarProps) {
  const primaryColor = variant === "hiker" ? "#2E8B57" : "#1E90FF";

  const tabs: { key: TabKey; label: string; icon: keyof typeof Ionicons.glyphMap }[] =
    [
      { key: "home", label: "Inicio", icon: "home-outline" },
      { key: "places", label: "Lugares", icon: "map-outline" },
      { key: "qr", label: "QR", icon: "qr-code-outline" },
    ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabChange(tab.key)}
          >
            <Ionicons
              name={tab.icon}
              size={22}
              color={isActive ? primaryColor : "#8e8e93"}
            />
            <Text
              style={[
                styles.label,
                { color: isActive ? primaryColor : "#8e8e93" },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingBottom: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
  },
});
