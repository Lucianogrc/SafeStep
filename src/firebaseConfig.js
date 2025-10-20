import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0NIWKve7DSYRKaP_UaWH4NtKDk7NZ7eE",
  authDomain: "safestep-95a11.firebaseapp.com",
  projectId: "safestep-95a11",
  storageBucket: "safestep-95a11.appspot.com",
  messagingSenderId: "575156311551",
  appId: "1:575156311551:web:b7b8cfa7ddcf90d80b43ca",
  measurementId: "G-CV7ZK5RSH9",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
