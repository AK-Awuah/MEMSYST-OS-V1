import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import firebaseConfig from "./config"

let app: ReturnType<typeof initializeApp> | null = null

export function getFirebaseApp() {
  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
  }
  return app
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp())
}

export function getFirestoreDb() {
  return getFirestore(getFirebaseApp())
}

export function getFirebaseStorage() {
  return getStorage(getFirebaseApp())
}
