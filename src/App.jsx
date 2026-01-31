import { lazy } from "solid-js";
import { Router, Navigate } from "@solidjs/router";
import Layout from "./component/theme/Layout";
import { useAuth } from "./component/context/AuthContext";

const Login = lazy(() => import("./pages/login"));
const Home = lazy(() => import("./pages/home"));
const Artikel = lazy(() => import("./pages/artikel"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const Kategori = lazy(() => import("./pages/kategori"));
const Setting = lazy(() => import("./pages/setting"));
const Tag = lazy(() => import("./pages/tag"));


const App = () => {
  const isAuthenticated = 'admin';
  const { role } = useAuth();

  console.log("liat status: ", role);

  const routesPublic = [
    { path: '/', component: Login},
    { path: '/login', component: Login},
    { path: '*', component: () => <Navigate href={'/'} /> }
  ];

  const routesPrivate = [
    {
      path: '/', component: Layout, children: [
      { path: '/', component: Dashboard},
      { path: '/artikel', component: Artikel},
      { path: '/Dashboard', component: Dashboard},
      { path: '/kategori', component: Kategori},
      { path: '/setting', component: Setting},
      { path: '/tag', component: Tag },
      { path: '*', component: () => <p>Not Found</p> }
    ]},
  ];

  const currentRoute = isAuthenticated === 'admin' ? routesPrivate : routesPublic;

  return <Router>{currentRoute}</Router>
};

export default App;
