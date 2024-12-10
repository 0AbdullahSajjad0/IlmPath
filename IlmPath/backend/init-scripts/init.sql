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
    expertise TEXT,                      -- Text input for the area of expertise
    email VARCHAR(255) UNIQUE NOT NULL, -- Email address, must be unique
    password VARCHAR(255) NOT NULL,     -- Password
    DOB DATE,                           -- Date of Birth
    phoneNo VARCHAR(15),                -- Phone number
    gender VARCHAR(10),                 -- Gender
    certificateImage TEXT,              -- URL or base64 string for certificate image  
    profileImage TEXT                  -- URL or base64 string for profile image
);

-- Create the new "progress" table
CREATE TABLE progress (
    id SERIAL,                          -- Auto-incrementing unique identifier
    user_id INT NOT NULL,               -- User identifier (no foreign key constraint)
    user_role VARCHAR(10) NOT NULL,     -- Role to distinguish between student and ulama
    progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 6236), -- Progress, must be between 0 and 6236
    PRIMARY KEY (id, user_id)           -- Composite primary key
);

-- Create "notes" table
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,              -- Auto-incrementing unique identifier
    user_id INT NOT NULL,               -- User identifier (not a foreign key)
    user_role VARCHAR(10) NOT NULL,     -- Role to distinguish between student and ulama
    note_text TEXT NOT NULL,            -- Note content
    note_surrah INT NOT NULL,           -- Surah number
    note_ayah INT NOT NULL              -- Ayah number
);


INSERT INTO studentuser (name, nickName, email, password, DOB, phoneNo, gender, profileImage)
VALUES
('Ali Khan', 'Ali', 'ali.khan@gmail.com', '12345678', '2000-01-15', '+1234567890', 'Male', NULL),
('Ayesha Ahmed', 'Ayesha', 'ayesha.ahmed@icloud.com', '12345678', '1999-05-23', '+1234567891', 'Female', NULL),
('Omar Farooq', NULL, 'omar.farooq@gmail.com', '87654321', '2002-11-10', '+1234567892', 'Male', NULL);

INSERT INTO ulamauser (name, nickName, email, password, DOB, phoneNo, gender, profileImage, certificateImage, expertise)
VALUES
('Dr. Abdul Rehman', 'Dr. AR', 'abdul.rehman@gmail.com', '12345678', '1985-07-12', '+9876543210', 'Male', NULL, NULL, 'Islamic Jurisprudence'),
('Mufti Saad Ali', 'Mufti Saad', 'saad.ali@gmail.com', '12345678', '1978-03-25', '+9876543211', 'Male', NULL, NULL, 'Quranic Exegesis'),
('Ustadha Fatima Zahra', 'Fatima', 'fatima.zahra@gmail.com', '87654321', '1990-08-17', '+9876543212', 'Female', NULL, NULL, 'Hadith Studies');

INSERT INTO progress (user_id, user_role, progress)
VALUES
(1, 'student', 120),  -- Ali Khan has completed 120 Ayahs
(2, 'student', 81),   -- Ayesha Ahmed has completed 80 Ayahs
(3, 'student', 150),  -- Omar Farooq has completed 150 Ayahs
(1, 'ulama', 6236),   -- Dr. Abdul Rehman has completed the entire Quran
(2, 'ulama', 5001),   -- Mufti Saad Ali has completed 5000 Ayahs
(3, 'ulama', 4500);   -- Ustadha Fatima Zahra has completed 4500 Ayahs
