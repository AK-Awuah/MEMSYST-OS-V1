export interface PlatformSettings {
  organizationName: string
  supportEmail: string
  notificationEmail: string
  autoAssignLeads: boolean
  leadAssignmentRule: "round-robin" | "manual"
  defaultLeadStatus: string
  crmDefaultProbability: string
  requireApprovalForTenants: boolean
  auditRetentionDays: string
  emailNotifications: boolean
  leadNotifications: boolean
  crmNotifications: boolean
  auditDigest: boolean
}

export interface ISettingsService {
  getSettings(): Promise<PlatformSettings | null>
  updateSettings(data: Partial<PlatformSettings>): Promise<void>
}
