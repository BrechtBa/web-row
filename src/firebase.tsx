import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyBCafCO5rNUkM8-bvIftApH9HZK3UTHLOI",
  authDomain: "web-row.firebaseapp.com",
  databaseURL: "https://web-row-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "web-row",
  storageBucket: "web-row.appspot.com",
  messagingSenderId: "307375878701",
  appId: "1:307375878701:web:7c36852a3aaf949dda7ea4"
};

export const app = initializeApp(firebaseConfig);
