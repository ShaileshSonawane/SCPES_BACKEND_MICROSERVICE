CREATE TABLE IF NOT EXISTS password_reset_otps (
    id UUID PRIMARY KEY,
    email VARCHAR(120) NOT NULL,
    otp VARCHAR(10) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_password_reset_otps_email ON password_reset_otps(email);
