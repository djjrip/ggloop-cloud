-- GG Loop Production Database Schema (PostgreSQL Reference)
-- Designed to run on AWS RDS PostgreSQL instance for high-availability telemetry.

-- Enable UUID extension for unique primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. API KEYS TABLE
-- Stores credentials for game studios using the GG Loop telemetry gateway.
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_name VARCHAR(100) NOT NULL,
    api_key VARCHAR(100) UNIQUE NOT NULL,
    api_secret_hash VARCHAR(255) NOT NULL, -- SHA256 hashed secret
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_api_keys_lookup ON api_keys(api_key);

-- Seed initial default credentials (hashed secret matching the local test seed)
INSERT INTO api_keys (studio_name, api_key, api_secret_hash)
VALUES (
    'Enterprise Demo Studio', 
    'GGLOOP_pk_live_djjrip_enterprise_demo', 
    '6ca982fa1f75ff3bbad58dbb24c16a445e9a2b5c00a026c40f3217adea94700c' -- hashed secret representation
) ON CONFLICT DO NOTHING;


-- 2. VIOLATIONS (ANTI-CHEAT TELEMETRY) TABLE
-- Stores verified logs of all cheat and memory tamper detections.
CREATE TABLE IF NOT EXISTS violations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(100) NOT NULL,
    server_region VARCHAR(50) DEFAULT 'US-East-1',
    violation_type VARCHAR(20) CHECK (violation_type IN ('process', 'focus', 'tamper')) NOT NULL,
    process_name VARCHAR(100),
    window_title VARCHAR(150),
    confidence_score INTEGER DEFAULT 99,
    hmac_signature VARCHAR(64) NOT NULL,
    ts BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_violations_player ON violations(player_id);
CREATE INDEX IF NOT EXISTS idx_violations_ts ON violations(ts DESC);


-- 3. LEADS TABLE
-- Stores leads extracted by the Hermes scraper from Reddit and Job Boards.
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    handle VARCHAR(100) NOT NULL,
    source_platform VARCHAR(50) NOT NULL, -- 'Reddit', 'GameJobs'
    origin_url VARCHAR(255),
    intent_snippet TEXT NOT NULL,
    lead_tier VARCHAR(20) CHECK (lead_tier IN ('HOT', 'WARM', 'ENTERPRISE')) DEFAULT 'WARM',
    mrr_estimate INTEGER DEFAULT 0,
    score INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leads_tier ON leads(lead_tier);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
