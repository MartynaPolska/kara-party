// src/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCkRUzOAjO7aPJh4Ik8mxCqku5O4Clvj7w",
    authDomain: "kara-party-lk.firebaseapp.com",
    projectId: "kara-party-lk",
    storageBucket: "kara-party-lk.firebasestorage.app",
    messagingSenderId: "927466164698",
    appId: "1:927466164698:web:17e79f28db34dabdfdf0e3"
  };

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
