<?php
session_start();
header('Content-Type: application/json');
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';

if ($username === '' || $password === '') {
    echo json_encode(['success' => false, 'message' => 'Username and password are required.']);
    exit;
}

$stmt = $pdo->prepare("SELECT id, username, password_hash, role FROM users WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['password_hash'])) {
    echo json_encode(['success' => false, 'message' => 'Login Failed!']);
    exit;
}

// Store session so admin_view.html / student_view.html can later be protected
$_SESSION['user_id']  = $user['id'];
$_SESSION['username'] = $user['username'];
$_SESSION['role']     = $user['role'];

echo json_encode([
    'success'  => true,
    'message'  => $user['role'] === 'admin' ? 'Admin access granted!' : 'Login successful!',
    'role'     => $user['role'],
    'redirect' => $user['role'] === 'admin' ? 'Admin/admin_view.html' : 'Student/student_view.html'
]);
