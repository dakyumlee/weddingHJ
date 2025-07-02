import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCbp3j05DdHk9JtxTYHs7q03otwdPfDkmI",
  authDomain: "wedding-6c770.firebaseapp.com",
  projectId: "wedding-6c770",
  storageBucket: "wedding-6c770.firebasestorage.app",
  messagingSenderId: "100162941105",
  appId: "1:100162941105:web:3a02dea657d09326c6f290",
  measurementId: "G-D8S6495EG7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
