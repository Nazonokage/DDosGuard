CREATE DATABASE IF NOT EXISTS ddos_simulation;
USE ddos_simulation;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    address TEXT,
    work VARCHAR(100),
    company VARCHAR(100),  -- Company/workplace column
    account_type ENUM('Client', 'Admin') NOT NULL DEFAULT 'Client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- IP Tracking Table
CREATE TABLE IF NOT EXISTS ip_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL UNIQUE,
    status ENUM('unmarked', 'attempted', 'blocked') DEFAULT 'unmarked',
    attempt_count INT DEFAULT 0,
    first_attempt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_attempt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    block_reason TEXT,
    blocked_until TIMESTAMP NULL
);

-- Insert sample admin user
INSERT INTO users (id, name, email, password_hash, address, work, company, created_at, account_type)
VALUES (1, 'human', 'bruh@hitman.com', 'a95bc16631ae2b6fadb455ee018da0adc2703e56d89e3eed074ce56d2f7b1b6a', 'Moscow', 'asdasd', 'Student', '2025-02-09 19:50:59', 'Admin')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert sample feedback
INSERT INTO feedback (user_id, message)
VALUES (1, 'This is a test feedback message.');
