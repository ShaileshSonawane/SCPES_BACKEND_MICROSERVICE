CREATE TABLE IF NOT EXISTS eligibility_rules (
    id UUID PRIMARY KEY,
    drive_id UUID NOT NULL,
    rule_json JSONB NOT NULL,
    version INT NOT NULL DEFAULT 1,
    created_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (drive_id, version)
);

CREATE TABLE IF NOT EXISTS eligibility_results (
    drive_id UUID NOT NULL,
    student_id UUID NOT NULL,
    eligible BOOLEAN NOT NULL,
    reasons JSONB NOT NULL DEFAULT '[]',
    rule_version INT NOT NULL,
    evaluated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (drive_id, student_id)
);

CREATE TABLE IF NOT EXISTS processed_events (
    event_id UUID PRIMARY KEY,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_elig_drive_eligible ON eligibility_results(drive_id, eligible);
