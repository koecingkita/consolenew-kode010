import { useAuth } from "./context/AuthContext";
import { Navigate } from "@solidjs/router";
import { Show, createEffect, createSignal, Switch, Match } from "solid-js";
import Layout from "./theme/Layout"

function ProtectedRoutes(props) {
  const { role } = useAuth();
  const [user, setUser] = createSignal(1);

  createEffect(() => {
    console.log("roleeessss:", role());
  })

  return (
    <Switch fallback={<p>Loading</p>}>
      <Match when={role === 0}>
        <Navigate href={'/login'} />
      </Match>
      <Match when={role === 1}>
        <Layout>
          {props.children}
        </Layout>
      </Match>
    </Switch>
  )
}

export default ProtectedRoutes;
