-- Database and Schema initialization script for SCPES

CREATE SCHEMA IF NOT EXISTS identity_svc;
CREATE SCHEMA IF NOT EXISTS student_svc;
CREATE SCHEMA IF NOT EXISTS placement_svc;
CREATE SCHEMA IF NOT EXISTS eligibility_svc;
CREATE SCHEMA IF NOT EXISTS matching_svc;
CREATE SCHEMA IF NOT EXISTS notification_svc;
CREATE SCHEMA IF NOT EXISTS report_svc;

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'identity_svc_user') THEN
    CREATE USER identity_svc_user WITH PASSWORD 'scpes_secret';
  END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'student_svc_user') THEN
    CREATE USER student_svc_user WITH PASSWORD 'scpes_secret';
  END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'placement_svc_user') THEN
    CREATE USER placement_svc_user WITH PASSWORD 'scpes_secret';
  END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'eligibility_svc_user') THEN
    CREATE USER eligibility_svc_user WITH PASSWORD 'scpes_secret';
  END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'matching_svc_user') THEN
    CREATE USER matching_svc_user WITH PASSWORD 'scpes_secret';
  END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'notification_svc_user') THEN
    CREATE USER notification_svc_user WITH PASSWORD 'scpes_secret';
  END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'report_svc_user') THEN
    CREATE USER report_svc_user WITH PASSWORD 'scpes_secret';
  END IF;
END $$;

GRANT ALL ON SCHEMA identity_svc TO identity_svc_user;
GRANT ALL ON SCHEMA student_svc TO student_svc_user;
GRANT ALL ON SCHEMA placement_svc TO placement_svc_user;
GRANT ALL ON SCHEMA eligibility_svc TO eligibility_svc_user;
GRANT ALL ON SCHEMA matching_svc TO matching_svc_user;
GRANT ALL ON SCHEMA notification_svc TO notification_svc_user;
GRANT ALL ON SCHEMA report_svc TO report_svc_user;

GRANT ALL ON SCHEMA identity_svc TO postgres;
GRANT ALL ON SCHEMA student_svc TO postgres;
GRANT ALL ON SCHEMA placement_svc TO postgres;
GRANT ALL ON SCHEMA eligibility_svc TO postgres;
GRANT ALL ON SCHEMA matching_svc TO postgres;
GRANT ALL ON SCHEMA notification_svc TO postgres;
GRANT ALL ON SCHEMA report_svc TO postgres;
