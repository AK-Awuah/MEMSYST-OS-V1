import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, updateDoc, deleteDoc, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IExaminationService } from "./IExaminationService"
import type { Examination, ExaminationResult, ExaminationStatus, AssessmentResult } from "@/types"

const EXAM_COLLECTION = "examinations"
const RESULTS_COLLECTION = "examinationResults"

function toExamination(id: string, data: Record<string, unknown>): Examination {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    courseId: (data.courseId as string) || "",
    title: (data.title as string) || "",
    scheduledDate: (data.scheduledDate as string) || "",
    duration: (data.duration as string) || "",
    status: (data.status as ExaminationStatus) || "scheduled",
    registeredCandidates: (data.registeredCandidates as number) || 0,
    resultsPublished: (data.resultsPublished as boolean) || false,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || "",
  }
}

function toExaminationResult(id: string, data: Record<string, unknown>): ExaminationResult {
  return {
    id,
    examinationId: (data.examinationId as string) || "",
    learnerId: (data.learnerId as string) || "",
    learnerName: (data.learnerName as string) || "",
    score: data.score as number | undefined,
    result: data.result as AssessmentResult | undefined,
    approved: (data.approved as boolean) || false,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
  }
}

export class FirebaseExaminationService implements IExaminationService {
  private db = getFirestoreDb()

  async listExaminations(tenantId: string, params?: { courseId?: string; status?: string }): Promise<Examination[]> {
    const col = collection(this.db, EXAM_COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("scheduledDate", "desc")]
    if (params?.courseId) constraints.unshift(where("courseId", "==", params.courseId))
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toExamination(d.id, d.data() as Record<string, unknown>))
  }

  async getExamination(id: string): Promise<Examination | null> {
    const snap = await getDoc(doc(this.db, EXAM_COLLECTION, id))
    if (!snap.exists()) return null
    return toExamination(snap.id, snap.data() as Record<string, unknown>)
  }

  async createExamination(data: Omit<Examination, "id" | "createdAt" | "updatedAt">): Promise<Examination> {
    const ref = await addDoc(collection(this.db, EXAM_COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return this.getExamination(ref.id) as Promise<Examination>
  }

  async updateExamination(id: string, data: Partial<Examination>): Promise<Examination> {
    await updateDoc(doc(this.db, EXAM_COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
    return this.getExamination(id) as Promise<Examination>
  }

  async scheduleExam(data: Omit<Examination, "id" | "createdAt" | "updatedAt">): Promise<Examination> {
    return this.createExamination(data)
  }

  async publishResults(id: string): Promise<Examination> {
    await updateDoc(doc(this.db, EXAM_COLLECTION, id), { resultsPublished: true, updatedAt: new Date().toISOString() })
    return this.getExamination(id) as Promise<Examination>
  }

  async registerCandidate(examinationId: string, _learnerId: string, _learnerName: string): Promise<void> {
    const ref = await addDoc(collection(this.db, RESULTS_COLLECTION), {
      examinationId,
      learnerId: _learnerId,
      learnerName: _learnerName,
      approved: false,
      createdAt: new Date().toISOString(),
    })
    const exam = await this.getExamination(examinationId)
    if (exam) {
      await updateDoc(doc(this.db, EXAM_COLLECTION, examinationId), {
        registeredCandidates: (exam.registeredCandidates || 0) + 1,
        updatedAt: new Date().toISOString(),
      })
    }
  }

  async getResults(examinationId: string): Promise<ExaminationResult[]> {
    const col = collection(this.db, RESULTS_COLLECTION)
    const snap = await getDocs(query(col, where("examinationId", "==", examinationId)))
    return snap.docs.map((d) => toExaminationResult(d.id, d.data() as Record<string, unknown>))
  }

  async deleteExamination(id: string): Promise<void> {
    const results = await this.getResults(id)
    for (const r of results) {
      await deleteDoc(doc(this.db, RESULTS_COLLECTION, r.id))
    }
    await deleteDoc(doc(this.db, EXAM_COLLECTION, id))
  }
}
