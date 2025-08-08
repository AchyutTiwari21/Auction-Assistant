declare global {
  interface Window {
    omnidimension?: {
      setUserContext: (context: { jwt: string }) => void;
    };
  }
}

export {};
