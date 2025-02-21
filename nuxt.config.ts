// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from "@primevue/themes/aura";
import { defineNuxtConfig } from "nuxt/config";
import { definePreset } from "@primevue/themes";

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{slate.50}",
      100: "{slate.100}",
      200: "{slate.200}",
      300: "{slate.300}",
      400: "{slate.400}",
      500: "#000",
      600: "{slate.600}",
      700: "{slate.700}",
      800: "{slate.800}",
      900: "{slate.900}",
      950: "{slate.950}",
    },
  },
});

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module"
  ],
  primevue: {
    options: {
      theme: {
        preset: MyPreset,
      },
    },
  },
  css: ["primeicons/primeicons.css"],
  plugins: ["~/plugins/api.ts", "~/plugins/auth.ts"],
  runtimeConfig: {
    apiBaseUrl: process.env.NUXT_API_URL, // URL base para las peticiones API
  },
});
