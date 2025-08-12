-- Create company_profile table for company details
CREATE TABLE IF NOT EXISTS company_profile (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    website TEXT,
    logo_url TEXT,
    banner_url TEXT,
    industry TEXT NOT NULL,
    founded_date DATE,
    description TEXT,
    social_links JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_company_profile_updated_at 
    BEFORE UPDATE ON company_profile 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create index on owner_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_company_profile_owner_id ON company_profile(owner_id);
