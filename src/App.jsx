import { lazy } from "solid-js";
import { Router } from "@solidjs/router";
import Layout from "./component/theme/Layout";

const Login = lazy(() => import("./pages/login"));
const Home = lazy(() => import("./pages/home"));
const Artikel = lazy(() => import("./pages/artikel"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const Kategori = lazy(() => import("./pages/kategori"));
const Setting = lazy(() => import("./pages/setting"));
const Tag = lazy(() => import("./pages/tag"));


const App = () => {
  const isAuthenticated = 'admin';

  const routesPublic = [
    { path: '/', component: Login},
    { path: '/login', component: Login},
    { path: '*', component: () => <p>Not Found 404</p> }
  ];

  const routesPrivate = [
    {
      path: '/', component: Layout, children: [
      { path: '/', component: Home},
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
