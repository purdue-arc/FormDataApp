// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase configuration details
const firebaseConfig = {
    apiKey: "AIzaSyB-BSekH0apcYF4sAjUITcsAKPr4USBr_U",
    authDomain: "riseformdata.firebaseapp.com",
    databaseURL: "https://improvedformstorage.firebaseio.com",
    projectId: "riseformdata",
    storageBucket: "riseformdata.firebasestorage.app",
    messagingSenderId: "202062436177",
    appId: "1:202062436177:web:0320fd3531e0c194aba570",
    measurementId: "G-C2ZSD73JZV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export default db;