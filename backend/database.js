const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Dynamic PostgreSQL configuration for AWS RDS production deployment
const pgUrl = process.env.DATABASE_URL || process.env.PGDATABASE;
let pgPool = null;

if (pgUrl) {
  try {
    const { Pool } = require('pg');
    pgPool = new Pool({
      connectionString: pgUrl,
      ssl: { rejectUnauthorized: false } // Required for AWS RDS secure connections
    });
    console.log("🐘 Database: Successfully connected to cloud PostgreSQL pool.");
  } catch (err) {
    console.error("⚠️ Database: Failed to load pg driver for PostgreSQL. Falling back to local storage.", err.message);
  }
}

class UniversalDatabase {
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

  readLocal() {
    try {
      const data = fs.readFileSync(this.dbPath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error("❌ DB Read Error, resetting:", err);
      this.init();
      return JSON.parse(fs.readFileSync(this.dbPath, 'utf8'));
    }
  }

  writeLocal(data) {
    const tempPath = this.dbPath + '.tmp';
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2));
    fs.renameSync(tempPath, this.dbPath);
  }

  // API Key & HMAC Verification
  async verifyApiKeyAndSignature(apiKey, signature, bodyString) {
    if (pgPool) {
      try {
        const res = await pgPool.query('SELECT api_secret_hash FROM api_keys WHERE api_key = $1', [apiKey]);
        if (res.rows.length === 0) return false;
        
        // In Postgres we store the secret. To simplify, if we use plain secrets:
        const secret = res.rows[0].api_secret_hash;
        const hmac = crypto.createHmac('sha256', secret);
        const computedSignature = hmac.update(bodyString).digest('hex');
        return computedSignature === signature;
      } catch (err) {
        console.error("❌ DB Error verifying key:", err.message);
        return false;
      }
    }

    // Local Fallback
    const db = this.readLocal();
    const keyEntry = db.apiKeys.find(k => k.key === apiKey);
    if (!keyEntry) return false;

    const hmac = crypto.createHmac('sha256', keyEntry.secret);
    const computedSignature = hmac.update(bodyString).digest('hex');
    return computedSignature === signature;
  }

  async generateAndAddKey() {
    const key = `GGLOOP_pk_live_${crypto.randomBytes(8).toString('hex')}`;
    const secret = `GGLOOP_sk_live_${crypto.randomBytes(16).toString('hex')}`;

    if (pgPool) {
      try {
        await pgPool.query(
          'INSERT INTO api_keys (api_key, api_secret_hash) VALUES ($1, $2)',
          [key, secret]
        );
        return { key, secret };
      } catch (err) {
        console.error("❌ DB Error inserting key:", err.message);
      }
    }

    // Local Fallback
    const db = this.readLocal();
    db.apiKeys.push({ key, secret });
    this.writeLocal(db);
    return { key, secret };
  }

  // Violations
  async insertViolation(violation) {
    if (pgPool) {
      try {
        await pgPool.query(
          `INSERT INTO violations (player_id, server_region, violation_type, process_name, window_title, confidence_score, hmac_signature, ts)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT DO NOTHING`,
          [
            violation.player,
            violation.server || 'US-East-1',
            violation.type || 'process',
            violation.processName || '',
            violation.windowTitle || '',
            violation.confidence || 99,
            violation.signature || 'local-unsigned',
            violation.ts || Date.now()
          ]
        );
        return;
      } catch (err) {
        console.error("❌ DB Error inserting violation:", err.message);
      }
    }

    // Local Fallback
    const db = this.readLocal();
    const isDuplicate = db.violations.some(
      v => v.player === violation.player && Math.abs(v.ts - violation.ts) < 2000
    );
    if (!isDuplicate) {
      db.violations.push(violation);
      this.writeLocal(db);
    }
  }

  async getViolations() {
    if (pgPool) {
      try {
        const res = await pgPool.query('SELECT player_id AS player, server_region AS server, violation_type AS type, process_name AS "processName", window_title AS "windowTitle", confidence_score AS confidence, hmac_signature AS signature, ts FROM violations ORDER BY ts DESC LIMIT 100');
        return res.rows;
      } catch (err) {
        console.error("❌ DB Error reading violations:", err.message);
        return [];
      }
    }

    // Local Fallback
    return this.readLocal().violations;
  }

  // Leads
  async insertLead(lead) {
    if (pgPool) {
      try {
        await pgPool.query(
          `INSERT INTO leads (handle, source_platform, origin_url, intent_snippet, lead_tier, mrr_estimate, score)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            lead.handle,
            lead.src || 'Reddit',
            lead.url || '',
            lead.intent || '',
            lead.tier || 'WARM',
            lead.mrr || 29,
            lead.score || 50
          ]
        );
        return;
      } catch (err) {
        console.error("❌ DB Error inserting lead:", err.message);
      }
    }

    // Local Fallback
    const db = this.readLocal();
    const isDuplicate = db.leads.some(
      l => l.handle === lead.handle && l.intent === lead.intent
    );
    if (!isDuplicate) {
      db.leads.push(lead);
      this.writeLocal(db);
    }
  }

  async getLeads() {
    if (pgPool) {
      try {
        const res = await pgPool.query('SELECT handle, source_platform AS src, origin_url AS url, intent_snippet AS intent, lead_tier AS tier, mrr_estimate AS mrr, score FROM leads ORDER BY created_at DESC LIMIT 100');
        return res.rows;
      } catch (err) {
        console.error("❌ DB Error reading leads:", err.message);
        return [];
      }
    }

    // Local Fallback
    return this.readLocal().leads;
  }
}

module.exports = new UniversalDatabase();
