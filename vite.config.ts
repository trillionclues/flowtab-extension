import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        popup: "src/popup/popup.html",
        background: "src/background.ts",
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === "background") return "background.js";
          return "popup/[name].js";
        },
      },
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: "public/manifest.json", dest: "." },
        { src: "src/popup/popup.html", dest: "popup" },
        { src: "src/popup/popup.css", dest: "popup" },
        { src: "public/icons", dest: "." },
      ],
    }),
  ],
});
