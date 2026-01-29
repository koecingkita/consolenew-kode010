import { useAuth } from "./component/context/AuthContext"
import { createEffect, lazy } from "solid-js";
import { Route, Router } from "@solidjs/router";
import ProtectedRoutes from "./component/ProtectedRoutes";

const Login = lazy(() => import("./pages/login"));
const Home = lazy(() => import("./pages/home"));
const Artikel = lazy(() => import("./pages/artikel"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const Kategori = lazy(() => import("./pages/kategori"));
const Setting = lazy(() => import("./pages/setting"));
const Tag = lazy(() => import("./pages/tag"));

const App = () => {
  const { api } = useAuth();

  createEffect(() => {
    console.log("value", api);
  })

  return <Router>
    <Route path="/" component={ProtectedRoutes}>
      <Route path='' component={Home}/>
      <Route path='/artikel' component={Artikel}/>
      <Route path='/dashboard' component={Dashboard}/>
      <Route path='/kategori' component={Kategori}/>
      <Route path='/setting' component={Setting}/>
      <Route path='/tag' component={Tag}/>
    </Route>
    <Route path='/login' component={Login} />
    <Route path='*404' component={() => <p>Not Found</p>} />
    </Router>
};

export default App;
