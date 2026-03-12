<?php
// api/auth.php - Clean auth

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

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'register':
        $input = json_decode(file_get_contents('php://input'), true);
        $name = trim($input['name'] ?? '');
        $email = trim($input['email'] ?? '');
        $password = $input['password'] ?? '';
        $address = $input['address'] ?? '';
        $work = $input['work'] ?? '';
        $company = $input['company'] ?? '';

        if (empty($name) || empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            exit;
        }

        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, address, work, company) VALUES (?, ?, ?, ?, ?, ?)");
        try {
            $stmt->execute([$name, $email, $hash, $address, $work, $company]);
            $userId = $pdo->lastInsertId();
            echo json_encode(['message' => 'Registered', 'user' => ['id' => $userId, 'name' => $name, 'type' => 'user']]);
        } catch (PDOException $e) {
            http_response_code(400);
            echo json_encode(['error' => 'Email already exists']);
        }
        break;

    case 'login':
        $input = json_decode(file_get_contents('php://input'), true);
        $email = trim($input['email'] ?? '');
        $password = $input['password'] ?? '';

        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            unset($user['password']);
            echo json_encode(['message' => 'Logged in', 'user' => $user]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
        }
        break;

    case 'check-session':
        if (isset($_SESSION['user_id'])) {
            $stmt = $pdo->prepare("SELECT id, name, `type` FROM users WHERE id = ?");
            $stmt->execute([$_SESSION['user_id']]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode(['logged_in' => true, 'user' => $user]);
        } else {
            echo json_encode(['logged_in' => false]);
        }
        break;

    case 'logout':
        session_destroy();
        echo json_encode(['message' => 'Logged out']);
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
}
?>

