import { collection, addDoc, getDocs, doc, query, where, updateDoc, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IMemberCommunicationService } from "./IMemberCommunicationService"
import type { MemberCommunication } from "@/types"

const COLLECTION = "memberCommunications"

function toPrefs(id: string, data: Record<string, unknown>): MemberCommunication {
  return {
    id, tenantId: (data.tenantId as string) || "", memberId: (data.memberId as string) || "",
    email: (data.email as boolean) ?? true, sms: (data.sms as boolean) ?? false,
    push: (data.push as boolean) ?? false, inApp: (data.inApp as boolean) ?? true,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

export class FirebaseMemberCommunicationService implements IMemberCommunicationService {
  private db = getFirestoreDb()

  async getPreferences(memberId: string): Promise<MemberCommunication | null> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("memberId", "==", memberId)))
    if (snap.empty) return null
    const d = snap.docs[0]
    return toPrefs(d.id, d.data() as Record<string, unknown>)
  }

  async updatePreferences(memberId: string, data: Partial<MemberCommunication>): Promise<void> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("memberId", "==", memberId)))
    if (snap.empty) {
      await addDoc(col, { ...data, memberId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    } else {
      await updateDoc(doc(this.db, COLLECTION, snap.docs[0].id), { ...data, updatedAt: new Date().toISOString() })
    }
  }
}
