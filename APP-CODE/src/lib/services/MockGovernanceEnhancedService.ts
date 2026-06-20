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
import { delay } from "./shared-store"

let elections: Election[] = [
  {
    id: "elec-1",
    tenantId: "tenant-1",
    title: "National President Election 2026",
    description: "Election for the National President of the Ghana Medical Association",
    positionId: "ep-1",
    positionName: "National President",
    organizationalLevel: "national",
    nominationStartDate: "2026-05-01T00:00:00Z",
    nominationEndDate: "2026-05-30T00:00:00Z",
    votingStartDate: "2026-06-15T00:00:00Z",
    votingEndDate: "2026-06-30T00:00:00Z",
    maxCandidates: 5,
    minVotesPerVoter: 1,
    maxVotesPerVoter: 1,
    isAnonymous: true,
    requiresTwoFactorAuth: true,
    status: "nomination",
    totalVoters: 1200,
    totalVotesCast: 0,
    voterTurnout: 0,
    createdAt: "2026-04-15T00:00:00Z",
    updatedAt: "2026-04-15T00:00:00Z",
  },
  {
    id: "elec-2",
    tenantId: "tenant-1",
    title: "Regional Chairperson Election 2026",
    description: "Election for Regional Chairpersons across all regions",
    positionId: "ep-4",
    positionName: "Regional Chairperson",
    organizationalLevel: "regional",
    nominationStartDate: "2026-05-15T00:00:00Z",
    nominationEndDate: "2026-06-10T00:00:00Z",
    votingStartDate: "2026-07-01T00:00:00Z",
    votingEndDate: "2026-07-15T00:00:00Z",
    maxCandidates: 3,
    minVotesPerVoter: 1,
    maxVotesPerVoter: 1,
    isAnonymous: true,
    requiresTwoFactorAuth: false,
    status: "draft",
    totalVoters: 800,
    totalVotesCast: 0,
    voterTurnout: 0,
    createdAt: "2026-04-20T00:00:00Z",
    updatedAt: "2026-04-20T00:00:00Z",
  },
]

let candidates: Candidate[] = [
  {
    id: "can-1",
    electionId: "elec-1",
    tenantId: "tenant-1",
    memberId: "mem-1",
    memberName: "Kofi Ansah",
    photo: "/photos/kofi-ansah.jpg",
    manifesto: "Strengthening healthcare delivery through unified advocacy",
    biography: "Dr. Kofi Ansah is a cardiologist with 15 years of experience...",
    nominationDate: "2026-05-02T00:00:00Z",
    nominationApproved: true,
    approvedBy: "user-1",
    voteCount: 0,
    status: "approved",
    createdAt: "2026-05-02T00:00:00Z",
  },
  {
    id: "can-2",
    electionId: "elec-1",
    tenantId: "tenant-1",
    memberId: "mem-3",
    memberName: "Abena Osei",
    photo: "/photos/abena-osei.jpg",
    manifesto: "Transparent governance for a stronger association",
    biography: "Dr. Abena Osei is a public health specialist...",
    nominationDate: "2026-05-03T00:00:00Z",
    nominationApproved: true,
    approvedBy: "user-1",
    voteCount: 0,
    status: "approved",
    createdAt: "2026-05-03T00:00:00Z",
  },
]

let votes: Vote[] = []

let committees: Committee[] = [
  {
    id: "com-1",
    tenantId: "tenant-1",
    name: "Finance Committee",
    description: "Oversees the financial affairs of the association",
    committeeType: "standing",
    chairpersonId: "mem-1",
    chairpersonName: "Kofi Ansah",
    viceChairpersonId: "mem-3",
    viceChairpersonName: "Abena Osei",
    secretaryId: "mem-5",
    secretaryName: "Yaw Adom",
    members: [
      { memberId: "mem-1", memberName: "Kofi Ansah", role: "Chairperson", appointedDate: "2026-01-15T00:00:00Z" },
      { memberId: "mem-3", memberName: "Abena Osei", role: "Vice Chairperson", appointedDate: "2026-01-15T00:00:00Z" },
      { memberId: "mem-5", memberName: "Yaw Adom", role: "Secretary", appointedDate: "2026-01-15T00:00:00Z" },
    ],
    meetingFrequency: "monthly",
    quorumRequired: 3,
    formationDate: "2026-01-15T00:00:00Z",
    status: "active",
    createdAt: "2026-01-15T00:00:00Z",
    updatedAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "com-2",
    tenantId: "tenant-1",
    name: "Ethics & Disciplinary Committee",
    description: "Handles ethical matters and disciplinary cases",
    committeeType: "standing",
    chairpersonId: "mem-2",
    chairpersonName: "Esi Mensah",
    members: [
      { memberId: "mem-2", memberName: "Esi Mensah", role: "Chairperson", appointedDate: "2026-02-01T00:00:00Z" },
    ],
    meetingFrequency: "quarterly",
    quorumRequired: 2,
    formationDate: "2026-02-01T00:00:00Z",
    status: "active",
    createdAt: "2026-02-01T00:00:00Z",
    updatedAt: "2026-02-01T00:00:00Z",
  },
]

