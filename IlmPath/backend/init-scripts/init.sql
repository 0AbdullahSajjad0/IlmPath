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
    profileImage TEXT,                  -- URL or base64 string for profile image
    verified BOOLEAN DEFAULT false      -- Verification status, default to false
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

CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    ulama_id INT NOT NULL,
    appointment_datetime TIMESTAMP NOT NULL,
    appointment_details TEXT,
    chat_id VARCHAR(36) NOT NULL, 
    status BOOLEAN DEFAULT false,
    CONSTRAINT fk_student
      FOREIGN KEY (student_id)
        REFERENCES studentuser(id),
    CONSTRAINT fk_ulama
      FOREIGN KEY (ulama_id)
        REFERENCES ulamauser(id)
);

-- Create "chat_messages" table for storing chat messages per appointment
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,                      -- Unique identifier for each message
    chat_id VARCHAR(36) NOT NULL,               -- Associated chat ID from appointments
    sender_id INT NOT NULL,                     -- User ID of the sender
    sender_role VARCHAR(10) NOT NULL,           -- Sender role ('student' or 'ullama')
    message_text TEXT NOT NULL,                 -- Chat message content
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Message timestamp
    CONSTRAINT fk_chat FOREIGN KEY (chat_id) REFERENCES appointments(chat_id)
);

-- Index for faster retrieval of chat messages per appointment
CREATE INDEX idx_chat_messages_chatId ON chat_messages (chat_id);

-- Index for fetching messages by sender (improves performance for user message history)
CREATE INDEX idx_chat_messages_senderId ON chat_messages (sender_id);

CREATE TABLE IF NOT EXISTS ulama_availability (
    id SERIAL PRIMARY KEY,
    ulama_id INT NOT NULL,                 
    day_of_week INT CHECK (day_of_week BETWEEN 1 AND 7), 
    specific_date DATE,                       
    start_time TIME,                          
    end_time TIME,                            
    permanent BOOLEAN DEFAULT FALSE,          

    CHECK ((day_of_week IS NOT NULL OR specific_date IS NOT NULL)),
    CHECK (start_time IS NULL OR end_time IS NULL OR end_time > start_time),
    CHECK (permanent = FALSE OR (day_of_week IS NOT NULL AND specific_date IS NULL)),
    CHECK (specific_date IS NULL OR permanent = FALSE),
    CONSTRAINT fk_ulama FOREIGN KEY (ulama_id) REFERENCES ulamauser(id)
);

CREATE INDEX idx_ulama_availability_day ON ulama_availability (ulama_id, day_of_week);
CREATE INDEX idx_ulama_availability_date ON ulama_availability (ulama_id, specific_date);

-- Create "bookmarks" table to store user-specific Ayah bookmarks
CREATE TABLE IF NOT EXISTS bookmarks (
    id SERIAL PRIMARY KEY,              -- Auto-incrementing unique identifier
    user_id INT NOT NULL,               -- User identifier
    user_role VARCHAR(10) NOT NULL,     -- Role to distinguish between student and ulama
    bookmarked_surah INT NOT NULL,      -- Surah number of the bookmarked Ayah
    bookmarked_ayah INT NOT NULL,       -- Ayah number being bookmarked
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for when the bookmark was created
    UNIQUE (user_id, user_role, bookmarked_surah, bookmarked_ayah) -- Ensures unique bookmarks per user-role
);

INSERT INTO progress (user_id, user_role, progress)
VALUES
(1, 'student', 120),  -- Ali Khan has completed 120 Ayahs
(2, 'student', 81),   -- Ayesha Ahmed has completed 80 Ayahs
(3, 'student', 150),  -- Omar Farooq has completed 150 Ayahs
(1, 'ullama', 6236),   -- Dr. Abdul Rehman has completed the entire Quran
(2, 'ullama', 5001),   -- Mufti Saad Ali has completed 5000 Ayahs
(3, 'ullama', 4500);   -- Ustadha Fatima Zahra has completed 4500 Ayahs

INSERT INTO notes (user_id, user_role, note_text, note_surrah, note_ayah)
VALUES
(1, 'student', 'Memorize this verse with tajweed rules.', 2, 255),
(2, 'student', 'Understand the meaning behind this Ayah.', 3, 102),
(3, 'student', 'Revise this before the next session.', 4, 56),
(4, 'student', 'Focus on pronunciation of this Ayah.', 5, 33),
(5, 'student', 'Important verse for understanding Quranic grammar.', 6, 75),
(1, 'ullama', 'Discuss this verse with students next session.', 7, 99),
(2, 'ullama', 'Check references related to this Ayah.', 8, 45),
(3, 'ullama', 'Prepare tafseer notes for this verse.', 9, 88);


