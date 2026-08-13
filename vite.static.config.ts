import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  root: "static",
  publicDir: "../public",
  build: {
    outDir: "../dist-static",
    emptyOutDir: true,
  },
  plugins: [react()],
});
