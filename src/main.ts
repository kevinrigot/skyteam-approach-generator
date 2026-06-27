import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDL4BzWgpuvlzT7JEDquFteFc_e3D7h6qU",
  authDomain: "skyteam-approach-generator.firebaseapp.com",
  projectId: "skyteam-approach-generator",
  storageBucket: "skyteam-approach-generator.firebasestorage.app",
  messagingSenderId: "687743733818",
  appId: "1:687743733818:web:de0d2521f61664bf886503",
  measurementId: "G-WY79GE9N8Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
