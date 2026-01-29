import { Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";
import ProtectedRoutes from "./component/ProtectedRoutes";

const Login = lazy(() => import("./pages/login"));
const Home = lazy(() => import("./pages/home"));
const Artikel = lazy(() => import("./pages/artikel"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const Kategori = lazy(() => import("./pages/kategori"));
const Setting = lazy(() => import("./pages/setting"));
const Tag = lazy(() => import("./pages/tag"));

export const Routes = () => (<Router>
  <Route path="/login" component={Login} />
  <Route path="/" component={ProtectedRoutes}>
    <Route path="/home" component={Home} />
    <Route path="/artikel" component={Artikel} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/kategori" component={Kategori} />
    <Route path="/setting" component={Setting} />
    <Route path="/tag" component={Tag} />
  </Route>

</Router>)
