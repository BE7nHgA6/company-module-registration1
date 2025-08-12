// Firebase configuration and authentication services
import { initializeApp } from "firebase/app"
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  type User as FirebaseUser,
} from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

// Firebase authentication services
export class FirebaseAuthService {
  static async registerWithEmail(email: string, password: string): Promise<FirebaseUser> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return userCredential.user
  }

  static async loginWithEmail(email: string, password: string): Promise<FirebaseUser> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  }

  static async sendEmailVerification(user: FirebaseUser): Promise<void> {
    await sendEmailVerification(user)
  }

  static async sendSMSOTP(phoneNumber: string): Promise<string> {
    // This would typically use Firebase Phone Auth
    // For demo purposes, we'll simulate OTP generation
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    console.log(`SMS OTP for ${phoneNumber}: ${otp}`)
    return otp
  }

  static async verifySMSOTP(phoneNumber: string, otp: string): Promise<boolean> {
    // In a real implementation, this would verify against Firebase
    // For demo purposes, we'll accept any 6-digit OTP
    return otp.length === 6 && /^\d+$/.test(otp)
  }
}
