<?php
session_start();
header('Content-Type: application/json');
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

$required = ['fname','mname','lname','bdate','sex','address','course','yrlvl','email','contact','username','password'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        echo json_encode(['success' => false, 'message' => "Missing field: $field"]);
        exit;
    }
}

$firstname  = trim($data['fname']);
$middlename = trim($data['mname']);
$lastname   = trim($data['lname']);
$birthdate  = $data['bdate'];
$sex        = $data['sex'];
$address    = trim($data['address']);
$course     = $data['course'];
$yearlvl    = $data['yrlvl'];
$email      = trim($data['email']);
$contact    = trim($data['contact']);
$username   = trim($data['username']);
$password   = $data['password'];

// Mirror the validation already hinted at in registration.html
if (strlen($username) < 4 || strlen($username) > 20 || preg_match('/\s/', $username)) {
    echo json_encode(['success' => false, 'message' => 'Username must be 4-20 characters with no spaces.']);
    exit;
}
if (strlen($password) < 8 || !preg_match('/[A-Z]/', $password) || !preg_match('/[0-9]/', $password) || !preg_match('/[\W_]/', $password)) {
    echo json_encode(['success' => false, 'message' => 'Password must be 8+ characters with an uppercase letter, a number, and a symbol.']);
    exit;
}
if (!preg_match('/^09[0-9]{9}$/', $contact)) {
    echo json_encode(['success' => false, 'message' => 'Contact number must be in format 09XXXXXXXXX.']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute([$username]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Username already taken.']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT id FROM students WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Email already registered.']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT id FROM courses WHERE course_name = ?");
    $stmt->execute([$course]);
    $courseRow = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$courseRow) {
        echo json_encode(['success' => false, 'message' => 'Invalid course selected.']);
        exit;
    }
    $course_id = $courseRow['id'];

    $pdo->beginTransaction();

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (username, password_hash, role) VALUES (?, ?, 'student')");
    $stmt->execute([$username, $hash]);
    $user_id = $pdo->lastInsertId();

    $stmt = $pdo->prepare(
        "INSERT INTO students (user_id, first_name, middle_name, last_name, birthdate, sex, address, course_id, year_level, email, contact_number)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([$user_id, $firstname, $middlename, $lastname, $birthdate, $sex, $address, $course_id, $yearlvl, $email, $contact]);

    $pdo->commit();

    echo json_encode(['success' => true, 'message' => 'Registration successful!']);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode(['success' => false, 'message' => 'Registration failed. Please try again.']);
}
