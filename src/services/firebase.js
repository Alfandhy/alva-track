import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAvayRNuvtTPW71CYzF5137TNSL6BRMAK4",
  authDomain: "alva-track.firebaseapp.com",
  projectId: "alva-track",
  storageBucket: "alva-track.firebasestorage.app",
  messagingSenderId: "1063439106474",
  appId: "1:1063439106474:web:17ffec18054501ece46bd3",
  measurementId: "G-XB2KN59S84"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Auth Service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firestore Service
export const db = getFirestore(app);

// Aktifkan Offline Persistence agar aplikasi tetap jalan walau offline
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support all of the features required to enable persistence');
  }
});

export default app;
