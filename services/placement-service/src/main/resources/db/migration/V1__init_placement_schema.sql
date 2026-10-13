CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    sector VARCHAR(60),
    website VARCHAR(255),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS company_registrations (
    company_id UUID PRIMARY KEY REFERENCES companies(id),
    contact_email VARCHAR(120) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    approved_by UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS drives (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id),
    role VARCHAR(100) NOT NULL,
    ctc NUMERIC(6,2),
    drive_date DATE,
    last_apply_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    category VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS drive_rounds (
    id UUID PRIMARY KEY,
    drive_id UUID NOT NULL REFERENCES drives(id) ON DELETE CASCADE,
    round_no INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    date DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY,
    drive_id UUID NOT NULL REFERENCES drives(id),
    student_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'APPLIED',
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (drive_id, student_id)
);

CREATE TABLE IF NOT EXISTS placement_results (
    id UUID PRIMARY KEY,
    application_id UUID NOT NULL REFERENCES applications(id),
    round_no INT NOT NULL,
    result VARCHAR(20) NOT NULL,
    package NUMERIC(6,2),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS job_postings (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id),
    title VARCHAR(120) NOT NULL,
    description TEXT,
    ctc NUMERIC(6,2),
    min_match_score NUMERIC(5,2),
    last_apply_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS job_skills (
    id UUID PRIMARY KEY,
    job_id UUID NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
    skill VARCHAR(60) NOT NULL,
    type VARCHAR(20) NOT NULL,
    weight NUMERIC(4,2) DEFAULT 1.0
);
