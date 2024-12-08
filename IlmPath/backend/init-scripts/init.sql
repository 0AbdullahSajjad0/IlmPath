-- Drop the tables if they exist (for re-initialization during testing)
-- DROP TABLE IF EXISTS "studentuser";
-- DROP TABLE IF EXISTS "ulamauser";
-- DROP TABLE IF EXISTS "progress";

-- Create "studentuser" table with additional profileImage field
CREATE TABLE IF NOT EXISTS studentuser (
    id SERIAL PRIMARY KEY,              -- Auto-incrementing primary key
    name VARCHAR(255) NOT NULL,         -- Student's full name
    nickName VARCHAR(255),              -- Nickname (optional)
    email VARCHAR(255) UNIQUE NOT NULL, -- Email address, must be unique
    password VARCHAR(255) NOT NULL,     -- Password
    DOB DATE,                           -- Date of Birth
    phoneNo VARCHAR(15),                -- Phone number
    gender VARCHAR(10),                 -- Gender
    profileImage TEXT                   -- URL or base64 string for profile image
);

-- Create "ulamauser" table with additional profileImage, certificateImage, and expertise fields
CREATE TABLE IF NOT EXISTS ulamauser (
    id SERIAL PRIMARY KEY,              -- Auto-incrementing primary key
    name VARCHAR(255) NOT NULL,         -- Ulama's full name
    nickName VARCHAR(255),              -- Nickname (optional)
    email VARCHAR(255) UNIQUE NOT NULL, -- Email address, must be unique
    password VARCHAR(255) NOT NULL,     -- Password
    DOB DATE,                           -- Date of Birth
    phoneNo VARCHAR(15),                -- Phone number
    gender VARCHAR(10),                 -- Gender
    profileImage TEXT,                  -- URL or base64 string for profile image
    certificateImage TEXT,              -- URL or base64 string for certificate image
    expertise TEXT                      -- Text input for the area of expertise
);

-- Create the new "progress" table
CREATE TABLE progress (
    id SERIAL,                          -- Auto-incrementing unique identifier
    user_id INT NOT NULL,               -- User identifier (no foreign key constraint)
    user_role VARCHAR(10) NOT NULL,     -- Role to distinguish between student and ulama
    progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 6236), -- Progress, must be between 0 and 6236
    PRIMARY KEY (id, user_id)           -- Composite primary key
);
