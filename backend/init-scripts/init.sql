-- Create a users table with plain-text passwords
DROP TABLE IF EXISTS  users;

-- Create "studentUser" table if not exists
CREATE TABLE IF NOT EXISTS "studentUser" (
    id SERIAL PRIMARY KEY,              -- Auto-incrementing primary key
    name VARCHAR(255) NOT NULL,         -- Student's full name
    nickName VARCHAR(255),              -- Nickname (optional)
    email VARCHAR(255) UNIQUE NOT NULL, -- Email address, must be unique
    password VARCHAR(255) NOT NULL,     -- Password
    DOB DATE,                           -- Date of Birth
    phoneNo VARCHAR(15),                -- Phone number
    gender VARCHAR(10)                  -- Gender
);

-- Create "UlamaUser" table if not exists
CREATE TABLE IF NOT EXISTS "UlamaUser" (
    id SERIAL PRIMARY KEY,              -- Auto-incrementing primary key
    name VARCHAR(255) NOT NULL,         -- Ulama's full name
    nickName VARCHAR(255),              -- Nickname (optional)
    email VARCHAR(255) UNIQUE NOT NULL, -- Email address, must be unique
    password VARCHAR(255) NOT NULL,     -- Password
    DOB DATE,                           -- Date of Birth
    phoneNo VARCHAR(15),                -- Phone number
    gender VARCHAR(10)                  -- Gender
);

