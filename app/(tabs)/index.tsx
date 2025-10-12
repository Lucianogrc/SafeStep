// app/index.tsx
import React, { useState } from "react";
import BrazaletPairing from "../../src/screens/BrazaletPairing";
import CompanyDashboard from "../../src/screens/CompanyDashboard";
import CompanyProfile from "../../src/screens/CompanyProfile";
import CompanyRegister from "../../src/screens/CompanyRegister";
import EmergencyScreen from "../../src/screens/EmergencyScreen";
import HikerHome from "../../src/screens/HikerHome";
import HikerProfile from "../../src/screens/HikerProfile";
import Login from "../../src/screens/Login";
import LogoutConfirmDialog from "../../src/screens/LogoutConfirmDialog";
import MapView from "../../src/screens/MapView";
import Notifications from "../../src/screens/Notifications";
import Register from "../../src/screens/Register";
import RegisterTypeSelector from "../../src/screens/RegisterTypeSelector";
import Welcome from "../../src/screens/Welcome";

export default function App() {
  const [screen, setScreen] = useState<
    | "welcome"
    | "login"
    | "registerType"
    | "register"
    | "companyRegister"
    | "dashboard"
    | "companyProfile"
    | "hikerHome"
    | "hikerProfile"
    | "map"
    | "emergency"
    | "notifications"
    | "brazalet"
  >("welcome");

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // 🌿 Pantalla de bienvenida
  if (screen === "welcome") {
    return <Welcome onGetStarted={() => setScreen("login")} />;
  }

  // 🔐 Pantalla de inicio de sesión
  if (screen === "login") {
    return (
      <Login
        onBack={() => setScreen("welcome")}
        onLogin={() => setScreen("hikerHome")}
        onRegister={() => setScreen("registerType")}
      />
    );
  }

  // 🧭 Selector de tipo de registro
  if (screen === "registerType") {
    return (
      <RegisterTypeSelector
        onBack={() => setScreen("login")}
        onSelectType={(type) => {
          if (type === "hiker") setScreen("register");
          else if (type === "company") setScreen("companyRegister");
        }}
      />
    );
  }

  // 🚶‍♂️ Registro de usuario Hiker
  if (screen === "register") {
    return (
      <Register
        onBack={() => setScreen("registerType")}
        onComplete={() => setScreen("hikerHome")}
      />
    );
  }

  // 🏢 Registro de empresa
  if (screen === "companyRegister") {
    return (
      <CompanyRegister
        onBack={() => setScreen("registerType")}
        onComplete={() => setScreen("dashboard")}
      />
    );
  }

  // 🏞️ Home del Hiker
  if (screen === "hikerHome") {
    return (
      <HikerHome
        onNavigate={(destination) => {
          if (destination === "hiker-profile") setScreen("hikerProfile");
          else if (destination === "map") setScreen("map");
          else if (destination === "emergency") setScreen("emergency");
          else if (destination === "notifications") setScreen("notifications");
          else if (destination === "brazalet") setScreen("brazalet");
        }}
        onLogout={() => setShowLogoutDialog(true)}
      />
    );
  }

  // 🧍 Perfil del Hiker
  if (screen === "hikerProfile") {
    return (
      <>
        <HikerProfile
          onBack={() => setScreen("hikerHome")}
          onLogout={() => setShowLogoutDialog(true)}
        />
        <LogoutConfirmDialog
          isOpen={showLogoutDialog}
          onConfirm={() => {
            setShowLogoutDialog(false);
            setScreen("welcome");
          }}
          onCancel={() => setShowLogoutDialog(false)}
        />
      </>
    );
  }

  // 🗺️ Vista de mapa del parque
  if (screen === "map") {
    return <MapView onBack={() => setScreen("hikerHome")} />;
  }

  // 🚨 Emergencia SOS
  if (screen === "emergency") {
    return <EmergencyScreen onBack={() => setScreen("hikerHome")} />;
  }

  // 🔔 Notificaciones
  if (screen === "notifications") {
    return <Notifications onBack={() => setScreen("hikerHome")} />;
  }

  // 📶 Emparejamiento de brazalete
  if (screen === "brazalet") {
    return <BrazaletPairing onBack={() => setScreen("hikerHome")} />;
  }

  // 🏢 Perfil de empresa
 if (screen === "companyProfile") {
  return (
    <CompanyProfile
      onBack={() => setScreen("dashboard")}
      onLogout={() => setScreen("welcome")}
    />
  );
}



  // 💼 Panel principal de empresa
  return (
    <>
      <CompanyDashboard
        onNavigate={(s) => {
          if (s === "company-profile") setScreen("companyProfile");
        }}
        onLogout={() => setShowLogoutDialog(true)}
      />
      <LogoutConfirmDialog
        isOpen={showLogoutDialog}
        onConfirm={() => {
          setShowLogoutDialog(false);
          setScreen("welcome");
        }}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </>
  );
}
