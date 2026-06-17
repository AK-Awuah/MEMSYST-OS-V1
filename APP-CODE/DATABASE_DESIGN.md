# MemSyst Stage 1 - Database Design Models (Firestore)

This document outlines the entity models, relationships, and structures for the MemSyst Business Operations Platform (M-BOP) as required by the Stage 1 Development Master Prompt.

## Core Architectural Principles for Firestore
1. **No direct Firebase coupling in UI**: All access goes through Repository/Service layers.
2. **Tenant Isolation**: Though M-BOP is the platform admin side, we must design for future multi-tenancy. Entities belonging to a tenant will have a `tenantId`. M-BOP internal entities might have `tenantId: "MEMSYST_PLATFORM"`.
3. **Auditability**: Every critical action creates an Audit Log entry.
4. **Standard Fields**: All entities will share standard fields like `id`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `status`.

---

## 1. Users
**Collection**: `users`
**Description**: Internal MemSyst platform users (Super Admin, Operations Admin, Sales Admin, Support Admin).

- `id`: String (Firebase UID)
- `email`: String
- `displayName`: String
- `phoneNumber`: String (optional)
- `photoURL`: String (optional)
- `roleId`: String (Reference to Roles)
- `status`: String ('ACTIVE', 'INACTIVE', 'SUSPENDED')
- `lastLoginAt`: Timestamp
- `createdAt`: Timestamp
- `updatedAt`: Timestamp
- `createdBy`: String (User ID)
- `updatedBy`: String (User ID)

---

## 2. Roles
**Collection**: `roles`
**Description**: Roles defined within the platform (e.g., Super Admin, Sales Admin).

- `id`: String
- `name`: String
- `description`: String
- `permissions`: Array<String> (List of Permission IDs or Keys)
- `isSystem`: Boolean (true if it cannot be deleted)
- `status`: String ('ACTIVE', 'INACTIVE')
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

---

## 3. Permissions
**Collection**: `permissions` (or defined as constants in code)
**Description**: Specific granular permissions (e.g., `lead:create`, `tenant:approve`).

- `id`: String
- `resource`: String (e.g., 'lead', 'tenant')
- `action`: String (e.g., 'create', 'read', 'update', 'delete')
- `description`: String

---

## 4. Form Submissions
**Collection**: `formSubmissions`
**Description**: Inquiries and forms submitted from the public marketing website.

- `id`: String
- `type`: String ('CONTACT', 'CONSULTATION', 'DEMO', 'PARTNERSHIP')
- `data`: Map<String, Any> (Raw submitted fields)
- `ipAddress`: String
- `sourcePage`: String
- `referralSource`: String
- `status`: String ('NEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')
- `assignedTo`: String (User ID)
- `convertedToLeadId`: String (optional, Lead ID if converted)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

---

## 5. Leads
**Collection**: `leads`
**Description**: Central prospect management record.

