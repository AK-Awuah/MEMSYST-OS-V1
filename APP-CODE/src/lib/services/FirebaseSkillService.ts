import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, updateDoc, deleteDoc, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ISkillService } from "./ISkillService"
import type { Skill, LearnerSkill } from "@/types"

const SKILLS_COLLECTION = "skills"
const LEARNER_SKILLS_COLLECTION = "learnerSkills"

function toSkill(id: string, data: Record<string, unknown>): Skill {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    name: (data.name as string) || "",
    category: (data.category as string) || "",
    description: data.description as string | undefined,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
  }
}

function toLearnerSkill(id: string, data: Record<string, unknown>): LearnerSkill {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    learnerId: (data.learnerId as string) || "",
    skillId: (data.skillId as string) || "",
    skillName: (data.skillName as string) || "",
    competencyLevel: (data.competencyLevel as string) || "",
    dateAchieved: (data.dateAchieved as string) || "",
    verifiedBy: data.verifiedBy as string | undefined,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || "",
  }
}

export class FirebaseSkillService implements ISkillService {
  private db = getFirestoreDb()

  async listSkills(tenantId: string): Promise<Skill[]> {
    const col = collection(this.db, SKILLS_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("name", "asc")))
    return snap.docs.map((d) => toSkill(d.id, d.data() as Record<string, unknown>))
  }

  async getSkill(id: string): Promise<Skill | null> {
    const snap = await getDoc(doc(this.db, SKILLS_COLLECTION, id))
    if (!snap.exists()) return null
    return toSkill(snap.id, snap.data() as Record<string, unknown>)
  }

  async createSkill(data: Omit<Skill, "id" | "createdAt">): Promise<Skill> {
    const ref = await addDoc(collection(this.db, SKILLS_COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
    })
    return this.getSkill(ref.id) as Promise<Skill>
  }

  async updateSkill(id: string, data: Partial<Skill>): Promise<Skill> {
    await updateDoc(doc(this.db, SKILLS_COLLECTION, id), { ...data })
    return this.getSkill(id) as Promise<Skill>
  }

  async deleteSkill(id: string): Promise<void> {
    await deleteDoc(doc(this.db, SKILLS_COLLECTION, id))
  }

  async listLearnerSkills(tenantId: string, learnerId?: string): Promise<LearnerSkill[]> {
    const col = collection(this.db, LEARNER_SKILLS_COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("dateAchieved", "desc")]
    if (learnerId) constraints.unshift(where("learnerId", "==", learnerId))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toLearnerSkill(d.id, d.data() as Record<string, unknown>))
  }

  async addLearnerSkill(data: Omit<LearnerSkill, "id" | "createdAt" | "updatedAt">): Promise<LearnerSkill> {
    const ref = await addDoc(collection(this.db, LEARNER_SKILLS_COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return this.getSkill(ref.id) as unknown as Promise<LearnerSkill>
  }

  async updateLearnerSkill(id: string, data: Partial<LearnerSkill>): Promise<LearnerSkill> {
    await updateDoc(doc(this.db, LEARNER_SKILLS_COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
    return this.getSkill(id) as unknown as Promise<LearnerSkill>
  }

  async removeLearnerSkill(id: string): Promise<void> {
    await deleteDoc(doc(this.db, LEARNER_SKILLS_COLLECTION, id))
  }
}
