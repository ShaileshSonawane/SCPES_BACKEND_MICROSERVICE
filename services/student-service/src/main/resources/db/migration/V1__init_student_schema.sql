CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    roll_no VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    branch VARCHAR(20) NOT NULL,
    batch VARCHAR(20),
    passout_year INT NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS academic_records (
    student_id UUID PRIMARY KEY REFERENCES students(id),
    tenth_pct NUMERIC(5,2),
    twelfth_pct NUMERIC(5,2),
    cgpa NUMERIC(4,2),
    active_backlogs INT NOT NULL DEFAULT 0,
    backlog_history INT NOT NULL DEFAULT 0,
    gap_years INT NOT NULL DEFAULT 0,
    verification_status VARCHAR(12) NOT NULL DEFAULT 'DRAFT',
    verified_by UUID,
    verified_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS student_skills (
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    skill VARCHAR(60) NOT NULL,
    PRIMARY KEY (student_id, skill)
);

CREATE TABLE IF NOT EXISTS student_documents (
    id UUID PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, -- RESUME, MARKSHEET, CERTIFICATE
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_students_passout ON students(passout_year);
CREATE INDEX IF NOT EXISTS idx_academic_status ON academic_records(verification_status);
