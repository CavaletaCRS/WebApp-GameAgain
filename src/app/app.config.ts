import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// import { getAnalytics } from "firebase/analytics";

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]

  
};

const firebaseConfig = {
  apiKey: "AIzaSyCaoi6qLB70PHQgcphXSLu7wefC-whCnOg",
  authDomain: "game-again-app.firebaseapp.com",
  projectId: "game-again-app",
  storageBucket: "game-again-app.firebasestorage.app",
  messagingSenderId: "1041418939842",
  appId: "1:1041418939842:web:2e341b4f918a115e6afa5b",
  measurementId: "G-XPZ56868M6"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
