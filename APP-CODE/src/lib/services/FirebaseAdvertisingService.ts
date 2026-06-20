import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, updateDoc, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IAdvertisingService } from "./IAdvertisingService"
import type { Advertisement, AdCampaign, SponsorDeal, AdvertisingAuditLog, AdStatus } from "@/types"

const ADS_COLLECTION = "advertisements"
const CAMPAIGNS_COLLECTION = "ad_campaigns"
const SPONSORS_COLLECTION = "sponsor_deals"
const AUDIT_COLLECTION = "advertising_audit_logs"

function toAd(id: string, data: Record<string, unknown>): Advertisement {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    advertiserId: (data.advertiserId as string) || "",
    advertiserName: (data.advertiserName as string) || "",
    title: (data.title as string) || "",
    description: (data.description as string) || "",
    imageUrl: data.imageUrl as string | undefined,
    linkUrl: (data.linkUrl as string) || "",
    placement: (data.placement as Advertisement["placement"]) || "homepage_banner",
    pricingModel: (data.pricingModel as Advertisement["pricingModel"]) || "fixed",
    rate: (data.rate as number) || 0,
    totalBudget: (data.totalBudget as number) || 0,
    spentBudget: (data.spentBudget as number) || 0,
    currency: (data.currency as string) || "",
    impressions: (data.impressions as number) || 0,
    clicks: (data.clicks as number) || 0,
    conversions: (data.conversions as number) || 0,
    targetAudience: (data.targetAudience as Advertisement["targetAudience"]) || "all_members",
    targetValue: data.targetValue as string | undefined,
    startDate: (data.startDate as string) || "",
    endDate: (data.endDate as string) || "",
    status: (data.status as AdStatus) || "draft",
    reviewedBy: data.reviewedBy as string | undefined,
    reviewNotes: data.reviewNotes as string | undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toCampaign(id: string, data: Record<string, unknown>): AdCampaign {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    name: (data.name as string) || "",
    description: (data.description as string) || "",
    advertiserId: (data.advertiserId as string) || "",
    advertiserName: (data.advertiserName as string) || "",
    ads: (data.ads as string[]) || [],
    totalBudget: (data.totalBudget as number) || 0,
    spentBudget: (data.spentBudget as number) || 0,
    startDate: (data.startDate as string) || "",
    endDate: (data.endDate as string) || "",
    status: (data.status as AdCampaign["status"]) || "draft",
    performance: (data.performance as AdCampaign["performance"]) || { impressions: 0, clicks: 0, conversions: 0, ctr: 0, conversionRate: 0 },
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toSponsor(id: string, data: Record<string, unknown>): SponsorDeal {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    sponsorName: (data.sponsorName as string) || "",
    sponsorContact: (data.sponsorContact as string) || "",
    sponsorEmail: data.sponsorEmail as string | undefined,
    sponsorshipTier: (data.sponsorshipTier as string) || "",
    amount: (data.amount as number) || 0,
    currency: (data.currency as string) || "",
    benefits: (data.benefits as string[]) || [],
    startDate: (data.startDate as string) || "",
    endDate: (data.endDate as string) || "",
    status: (data.status as SponsorDeal["status"]) || "active",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toAuditLog(id: string, data: Record<string, unknown>): AdvertisingAuditLog {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    actor: (data.actor as string) || "",
    action: (data.action as AdvertisingAuditLog["action"]) || "ad_created",
    recordType: (data.recordType as string) || "",
    recordId: (data.recordId as string) || "",
    previousValue: data.previousValue as string | undefined,
    newValue: data.newValue as string | undefined,
    details: data.details as string | undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
  }
}

export class FirebaseAdvertisingService implements IAdvertisingService {
  private db = getFirestoreDb()

  async listAds(tenantId: string, params?: { status?: string; placement?: string }): Promise<Advertisement[]> {
    const col = collection(this.db, ADS_COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    if (params?.placement) constraints.unshift(where("placement", "==", params.placement))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toAd(d.id, d.data() as Record<string, unknown>))
  }

  async getAd(id: string): Promise<Advertisement | null> {
    const snap = await getDoc(doc(this.db, ADS_COLLECTION, id))
    if (!snap.exists()) return null
    return toAd(snap.id, snap.data() as Record<string, unknown>)
  }

  async createAd(tenantId: string, data: Omit<Advertisement, "id" | "createdAt" | "updatedAt" | "impressions" | "clicks" | "conversions" | "spentBudget">): Promise<Advertisement> {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(this.db, ADS_COLLECTION), { ...data, tenantId, impressions: 0, clicks: 0, conversions: 0, spentBudget: 0, createdAt: now, updatedAt: now })
    const created = await getDoc(ref)
    return toAd(created.id, created.data() as Record<string, unknown>)
  }

  async updateAd(id: string, data: Partial<Advertisement>): Promise<void> {
    await updateDoc(doc(this.db, ADS_COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
  }

  async approveAd(id: string, reviewedBy: string, reviewNotes?: string): Promise<void> {
    const now = new Date().toISOString()
    await updateDoc(doc(this.db, ADS_COLLECTION, id), { status: "approved", reviewedBy, reviewNotes: reviewNotes || "", updatedAt: now })
  }

  async rejectAd(id: string, reviewedBy: string, reviewNotes: string): Promise<void> {
    const now = new Date().toISOString()
    await updateDoc(doc(this.db, ADS_COLLECTION, id), { status: "rejected", reviewedBy, reviewNotes, updatedAt: now })
  }

  async pauseAd(id: string): Promise<void> {
    await updateDoc(doc(this.db, ADS_COLLECTION, id), { status: "paused", updatedAt: new Date().toISOString() })
  }

  async submitAd(id: string): Promise<void> {
    await updateDoc(doc(this.db, ADS_COLLECTION, id), { status: "pending_review", updatedAt: new Date().toISOString() })
  }

  async listCampaigns(tenantId: string): Promise<AdCampaign[]> {
    const col = collection(this.db, CAMPAIGNS_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toCampaign(d.id, d.data() as Record<string, unknown>))
  }

  async getCampaign(id: string): Promise<AdCampaign | null> {
    const snap = await getDoc(doc(this.db, CAMPAIGNS_COLLECTION, id))
    if (!snap.exists()) return null
    return toCampaign(snap.id, snap.data() as Record<string, unknown>)
  }

  async createCampaign(tenantId: string, data: Omit<AdCampaign, "id" | "createdAt" | "updatedAt" | "spentBudget" | "performance">): Promise<AdCampaign> {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(this.db, CAMPAIGNS_COLLECTION), { ...data, tenantId, spentBudget: 0, performance: { impressions: 0, clicks: 0, conversions: 0, ctr: 0, conversionRate: 0 }, createdAt: now, updatedAt: now })
    const created = await getDoc(ref)
    return toCampaign(created.id, created.data() as Record<string, unknown>)
  }

  async updateCampaign(id: string, data: Partial<AdCampaign>): Promise<void> {
    await updateDoc(doc(this.db, CAMPAIGNS_COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
  }

  async launchCampaign(id: string): Promise<void> {
    await updateDoc(doc(this.db, CAMPAIGNS_COLLECTION, id), { status: "active", updatedAt: new Date().toISOString() })
  }

  async completeCampaign(id: string): Promise<void> {
    await updateDoc(doc(this.db, CAMPAIGNS_COLLECTION, id), { status: "completed", updatedAt: new Date().toISOString() })
  }

  async listSponsors(tenantId: string): Promise<SponsorDeal[]> {
    const col = collection(this.db, SPONSORS_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toSponsor(d.id, d.data() as Record<string, unknown>))
  }

  async getSponsor(id: string): Promise<SponsorDeal | null> {
    const snap = await getDoc(doc(this.db, SPONSORS_COLLECTION, id))
    if (!snap.exists()) return null
    return toSponsor(snap.id, snap.data() as Record<string, unknown>)
  }

  async createSponsor(tenantId: string, data: Omit<SponsorDeal, "id" | "createdAt" | "updatedAt">): Promise<SponsorDeal> {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(this.db, SPONSORS_COLLECTION), { ...data, tenantId, createdAt: now, updatedAt: now })
    const created = await getDoc(ref)
    return toSponsor(created.id, created.data() as Record<string, unknown>)
  }

  async updateSponsor(id: string, data: Partial<SponsorDeal>): Promise<void> {
    await updateDoc(doc(this.db, SPONSORS_COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
  }

  async getAuditLogs(tenantId: string): Promise<AdvertisingAuditLog[]> {
    const col = collection(this.db, AUDIT_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toAuditLog(d.id, d.data() as Record<string, unknown>))
  }
}
