import { fireEvent, render } from "@testing-library/react-native";
import { getDocs } from "firebase/firestore";
import React from "react";
import Places from "../src/screens/Places";

jest.mock("../src/firebaseConfig", () => ({
  db: {}
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn()
}));

jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: "granted" }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: { latitude: 20.67, longitude: -103.35 }
  })
}));

jest.mock("react-native-maps", () => {
  const React = require("react");
  const { View } = require("react-native");
  const Mock = (props: any) => <View {...props} />;
  Mock.Marker = (props: any) => <View {...props} testID={props.testID} onPress={props.onPress} />;
  return Mock;
});

describe("Places", () => {
  it("muestra marcador y tarjeta con nombre de empresa", async () => {
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [
        { id: "company-123", data: () => ({ companyName: "Parque La Primavera", latitude: 20.7, longitude: -103.4 }) }
      ]
    });

    const { queryByTestId, findByTestId } = render(
      <Places
        onTabChange={() => {}}
        onNavigateToDetail={() => {}}
      />
    );

    // Espera a que cargue y aparezca el marcador mock
    const marker = await findByTestId("marker-company-123");
    fireEvent.press(marker);

    // Tarjeta inferior visible
    const bottom = await findByTestId("place-bottom-card");
    expect(bottom).toBeTruthy();
  });
});
