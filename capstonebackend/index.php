<?php
// index.php - Clean API router for React + XAMPP

// Dynamic CORS for local React dev (any localhost port)
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

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // CORS preflight
    exit(0);
}

require 'config.php';

// Example request path when served from XAMPP:
//   /capstonebackend/api/auth/login
// We just need to find the "api" segment and read after it.
$requestPath = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
$parts = explode('/', $requestPath);

$apiIndex = array_search('api', $parts, true);

if ($apiIndex !== false && isset($parts[$apiIndex + 1], $parts[$apiIndex + 2])) {
    $controller = $parts[$apiIndex + 1]; // auth, feedback, profile, ...
    $action = $parts[$apiIndex + 2];     // login, register, index, update, ...
    $file = "api/{$controller}.php";

    if (file_exists($file)) {
        $_GET['action'] = $action;
        include $file;
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Controller not found']);
    }
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Bad API path']);
}
?>

