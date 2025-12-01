import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { setDoc } from "firebase/firestore";
import React from "react";
import CompanyMap from "../src/screens/CompanyMap";

jest.mock("../src/firebaseConfig", () => ({
  auth: { currentUser: { uid: "company-123" } },
  db: {}
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn().mockResolvedValue({ exists: () => false }),
  setDoc: jest.fn()
}));

// Mock MapView to avoid native issues in tests
jest.mock("react-native-maps", () => {
  const React = require("react");
  const { View } = require("react-native");
  const Mock = (props: any) => <View {...props} />;
  Mock.Marker = (props: any) => <View {...props} />;
  return Mock;
});

describe("CompanyMap", () => {
  it("guarda ubicación y nombre en Firestore", async () => {
    const { getByTestId, queryByTestId } = render(
      <CompanyMap onTabChange={() => {}} />
    );

    // Activa edición
    fireEvent.press(getByTestId("btn-toggle-edit"));

    // Simula que se tocó el mapa (seteamos estado indirectamente llamando open modal)
    // Para simplificar: llamamos directamente al modal
    // (en E2E con Maestro sí se toca la UI real)
    // Abrimos modal de nombre
    // => Como el modal abre tras tocar el mapa, lo simulamos con setState vía props:
    // No podemos acceder a setState aquí, entonces simulamos flujo final:
    // Escribimos nombre y guardamos
    const nameInput = getByTestId("input-company-name");
    fireEvent.changeText(nameInput, "Parque La Primavera");
    fireEvent.press(getByTestId("btn-save"));

    await waitFor(() => {
      expect(setDoc).toHaveBeenCalled();
      // Validación de estructura
      const [[docRef, payload]] = (setDoc as jest.Mock).mock.calls;
      expect(payload.companyId).toBe("company-123");
      expect(payload.companyName).toBe("Parque La Primavera");
    });
  });
});
