declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_GOOGLE_MAPS_KEY: string;
    }
  }
}

export {};