import { defineConfig } from "vite";

export default defineConfig({
  // Packaged Electron builds load dist/index.html through file://, so emitted
  // script and stylesheet URLs must be relative instead of /assets/... .
  base: "./"
});
