import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

// Screens
import TabBar from "../../components/ui/TabBar";
import CompanyDashboard from "../../src/screens/CompanyDashboard";
import CompanyMap from "../../src/screens/CompanyMap";
import CompanyNotifications from "../../src/screens/CompanyNotifications";
import CompanyProfile from "../../src/screens/CompanyProfile";
import CompanyRegister from "../../src/screens/CompanyRegister";
import EmergencyScreen from "../../src/screens/EmergencyScreen";
import HikerHome from "../../src/screens/HikerHome";
import HikerProfile from "../../src/screens/HikerProfile";
import Login from "../../src/screens/Login";
import LogoutConfirmDialog from "../../src/screens/LogoutConfirmDialog";
import Notifications from "../../src/screens/Notifications";
import PlaceDetail from "../../src/screens/PlaceDetail";
import Places from "../../src/screens/Places";
import QRCodeScreen from "../../src/screens/QRCodeScreen";
import Register from "../../src/screens/Register";
import RegisterTypeSelector from "../../src/screens/RegisterTypeSelector";
import Welcome from "../../src/screens/Welcome";

// Firebase
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../src/firebaseConfig";

// 🌐 Contexto de Autenticación
interface AuthContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

export const useAuth = () => useContext(AuthContext);

// 💡 Proveedor de autenticación persistente
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let firstCheckDone = false;

    const checkStoredSession = async () => {
      const token = await AsyncStorage.getItem("userToken");
      if (token) setIsLoggedIn(true);
    };

    checkStoredSession();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await AsyncStorage.setItem("userToken", user.uid);
        setIsLoggedIn(true);
      } else {
        if (firstCheckDone) {
          await AsyncStorage.removeItem("userToken");
          setIsLoggedIn(false);
        }
      }
      firstCheckDone = true;
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
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

