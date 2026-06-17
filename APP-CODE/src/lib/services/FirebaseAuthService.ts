import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth"
import { doc, getDoc, setDoc, updateDoc, collection, query, getDocs } from "firebase/firestore"
import { getFirebaseAuth, getFirestoreDb } from "@/lib/firebase/client"
import type { IAuthService } from "./IAuthService"
import type { MemsystUser, UserRole } from "@/types"

function mapFirebaseUser(fbUser: FirebaseUser, profile: MemsystUser): MemsystUser {
  return {
    id: fbUser.uid,
    tenantId: profile.tenantId,
    email: fbUser.email || profile.email,
    emailVerified: fbUser.emailVerified,
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone || fbUser.phoneNumber || "",
    username: profile.username || "",
    role: profile.role,
    permissions: profile.permissions,
    status: profile.status,
    photoURL: fbUser.photoURL || profile.photoURL,
    createdAt: profile.createdAt,
    updatedAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  }
}

export class FirebaseAuthService implements IAuthService {
  private auth = getFirebaseAuth()
  private db = getFirestoreDb()

  async login(email: string, password: string): Promise<MemsystUser> {
    const cred = await signInWithEmailAndPassword(this.auth, email, password)
    let profile = await this.getUserProfile(cred.user.uid)
    if (!profile) {
      const now = new Date().toISOString()
      profile = {
        id: cred.user.uid,
        tenantId: "",
        email: cred.user.email || email,
        emailVerified: cred.user.emailVerified,
        firstName: cred.user.displayName?.split(" ")[0] || email.split("@")[0],
        lastName: cred.user.displayName?.split(" ").slice(1).join(" ") || "",
        phone: cred.user.phoneNumber || "",
        username: email.split("@")[0],
        role: "super_admin",
        permissions: ["*"],
        status: "active",
        photoURL: cred.user.photoURL || "",
        createdAt: now,
        updatedAt: now,
      }
      await setDoc(doc(this.db, "users", cred.user.uid), profile)
    }
    return mapFirebaseUser(cred.user, profile)
  }

  async logout(): Promise<void> {
    await signOut(this.auth)
  }

  async getCurrentUser(): Promise<MemsystUser | null> {
    const fbUser = this.auth.currentUser
    if (!fbUser) return null
    const profile = await this.getUserProfile(fbUser.uid)
    if (!profile) return null
    return mapFirebaseUser(fbUser, profile)
  }

  onAuthStateChanged(callback: (user: MemsystUser | null) => void): () => void {
    return firebaseOnAuthStateChanged(this.auth, async (fbUser) => {
      if (!fbUser) {
        callback(null)
        return
      }
      const profile = await this.getUserProfile(fbUser.uid)
      if (!profile) {
        callback(null)
        return
      }
      callback(mapFirebaseUser(fbUser, profile))
    })
  }

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email)
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const fbUser = this.auth.currentUser
    if (!fbUser || !fbUser.email) throw new Error("Not authenticated")
    const cred = EmailAuthProvider.credential(fbUser.email, currentPassword)
    await reauthenticateWithCredential(fbUser, cred)
    await updatePassword(fbUser, newPassword)
  }

  async updateProfile(data: Partial<MemsystUser>): Promise<MemsystUser> {
    const fbUser = this.auth.currentUser
    if (!fbUser) throw new Error("Not authenticated")
    const ref = doc(this.db, "users", fbUser.uid)
    await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() })
    const profile = await this.getUserProfile(fbUser.uid)
    if (!profile) throw new Error("Profile not found after update")
    return mapFirebaseUser(fbUser, profile)
  }

  async createUser(email: string, password: string, name: string, role: UserRole): Promise<MemsystUser> {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password)
    const [firstName, lastName] = name.split(" ")
    const now = new Date().toISOString()
    const newUser: MemsystUser = {
      id: cred.user.uid,
      tenantId: "",
      email,
      emailVerified: false,
      firstName: firstName || name,
      lastName: lastName || "",
      phone: "",
      username: email.split("@")[0],
      role,
      permissions: this.getDefaultPermissions(role),
      status: "active",
      createdAt: now,
      updatedAt: now,
    }
    await setDoc(doc(this.db, "users", cred.user.uid), newUser)
    return newUser
  }

  async updateUser(userId: string, data: Partial<MemsystUser>): Promise<MemsystUser> {
    const ref = doc(this.db, "users", userId)
    await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() })
    const snap = await getDoc(ref)
    if (!snap.exists()) throw new Error("User not found")
      const profile = { ...snap.data() as MemsystUser }
      const fbUser = this.auth.currentUser
      if (fbUser && fbUser.uid === userId) return mapFirebaseUser(fbUser, profile)
      return profile
  }

  async deactivateUser(userId: string): Promise<void> {
    const ref = doc(this.db, "users", userId)
    await updateDoc(ref, { status: "inactive", updatedAt: new Date().toISOString() })
  }

  async adminResetPassword(_userId: string, _newPassword: string): Promise<void> {
    throw new Error("Admin password reset requires Firebase Admin SDK. Use Firebase Console or create a Cloud Function.")
  }

  async listUsers(): Promise<MemsystUser[]> {
    const col = collection(this.db, "users")
    const snap = await getDocs(query(col))
    return snap.docs.map((d) => d.data() as MemsystUser)
  }

  hasPermission(user: MemsystUser, permission: string): boolean {
    if (user.permissions.includes("*")) return true
    return user.permissions.includes(permission)
  }

  private async getUserProfile(uid: string): Promise<MemsystUser | null> {
    const ref = doc(this.db, "users", uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    return snap.data() as MemsystUser
  }

  private getDefaultPermissions(role: UserRole): string[] {
    switch (role) {
      case "super_admin": return ["*"]
      case "operations_admin": return ["leads:read", "leads:write", "forms:read", "forms:write", "organizations:read"]
      case "sales_admin": return ["leads:read", "leads:write", "crm:read", "crm:write"]
      case "support_admin": return ["forms:read", "forms:write", "notifications:read"]
    }
  }
}
