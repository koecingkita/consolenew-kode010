import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import solidPlugin from "vite-plugin-solid";
import devtools from "solid-devtools/vite";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return defineConfig({
    plugins: [devtools(), solidPlugin(), tailwindcss()],
    server: {
      host: true,
      port: Number(env.VITE_PORT),
      staticPort: true,
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true
        }
      }
    },
    build: {
      target: "esnext",
    },

  });
};
