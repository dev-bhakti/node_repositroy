-- -- Blog Platform Database Setup Script

-- -- Create database
-- CREATE DATABASE blog_platform;

-- -- Connect to the database
-- \c blog_platform;

-- -- Create users table
-- CREATE TABLE IF NOT EXISTS users (
--     id SERIAL PRIMARY KEY,
--     username VARCHAR(50) UNIQUE NOT NULL,
--     email VARCHAR(100) UNIQUE NOT NULL,
--     password VARCHAR(255) NOT NULL,
--     "firstName" VARCHAR(50),
--     "lastName" VARCHAR(50),
--     "isActive" BOOLEAN DEFAULT TRUE,
--     "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Create status enum type
-- CREATE TYPE blog_status AS ENUM ('draft', 'published', 'archived');

-- -- Create blogs table
-- CREATE TABLE IF NOT EXISTS blogs (
--     id SERIAL PRIMARY KEY,
--     title VARCHAR(200) NOT NULL,
--     content TEXT NOT NULL,
--     summary VARCHAR(500),
--     slug VARCHAR(250) UNIQUE NOT NULL,
--     "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--     status blog_status DEFAULT 'draft',
--     "publishedAt" TIMESTAMP WITH TIME ZONE,
--     tags TEXT[],
--     "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Create indexes for better performance
-- CREATE INDEX idx_blogs_user_id ON blogs("userId");
-- CREATE INDEX idx_blogs_status ON blogs(status);
-- CREATE INDEX idx_blogs_slug ON blogs(slug);
-- CREATE INDEX idx_blogs_created_at ON blogs("createdAt" DESC);
-- CREATE INDEX idx_users_email ON users(email);
-- CREATE INDEX idx_users_username ON users(username);

-- -- Create function to update updated_at timestamp
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW."updatedAt" = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$ language 'plpgsql';

-- -- Create triggers to auto-update updated_at
-- CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
--     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON blogs
--     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -- Insert sample data (optional)
-- -- Sample user (password: 'password123' - will be hashed by application)
-- -- INSERT INTO users (username, email, password, "firstName", "lastName") 
-- -- VALUES ('admin', 'admin@example.com', 'hashed_password_here', 'Admin', 'User');

-- COMMIT;

