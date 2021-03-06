export interface Environment {
  FIREBASE: Firebase;
  GOOGLE_ANALYTICS: string;
}

export interface Firebase {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
}
