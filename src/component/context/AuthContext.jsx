import { createSignal, useContext, createContext, onMount, onCleanup, createMemo } from "solid-js";

import { apiEndpoints } from "../config/config.js";

const AuthContext = createContext();

const apiGetToken = apiEndpoints.users.refresh;
const apiLogout = apiEndpoints.users.logout;
const AppName = import.meta.env.VITE_APP_NAME;

export function AuthProvider(props) {
  const [role, setRole] = createSignal('guest');
  /*
  const [user, setUser] = createSignal('');
  const [accessToken, setAccessToken] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);

  const login = async (token) => {
    setAccessToken(token);
    setRole(1);
  }

  const logout = async () => {
    setIsLoading(true);
    try {
      await fetch(apiLogout, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.log("Logout error:", err);
    } finally {
      setAccessToken(null);
      setUser(null);
      setIsLoading(false);
    }
  };


  const refreshToken = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(apiGetToken, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Refresh failed");
      const data = await res.json();
      setAccessToken(data.accessToken);
      setUser(decodeToken(data.accessToken));
    } catch (err) {
      console.log("Token expired");
      logout();
    } finally {
      setIsLoading(false);
    }
  }


  onMount(() => {
    const timer = setInterval(refreshToken, 10 * 60 * 1000);
    onCleanup(() => clearInterval(timer));
  });

  onMount(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setAccessToken(token);
      setUser(decodeToken(token));
    } else {
      refreshToken();
    }
  });

  // const isAuthenticated = createMemo(() => !!accessToken());
  const isAuthenticated = true;



  // const value = {
  //   nama: props.nama,
  //   role: role(),
  //   accessToken,
  //   isAuthenticated,
  //   login,
  //   logout,
  //   refreshToken,
  //   isLoading,
  //   api: [apiGetToken, apiLogout]
  // }
  //
  //
  // */
  //
  const value = {
    role: "aaaaa",
    AppName
  }

  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  )
}

export function useAuth() {  return useContext(AuthContext) }
