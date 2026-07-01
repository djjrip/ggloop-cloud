const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class FileDatabase {
  constructor() {
    this.dbPath = path.join(__dirname, 'database.json');
    this.init();
  }

  init() {
    if (!fs.existsSync(this.dbPath)) {
      const defaultDb = {
        apiKeys: [
          { 
            key: 'GGLOOP_pk_live_djjrip_enterprise_demo', 
            secret: 'GGLOOP_sk_live_djjrip_enterprise_secret_9988' 
          }
        ],
        violations: [],
        leads: []
      };
      fs.writeFileSync(this.dbPath, JSON.stringify(defaultDb, null, 2));
    }
  }

  read() {
    try {
      const data = fs.readFileSync(this.dbPath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error("❌ DB Read Error, resetting:", err);
      this.init();
      return JSON.parse(fs.readFileSync(this.dbPath, 'utf8'));
    }
  }

  write(data) {
    const tempPath = this.dbPath + '.tmp';
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2));
    fs.renameSync(tempPath, this.dbPath);
  }

  // API Key & HMAC Verification
  verifyApiKeyAndSignature(apiKey, signature, bodyString) {
    const db = this.read();
    const keyEntry = db.apiKeys.find(k => k.key === apiKey);
    if (!keyEntry) {
      console.warn(`[DB] Verification failed: API Key not found (${apiKey})`);
      return false;
    }

    const hmac = crypto.createHmac('sha256', keyEntry.secret);
    const computedSignature = hmac.update(bodyString).digest('hex');
    
    const valid = computedSignature === signature;
    if (!valid) {
      console.warn(`[DB] Signature mismatch for key ${apiKey}. Got: ${signature}, Expected: ${computedSignature}`);
    }
    return valid;
  }

  generateAndAddKey() {
    const db = this.read();
    const key = `GGLOOP_pk_live_${crypto.randomBytes(8).toString('hex')}`;
    const secret = `GGLOOP_sk_live_${crypto.randomBytes(16).toString('hex')}`;
    db.apiKeys.push({ key, secret });
    this.write(db);
    return { key, secret };
  }

  // Violations
  insertViolation(violation) {
    const db = this.read();
    // Prevent duplicate entries
    const isDuplicate = db.violations.some(
      v => v.player === violation.player && Math.abs(v.ts - violation.ts) < 2000
    );
    if (!isDuplicate) {
      db.violations.push(violation);
      this.write(db);
    }
  }

  getViolations() {
    return this.read().violations;
  }

  // Leads
  insertLead(lead) {
    const db = this.read();
    // Deduplicate leads by handle and intent
    const isDuplicate = db.leads.some(
      l => l.handle === lead.handle && l.intent === lead.intent
    );
    if (!isDuplicate) {
      db.leads.push(lead);
      this.write(db);
    }
  }

  getLeads() {
    return this.read().leads;
  }
}

module.exports = new FileDatabase();
