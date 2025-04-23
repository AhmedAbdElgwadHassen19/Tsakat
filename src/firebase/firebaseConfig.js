import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAc_6FuRC7M1NiCo4N-1EitT-0R-vNUyys",
    authDomain: "team-84c79.firebaseapp.com",
    projectId: "team-84c79",
    storageBucket: "team-84c79.firebasestorage.app",
    messagingSenderId: "1016362926259",
    appId: "1:1016362926259:web:702ee7054d815f571ab0c6",
    measurementId: "G-29LFDTRRCE"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };