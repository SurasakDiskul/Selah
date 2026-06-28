<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/mailer.php';

define('CSV_FILE', __DIR__ . '/subscribers.csv');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);

if (!$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

$timestamp = date('Y-m-d H:i:s');
$ip = $_SERVER['REMOTE_ADDR'] ?? '-';

$existing = [];
if (file_exists(CSV_FILE)) {
    $handle = fopen(CSV_FILE, 'r');
    while (($row = fgetcsv($handle)) !== false) {
        if (isset($row[0])) $existing[] = strtolower(trim($row[0]));
    }
    fclose($handle);
}

if (in_array(strtolower($email), $existing)) {
    echo json_encode(['success' => true, 'message' => 'You are already subscribed. Thank you!']);
    exit;
}

$handle = fopen(CSV_FILE, 'a');
if (!$handle) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error. Please try again later.']);
    exit;
}
fputcsv($handle, [$email, $timestamp, $ip]);
fclose($handle);

$subject = '[SELAH INTERNATIONAL] New Email Subscriber';
$body = "New subscriber on SELAH INTERNATIONAL website\n"
      . str_repeat('-', 40) . "\n"
      . "Email : $email\n"
      . "Time  : $timestamp\n"
      . "IP    : $ip\n"
      . str_repeat('-', 40) . "\n";

selah_send_mail(ADMIN_EMAIL, $subject, $body, $email);

echo json_encode(['success' => true, 'message' => 'Subscribed successfully! Thank you.']);
