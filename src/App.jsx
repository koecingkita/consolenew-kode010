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
const FAQ = lazy(() => import("./pages/faq"));
const CreateArtikel = lazy(() => import("./component/CreateArtikel"));
const UpdateArtikel = lazy(() => import("./component/UpdateArtikel"));
const CreateKategori = lazy(() => import("./component/CreateKategori"));
const UpdateKategori = lazy(() => import("./component/UpdateKategori"));
const CreateFAQ = lazy(() => import("./component/CreateFAQ"));
const UpdateFAQ = lazy(() => import("./component/UpdateFAQ"));
const CreateTag = lazy(() => import("./component/CreateTag"));
const UpdateTag = lazy(() => import("./component/UpdateTag"));
const TextRich = lazy(() => import("./component/TextRich"));
const NotFound = lazy(() => import("./pages/notfound"));


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
      { path: '/artikel', children: [
        { path: '/', component: Artikel },
        { path: '/create', component: CreateArtikel },
        { path: '/update', component: UpdateArtikel },
      ]},
      { path: '/Dashboard', component: Dashboard},
      { path: '/kategori', children: [
        { path: "/", component: Kategori },
        { path: "/create", component: CreateKategori },
        { path: "/update", component: UpdateKategori }
      ]},
      { path: '/setting', component:Setting },
      { path: '/tag', children: [
        { path:'/', component:Tag },
        { path:'/create', component:CreateTag },
        { path:'/update', component:UpdateTag }
      ]},
      { path: '/faq', children: [
        { path: '/', component:FAQ },
        { path: '/create', component:CreateFAQ },
        { path: '/update', component:UpdateFAQ }
      ]},
      { path: '/test', component: TextRich },
    ]},
    { path: '*', component: NotFound }
  ];

  const currentRoute = isAuthenticated === 'admin' ? routesPrivate : routesPublic;

  return <Router>{currentRoute}</Router>
};

export default App;
