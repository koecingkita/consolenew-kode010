import { useAuth } from "../component/context/AuthContext"

function Login() {
  const { nama } = useAuth();

  return (
    <>
      <h2>Login: {nama}</h2>
      <p>Ini Login page</p>
    </>
  );
}

export default Login;
