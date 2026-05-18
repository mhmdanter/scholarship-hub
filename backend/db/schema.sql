-- 1. RAW LAYER
CREATE TABLE IF NOT EXISTS raw_scholarships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_name TEXT,
    raw_content JSONB,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. STAGING LAYER
CREATE TABLE IF NOT EXISTS scholarships_staging (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    provider TEXT,
    deadline_raw TEXT,
    description_raw TEXT,
);

-- 3. PRODUCTION LAYER
CREATE TABLE IF NOT EXISTS scholarships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    provider TEXT,
    level TEXT[],
    opportunity_type TEXT,
    deadline DATE,
    major_tags TEXT[],
    is_math_intensive BOOLEAN DEFAULT FALSE,
    application_url TEXT,
    data_quality_score INT DEFAULT 0,
    search_vector TSVECTOR
);