- `id`: String
- `organizationName`: String
- `contactPerson`: String
- `email`: String
- `phoneNumber`: String
- `organizationType`: String
- `country`: String
- `expectedMembers`: Number
- `website`: String
- `source`: String
- `estimatedValue`: Number
- `expectedLaunchDate`: Timestamp
- `assignedTo`: String (User ID)
- `status`: String ('NEW', 'QUALIFIED', 'MEETING_SCHEDULED', 'NEEDS_ASSESSMENT', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST')
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

---

## 6. Lead Activities
**Collection**: `leads/{leadId}/activities`
**Description**: Activities related to a specific lead.

- `id`: String
- `type`: String ('CALL', 'EMAIL', 'NOTE', 'STATUS_CHANGE', 'DOCUMENT_UPLOAD')
- `description`: String
- `attachments`: Array<String> (Storage URLs)
- `performedBy`: String (User ID)
- `createdAt`: Timestamp

---

## 7. Organizations (Prospects)
**Collection**: `organizations`
**Description**: Prospective customer organizations.

- `id`: String
- `name`: String
- `industryType`: String
- `country`: String
- `expectedMembers`: Number
- `currentChallenges`: String
- `desiredCapabilities`: String
- `commercialNotes`: String
- `assignedTo`: String (User ID)
- `status`: String ('PROSPECT', 'QUALIFIED', 'PROPOSAL_STAGE', 'NEGOTIATION', 'APPROVED', 'REJECTED')
- `leadId`: String (Reference to original lead)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

---

## 8. CRM Opportunities
**Collection**: `opportunities`
**Description**: Manage sales opportunities in the pipeline.

- `id`: String
- `leadId`: String (Reference to Lead)
- `organizationId`: String (Reference to Organization)
- `assignedTo`: String (User ID)
- `value`: Number
- `probability`: Number (0-100)
- `expectedCloseDate`: Timestamp
- `stage`: String ('NEW_LEAD', 'CONTACTED', 'DISCOVERY_MEETING', 'NEEDS_ASSESSMENT', 'PROPOSAL_SENT', 'NEGOTIATION', 'APPROVED', 'TENANT_CREATION')
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

---

## 9. Tasks
**Collection**: `tasks`
**Description**: Actionable tasks for platform users.

- `id`: String
- `title`: String
- `description`: String
- `dueDate`: Timestamp
- `assignedTo`: String (User ID)
- `relatedTo`: Map<String, String> (e.g., { type: 'LEAD', id: 'lead123' })
- `status`: String ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')
- `createdAt`: Timestamp
- `updatedAt`: Timestamp
- `createdBy`: String (User ID)

---

## 10. Meetings
**Collection**: `meetings`
**Description**: Scheduled meetings with prospects.

- `id`: String
- `title`: String
- `scheduledDate`: Timestamp
- `durationMinutes`: Number
- `attendees`: Array<String> (Emails or User IDs)
- `relatedTo`: Map<String, String> (e.g., { type: 'LEAD', id: 'lead123' })
- `meetingLink`: String
- `status`: String ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED')
- `createdAt`: Timestamp
- `updatedAt`: Timestamp
- `createdBy`: String (User ID)

---

## 11. Notifications
**Collection**: `notifications`
**Description**: Real-time operational alerts for users.

- `id`: String
- `userId`: String (Target User ID)
- `type`: String ('SYSTEM', 'LEAD_ASSIGNED', 'FORM_SUBMISSION', 'TASK_REMINDER', 'MEETING_REMINDER')
- `title`: String
- `message`: String
- `actionUrl`: String (optional)
- `status`: String ('UNREAD', 'READ', 'ARCHIVED')
- `createdAt`: Timestamp

---

## 12. Tenants
**Collection**: `tenants`
**Description**: Future-ready tenant records for onboarded organizations.

- `id`: String
- `organizationId`: String (Reference to Organization Prospect)
- `name`: String
- `shortName`: String
- `subdomain`: String
- `country`: String
- `industry`: String
- `branding`: Map<String, String> (logoUrl, primaryColor, secondaryColor)
- `commercialSetup`: Map<String, Any> (plan, subscriptionStatus, commissionModel, revenueDistribution)
- `adminContact`: Map<String, String> (name, email, phone)
- `status`: String ('SETUP_PENDING', 'ACTIVE', 'SUSPENDED')
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

---

## 13. Settings
**Collection**: `settings`
**Description**: Platform configuration settings (Configuration-driven architecture).

- `id`: String (e.g., 'platform_config')
- `organizationInfo`: Map
- `emailSettings`: Map
- `notificationSettings`: Map
- `leadSettings`: Map
- `crmSettings`: Map
- `tenantSettings`: Map
- `updatedAt`: Timestamp
- `updatedBy`: String (User ID)

---

## 14. Audit Logs
**Collection**: `auditLogs`
**Description**: Immutable record of all critical actions.

- `id`: String
- `actorId`: String (User ID)
- `actorRole`: String
- `action`: String (e.g., 'CREATE', 'UPDATE', 'DELETE', 'CONVERT')
- `module`: String (e.g., 'LEADS', 'TENANTS', 'USERS')
- `recordType`: String
- `recordId`: String
- `previousValue`: Map<String, Any> (optional)
- `newValue`: Map<String, Any> (optional)
- `ipAddress`: String
- `timestamp`: Timestamp

---

## Next Steps for Stage 1 Development
1. Verify this data model with the team/architect.
2. Setup Firebase project & service accounts.
3. Establish Repository & Service layers in the Next.js application based on these models.
4. Begin implementing Module 1 (Authentication).
