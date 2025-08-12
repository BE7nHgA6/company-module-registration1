-- Create users table for authentication and user details
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    signup_type VARCHAR(1) NOT NULL DEFAULT 'e',
    gender CHAR(1) NOT NULL CHECK (gender IN ('m', 'f', 'o')),
    mobile_no VARCHAR(20) NOT NULL UNIQUE,
    is_mobile_verified BOOLEAN DEFAULT false,
    is_email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
