module.exports = {
  preset: "react-native",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native|@expo|expo(nent)?|expo-.*|@expo-google-fonts|react-navigation|@react-navigation/.*|@react-native-community/.*))"
  ],
  moduleNameMapper: {
    "\\.(svg|png|jpg)$": "<rootDir>/__mocks__/fileMock.js"
  }
};
