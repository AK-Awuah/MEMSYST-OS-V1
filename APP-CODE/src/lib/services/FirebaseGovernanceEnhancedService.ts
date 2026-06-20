import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IGovernanceEnhancedService } from "./IGovernanceEnhancedService"
import type {
  Election,
  Candidate,
  Vote,
  Committee,
  CommitteeMeeting,
  Resolution,
  GovernanceDashboardMetrics,
  GovernanceAuditLog,
} from "@/types"

const ELECTIONS_COL = "governanceElections"
const CANDIDATES_COL = "governanceCandidates"
const VOTES_COL = "governanceVotes"
const COMMITTEES_COL = "governanceCommittees"
const MEETINGS_COL = "governanceMeetings"
const RESOLUTIONS_COL = "governanceResolutions"
const AUDIT_COL = "governanceAuditLogs"

function toElection(id: string, data: Record<string, unknown>): Election {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    title: (data.title as string) || "",
    description: (data.description as string) || "",
    positionId: (data.positionId as string) || "",
    positionName: (data.positionName as string) || "",
    organizationalLevel: (data.organizationalLevel as string) || "",
    nominationStartDate: (data.nominationStartDate as string) || "",
    nominationEndDate: (data.nominationEndDate as string) || "",
    votingStartDate: (data.votingStartDate as string) || "",
    votingEndDate: (data.votingEndDate as string) || "",
    maxCandidates: (data.maxCandidates as number) || 0,
    minVotesPerVoter: (data.minVotesPerVoter as number) || 1,
    maxVotesPerVoter: (data.maxVotesPerVoter as number) || 1,
    isAnonymous: (data.isAnonymous as boolean) || false,
    requiresTwoFactorAuth: (data.requiresTwoFactorAuth as boolean) || false,
    status: (data.status as Election["status"]) || "draft",
    totalVoters: (data.totalVoters as number) || 0,
    totalVotesCast: (data.totalVotesCast as number) || 0,
    voterTurnout: (data.voterTurnout as number) || 0,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toCandidate(id: string, data: Record<string, unknown>): Candidate {
  return {
    id,
    electionId: (data.electionId as string) || "",
    tenantId: (data.tenantId as string) || "",
    memberId: (data.memberId as string) || "",
    memberName: (data.memberName as string) || "",
    photo: (data.photo as string) || undefined,
    manifesto: (data.manifesto as string) || "",
    biography: (data.biography as string) || "",
    nominationDate: (data.nominationDate as string) || "",
    nominationApproved: (data.nominationApproved as boolean) || false,
    approvedBy: (data.approvedBy as string) || undefined,
    voteCount: (data.voteCount as number) || 0,
    status: (data.status as Candidate["status"]) || "nominated",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
  }
}

function toVote(id: string, data: Record<string, unknown>): Vote {
  return {
    id,
    electionId: (data.electionId as string) || "",
    tenantId: (data.tenantId as string) || "",
    voterId: (data.voterId as string) || "",
    candidateId: (data.candidateId as string) || "",
    votedAt: data.votedAt instanceof Timestamp ? data.votedAt.toDate().toISOString() : (data.votedAt as string) || "",
    transactionHash: (data.transactionHash as string) || undefined,
    isVerified: (data.isVerified as boolean) || false,
  }
}

function toCommittee(id: string, data: Record<string, unknown>): Committee {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    name: (data.name as string) || "",
    description: (data.description as string) || "",
    committeeType: (data.committeeType as Committee["committeeType"]) || "standing",
    parentCommitteeId: (data.parentCommitteeId as string) || undefined,
    chairpersonId: (data.chairpersonId as string) || "",
    chairpersonName: (data.chairpersonName as string) || "",
    viceChairpersonId: (data.viceChairpersonId as string) || undefined,
    viceChairpersonName: (data.viceChairpersonName as string) || undefined,
    secretaryId: (data.secretaryId as string) || undefined,
    secretaryName: (data.secretaryName as string) || undefined,
    members: (data.members as Committee["members"]) || [],
    meetingFrequency: (data.meetingFrequency as string) || "",
    quorumRequired: (data.quorumRequired as number) || 0,
    formationDate: (data.formationDate as string) || "",
    dissolutionDate: (data.dissolutionDate as string) || undefined,
    status: (data.status as Committee["status"]) || "active",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toMeeting(id: string, data: Record<string, unknown>): CommitteeMeeting {
  return {
    id,
    committeeId: (data.committeeId as string) || "",
    committeeName: (data.committeeName as string) || "",
    tenantId: (data.tenantId as string) || "",
    title: (data.title as string) || "",
    agenda: (data.agenda as string) || "",
    minutes: (data.minutes as string) || undefined,
    meetingDate: (data.meetingDate as string) || "",
    startTime: (data.startTime as string) || "",
    endTime: (data.endTime as string) || undefined,
    location: (data.location as string) || undefined,
    virtualLink: (data.virtualLink as string) || undefined,
    status: (data.status as CommitteeMeeting["status"]) || "scheduled",
    attendees: (data.attendees as CommitteeMeeting["attendees"]) || [],
    resolutions: (data.resolutions as CommitteeMeeting["resolutions"]) || [],
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toResolution(id: string, data: Record<string, unknown>): Resolution {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    title: (data.title as string) || "",
    description: (data.description as string) || "",
    proposedById: (data.proposedById as string) || "",
    proposedByName: (data.proposedByName as string) || "",
    meetingId: (data.meetingId as string) || undefined,
    committeeId: (data.committeeId as string) || undefined,
    voteCount: (data.voteCount as number) || 0,
    votesFor: (data.votesFor as number) || 0,
    votesAgainst: (data.votesAgainst as number) || 0,
    votesAbstain: (data.votesAbstain as number) || 0,
    status: (data.status as Resolution["status"]) || "proposed",
    implementationNotes: (data.implementationNotes as string) || undefined,
    implementedDate: (data.implementedDate as string) || undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toAuditLog(id: string, data: Record<string, unknown>): GovernanceAuditLog {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    actor: (data.actor as string) || "",
    action: (data.action as GovernanceAuditLog["action"]) || "election_created",
    recordType: (data.recordType as string) || "",
    recordId: (data.recordId as string) || "",
    previousValue: (data.previousValue as string) || undefined,
    newValue: (data.newValue as string) || undefined,
    details: (data.details as string) || undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
  }
}

export class FirebaseGovernanceEnhancedService implements IGovernanceEnhancedService {
  private db = getFirestoreDb()

  // ---- Elections ----

  async listElections(tenantId: string): Promise<Election[]> {
    const col = collection(this.db, ELECTIONS_COL)
    const q = query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc"))
    const snap = await getDocs(q)
    return snap.docs.map((d) => toElection(d.id, d.data() as Record<string, unknown>))
  }

  async getElection(id: string): Promise<Election | null> {
    const ref = doc(this.db, ELECTIONS_COL, id)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    return toElection(snap.id, snap.data() as Record<string, unknown>)
  }

  async createElection(data: Omit<Election, "id" | "createdAt" | "updatedAt">): Promise<Election> {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(this.db, ELECTIONS_COL), { ...data, createdAt: now, updatedAt: now })
    return { id: ref.id, ...data, createdAt: now, updatedAt: now }
  }

  async updateElection(id: string, data: Partial<Election>): Promise<void> {
    const ref = doc(this.db, ELECTIONS_COL, id)
    await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() })
  }

  async openElection(id: string): Promise<void> {
    const ref = doc(this.db, ELECTIONS_COL, id)
    await updateDoc(ref, { status: "nomination", updatedAt: new Date().toISOString() })
  }

  async closeElection(id: string): Promise<void> {
    const ref = doc(this.db, ELECTIONS_COL, id)
    await updateDoc(ref, { status: "completed", updatedAt: new Date().toISOString() })
  }

  async publishResults(id: string): Promise<void> {
    const ref = doc(this.db, ELECTIONS_COL, id)
    await updateDoc(ref, { status: "published", updatedAt: new Date().toISOString() })
  }

  // ---- Candidates ----

  async listCandidates(electionId: string): Promise<Candidate[]> {
    const col = collection(this.db, CANDIDATES_COL)
    const q = query(col, where("electionId", "==", electionId), orderBy("createdAt", "desc"))
    const snap = await getDocs(q)
    return snap.docs.map((d) => toCandidate(d.id, d.data() as Record<string, unknown>))
  }

  async getCandidate(id: string): Promise<Candidate | null> {
    const ref = doc(this.db, CANDIDATES_COL, id)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    return toCandidate(snap.id, snap.data() as Record<string, unknown>)
  }

  async nominateCandidate(data: Omit<Candidate, "id" | "createdAt">): Promise<Candidate> {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(this.db, CANDIDATES_COL), { ...data, createdAt: now })
    return { id: ref.id, ...data, createdAt: now }
  }

  async approveCandidate(id: string, approvedBy: string): Promise<void> {
    const ref = doc(this.db, CANDIDATES_COL, id)
    await updateDoc(ref, { nominationApproved: true, approvedBy, status: "approved" })
  }

  async disqualifyCandidate(id: string): Promise<void> {
    const ref = doc(this.db, CANDIDATES_COL, id)
    await updateDoc(ref, { status: "disqualified" })
  }

  // ---- Votes ----

  async castVote(data: Omit<Vote, "id" | "votedAt">): Promise<Vote> {
    const votedAt = new Date().toISOString()
    const ref = await addDoc(collection(this.db, VOTES_COL), { ...data, votedAt })
    return { id: ref.id, ...data, votedAt }
  }

  async getVotes(electionId: string): Promise<Vote[]> {
    const col = collection(this.db, VOTES_COL)
    const q = query(col, where("electionId", "==", electionId), orderBy("votedAt", "desc"))
    const snap = await getDocs(q)
    return snap.docs.map((d) => toVote(d.id, d.data() as Record<string, unknown>))
  }

  async getVoterTurnout(electionId: string): Promise<{ totalVoters: number; totalVotes: number; turnoutPercentage: number }> {
    const election = await this.getElection(electionId)
    const totalVoters = election?.totalVoters || 0
    const votes = await this.getVotes(electionId)
    const totalVotes = votes.length
    const turnoutPercentage = totalVoters > 0 ? Math.round((totalVotes / totalVoters) * 100) : 0
    return { totalVoters, totalVotes, turnoutPercentage }
  }

  // ---- Committees ----

  async listCommittees(tenantId: string): Promise<Committee[]> {
    const col = collection(this.db, COMMITTEES_COL)
    const q = query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc"))
    const snap = await getDocs(q)
    return snap.docs.map((d) => toCommittee(d.id, d.data() as Record<string, unknown>))
  }

  async getCommittee(id: string): Promise<Committee | null> {
    const ref = doc(this.db, COMMITTEES_COL, id)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    return toCommittee(snap.id, snap.data() as Record<string, unknown>)
  }

  async createCommittee(data: Omit<Committee, "id" | "createdAt" | "updatedAt">): Promise<Committee> {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(this.db, COMMITTEES_COL), { ...data, createdAt: now, updatedAt: now })
    return { id: ref.id, ...data, createdAt: now, updatedAt: now }
  }

  async updateCommittee(id: string, data: Partial<Committee>): Promise<void> {
    const ref = doc(this.db, COMMITTEES_COL, id)
    await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() })
  }

  async dissolveCommittee(id: string): Promise<void> {
    const ref = doc(this.db, COMMITTEES_COL, id)
    await updateDoc(ref, { status: "dissolved", dissolutionDate: new Date().toISOString(), updatedAt: new Date().toISOString() })
  }

  // ---- Meetings ----

  async listMeetings(committeeId: string): Promise<CommitteeMeeting[]> {
    const col = collection(this.db, MEETINGS_COL)
    const q = query(col, where("committeeId", "==", committeeId), orderBy("meetingDate", "desc"))
    const snap = await getDocs(q)
    return snap.docs.map((d) => toMeeting(d.id, d.data() as Record<string, unknown>))
  }

  async getMeeting(id: string): Promise<CommitteeMeeting | null> {
    const ref = doc(this.db, MEETINGS_COL, id)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    return toMeeting(snap.id, snap.data() as Record<string, unknown>)
  }

  async createMeeting(data: Omit<CommitteeMeeting, "id" | "createdAt" | "updatedAt">): Promise<CommitteeMeeting> {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(this.db, MEETINGS_COL), { ...data, createdAt: now, updatedAt: now })
    return { id: ref.id, ...data, createdAt: now, updatedAt: now }
  }

  async updateMeeting(id: string, data: Partial<CommitteeMeeting>): Promise<void> {
    const ref = doc(this.db, MEETINGS_COL, id)
    await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() })
  }

  async completeMeeting(id: string, minutes: string): Promise<void> {
    const ref = doc(this.db, MEETINGS_COL, id)
    await updateDoc(ref, { status: "completed", minutes, endTime: new Date().toISOString(), updatedAt: new Date().toISOString() })
  }

  // ---- Resolutions ----

  async listResolutions(tenantId: string): Promise<Resolution[]> {
    const col = collection(this.db, RESOLUTIONS_COL)
    const q = query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc"))
    const snap = await getDocs(q)
    return snap.docs.map((d) => toResolution(d.id, d.data() as Record<string, unknown>))
  }

  async getResolution(id: string): Promise<Resolution | null> {
    const ref = doc(this.db, RESOLUTIONS_COL, id)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    return toResolution(snap.id, snap.data() as Record<string, unknown>)
  }

  async proposeResolution(data: Omit<Resolution, "id" | "createdAt" | "updatedAt">): Promise<Resolution> {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(this.db, RESOLUTIONS_COL), { ...data, createdAt: now, updatedAt: now })
    return { id: ref.id, ...data, createdAt: now, updatedAt: now }
  }

  async passResolution(id: string): Promise<void> {
    const ref = doc(this.db, RESOLUTIONS_COL, id)
    await updateDoc(ref, { status: "passed", updatedAt: new Date().toISOString() })
  }

  async implementResolution(id: string, notes: string): Promise<void> {
    const ref = doc(this.db, RESOLUTIONS_COL, id)
    await updateDoc(ref, { status: "implemented", implementationNotes: notes, implementedDate: new Date().toISOString(), updatedAt: new Date().toISOString() })
  }

  // ---- Dashboard & Audit ----

  async getDashboardMetrics(tenantId: string): Promise<GovernanceDashboardMetrics> {
    const elections = await this.listElections(tenantId)
    const committees = await this.listCommittees(tenantId)
    const resolutions = await this.listResolutions(tenantId)
    const meetings = (
      await Promise.all(committees.map((c) => this.listMeetings(c.id)))
    ).flat()

    const totalElections = elections.length
    const activeElections = elections.filter((e) => e.status === "nomination" || e.status === "campaign" || e.status === "voting").length
    const totalCandidates = (
      await Promise.all(elections.map((e) => this.listCandidates(e.id)))
    ).flat().length
    const totalVotesCast = elections.reduce((sum, e) => sum + e.totalVotesCast, 0)
    const totalCommittees = committees.length
    const activeCommittees = committees.filter((c) => c.status === "active").length
    const totalMeetings = meetings.length
    const upcomingMeetings = meetings.filter((m) => m.status === "scheduled").length
    const totalResolutions = resolutions.length
    const passedResolutions = resolutions.filter((r) => r.status === "passed" || r.status === "implemented").length
    const totalVoters = elections.reduce((sum, e) => sum + e.totalVoters, 0)
    const voterTurnoutRate = totalVoters > 0 ? Math.round((totalVotesCast / totalVoters) * 100) : 0

    return {
      totalElections,
      activeElections,
      totalCandidates,
      totalVotesCast,
      totalCommittees,
      activeCommittees,
      totalMeetings,
      upcomingMeetings,
      totalResolutions,
      passedResolutions,
      voterTurnoutRate,
    }
  }

  async getAuditLogs(tenantId: string): Promise<GovernanceAuditLog[]> {
    const col = collection(this.db, AUDIT_COL)
    const q = query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc"))
    const snap = await getDocs(q)
    return snap.docs.map((d) => toAuditLog(d.id, d.data() as Record<string, unknown>))
  }
}
