import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, updateDoc, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IProfessionalDevelopmentService } from "./IProfessionalDevelopmentService"
import type { ProfessionalDevelopment } from "@/types"

const COLLECTION = "professionalDevelopments"

function toProfessionalDevelopment(id: string, data: Record<string, unknown>): ProfessionalDevelopment {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    learnerId: (data.learnerId as string) || "",
    learnerName: (data.learnerName as string) || "",
    coursesTaken: (data.coursesTaken as number) || 0,
    trainingHours: (data.trainingHours as number) || 0,
    certificationsEarned: (data.certificationsEarned as number) || 0,
    skillsAchieved: (data.skillsAchieved as string[]) || [],
    professionalCredits: (data.professionalCredits as number) || 0,
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || "",
  }
}

export class FirebaseProfessionalDevelopmentService implements IProfessionalDevelopmentService {
  private db = getFirestoreDb()

  async listProfessionalDevelopments(tenantId: string): Promise<ProfessionalDevelopment[]> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("updatedAt", "desc")))
    return snap.docs.map((d) => toProfessionalDevelopment(d.id, d.data() as Record<string, unknown>))
  }

  async getProfessionalDevelopment(id: string): Promise<ProfessionalDevelopment | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toProfessionalDevelopment(snap.id, snap.data() as Record<string, unknown>)
  }

  async getByLearner(learnerId: string, tenantId: string): Promise<ProfessionalDevelopment[]> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("learnerId", "==", learnerId), where("tenantId", "==", tenantId)))
    return snap.docs.map((d) => toProfessionalDevelopment(d.id, d.data() as Record<string, unknown>))
  }

  async createProfessionalDevelopment(data: Omit<ProfessionalDevelopment, "id">): Promise<ProfessionalDevelopment> {
    const ref = await addDoc(collection(this.db, COLLECTION), {
      ...data,
      updatedAt: new Date().toISOString(),
    })
    return this.getProfessionalDevelopment(ref.id) as Promise<ProfessionalDevelopment>
  }

  async updateProfessionalDevelopment(id: string, data: Partial<ProfessionalDevelopment>): Promise<ProfessionalDevelopment> {
    await updateDoc(doc(this.db, COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
    return this.getProfessionalDevelopment(id) as Promise<ProfessionalDevelopment>
  }
}
