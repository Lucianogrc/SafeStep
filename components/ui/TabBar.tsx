import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Tab {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface TabBarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: "hiker" | "company";
}

export default function TabBar({ activeTab, onTabChange, variant = "hiker" }: TabBarProps) {
  const hikerTabs: Tab[] = [
    { id: "home", label: "Inicio", icon: "home-outline" },
    { id: "places", label: "Lugares", icon: "navigate-outline" },
    { id: "qr", label: "Mi QR", icon: "qr-code-outline" },
  ];

  const companyTabs: Tab[] = [
    { id: "home", label: "Inicio", icon: "home-outline" },
    { id: "map", label: "Mapa", icon: "map-outline" },
  ];

  const tabs = variant === "hiker" ? hikerTabs : companyTabs;
  const activeColor = variant === "hiker" ? "#2E8B57" : "#1E90FF";

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const scale = new Animated.Value(isActive ? 1.1 : 1);

        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => {
              Animated.spring(scale, {
                toValue: 1.2,
                friction: 3,
                useNativeDriver: true,
              }).start(() => {
                scale.setValue(1);
              });
              onTabChange(tab.id);
            }}
            activeOpacity={0.8}
            style={styles.tabButton}
          >
            <Animated.View style={{ transform: [{ scale }] }}>
              <Ionicons
                name={tab.icon}
                size={24}
                color={isActive ? activeColor : "#86868b"}
                style={{ marginBottom: 4 }}
              />
            </Animated.View>

            <Text
              style={[
                styles.label,
                {
                  color: isActive ? activeColor : "#86868b",
                  fontWeight: isActive ? "600" : "400",
                },
              ]}
            >
              {tab.label}
            </Text>

            {isActive && (
              <View
                style={[
                  styles.indicator,
                  { backgroundColor: activeColor },
                ]}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 6,
    height: 70,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
  },
  indicator: {
    position: "absolute",
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
