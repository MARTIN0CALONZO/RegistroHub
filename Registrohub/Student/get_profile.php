<?php
session_start();
header('Content-Type: application/json');
require_once '../db.php';

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'student') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Not authorized.']);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "SELECT s.first_name, s.middle_name, s.last_name, s.birthdate, s.sex,
                s.address, c.course_name, col.college_name, s.year_level,
                s.email, s.contact_number
        FROM students s
        JOIN courses c ON c.id = s.course_id
        JOIN colleges col ON col.id = c.college_id
        WHERE s.user_id = ?"
    );
    $stmt->execute([$_SESSION['user_id']]);
    $student = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$student) {
        echo json_encode(['success' => false, 'message' => 'No record on file.']);
        exit;
    }

    $bdate = new DateTime($student['birthdate']);
    $student['age'] = (new DateTime())->diff($bdate)->y;

    echo json_encode(['success' => true, 'student' => $student]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not load record.']);
}