let meetings: CommitteeMeeting[] = [
  {
    id: "mtg-1",
    committeeId: "com-1",
    committeeName: "Finance Committee",
    tenantId: "tenant-1",
    title: "Q1 Budget Review",
    agenda: "Review Q1 expenditure and approve Q2 budget",
    minutes: "The committee reviewed all expenditures and approved the Q2 budget.",
    meetingDate: "2026-04-10T00:00:00Z",
    startTime: "10:00",
    endTime: "12:30",
    location: "Conference Room A",
    status: "completed",
    attendees: [
      { memberId: "mem-1", memberName: "Kofi Ansah", attended: true },
      { memberId: "mem-3", memberName: "Abena Osei", attended: true },
    ],
    resolutions: [
      { id: "res-1", title: "Q2 Budget Approval", description: "Approve Q2 operational budget", proposedBy: "mem-1", voteCount: 3, status: "passed" },
    ],
    createdAt: "2026-03-20T00:00:00Z",
    updatedAt: "2026-04-10T00:00:00Z",
  },
]

let resolutions: Resolution[] = [
  {
    id: "res-1",
    tenantId: "tenant-1",
    title: "Q2 Budget Approval",
    description: "Approve Q2 operational budget of GHS 500,000",
    proposedById: "mem-1",
    proposedByName: "Kofi Ansah",
    meetingId: "mtg-1",
    committeeId: "com-1",
    voteCount: 3,
    votesFor: 3,
    votesAgainst: 0,
    votesAbstain: 0,
    status: "implemented",
    implementationNotes: "Budget approved and sent to finance department",
    implementedDate: "2026-04-12T00:00:00Z",
    createdAt: "2026-04-10T00:00:00Z",
    updatedAt: "2026-04-12T00:00:00Z",
  },
  {
    id: "res-2",
    tenantId: "tenant-1",
    title: "Annual Subscription Fee Adjustment",
    description: "Proposal to adjust annual subscription fees for the next fiscal year",
    proposedById: "mem-3",
    proposedByName: "Abena Osei",
    voteCount: 0,
    votesFor: 0,
    votesAgainst: 0,
    votesAbstain: 0,
    status: "proposed",
    createdAt: "2026-05-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
]

let auditLogs: GovernanceAuditLog[] = [
  {
    id: "gal-1",
    tenantId: "tenant-1",
    actor: "System",
    action: "election_created",
    recordType: "Election",
    recordId: "elec-1",
    newValue: "Election created: National President Election 2026",
    createdAt: "2026-04-15T00:00:00Z",
  },
  {
    id: "gal-2",
    tenantId: "tenant-1",
    actor: "Kwame Asante",
    action: "candidate_approved",
    recordType: "Candidate",
    recordId: "can-1",
    newValue: "Kofi Ansah approved as candidate",
    createdAt: "2026-05-04T00:00:00Z",
  },
  {
    id: "gal-3",
    tenantId: "tenant-1",
    actor: "Kwame Asante",
    action: "committee_created",
    recordType: "Committee",
    recordId: "com-1",
    newValue: "Committee created: Finance Committee",
    createdAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "gal-4",
    tenantId: "tenant-1",
    actor: "System",
    action: "meeting_completed",
    recordType: "Meeting",
    recordId: "mtg-1",
    newValue: "Meeting completed: Q1 Budget Review",
    createdAt: "2026-04-10T00:00:00Z",
  },
  {
    id: "gal-5",
    tenantId: "tenant-1",
    actor: "System",
    action: "resolution_passed",
    recordType: "Resolution",
    recordId: "res-1",
    newValue: "Resolution passed: Q2 Budget Approval",
    createdAt: "2026-04-10T00:00:00Z",
  },
]

export class MockGovernanceEnhancedService implements IGovernanceEnhancedService {
  // ---- Elections ----

  async listElections(tenantId: string): Promise<Election[]> {
    await delay(200)
    return elections.filter((e) => e.tenantId === tenantId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getElection(id: string): Promise<Election | null> {
    await delay(100)
    return elections.find((e) => e.id === id) || null
  }

  async createElection(data: Omit<Election, "id" | "createdAt" | "updatedAt">): Promise<Election> {
    await delay(400)
    const election: Election = { ...data, id: `elec-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    elections.push(election)
    return election
  }

  async updateElection(id: string, data: Partial<Election>): Promise<void> {
    await delay(300)
    const idx = elections.findIndex((e) => e.id === id)
    if (idx !== -1) {
      elections[idx] = { ...elections[idx], ...data, updatedAt: new Date().toISOString() }
    }
  }

  async openElection(id: string): Promise<void> {
    await delay(200)
    const idx = elections.findIndex((e) => e.id === id)
    if (idx !== -1) {
      elections[idx] = { ...elections[idx], status: "nomination", updatedAt: new Date().toISOString() }
    }
  }

  async closeElection(id: string): Promise<void> {
    await delay(200)
    const idx = elections.findIndex((e) => e.id === id)
    if (idx !== -1) {
      elections[idx] = { ...elections[idx], status: "completed", updatedAt: new Date().toISOString() }
    }
  }

  async publishResults(id: string): Promise<void> {
    await delay(200)
    const idx = elections.findIndex((e) => e.id === id)
    if (idx !== -1) {
      elections[idx] = { ...elections[idx], status: "published", updatedAt: new Date().toISOString() }
    }
  }

  // ---- Candidates ----

  async listCandidates(electionId: string): Promise<Candidate[]> {
    await delay(200)
    return candidates.filter((c) => c.electionId === electionId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getCandidate(id: string): Promise<Candidate | null> {
    await delay(100)
    return candidates.find((c) => c.id === id) || null
  }

  async nominateCandidate(data: Omit<Candidate, "id" | "createdAt">): Promise<Candidate> {
    await delay(400)
    const candidate: Candidate = { ...data, id: `can-${Date.now()}`, createdAt: new Date().toISOString() }
    candidates.push(candidate)
    return candidate
  }

  async approveCandidate(id: string, approvedBy: string): Promise<void> {
    await delay(300)
    const idx = candidates.findIndex((c) => c.id === id)
    if (idx !== -1) {
      candidates[idx] = { ...candidates[idx], nominationApproved: true, approvedBy, status: "approved" }
    }
  }

  async disqualifyCandidate(id: string): Promise<void> {
    await delay(200)
    const idx = candidates.findIndex((c) => c.id === id)
    if (idx !== -1) {
      candidates[idx] = { ...candidates[idx], status: "disqualified" }
    }
  }

  // ---- Votes ----

  async castVote(data: Omit<Vote, "id" | "votedAt">): Promise<Vote> {
    await delay(300)
    const vote: Vote = { ...data, id: `vote-${Date.now()}`, votedAt: new Date().toISOString() }
    votes.push(vote)
    const eIdx = elections.findIndex((e) => e.id === data.electionId)
    if (eIdx !== -1) {
      elections[eIdx] = { ...elections[eIdx], totalVotesCast: elections[eIdx].totalVotesCast + 1, voterTurnout: elections[eIdx].totalVoters > 0 ? Math.round(((elections[eIdx].totalVotesCast + 1) / elections[eIdx].totalVoters) * 100) : 0 }
    }
    const cIdx = candidates.findIndex((c) => c.id === data.candidateId)
    if (cIdx !== -1) {
      candidates[cIdx] = { ...candidates[cIdx], voteCount: candidates[cIdx].voteCount + 1 }
    }
    return vote
  }

  async getVotes(electionId: string): Promise<Vote[]> {
    await delay(200)
    return votes.filter((v) => v.electionId === electionId).sort((a, b) => new Date(b.votedAt).getTime() - new Date(a.votedAt).getTime())
  }

  async getVoterTurnout(electionId: string): Promise<{ totalVoters: number; totalVotes: number; turnoutPercentage: number }> {
    await delay(100)
    const election = elections.find((e) => e.id === electionId)
    const totalVoters = election?.totalVoters || 0
    const electionVotes = votes.filter((v) => v.electionId === electionId)
    const totalVotes = electionVotes.length
    const turnoutPercentage = totalVoters > 0 ? Math.round((totalVotes / totalVoters) * 100) : 0
    return { totalVoters, totalVotes, turnoutPercentage }
  }

  // ---- Committees ----

  async listCommittees(tenantId: string): Promise<Committee[]> {
    await delay(200)
    return committees.filter((c) => c.tenantId === tenantId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getCommittee(id: string): Promise<Committee | null> {
    await delay(100)
    return committees.find((c) => c.id === id) || null
  }

  async createCommittee(data: Omit<Committee, "id" | "createdAt" | "updatedAt">): Promise<Committee> {
    await delay(400)
    const committee: Committee = { ...data, id: `com-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    committees.push(committee)
    return committee
  }

  async updateCommittee(id: string, data: Partial<Committee>): Promise<void> {
    await delay(300)
    const idx = committees.findIndex((c) => c.id === id)
    if (idx !== -1) {
      committees[idx] = { ...committees[idx], ...data, updatedAt: new Date().toISOString() }
    }
  }

  async dissolveCommittee(id: string): Promise<void> {
    await delay(200)
    const idx = committees.findIndex((c) => c.id === id)
    if (idx !== -1) {
      committees[idx] = { ...committees[idx], status: "dissolved", dissolutionDate: new Date().toISOString(), updatedAt: new Date().toISOString() }
    }
  }

  // ---- Meetings ----

  async listMeetings(committeeId: string): Promise<CommitteeMeeting[]> {
    await delay(200)
    return meetings.filter((m) => m.committeeId === committeeId).sort((a, b) => new Date(b.meetingDate).getTime() - new Date(a.meetingDate).getTime())
  }

  async getMeeting(id: string): Promise<CommitteeMeeting | null> {
    await delay(100)
    return meetings.find((m) => m.id === id) || null
  }

  async createMeeting(data: Omit<CommitteeMeeting, "id" | "createdAt" | "updatedAt">): Promise<CommitteeMeeting> {
    await delay(400)
    const meeting: CommitteeMeeting = { ...data, id: `mtg-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    meetings.push(meeting)
    return meeting
  }

  async updateMeeting(id: string, data: Partial<CommitteeMeeting>): Promise<void> {
    await delay(300)
    const idx = meetings.findIndex((m) => m.id === id)
    if (idx !== -1) {
      meetings[idx] = { ...meetings[idx], ...data, updatedAt: new Date().toISOString() }
    }
  }

  async completeMeeting(id: string, minutes: string): Promise<void> {
    await delay(200)
    const idx = meetings.findIndex((m) => m.id === id)
    if (idx !== -1) {
      meetings[idx] = { ...meetings[idx], status: "completed", minutes, endTime: new Date().toISOString(), updatedAt: new Date().toISOString() }
    }
  }

  // ---- Resolutions ----

  async listResolutions(tenantId: string): Promise<Resolution[]> {
    await delay(200)
    return resolutions.filter((r) => r.tenantId === tenantId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getResolution(id: string): Promise<Resolution | null> {
    await delay(100)
    return resolutions.find((r) => r.id === id) || null
  }

  async proposeResolution(data: Omit<Resolution, "id" | "createdAt" | "updatedAt">): Promise<Resolution> {
    await delay(400)
    const resolution: Resolution = { ...data, id: `res-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    resolutions.push(resolution)
    return resolution
  }

  async passResolution(id: string): Promise<void> {
    await delay(200)
    const idx = resolutions.findIndex((r) => r.id === id)
    if (idx !== -1) {
      resolutions[idx] = { ...resolutions[idx], status: "passed", updatedAt: new Date().toISOString() }
    }
  }

  async implementResolution(id: string, notes: string): Promise<void> {
    await delay(200)
    const idx = resolutions.findIndex((r) => r.id === id)
    if (idx !== -1) {
      resolutions[idx] = { ...resolutions[idx], status: "implemented", implementationNotes: notes, implementedDate: new Date().toISOString(), updatedAt: new Date().toISOString() }
    }
  }

  // ---- Dashboard & Audit ----

  async getDashboardMetrics(tenantId: string): Promise<GovernanceDashboardMetrics> {
    await delay(300)
    const tenantElections = elections.filter((e) => e.tenantId === tenantId)
    const tenantCommittees = committees.filter((c) => c.tenantId === tenantId)
    const tenantResolutions = resolutions.filter((r) => r.tenantId === tenantId)
    const tenantMeetings = meetings.filter((m) => m.tenantId === tenantId)
    const tenantCandidates = candidates.filter((c) => c.tenantId === tenantId)

    return {
      totalElections: tenantElections.length,
      activeElections: tenantElections.filter((e) => e.status === "nomination" || e.status === "campaign" || e.status === "voting").length,
      totalCandidates: tenantCandidates.length,
      totalVotesCast: tenantElections.reduce((sum, e) => sum + e.totalVotesCast, 0),
      totalCommittees: tenantCommittees.length,
      activeCommittees: tenantCommittees.filter((c) => c.status === "active").length,
      totalMeetings: tenantMeetings.length,
      upcomingMeetings: tenantMeetings.filter((m) => m.status === "scheduled").length,
      totalResolutions: tenantResolutions.length,
      passedResolutions: tenantResolutions.filter((r) => r.status === "passed" || r.status === "implemented").length,
      voterTurnoutRate: tenantElections.reduce((sum, e) => sum + e.voterTurnout, 0) / (tenantElections.length || 1),
    }
  }

  async getAuditLogs(tenantId: string): Promise<GovernanceAuditLog[]> {
    await delay(200)
    return auditLogs.filter((l) => l.tenantId === tenantId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
}
