import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDbz21NsL-GNhIMHVd_dBm8buYVLVsut9o",
  authDomain: "todo-app-zhang.firebaseapp.com",
  projectId: "todo-app-zhang",
  storageBucket: "todo-app-zhang.firebasestorage.app",
  messagingSenderId: "195702426415",
  appId: "1:195702426415:web:46bbf057b11c7e47362fda",
  measurementId: "G-LBRHP4JWFM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
