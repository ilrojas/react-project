/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_API_KEY_WEATHER: string;
    readonly VITE_API_KEY_MOVIES: string;
    readonly VITE_API_URL_WEATHER: string;
    readonly VITE_API_URL_MOVIES: string;
    // Agrega otras variables aquí
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }