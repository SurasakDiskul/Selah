<?php
header('Content-Type: application/json; charset=utf-8');

define('TO',        'SELAH@SELAH-INTER.COM');
define('SITE',      'SELAH INTERNATIONAL');
define('CSV_FILE',  __DIR__ . '/subscribers.csv');

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

$subject = '[' . SITE . '] New Email Subscriber';
$body = "New subscriber on " . SITE . "\n"
      . str_repeat('-', 40) . "\n"
      . "Email : $email\n"
      . "Time  : $timestamp\n"
      . "IP    : $ip\n"
      . str_repeat('-', 40) . "\n";

$headers = "From: noreply@selah-inter.com\r\n"
         . "Reply-To: $email\r\n"
         . "Content-Type: text/plain; charset=UTF-8\r\n";

mail(TO, $subject, $body, $headers);

echo json_encode(['success' => true, 'message' => 'Subscribed successfully! Thank you.']);
