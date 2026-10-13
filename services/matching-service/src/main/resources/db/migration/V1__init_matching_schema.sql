CREATE TABLE IF NOT EXISTS resume_profiles (
    student_id UUID PRIMARY KEY,
    file_url TEXT NOT NULL,
    parsed_text TEXT NOT NULL,
    extracted_skills TEXT[] NOT NULL DEFAULT '{}',
    experience_years NUMERIC(3,1),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS job_matches (
    job_id UUID NOT NULL,
    student_id UUID NOT NULL,
    match_score NUMERIC(5,2) NOT NULL,
    matched_skills TEXT[] NOT NULL DEFAULT '{}',
    missing_skills TEXT[] NOT NULL DEFAULT '{}',
    forwarded_at TIMESTAMPTZ,
    viewed BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (job_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_matches_student ON job_matches(student_id, forwarded_at DESC);
