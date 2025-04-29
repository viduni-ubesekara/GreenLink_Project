import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBi9D5nWm0AYK5s6AosR6kQ9ycBGHnKQ7I",
  authDomain: "inspiretech2024.firebaseapp.com",
  projectId: "inspiretech2024",
  storageBucket: "inspiretech2024.appspot.com",
  messagingSenderId: "241366797415",
  appId: "1:241366797415:web:b8d11ac3dff94260f6d8c2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);