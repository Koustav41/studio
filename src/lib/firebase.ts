import { initializeApp, getApp, getApps } from 'firebase/app';

const firebaseConfig = {
  projectId: 'internship-compass-q9r3m',
  appId: '1:188086920375:web:0d3df2e286dccae06a1932',
  storageBucket: 'internship-compass-q9r3m.firebasestorage.app',
  apiKey: 'AIzaSyDBjuGLNpylkYafbnPwEkCLSkNc7IrvE3A',
  authDomain: 'internship-compass-q9r3m.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '188086920375',
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export { app };
