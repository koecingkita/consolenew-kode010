import { Routes } from "./routes";
import { useAuth } from "./component/context/AuthContext"
import { createEffect } from "solid-js";

const App = () => {
  const { api } = useAuth();

  createEffect(() => {
    console.log("value", api);
  })

  return <Routes />
};

export default App;
