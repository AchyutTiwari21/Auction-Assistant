declare global {
  interface Window {
    omnidimension?: {
      setUserContext: (context: { jwt: string | null }) => void;
    };
  }
}

export {};
