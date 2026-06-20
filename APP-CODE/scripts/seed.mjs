import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const serviceAccountPath = resolve(__dirname, '..', 'service-account.json')

if (!existsSync(serviceAccountPath)) {
  console.error(
    'Missing service-account.json. Download it from Firebase Console > Project Settings > Service Accounts.'
  )
  process.exit(1)
}

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'))

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) })
}

const db = getFirestore()

async function seed() {
  const now = new Date()
  const timestamp = { createdAt: now, updatedAt: now }

  // --- Seed Permissions ---
  const permissions = [
    { id: 'events:read', name: 'Read Events', description: 'View events', category: 'Events', ...timestamp },
    { id: 'events:write', name: 'Write Events', description: 'Create/update events', category: 'Events', ...timestamp },
    { id: 'governance:read', name: 'Read Governance', description: 'View governance', category: 'Governance', ...timestamp },
    { id: 'governance:write', name: 'Write Governance', description: 'Manage governance', category: 'Governance', ...timestamp },
    { id: 'ai:read', name: 'Read AI', description: 'View AI assistant', category: 'AI', ...timestamp },
    { id: 'ai:write', name: 'Write AI', description: 'Manage AI assistant', category: 'AI', ...timestamp },
    { id: 'platform:read', name: 'Read Platform', description: 'View platform ops', category: 'Platform', ...timestamp },
    { id: 'platform:write', name: 'Write Platform', description: 'Manage platform ops', category: 'Platform', ...timestamp },
    { id: 'advertising:read', name: 'Read Ads', description: 'View advertising', category: 'Advertising', ...timestamp },
    { id: 'advertising:write', name: 'Write Ads', description: 'Manage advertising', category: 'Advertising', ...timestamp },
    { id: 'tiering:read', name: 'Read Tiering', description: 'View tiering', category: 'Tiering', ...timestamp },
    { id: 'tiering:write', name: 'Write Tiering', description: 'Manage tiering', category: 'Tiering', ...timestamp },
    { id: 'analytics:read', name: 'Read Analytics', description: 'View analytics', category: 'Analytics', ...timestamp },
    { id: 'integrations:read', name: 'Read Integrations', description: 'View integrations', category: 'Integrations', ...timestamp },
    { id: 'integrations:write', name: 'Write Integrations', description: 'Manage integrations', category: 'Integrations', ...timestamp },
    { id: 'mobile:read', name: 'Read Mobile', description: 'View mobile settings', category: 'Mobile', ...timestamp },
    { id: 'mobile:write', name: 'Write Mobile', description: 'Manage mobile settings', category: 'Mobile', ...timestamp },
  ]

  console.log('Seeding permissions...')
  const batch = db.batch()
  for (const perm of permissions) {
    batch.set(db.collection('permissions').doc(perm.id), perm)
  }
  await batch.commit()
  console.log(`  ✓ ${permissions.length} permissions`)

  // --- Seed Roles ---
  const roles = [
    {
      id: 'super_admin',
      name: 'Super Admin',
      description: 'Full access across all tenants',
      permissions: permissions.map((p) => p.id),
      isSuperRole: true,
      ...timestamp,
    },
    {
      id: 'tenant_admin',
      name: 'Tenant Admin',
      description: 'Full access within a tenant',
      permissions: permissions.map((p) => p.id),
      isSuperRole: false,
      ...timestamp,
    },
    {
      id: 'member',
      name: 'Member',
      description: 'Basic member access',
      permissions: ['events:read', 'governance:read', 'ai:read', 'analytics:read'],
      isSuperRole: false,
      ...timestamp,
    },
  ]

  console.log('Seeding roles...')
  const roleBatch = db.batch()
  for (const role of roles) {
    roleBatch.set(db.collection('roles').doc(role.id), role)
  }
  await roleBatch.commit()
  console.log(`  ✓ ${roles.length} roles`)

  // --- Seed Plans ---
  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Basic plan for small organizations',
      price: 0,
      interval: 'month',
      features: ['Up to 50 members', 'Basic events', 'Email support'],
      limits: { members: 50, storage: 500, apiCalls: 1000 },
      isActive: true,
      sortOrder: 0,
      ...timestamp,
    },
    {
      id: 'starter',
      name: 'Starter',
      description: 'Growing organizations',
      price: 29,
      interval: 'month',
      features: ['Up to 500 members', 'Events + Governance', 'Analytics dashboard', 'Priority support'],
      limits: { members: 500, storage: 5000, apiCalls: 10000 },
      isActive: true,
      sortOrder: 1,
      ...timestamp,
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Established organizations',
      price: 99,
      interval: 'month',
      features: ['Up to 5000 members', 'Full feature access', 'AI assistant', 'API integrations', 'Dedicated support'],
      limits: { members: 5000, storage: 50000, apiCalls: 100000 },
      isActive: true,
      sortOrder: 2,
      ...timestamp,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Large-scale organizations',
      price: 299,
      interval: 'month',
      features: ['Unlimited members', 'All features', 'Custom integrations', 'SLA guarantee', '24/7 support'],
      limits: { members: -1, storage: -1, apiCalls: -1 },
      isActive: true,
      sortOrder: 3,
      ...timestamp,
    },
  ]

  console.log('Seeding plans...')
  const planBatch = db.batch()
  for (const plan of plans) {
    planBatch.set(db.collection('plans').doc(plan.id), plan)
  }
  await planBatch.commit()
  console.log(`  ✓ ${plans.length} plans`)

  // --- Seed Sample Tenant ---
  const tenantRef = db.collection('tenants').doc('demo-tenant')
  await tenantRef.set({
    id: 'demo-tenant',
    name: 'Demo Organization',
    slug: 'demo',
    planId: 'professional',
    isActive: true,
    settings: {
      theme: { primaryColor: '#3CA4F9', darkMode: true },
      features: { events: true, governance: true, ai: true, advertising: false },
    },
    ...timestamp,
  })
  console.log('  ✓ 1 tenant')

  console.log('\n✅ Seed complete!')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
