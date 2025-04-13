USE cv_generator;

-- Applicants table
CREATE TABLE applicants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    domain VARCHAR(50),
    position VARCHAR(100),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    location VARCHAR(100),
    linkedin VARCHAR(255),
    summary TEXT,
    photo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Work Experience table
CREATE TABLE work_experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT,
    job_title VARCHAR(100),
    company VARCHAR(100),
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE
);

-- Education table
CREATE TABLE education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT,
    degree VARCHAR(100),
    institution VARCHAR(100),
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE
);

-- Skills table
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT,
    skill_name VARCHAR(100),
    FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE
);

-- Certifications table
CREATE TABLE certifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT,
    certification_name VARCHAR(100),
    issuing_organization VARCHAR(100),
    date_obtained DATE,
    description TEXT,
    FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE
);

-- Languages table
CREATE TABLE languages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT,
    language_name VARCHAR(50),
    proficiency VARCHAR(50),
    FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE
);

-- Projects table
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT,
    project_title VARCHAR(100),
    technologies VARCHAR(255),
    description TEXT,
    link VARCHAR(255),
    FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE
);

-- Recruiters table
CREATE TABLE recruiters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Insert a sample recruiter (password: "password123" - hash will be added later)
INSERT INTO recruiters (username, password)
VALUES ('admin', 'TEMPORARY_PASSWORD');
