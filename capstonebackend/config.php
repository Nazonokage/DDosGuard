<?php
// config.php - MySQL Database Config (Edit for XAMPP/InfinityFree)
$DB_HOST = 'sql310.infinityfree.com';
$DB_NAME = 'if0_41371466_capstone_db';  // Create DB in phpMyAdmin
$DB_USER = 'if0_41371466';         // XAMPP default
$DB_PASS = 'SFW1dIfgMrnE9';             // XAMPP default empty

try {
    $pdo = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4", $DB_USER, $DB_PASS);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die('MySQL failed: ' . $e->getMessage() . '. Check config vars.');
}

// Init tables
$initSql = "CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address TEXT,
    work VARCHAR(255),
    company VARCHAR(255),
    `type` VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feedback (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);";

$pdo->exec($initSql);
?>

