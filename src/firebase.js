import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBZIdcBCt95b9Nf9GBynVCOzhDTlRX0wrk",
  authDomain: "blog-7-539e1.firebaseapp.com",
  projectId: "blog-7-539e1",
  storageBucket: "blog-7-539e1.firebasestorage.app",
  messagingSenderId: "697849430301",
  appId: "1:697849430301:web:b56a3bf7db1371c65b21f4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export default db;