-- ============================================
-- Student Registration System - Database Schema
-- For XAMPP (MySQL/MariaDB) + PHP
-- ============================================

CREATE DATABASE IF NOT EXISTS student_registration_system;
USE student_registration_system;

-- ------------------------------------------------
-- 1. users
-- Holds login credentials + role for both admin and student
-- ------------------------------------------------
CREATE TABLE users (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    username        VARCHAR(20)  NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,          -- store PHP password_hash() output, never plaintext
    role            ENUM('admin', 'student') NOT NULL DEFAULT 'student',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------
-- 2. courses
-- Matches the <select id="course"> options in registration.html
-- ------------------------------------------------
CREATE TABLE courses (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    course_name     VARCHAR(150) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT INTO courses (course_name) VALUES
    ('Bachelor of Science in Information Technology'),
    ('Bachelor of Science in Medical Technology'),
    ('Bachelor of Science in Business Administration');

-- ------------------------------------------------
-- 3. students
-- One row per registrant, linked 1:1 to a users row
-- ------------------------------------------------
CREATE TABLE students (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL UNIQUE,
    first_name      VARCHAR(100) NOT NULL,
    middle_name     VARCHAR(100),
    last_name       VARCHAR(100) NOT NULL,
    birthdate       DATE NOT NULL,
    sex             ENUM('Male', 'Female') NOT NULL,
    address         VARCHAR(255) NOT NULL,
    course_id       INT NOT NULL,
    year_level      ENUM('1st Year','2nd Year','3rd Year','4th Year') NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    contact_number  VARCHAR(11)  NOT NULL,           -- 09XXXXXXXXX, matches the pattern in registration.html
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_students_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_students_course
        FOREIGN KEY (course_id) REFERENCES courses(id)
) ENGINE=InnoDB;

-- ------------------------------------------------
-- Seed an admin account so login.js's hardcoded
-- admin/12345 check can be replaced with a real DB lookup.
-- Replace the hash below with a real one from PHP:
--   php -r "echo password_hash('12345', PASSWORD_DEFAULT);"
-- ------------------------------------------------
INSERT INTO users (username, password_hash, role) VALUES
    ('admin', '$2y$10$FSd.rBNOG8R3iqz6qZ.R5OStp6FZfAxJ5qnGZpsWZp9j4ZDs4uNZG', 'admin');
