// src/firebase/config.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDD-WDPCDMgF48Ynr6mY7__MWDMQYmG4yo",
  authDomain: "todoapp-7afa3.firebaseapp.com",
  projectId: "todoapp-7afa3",
  storageBucket: "todoapp-7afa3.firebasestorage.app",
  messagingSenderId: "137155354338",
  appId: "1:137155354338:web:81098d90b4212c771988bb"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig)

// Firebase 서비스 내보내기
export const auth = getAuth(app)
export const db = getFirestore(app)
