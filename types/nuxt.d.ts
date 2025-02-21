// types/nuxt.d.ts
import { NuxtApp } from '#app';

declare module '#app' {
  interface NuxtApp {
    $API: (method: string, endpoint: string, body?: any) => Promise<any>;
  }
}
