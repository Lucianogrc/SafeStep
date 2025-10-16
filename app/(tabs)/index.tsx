import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

// Screens
import TabBar from "../../components/ui/TabBar";
import BrazaletPairing from "../../src/screens/BrazaletPairing";
import CompanyDashboard from "../../src/screens/CompanyDashboard";
import CompanyMap from "../../src/screens/CompanyMap"; // ✅ agregado
import CompanyProfile from "../../src/screens/CompanyProfile";
import CompanyRegister from "../../src/screens/CompanyRegister";
import EmergencyScreen from "../../src/screens/EmergencyScreen";
import HikerHome from "../../src/screens/HikerHome";
import HikerProfile from "../../src/screens/HikerProfile";
import Login from "../../src/screens/Login";
import LogoutConfirmDialog from "../../src/screens/LogoutConfirmDialog";
import MapView from "../../src/screens/MapView";
import Notifications from "../../src/screens/Notifications";
import PlaceDetail from "../../src/screens/PlaceDetail";
import Places from "../../src/screens/Places";
import QRCodeScreen from "../../src/screens/QRCodeScreen";
import Register from "../../src/screens/Register";
import RegisterTypeSelector from "../../src/screens/RegisterTypeSelector";
import Welcome from "../../src/screens/Welcome";

// ---------------------------
// 🌐 Contexto de Autenticación
// ---------------------------
interface AuthContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

export const useAuth = () => useContext(AuthContext);

// -----------------------------------------
// 💡 Proveedor de autenticación con persistencia
// -----------------------------------------
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogin = async () => {
      const token = await AsyncStorage.getItem("userToken");
      setIsLoggedIn(!!token);
      setLoading(false);
    };
    loadLogin();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

