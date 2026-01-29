import { useAuth } from "./context/AuthContext";
import { Navigate } from "@solidjs/router";

export default function RoleGuard(props) {
  const { role } = useAuth();

  return props.allow.includes(role())
    ? props.children
    : <Navigate href="/login" />;
}
