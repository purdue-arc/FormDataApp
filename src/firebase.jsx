// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDb1_fM3bxDOr3W_vuSXJ8oL2eydo1QC3k",
    authDomain: "riseformdata.firebaseapp.com",
    databaseURL: "https://riseformdata-default-rtdb.firebaseio.com",
    projectId: "riseformdata",
    storageBucket: "riseformdata.appspot.com",
    messagingSenderId: "202062436177",
    appId: "1:202062436177:web:004e6564ae9b3bc2aba570",
    measurementId: "G-YE1W3PVFPP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
