CREATE TABLE IF NOT EXISTS drive_stats (
    drive_id UUID PRIMARY KEY,
    role VARCHAR(100),
    total_eligible INT DEFAULT 0,
    total_applied INT DEFAULT 0,
    total_shortlisted INT DEFAULT 0,
    total_selected INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS department_stats (
    department VARCHAR(50),
    year INT,
    placement_pct NUMERIC(5,2),
    highest_package NUMERIC(6,2),
    average_package NUMERIC(6,2),
    median_package NUMERIC(6,2),
    PRIMARY KEY (department, year)
);
