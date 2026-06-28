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

$totalSubs = count($existing) + 1;

$contentHtml = '
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="text-align:center;padding-bottom:24px;">
<div style="display:inline-block;background:#e8f8f0;border-radius:50%;width:64px;height:64px;line-height:64px;text-align:center;font-size:28px;">&#9989;</div>
</td></tr>

<tr><td style="text-align:center;padding-bottom:8px;">
<div style="font-size:18px;color:#13317C;font-weight:bold;">New Email Subscriber</div>
</td></tr>

<tr><td style="text-align:center;padding-bottom:28px;">
<div style="font-size:13px;color:#8892a8;">' . date('d M Y, H:i') . '</div>
</td></tr>

<tr><td>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fc;border-radius:8px;overflow:hidden;">
<tr>
<td style="padding:16px 20px;border-bottom:1px solid #e8ebf2;">
<div style="font-size:11px;color:#8892a8;text-transform:uppercase;letter-spacing:1px;font-weight:bold;margin-bottom:4px;">Email Address</div>
<a href="mailto:' . $email . '" style="font-size:16px;color:#39CCFF;text-decoration:none;font-weight:bold;">' . $email . '</a>
</td>
</tr>
<tr>
<td style="padding:16px 20px;border-bottom:1px solid #e8ebf2;">
<div style="font-size:11px;color:#8892a8;text-transform:uppercase;letter-spacing:1px;font-weight:bold;margin-bottom:4px;">IP Address</div>
<div style="font-size:14px;color:#333;">' . $ip . '</div>
</td>
</tr>
<tr>
<td style="padding:16px 20px;">
<div style="font-size:11px;color:#8892a8;text-transform:uppercase;letter-spacing:1px;font-weight:bold;margin-bottom:4px;">Total Subscribers</div>
<div style="font-size:24px;color:#13317C;font-weight:bold;">' . $totalSubs . '</div>
</td>
</tr>
</table>
</td></tr>
</table>';

$subject = '[SELAH] New Subscriber: ' . $email;
$html = selah_email_template('New Email Subscriber', $contentHtml);
selah_send_mail(ADMIN_EMAIL, $subject, $html, $email);

echo json_encode(['success' => true, 'message' => 'Subscribed successfully! Thank you.']);
