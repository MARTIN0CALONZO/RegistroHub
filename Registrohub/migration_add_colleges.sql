-- ============================================
-- Migration: add colleges table + link to courses
-- Run this in phpMyAdmin's SQL tab on your EXISTING database.
-- Safe to run once — does not touch students/users data.
-- ============================================

USE student_registration_system;

-- 1. Create the colleges table
CREATE TABLE colleges (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    college_name    VARCHAR(150) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT INTO colleges (college_name) VALUES
    ('College of Business Education and Accountancy'),
    ('College of Medicine'),
    ('College of Information Communication Technology');

-- 2. Add the new column to courses (nullable for now, so existing rows aren't rejected)
ALTER TABLE courses ADD COLUMN college_id INT NULL AFTER course_name;

-- 3. Populate college_id for the existing course rows
UPDATE courses SET college_id =
    (SELECT id FROM colleges WHERE college_name = 'College of Information Communication Technology')
    WHERE course_name = 'Bachelor of Science in Information Technology';

UPDATE courses SET college_id =
    (SELECT id FROM colleges WHERE college_name = 'College of Medicine')
    WHERE course_name = 'Bachelor of Science in Medical Technology';

UPDATE courses SET college_id =
    (SELECT id FROM colleges WHERE college_name = 'College of Business Education and Accountancy')
    WHERE course_name = 'Bachelor of Science in Business Administration';

-- 4. Now that every row has a college_id, lock the column down to NOT NULL
ALTER TABLE courses MODIFY COLUMN college_id INT NOT NULL;

-- 5. Add the foreign key relationship
ALTER TABLE courses
    ADD CONSTRAINT fk_courses_college
    FOREIGN KEY (college_id) REFERENCES colleges(id);
