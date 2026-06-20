/**
 * Deploy Firestore rules and indexes.
 *
 * Prerequisites:
 *   1. firebase-tools CLI installed: npm install -g firebase-tools
 *   2. Logged in: firebase login
 *   3. service-account.json in project root for seed script
 *
 * Usage:
 *   node scripts/deploy-firestore.mjs
 */

import { execSync } from 'child_process'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = resolve(__dirname, '..')

function run(cmd) {
  console.log(`\n> ${cmd}`)
  execSync(cmd, { cwd: root, stdio: 'inherit' })
}

try {
  console.log('=== Deploying Firestore Rules ===')
  run('npx firebase deploy --only firestore:rules')

  console.log('\n=== Deploying Firestore Indexes ===')
  run('npx firebase deploy --only firestore:indexes')

  console.log('\n✅ Firestore deployment complete!')
} catch (err) {
  console.error('\n❌ Deployment failed:', err.message)
  process.exit(1)
}
