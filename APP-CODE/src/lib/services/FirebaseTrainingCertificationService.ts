import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, updateDoc, deleteDoc, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ITrainingCertificationService } from "./ITrainingCertificationService"
import type { TrainingCertification, TrainingCertificationType, TrainingCertificationStatus } from "@/types"

const COLLECTION = "trainingCertifications"

function toTrainingCertification(id: string, data: Record<string, unknown>): TrainingCertification {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    learnerId: (data.learnerId as string) || "",
    learnerName: (data.learnerName as string) || "",
    courseId: data.courseId as string | undefined,
    programId: data.programId as string | undefined,
    type: (data.type as TrainingCertificationType) || "course_completion",
    credentialId: data.credentialId as string | undefined,
    status: (data.status as TrainingCertificationStatus) || "active",
    issuedAt: (data.issuedAt as string) || "",
    expiresAt: data.expiresAt as string | undefined,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || "",
  }
}

export class FirebaseTrainingCertificationService implements ITrainingCertificationService {
  private db = getFirestoreDb()

  async listCertifications(tenantId: string, params?: { learnerId?: string; type?: string; status?: string }): Promise<TrainingCertification[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("issuedAt", "desc")]
    if (params?.learnerId) constraints.unshift(where("learnerId", "==", params.learnerId))
    if (params?.type) constraints.unshift(where("type", "==", params.type))
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toTrainingCertification(d.id, d.data() as Record<string, unknown>))
  }

  async getCertification(id: string): Promise<TrainingCertification | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toTrainingCertification(snap.id, snap.data() as Record<string, unknown>)
  }

  async issueCertification(data: Omit<TrainingCertification, "id" | "createdAt" | "updatedAt">): Promise<TrainingCertification> {
    const ref = await addDoc(collection(this.db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return this.getCertification(ref.id) as Promise<TrainingCertification>
  }

  async revokeCertification(id: string): Promise<TrainingCertification> {
    await updateDoc(doc(this.db, COLLECTION, id), { status: "revoked", updatedAt: new Date().toISOString() })
    return this.getCertification(id) as Promise<TrainingCertification>
  }

  async getByLearner(learnerId: string, tenantId: string): Promise<TrainingCertification[]> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), where("learnerId", "==", learnerId)))
    return snap.docs.map((d) => toTrainingCertification(d.id, d.data() as Record<string, unknown>))
  }

  async deleteCertification(id: string): Promise<void> {
    await deleteDoc(doc(this.db, COLLECTION, id))
  }
}
