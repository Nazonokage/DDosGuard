<?php
// api/profile.php

// Basic CORS for local React dev (http://localhost:<port>)
if (isset($_SERVER['HTTP_ORIGIN'])) {
    $origin = $_SERVER['HTTP_ORIGIN'];
    if (preg_match('#^http://localhost(:[0-9]+)?$#', $origin)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Credentials: true');
    }
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Ensure database connection is available when this file is called directly
require_once __DIR__ . '/../config.php';

session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'index':
        $stmt = $pdo->prepare("SELECT id, name, email, address, work, company, `type` FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user) {
            echo json_encode($user);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
        }
        break;

    case 'update':
        $input = json_decode(file_get_contents('php://input'), true);
        $fields = ['name', 'email', 'address', 'work', 'company'];
        $updates = [];
        $params = [];

        foreach ($fields as $field) {
            if (isset($input[$field])) {
                $updates[] = "$field = ?";
                $params[] = trim($input[$field]);
            }
        }

        if (!empty($updates)) {
            $sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
            $params[] = $_SESSION['user_id'];
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            echo json_encode(['message' => 'Updated']);
        } else {
            echo json_encode(['message' => 'No changes']);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
}
?>