// 🧭 Navegación principal
function MainNavigator() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [userRole, setUserRole] = useState<"hiker" | "company" | null>(null);
  const [roleLoaded, setRoleLoaded] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const [screen, setScreen] = useState<
    | { name: "welcome" }
    | { name: "login" }
    | { name: "registerType" }
    | { name: "register" }
    | { name: "companyRegister" }
    | { name: "dashboard" }
    | { name: "companyProfile" }
    | { name: "companyMap" }
    | { name: "company-notifications" }
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

  // 🔹 Cargar rol persistente
  useEffect(() => {
    const loadSession = async () => {
      const role = await AsyncStorage.getItem("userRole");
      const token = await AsyncStorage.getItem("userToken");

      if (token && role) {
        setUserRole(role as "hiker" | "company");
        setScreen(role === "company" ? { name: "dashboard" } : { name: "hikerHome" });
      }
      setRoleLoaded(true);
    };
    loadSession();
  }, []);

  // 🔹 Guardar sesión con rol
  const handleLogin = async (role: "hiker" | "company") => {
    const user = auth.currentUser;
    if (user) {
      await AsyncStorage.setItem("userToken", user.uid);
      await AsyncStorage.setItem("userRole", role);
      setUserRole(role);
      setIsLoggedIn(true);
      setScreen(role === "company" ? { name: "dashboard" } : { name: "hikerHome" });
    }
  };

  // 🔹 Cerrar sesión
  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserRole(null);
    setScreen({ name: "welcome" });
  };

  // ⏳ Esperar a que se cargue el rol antes de renderizar
  if (isLoggedIn && !roleLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  // ---------------------------
  // 🔹 Flujo de pantallas
  // ---------------------------

  // 🌱 Pantallas iniciales
  if (!isLoggedIn && screen.name === "welcome")
    return <Welcome onGetStarted={() => setScreen({ name: "login" })} />;

  if (!isLoggedIn && screen.name === "login")
    return (
      <Login
        onBack={() => setScreen({ name: "welcome" })}
        onLoginHiker={() => handleLogin("hiker")}
        onLoginCompany={() => handleLogin("company")}
        onRegister={() => setScreen({ name: "registerType" })}
      />
    );

  if (!isLoggedIn && screen.name === "registerType")
    return (
      <RegisterTypeSelector
        onBack={() => setScreen({ name: "login" })}
        onSelectType={(type) =>
          setScreen(type === "hiker" ? { name: "register" } : { name: "companyRegister" })
        }
      />
    );

  if (!isLoggedIn && screen.name === "register")
    return (
      <Register
        onBack={() => setScreen({ name: "registerType" })}
        onComplete={() => handleLogin("hiker")}
      />
    );

  if (!isLoggedIn && screen.name === "companyRegister")
    return (
      <CompanyRegister
        onBack={() => setScreen({ name: "registerType" })}
        onComplete={() => handleLogin("company")}
      />
    );

  // 🚶‍♂️ Hiker Home
  if (userRole === "hiker" && screen.name === "hikerHome")
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

        {showLogoutDialog && (
          <LogoutConfirmDialog
            isOpen={showLogoutDialog}
            onConfirm={handleLogout}
            onCancel={() => setShowLogoutDialog(false)}
          />
        )}
      </>
    );

  // 🌲 Lugares y detalles
  if (userRole === "hiker" && screen.name === "places")
    return (
      <Places
        onTabChange={(tab) => {
          if (tab === "home") setScreen({ name: "hikerHome" });
          if (tab === "places") setScreen({ name: "places" });
          if (tab === "qr") setScreen({ name: "qr" });
        }}
        onNavigateToDetail={(placeId) =>
          setScreen({ name: "placeDetail", id: placeId, from: "places" })
        }
      />
    );

  if (userRole === "hiker" && screen.name === "placeDetail")
    return (
      <PlaceDetail
        placeId={screen.id}
        onBack={() =>
          screen.from === "hikerHome"
            ? setScreen({ name: "hikerHome" })
            : setScreen({ name: "places" })
        }
      />
    );

  // 👤 Perfil del Hiker
  if (userRole === "hiker" && screen.name === "hikerProfile")
    return (
      <>
        <HikerProfile
          onBack={() => setScreen({ name: "hikerHome" })}
          onLogout={() => setShowLogoutDialog(true)}
        />
        {showLogoutDialog && (
          <LogoutConfirmDialog
            isOpen={showLogoutDialog}
            onConfirm={handleLogout}
            onCancel={() => setShowLogoutDialog(false)}
          />
        )}
      </>
    );

  // 🔔 Notificaciones del Hiker
  if (userRole === "hiker" && screen.name === "notifications")
    return <Notifications onBack={() => setScreen({ name: "hikerHome" })} />;

  // 🚨 SOS / Emergencias
  if (userRole === "hiker" && screen.name === "emergency")
    return <EmergencyScreen onBack={() => setScreen({ name: "hikerHome" })} />;

  // 🧾 Código QR
  if (userRole === "hiker" && screen.name === "qr")
    return (
      <QRCodeScreen
        onTabChange={(tab) => {
          if (tab === "home") setScreen({ name: "hikerHome" });
          if (tab === "places") setScreen({ name: "places" });
          if (tab === "qr") setScreen({ name: "qr" });
        }}
      />
    );

  // 🏢 Company Screens
  if (userRole === "company" && screen.name === "dashboard")
    return (
      <>
        <CompanyDashboard
          onNavigate={(s) => {
            if (s === "company-profile") setScreen({ name: "companyProfile" });
            if (s === "company-notifications") setScreen({ name: "company-notifications" });
          }}
          onLogout={() => setShowLogoutDialog(true)}
          onTabChange={(tab) => {
            if (tab === "home") setScreen({ name: "dashboard" });
            if (tab === "map") setScreen({ name: "companyMap" });
            if (tab === "profile") setScreen({ name: "companyProfile" });
          }}
        />

        {showLogoutDialog && (
          <LogoutConfirmDialog
            isOpen={showLogoutDialog}
            onConfirm={handleLogout}
            onCancel={() => setShowLogoutDialog(false)}
          />
        )}
      </>
    );

  // 📍 Mapa de empresa
  if (userRole === "company" && screen.name === "companyMap")
    return (
      <CompanyMap
        onTabChange={(tab) => {
          if (tab === "home") setScreen({ name: "dashboard" });
          if (tab === "map") setScreen({ name: "companyMap" });
          if (tab === "profile") setScreen({ name: "companyProfile" });
        }}
      />
    );

  // 👤 Perfil de empresa
  if (userRole === "company" && screen.name === "companyProfile")
    return <CompanyProfile onBack={() => setScreen({ name: "dashboard" })} onLogout={handleLogout} />;

  // 🔔 Notificaciones de empresa
  if (userRole === "company" && screen.name === "company-notifications")
    return <CompanyNotifications onBack={() => setScreen({ name: "dashboard" })} />;

  // 🕐 Pantalla de carga intermedia
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <ActivityIndicator size="large" color="#1E90FF" />
    </View>
  );
}

// 🚀 App principal
export default function App() {
  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  );
}
