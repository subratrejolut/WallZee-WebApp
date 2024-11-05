import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBiQHUyKCkf0hnWHl4kHvOrOULeXR-L79I",
  authDomain: "wallzee-857fd.firebaseapp.com",
  projectId: "wallzee-857fd",
  storageBucket: "wallzee-857fd.appspot.com",
  messagingSenderId: "677784362237",
  appId: "1:677784362237:web:d0417c8352badc5d90f294",
  measurementId: "G-B0V77K1FMF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
