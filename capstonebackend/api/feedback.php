<?php
// api/feedback.php

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
        $stmt = $pdo->prepare("SELECT f.*, u.name FROM feedback f JOIN users u ON f.user_id = u.id ORDER BY f.created_at DESC");
        $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'create':
        $input = json_decode(file_get_contents('php://input'), true);
        $message = trim($input['message'] ?? '');
        if (empty($message)) {
            http_response_code(400);
            echo json_encode(['error' => 'Message required']);
            exit;
        }
        $stmt = $pdo->prepare("INSERT INTO feedback (user_id, message) VALUES (?, ?)");
        $stmt->execute([$_SESSION['user_id'], $message]);
        echo json_encode(['message' => 'Created', 'id' => $pdo->lastInsertId()]);
        break;

    case 'update':
        $id = $_GET['id'] ?? 0;
        $input = json_decode(file_get_contents('php://input'), true);
        $message = trim($input['message'] ?? '');
        if (empty($message)) {
            http_response_code(400);
            echo json_encode(['error' => 'Message required']);
            exit;
        }
        $stmt = $pdo->prepare("UPDATE feedback SET message = ? WHERE id = ? AND user_id = ?");
        $stmt->execute([$message, $id, $_SESSION['user_id']]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(['message' => 'Updated']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Not found']);
        }
        break;

    case 'delete':
        $id = $_GET['id'] ?? 0;
        $stmt = $pdo->prepare("DELETE FROM feedback WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $_SESSION['user_id']]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(['message' => 'Deleted']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Not found']);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
}
?>

