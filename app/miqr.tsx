import QRCodeScreen from "../src/screens/QRCodeScreen";

export default function QRFullScreen() {
  return <QRCodeScreen onTabChange={function (tab: string): void {
      throw new Error("Function not implemented.");
  } } />;
}
