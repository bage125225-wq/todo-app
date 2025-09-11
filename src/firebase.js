// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  // Firestore

// 你的 Firebase 配置信息
const firebaseConfig = {
  apiKey: "AIzaSyDbz21NsL-GNhIMHVd_dBm8buYVLVsut9o",
  authDomain: "todo-app-zhang.firebaseapp.com",
  projectId: "todo-app-zhang",
  storageBucket: "todo-app-zhang.firebasestorage.app",
  messagingSenderId: "195702426415",
  appId: "1:195702426415:web:46bbf057b11c7e47362fda",
  measurementId: "G-LBRHP4JWFM"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 初始化 Firestore
const db = getFirestore(app);

export { db };
