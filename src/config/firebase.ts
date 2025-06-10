import { initializeApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';
import { getStorage } from '@react-native-firebase/storage';

// Configuration Firebase pour chopTime
const firebaseConfig = {
  apiKey: "AIzaSyCYRut0BEI-quqxUC_dTOnD5miU50SLwQ4", 
  authDomain: "choptime-fc06b.firebaseapp.com",
  projectId: "choptime-fc06b",
  storageBucket: "choptime-fc06b.appspot.com",
  messagingSenderId: "45040559711",
  appId: "1:45040559711:web:1234567890abcdef"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Initialisation des services
export const auth = getAuth();
export const firestore = getFirestore();
export const storage = getStorage();

export default app;
