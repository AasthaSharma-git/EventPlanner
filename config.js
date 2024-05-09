// Your web app's Firebase configuration
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyA4UuMrtEO7PQOSqeqluCT2xkczOFvdRk0",
  authDomain: "drive-and-help-b8f62.firebaseapp.com",
  databaseURL: "https://drive-and-help-b8f62-default-rtdb.firebaseio.com",
  projectId: "drive-and-help-b8f62",
  storageBucket: "drive-and-help-b8f62.appspot.com",
  messagingSenderId: "516110977717",
  appId: "1:516110977717:web:63c3eb8f82d755c62e0cfc"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default db;