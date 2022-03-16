import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCpvffjOKqFxC5M56tlcvrVkjiB47o8kkw",
  authDomain: "kred-partner.firebaseapp.com",
  projectId: "kred-partner",
  storageBucket: "kred-partner.appspot.com",
  messagingSenderId: "297697003990",
  appId: "1:297697003990:web:d49107a68ec8b74c903c77",
  measurementId: "G-LPT97D4EQR",
}

const app = initializeApp(firebaseConfig)
// export const analytics = getAnalytics(app)
export const auth = getAuth(app)
