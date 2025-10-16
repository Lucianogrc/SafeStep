import { Slot } from "expo-router";
import { View } from "react-native";
import TabBar from "../../components/ui/TabBar";
import { useAuth } from "../../src/context/AuthContext";

export default function Layout() {
  const { isLoggedIn } = useAuth();

  return (
    <View style={{ flex: 1 }}>
      <Slot />
      {isLoggedIn && (
        <TabBar
          activeTab="home" // valor inicial por defecto
          onTabChange={() => {}} // función vacía para evitar errores
          variant="hiker" // o "company", según el tipo de usuario
        />
      )}
    </View>
  );
}
