import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCujPDS23pUz42Q8HP59MwsBsvK5-glJoY",
  authDomain: "blog-application-774b9.firebaseapp.com",
  projectId: "blog-application-774b9",
  storageBucket: "blog-application-774b9.firebasestorage.app",
  messagingSenderId: "1083356885734",
  appId: "1:1083356885734:web:4871aa6a4a17d81142c127"
};

// Main app (for login, current session)
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Secondary app (ONLY for creating new users — no session switch)
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
export const secondaryAuth = getAuth(secondaryApp); 