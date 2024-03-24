// vite.config.js
import { defineConfig } from "file:///home/media/PhantomSDR/html-svelte/node_modules/.pnpm/vite@5.2.5_terser@5.29.2/node_modules/vite/dist/node/index.js";
import { svelte } from "file:///home/media/PhantomSDR/html-svelte/node_modules/.pnpm/@sveltejs+vite-plugin-svelte@3.0.2_svelte@4.2.12_vite@5.2.5/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
import legacy from "file:///home/media/PhantomSDR/html-svelte/node_modules/.pnpm/@vitejs+plugin-legacy@5.3.2_terser@5.29.2_vite@5.2.5/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
import { visualizer } from "file:///home/media/PhantomSDR/html-svelte/node_modules/.pnpm/rollup-plugin-visualizer@5.12.0/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import wasm from "file:///home/media/PhantomSDR/html-svelte/node_modules/.pnpm/vite-plugin-wasm@3.3.0_vite@5.2.5/node_modules/vite-plugin-wasm/exports/import.mjs";
import topLevelAwait from "file:///home/media/PhantomSDR/html-svelte/node_modules/.pnpm/vite-plugin-top-level-await@1.4.1_vite@5.2.5/node_modules/vite-plugin-top-level-await/exports/import.mjs";
var vite_config_default = defineConfig({
  plugins: [
    wasm(),
    svelte(),
    topLevelAwait(),
    legacy({
      targets: ["ie >= 11"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"]
    })
  ],
  server: {
    proxy: {
      "/audio": {
        target: "http://localhost:9002",
        ws: true
      },
      "/waterfall": {
        target: "http://localhost:9002",
        ws: true
      },
      "/events": {
        target: "http://localhost:9002",
        ws: true
      },
      "/signal": {
        target: "http://localhost:9002",
        ws: true
      }
    }
  },
  define: {
    __filename: JSON.stringify("")
  },
  build: {
    minify: true,
    rollupOptions: {
      output: {},
      plugins: [visualizer()]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9tZWRpYS9QaGFudG9tU0RSL2h0bWwtc3ZlbHRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9tZWRpYS9QaGFudG9tU0RSL2h0bWwtc3ZlbHRlL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL21lZGlhL1BoYW50b21TRFIvaHRtbC1zdmVsdGUvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgc3ZlbHRlIH0gZnJvbSAnQHN2ZWx0ZWpzL3ZpdGUtcGx1Z2luLXN2ZWx0ZSdcbmltcG9ydCBsZWdhY3kgZnJvbSAnQHZpdGVqcy9wbHVnaW4tbGVnYWN5J1xuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcidcbmltcG9ydCB3YXNtIGZyb20gJ3ZpdGUtcGx1Z2luLXdhc20nO1xuaW1wb3J0IHRvcExldmVsQXdhaXQgZnJvbSAndml0ZS1wbHVnaW4tdG9wLWxldmVsLWF3YWl0J1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHdhc20oKSxcbiAgICBzdmVsdGUoKSxcbiAgICB0b3BMZXZlbEF3YWl0KCksXG4gICAgbGVnYWN5KHtcbiAgICAgIHRhcmdldHM6IFsnaWUgPj0gMTEnXSxcbiAgICAgIGFkZGl0aW9uYWxMZWdhY3lQb2x5ZmlsbHM6IFsncmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lJ11cbiAgICB9KVxuICBdLFxuICBzZXJ2ZXI6IHtcbiAgICBwcm94eToge1xuICAgICAgJy9hdWRpbyc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo5MDAyJyxcbiAgICAgICAgd3M6IHRydWVcbiAgICAgIH0sXG4gICAgICAnL3dhdGVyZmFsbCc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo5MDAyJyxcbiAgICAgICAgd3M6IHRydWVcbiAgICAgIH0sXG4gICAgICAnL2V2ZW50cyc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo5MDAyJyxcbiAgICAgICAgd3M6IHRydWVcbiAgICAgIH0sXG4gICAgICAnL3NpZ25hbCc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo5MDAyJyxcbiAgICAgICAgd3M6IHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGRlZmluZToge1xuICAgIF9fZmlsZW5hbWU6IEpTT04uc3RyaW5naWZ5KCcnKVxuICB9LFxuICBidWlsZDoge1xuICAgIG1pbmlmeTogdHJ1ZSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgIH0sXG4gICAgICBwbHVnaW5zOiBbdmlzdWFsaXplcigpXVxuICAgIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBd1IsU0FBUyxvQkFBb0I7QUFDclQsU0FBUyxjQUFjO0FBQ3ZCLE9BQU8sWUFBWTtBQUNuQixTQUFTLGtCQUFrQjtBQUMzQixPQUFPLFVBQVU7QUFDakIsT0FBTyxtQkFBbUI7QUFHMUIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsS0FBSztBQUFBLElBQ0wsT0FBTztBQUFBLElBQ1AsY0FBYztBQUFBLElBQ2QsT0FBTztBQUFBLE1BQ0wsU0FBUyxDQUFDLFVBQVU7QUFBQSxNQUNwQiwyQkFBMkIsQ0FBQyw2QkFBNkI7QUFBQSxJQUMzRCxDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsVUFBVTtBQUFBLFFBQ1IsUUFBUTtBQUFBLFFBQ1IsSUFBSTtBQUFBLE1BQ047QUFBQSxNQUNBLGNBQWM7QUFBQSxRQUNaLFFBQVE7QUFBQSxRQUNSLElBQUk7QUFBQSxNQUNOO0FBQUEsTUFDQSxXQUFXO0FBQUEsUUFDVCxRQUFRO0FBQUEsUUFDUixJQUFJO0FBQUEsTUFDTjtBQUFBLE1BQ0EsV0FBVztBQUFBLFFBQ1QsUUFBUTtBQUFBLFFBQ1IsSUFBSTtBQUFBLE1BQ047QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sWUFBWSxLQUFLLFVBQVUsRUFBRTtBQUFBLEVBQy9CO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDYixRQUFRLENBQ1I7QUFBQSxNQUNBLFNBQVMsQ0FBQyxXQUFXLENBQUM7QUFBQSxJQUN4QjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
