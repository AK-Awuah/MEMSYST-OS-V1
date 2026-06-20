import type { ISkillService } from "./ISkillService"
import type { Skill, LearnerSkill } from "@/types"
import { mockSkills, mockLearnerSkills } from "./mock-data"
import { delay } from "./shared-store"

export class MockSkillService implements ISkillService {
  private skills = [...mockSkills]
  private learnerSkills = [...mockLearnerSkills]

  async listSkills(tenantId: string): Promise<Skill[]> {
    await delay(200)
    return this.skills.filter((s) => s.tenantId === tenantId)
  }

  async getSkill(id: string): Promise<Skill | null> {
    await delay(100)
    return this.skills.find((s) => s.id === id) || null
  }

  async createSkill(data: Omit<Skill, "id" | "createdAt">): Promise<Skill> {
    await delay(200)
    const skill: Skill = {
      ...data,
      id: `skill-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    this.skills.push(skill)
    return skill
  }

  async updateSkill(id: string, data: Partial<Skill>): Promise<Skill> {
    await delay(150)
    const idx = this.skills.findIndex((s) => s.id === id)
    if (idx === -1) throw new Error("Skill not found")
    this.skills[idx] = { ...this.skills[idx], ...data }
    return this.skills[idx]
  }

  async deleteSkill(id: string): Promise<void> {
    await delay(100)
    this.skills = this.skills.filter((s) => s.id !== id)
  }

  async listLearnerSkills(tenantId: string, learnerId?: string): Promise<LearnerSkill[]> {
    await delay(200)
    let result = this.learnerSkills.filter((ls) => ls.tenantId === tenantId)
    if (learnerId) result = result.filter((ls) => ls.learnerId === learnerId)
    return result
  }

  async addLearnerSkill(data: Omit<LearnerSkill, "id" | "createdAt" | "updatedAt">): Promise<LearnerSkill> {
    await delay(200)
    const learnerSkill: LearnerSkill = {
      ...data,
      id: `ls-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.learnerSkills.push(learnerSkill)
    return learnerSkill
  }

  async updateLearnerSkill(id: string, data: Partial<LearnerSkill>): Promise<LearnerSkill> {
    await delay(150)
    const idx = this.learnerSkills.findIndex((ls) => ls.id === id)
    if (idx === -1) throw new Error("LearnerSkill not found")
    this.learnerSkills[idx] = { ...this.learnerSkills[idx], ...data, updatedAt: new Date().toISOString() }
    return this.learnerSkills[idx]
  }

  async removeLearnerSkill(id: string): Promise<void> {
    await delay(100)
    this.learnerSkills = this.learnerSkills.filter((ls) => ls.id !== id)
  }
}
