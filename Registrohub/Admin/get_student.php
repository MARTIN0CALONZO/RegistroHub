<?php
session_start();
header('Content-Type: application/json');
require_once '../db.php';

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Not authorized.']);
    exit;
}

try {
    $stmt = $pdo->query(
        "SELECT s.id, s.first_name, s.middle_name, s.last_name, s.birthdate, s.sex,
                s.address, c.course_name, s.year_level, s.email, s.contact_number
        FROM students s
        JOIN courses c ON c.id = s.course_id
        ORDER BY s.last_name, s.first_name"
    );
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $today = new DateTime();
    foreach ($rows as &$row) {
        $bdate = new DateTime($row['birthdate']);
        $row['age'] = $today->diff($bdate)->y;
    }

    echo json_encode(['success' => true, 'students' => $rows]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not load students.']);
}
