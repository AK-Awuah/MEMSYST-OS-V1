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

export interface IGovernanceEnhancedService {
  listElections(tenantId: string): Promise<Election[]>
  getElection(id: string): Promise<Election | null>
  createElection(data: Omit<Election, "id" | "createdAt" | "updatedAt">): Promise<Election>
  updateElection(id: string, data: Partial<Election>): Promise<void>
  openElection(id: string): Promise<void>
  closeElection(id: string): Promise<void>
  publishResults(id: string): Promise<void>

  listCandidates(electionId: string): Promise<Candidate[]>
  getCandidate(id: string): Promise<Candidate | null>
  nominateCandidate(data: Omit<Candidate, "id" | "createdAt">): Promise<Candidate>
  approveCandidate(id: string, approvedBy: string): Promise<void>
  disqualifyCandidate(id: string): Promise<void>

  castVote(data: Omit<Vote, "id" | "votedAt">): Promise<Vote>
  getVotes(electionId: string): Promise<Vote[]>
  getVoterTurnout(electionId: string): Promise<{ totalVoters: number; totalVotes: number; turnoutPercentage: number }>

  listCommittees(tenantId: string): Promise<Committee[]>
  getCommittee(id: string): Promise<Committee | null>
  createCommittee(data: Omit<Committee, "id" | "createdAt" | "updatedAt">): Promise<Committee>
  updateCommittee(id: string, data: Partial<Committee>): Promise<void>
  dissolveCommittee(id: string): Promise<void>

  listMeetings(committeeId: string): Promise<CommitteeMeeting[]>
  getMeeting(id: string): Promise<CommitteeMeeting | null>
  createMeeting(data: Omit<CommitteeMeeting, "id" | "createdAt" | "updatedAt">): Promise<CommitteeMeeting>
  updateMeeting(id: string, data: Partial<CommitteeMeeting>): Promise<void>
  completeMeeting(id: string, minutes: string): Promise<void>

  listResolutions(tenantId: string): Promise<Resolution[]>
  getResolution(id: string): Promise<Resolution | null>
  proposeResolution(data: Omit<Resolution, "id" | "createdAt" | "updatedAt">): Promise<Resolution>
  passResolution(id: string): Promise<void>
  implementResolution(id: string, notes: string): Promise<void>

  getDashboardMetrics(tenantId: string): Promise<GovernanceDashboardMetrics>
  getAuditLogs(tenantId: string): Promise<GovernanceAuditLog[]>
}