// ---------------------------
// 🧭 Navegación principal
// ---------------------------
function MainNavigator() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [userRole, setUserRole] = useState<"hiker" | "company" | null>(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const [screen, setScreen] = useState<
    | { name: "welcome" }
    | { name: "login" }
    | { name: "registerType" }
    | { name: "register" }
    | { name: "companyRegister" }
    | { name: "dashboard" }
    | { name: "companyProfile" }
    | { name: "companyMap" } // ✅ agregado
    | { name: "hikerHome" }
    | { name: "hikerProfile" }
    | { name: "map" }
    | { name: "places" }
    | { name: "placeDetail"; id: string; from: "hikerHome" | "places" }
    | { name: "emergency" }
    | { name: "notifications" }
    | { name: "brazalet" }
    | { name: "qr" }
  >({ name: "welcome" });

  useEffect(() => {
    const loadRole = async () => {
      const role = await AsyncStorage.getItem("userRole");
      const token = await AsyncStorage.getItem("userToken");
      if (token && role) {
        setUserRole(role as "hiker" | "company");
        setScreen(role === "company" ? { name: "dashboard" } : { name: "hikerHome" });
      }
    };
    loadRole();
  }, []);

  // 🔹 Guardar login con rol
  const handleLogin = async (role: "hiker" | "company") => {
    await AsyncStorage.setItem("userToken", "123abc");
    await AsyncStorage.setItem("userRole", role);
    setUserRole(role);
    setIsLoggedIn(true);
    setScreen(role === "company" ? { name: "dashboard" } : { name: "hikerHome" });
  };

  // 🔹 Cerrar sesión
  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserRole(null);
    setScreen({ name: "welcome" });
  };

  // ---------------------------
  // 🔹 Flujo de pantallas
  // ---------------------------

  if (screen.name === "welcome")
    return <Welcome onGetStarted={() => setScreen({ name: "login" })} />;

  if (screen.name === "login")
    return (
      <Login
        onBack={() => setScreen({ name: "welcome" })}
        onLoginHiker={() => handleLogin("hiker")}
        onLoginCompany={() => handleLogin("company")}
        onRegister={() => setScreen({ name: "registerType" })}
      />
    );

  if (screen.name === "registerType")
    return (
      <RegisterTypeSelector
        onBack={() => setScreen({ name: "login" })}
        onSelectType={(type) =>
          setScreen(type === "hiker" ? { name: "register" } : { name: "companyRegister" })
        }
      />
    );

  if (screen.name === "register")
    return <Register onBack={() => setScreen({ name: "registerType" })} onComplete={() => handleLogin("hiker")} />;

  if (screen.name === "companyRegister")
    return <CompanyRegister onBack={() => setScreen({ name: "registerType" })} onComplete={() => handleLogin("company")} />;

  // 🚶‍♂️ Home del Hiker
  if (screen.name === "hikerHome")
    return (
      <>
        <HikerHome
          onNavigate={(dest) => {
            if (dest === "hiker-profile") setScreen({ name: "hikerProfile" });
            if (dest === "map") setScreen({ name: "map" });
            if (dest === "places") setScreen({ name: "places" });
            if (dest === "emergency") setScreen({ name: "emergency" });
            if (dest === "notifications") setScreen({ name: "notifications" });
            if (dest === "brazalet") setScreen({ name: "brazalet" });
            if (dest.startsWith("place-"))
              setScreen({ name: "placeDetail", id: dest.replace("place-", ""), from: "hikerHome" });
          }}
          onLogout={() => setShowLogoutDialog(true)}
        />

        <TabBar
          variant="hiker"
          activeTab="home"
          onTabChange={(tab) => {
            if (tab === "home") setScreen({ name: "hikerHome" });
            if (tab === "places") setScreen({ name: "places" });
            if (tab === "qr") setScreen({ name: "qr" });
          }}
        />

        <LogoutConfirmDialog
          isOpen={showLogoutDialog}
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutDialog(false)}
        />
      </>
    );

  // 🌲 Lugares
  if (screen.name === "places")
    return (
      <Places
        onTabChange={(tab) => {
          if (tab === "home") setScreen({ name: "hikerHome" });
          if (tab === "places") setScreen({ name: "places" });
          if (tab === "qr") setScreen({ name: "qr" });
        }}
        onNavigateToDetail={(placeId) => setScreen({ name: "placeDetail", id: placeId, from: "places" })}
      />
    );

  // 📍 Detalle del lugar
  if (screen.name === "placeDetail")
    return (
      <PlaceDetail
        placeId={screen.id}
        onBack={() => (screen.from === "hikerHome" ? setScreen({ name: "hikerHome" }) : setScreen({ name: "places" }))}
      />
    );

  // 👤 Perfil del Hiker
  if (screen.name === "hikerProfile")
    return (
      <>
        <HikerProfile onBack={() => setScreen({ name: "hikerHome" })} onLogout={() => setShowLogoutDialog(true)} />
        <LogoutConfirmDialog
          isOpen={showLogoutDialog}
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutDialog(false)}
        />
      </>
    );

  // 🗺️ Mapa del Hiker
  if (screen.name === "map") return <MapView onBack={() => setScreen({ name: "hikerHome" })} />;

  // 🚨 Emergencias
  if (screen.name === "emergency") return <EmergencyScreen onBack={() => setScreen({ name: "hikerHome" })} />;

  // 🔔 Notificaciones
  if (screen.name === "notifications") return <Notifications onBack={() => setScreen({ name: "hikerHome" })} />;

  // 📶 Brazalete
  if (screen.name === "brazalet") return <BrazaletPairing onBack={() => setScreen({ name: "hikerHome" })} />;

  // 🆕 QR
  if (screen.name === "qr")
    return (
      <QRCodeScreen
        onTabChange={(tab) => {
          if (tab === "home") setScreen({ name: "hikerHome" });
          if (tab === "places") setScreen({ name: "places" });
          if (tab === "qr") setScreen({ name: "qr" });
        }}
      />
    );

  // 🏢 Perfil empresa
  if (screen.name === "companyProfile")
    return <CompanyProfile onBack={() => setScreen({ name: "dashboard" })} onLogout={handleLogout} />;

  // 🗺️ Mapa empresa ✅
  if (screen.name === "companyMap")
    return (
      <CompanyMap
        onTabChange={(tab) => {
          if (tab === "home") setScreen({ name: "dashboard" });
          if (tab === "map") setScreen({ name: "companyMap" });
          if (tab === "profile") setScreen({ name: "companyProfile" });
        }}
      />
    );

  // 💼 Dashboard empresa
  return (
    <>
      <CompanyDashboard
        onNavigate={(s) => {
          if (s === "company-profile") setScreen({ name: "companyProfile" });
        }}
        onLogout={() => setShowLogoutDialog(true)}
        onTabChange={(tab) => {
          if (tab === "home") setScreen({ name: "dashboard" });
          if (tab === "map") setScreen({ name: "companyMap" });
          if (tab === "profile") setScreen({ name: "companyProfile" });
        }}
      />

      <LogoutConfirmDialog
        isOpen={showLogoutDialog}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </>
  );
}

// ---------------------------
// 🚀 App principal
// ---------------------------
export default function App() {
  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  );
}
