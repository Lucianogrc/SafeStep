// app/(tabs)/index.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

// Screens (Hiker + Company)
import TabBar from "../../components/ui/TabBar";
import CompanyDashboard from "../../src/screens/CompanyDashboard";
import CompanyHikerDetail from "../../src/screens/CompanyHikerDetail";
import CompanyMap from "../../src/screens/CompanyMap";
import CompanyNotifications from "../../src/screens/CompanyNotifications";
import CompanyProfile from "../../src/screens/CompanyProfile";
import CompanyRegister from "../../src/screens/CompanyRegister";
import CompanyScanQRScreen from "../../src/screens/CompanyScanQRScreen";
import CorporateDashboard from "../../src/screens/CorporateDashboard";

import EmergencyScreen from "../../src/screens/EmergencyScreen";
import HikerCompanyDetail from "../../src/screens/HikerCompanyDetail";
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
import { auth } from "../../src/Services/firebaseConfig";

// ⛰ Tracker de ubicación del hiker
import HikerLocationTracker from "../../components/HikerLocationTracker";

// 🌐 Auth Context
interface AuthContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

export const useAuth = () => useContext(AuthContext);
type TabKey = "home" | "places" | "qr" | "map" | "corporation";

// 🔐 Provider
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = await AsyncStorage.getItem("userToken");
      const role = await AsyncStorage.getItem("userRole");
      setIsLoggedIn(!!token && !!role);
      setLoading(false);
    };

    bootstrap();

    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        await AsyncStorage.removeItem("userToken");
        await AsyncStorage.removeItem("userRole");
        setIsLoggedIn(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

// 🧭 Main Navigator
function MainNavigator() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [userRole, setUserRole] = useState<"hiker" | "company" | null>(null);
  const [roleLoaded, setRoleLoaded] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const [screen, setScreen] = useState<any>({ name: "welcome" });

  // Load role from storage
  useEffect(() => {
    const loadSession = async () => {
      const role = await AsyncStorage.getItem("userRole");
      const token = await AsyncStorage.getItem("userToken");

      if (token && role) {
        setUserRole(role as "hiker" | "company");
        setScreen(
          role === "company" ? { name: "dashboard" } : { name: "hikerHome" }
        );
      }
      setRoleLoaded(true);
    };
    loadSession();
  }, []);

  const handleLogin = async (role: "hiker" | "company") => {
    await AsyncStorage.setItem("userToken", auth.currentUser?.uid || "");
    await AsyncStorage.setItem("userRole", role);
    setUserRole(role);
    setIsLoggedIn(true);
    setScreen(role === "company"
      ? { name: "dashboard" }
      : { name: "hikerHome" });
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserRole(null);
    setScreen({ name: "welcome" });
  };

  // 🔁 Tracker: se monta en todas las pantallas del hiker
  const hikerTracker =
    userRole === "hiker" ? <HikerLocationTracker /> : null;

  // Wait until role is loaded
  if (isLoggedIn && !roleLoaded)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );

  // --------------------------
  // AUTH FLOW
  // --------------------------

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
          setScreen(
            type === "hiker"
              ? { name: "register" }
              : { name: "companyRegister" }
          )
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

  // --------------------------
  // HIKER
  // --------------------------

  if (userRole === "hiker" && screen.name === "hikerHome")
    return (
      <>
        {hikerTracker}

        <HikerHome
          onNavigate={(dest) => {
            if (dest === "hiker-profile") setScreen({ name: "hikerProfile" });
            if (dest === "map") setScreen({ name: "map" });
            if (dest === "places") setScreen({ name: "places" });
            if (dest === "emergency") setScreen({ name: "emergency" });
            if (dest === "notifications")
              setScreen({ name: "notifications" });
            if (dest === "brazalet") setScreen({ name: "brazalet" });
            if (dest === "qr") setScreen({ name: "qr" });

            if (dest.startsWith("place-"))
              setScreen({
                name: "placeDetail",
                id: dest.replace("place-", ""),
                from: "hikerHome",
              });

            if (dest.startsWith("company-"))
              setScreen({
                name: "hikerCompanyDetail",
                companyId: dest.replace("company-", ""),
              });
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

  if (userRole === "hiker" && screen.name === "places")
    return (
      <>
        {hikerTracker}

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
      </>
    );

  if (userRole === "hiker" && screen.name === "placeDetail")
    return (
      <>
        {hikerTracker}

        <PlaceDetail
          placeId={screen.id}
          onBack={() =>
            screen.from === "hikerHome"
              ? setScreen({ name: "hikerHome" })
              : setScreen({ name: "places" })
          }
        />
      </>
    );

  if (userRole === "hiker" && screen.name === "hikerProfile")
    return (
      <>
        {hikerTracker}

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

  if (userRole === "hiker" && screen.name === "notifications")
    return (
      <>
        {hikerTracker}
        <Notifications onBack={() => setScreen({ name: "hikerHome" })} />
      </>
    );

  if (userRole === "hiker" && screen.name === "emergency")
    return (
      <>
        {hikerTracker}
        <EmergencyScreen onBack={() => setScreen({ name: "hikerHome" })} />
      </>
    );

  if (userRole === "hiker" && screen.name === "qr")
    return (
      <>
        {hikerTracker}

        <QRCodeScreen />

        <TabBar
          variant="hiker"
          activeTab="qr"
          onTabChange={(tab) => {
            if (tab === "home") setScreen({ name: "hikerHome" });
            if (tab === "places") setScreen({ name: "places" });
            if (tab === "qr") setScreen({ name: "qr" });
          }}
        />
      </>
    );

  if (userRole === "hiker" && screen.name === "hikerCompanyDetail")
    return (
      <>
        {hikerTracker}

        <HikerCompanyDetail
          companyId={screen.companyId}
          onBack={() => setScreen({ name: "hikerHome" })}
        />
      </>
    );

  // --------------------------
  // COMPANY
  // --------------------------

  // 📌 MAIN COMPANY DASHBOARD (Home)
  if (userRole === "company" && screen.name === "dashboard")
    return (
      <>
        <CompanyDashboard
          onNavigate={(s) => {
            if (s === "company-profile")
              setScreen({ name: "companyProfile" });
            if (s === "company-notifications")
              setScreen({ name: "company-notifications" });
            if (s === "company-scan-qr")
              setScreen({ name: "company-scan-qr" });
          }}
          onLogout={() => setShowLogoutDialog(true)}
          onTabChange={(tab) => {
            if (tab === "home") setScreen({ name: "dashboard" });
            if (tab === "map") setScreen({ name: "companyMap" });
            if (tab === "corporation")
              setScreen({ name: "corporateDashboard" });
          }}
          onOpenHiker={(hiker) =>
            setScreen({ name: "company-hiker-detail", hiker })
          }
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

  // 📌 COMPANY → CORPORATE DASHBOARD (NEW)
  if (userRole === "company" && screen.name === "corporateDashboard")
    return (
      <>
        <CorporateDashboard onBack={() => setScreen({ name: "dashboard" })} />

        <TabBar
          variant="company"
          activeTab="corporation"
          onTabChange={(tab) => {
            if (tab === "home") setScreen({ name: "dashboard" });
            if (tab === "map") setScreen({ name: "companyMap" });
            if (tab === "corporation")
              setScreen({ name: "corporateDashboard" });
          }}
        />
      </>
    );

  if (userRole === "company" && screen.name === "company-scan-qr")
    return (
      <CompanyScanQRScreen
        onBack={() => setScreen({ name: "dashboard" })}
      />
    );

  if (userRole === "company" && screen.name === "company-hiker-detail")
    return (
      <CompanyHikerDetail
        hikerUid={screen.hiker.hikerUid}
        activeDocId={screen.hiker.id}
        onBack={() => setScreen({ name: "dashboard" })}
      />
    );

  if (userRole === "company" && screen.name === "companyMap")
    return (
      <CompanyMap
        onTabChange={(tab) => {
          if (tab === "home") setScreen({ name: "dashboard" });
          if (tab === "map") setScreen({ name: "companyMap" });
          if (tab === "corporation")
            setScreen({ name: "corporateDashboard" });
        }}
      />
    );

  if (userRole === "company" && screen.name === "companyProfile")
    return (
      <CompanyProfile
        onBack={() => setScreen({ name: "dashboard" })}
        onLogout={handleLogout}
      />
    );

  if (userRole === "company" && screen.name === "company-notifications")
    return (
      <CompanyNotifications
        onBack={() => setScreen({ name: "dashboard" })}
      />
    );

  // --------------------------
  // FALLBACK
  // --------------------------

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#1E90FF" />
    </View>
  );
}

// 🚀 APP
export default function App() {
  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  );
}
