import type { Skill, LearnerSkill } from "@/types"

export interface ISkillService {
  listSkills(tenantId: string): Promise<Skill[]>
  getSkill(id: string): Promise<Skill | null>
  createSkill(data: Omit<Skill, "id" | "createdAt">): Promise<Skill>
  updateSkill(id: string, data: Partial<Skill>): Promise<Skill>
  deleteSkill(id: string): Promise<void>
  listLearnerSkills(tenantId: string, learnerId?: string): Promise<LearnerSkill[]>
  addLearnerSkill(data: Omit<LearnerSkill, "id" | "createdAt" | "updatedAt">): Promise<LearnerSkill>
  updateLearnerSkill(id: string, data: Partial<LearnerSkill>): Promise<LearnerSkill>
  removeLearnerSkill(id: string): Promise<void>
}
