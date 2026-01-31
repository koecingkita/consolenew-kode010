import { AuthProvider } from "./component/context/AuthContext";
import App from "./App";

export default function AppWrapper() {
  return <AuthProvider><App /></AuthProvider>
}
