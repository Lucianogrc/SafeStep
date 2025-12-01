import "@testing-library/jest-native/extend-expect";

// Mocks básicos RN/Expo si hicieran falta
jest.mock("expo-linear-gradient", () => "LinearGradient");
jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock")
);

// Mock Firebase (auth + firestore) – lo sustituimos por mocks en cada test
jest.mock("firebase/auth", () => ({}));
jest.mock("firebase/firestore", () => ({}));
