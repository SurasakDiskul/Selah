<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/mailer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

function s($v) { return htmlspecialchars(strip_tags(trim($v ?? '')), ENT_QUOTES, 'UTF-8'); }

$loc  = s($_POST['location'] ?? '');
$name = s($_POST['name']     ?? '');
$subj = s($_POST['subject']  ?? '');
$mail = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$tel  = s($_POST['number']   ?? '');
$msg  = s($_POST['message']  ?? '');

if (!$name || !$mail || !$msg) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Name, email and message are required.']);
    exit;
}

$time = date('d M Y, H:i');

$contentHtml = '
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td colspan="2" style="padding-bottom:20px;">
<div style="font-family:Arial,sans-serif;font-size:16px;color:#13317C;font-weight:bold;margin-bottom:6px;">New Contact Message</div>
<div style="font-family:Arial,sans-serif;font-size:13px;color:#8892a8;">Received on ' . $time . '</div>
</td></tr>

<tr>
<td style="padding:12px 16px;background:#f8f9fc;border-radius:8px 8px 0 0;border-bottom:1px solid #e8ebf2;width:120px;vertical-align:top;">
<div style="font-size:11px;color:#8892a8;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">Name</div>
</td>
<td style="padding:12px 16px;background:#f8f9fc;border-radius:8px 8px 0 0;border-bottom:1px solid #e8ebf2;">
<div style="font-size:14px;color:#13317C;font-weight:bold;">' . $name . '</div>
</td>
</tr>

<tr>
<td style="padding:12px 16px;border-bottom:1px solid #f0f2f7;vertical-align:top;">
<div style="font-size:11px;color:#8892a8;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">Email</div>
</td>
<td style="padding:12px 16px;border-bottom:1px solid #f0f2f7;">
<a href="mailto:' . $mail . '" style="font-size:14px;color:#39CCFF;text-decoration:none;">' . $mail . '</a>
</td>
</tr>

<tr>
<td style="padding:12px 16px;border-bottom:1px solid #f0f2f7;vertical-align:top;">
<div style="font-size:11px;color:#8892a8;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">Phone</div>
</td>
<td style="padding:12px 16px;border-bottom:1px solid #f0f2f7;">
<div style="font-size:14px;color:#333;">' . ($tel ?: '-') . '</div>
</td>
</tr>

<tr>
<td style="padding:12px 16px;border-bottom:1px solid #f0f2f7;vertical-align:top;">
<div style="font-size:11px;color:#8892a8;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">Location</div>
</td>
<td style="padding:12px 16px;border-bottom:1px solid #f0f2f7;">
<div style="font-size:14px;color:#333;">' . ($loc ?: '-') . '</div>
</td>
</tr>

<tr>
<td style="padding:12px 16px;border-bottom:1px solid #f0f2f7;vertical-align:top;">
<div style="font-size:11px;color:#8892a8;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">Subject</div>
</td>
<td style="padding:12px 16px;border-bottom:1px solid #f0f2f7;">
<div style="font-size:14px;color:#333;">' . ($subj ?: '-') . '</div>
</td>
</tr>

<tr>
<td colspan="2" style="padding:20px 0 0;">
<div style="font-size:11px;color:#8892a8;text-transform:uppercase;letter-spacing:1px;font-weight:bold;margin-bottom:8px;">Message</div>
<div style="background:#f8f9fc;border-radius:8px;padding:20px;border-left:4px solid #39CCFF;">
<div style="font-size:14px;color:#333;line-height:1.8;white-space:pre-wrap;">' . $msg . '</div>
</div>
</td>
</tr>
</table>

<div style="margin-top:24px;text-align:center;">
<a href="mailto:' . $mail . '" style="display:inline-block;background:#13317C;color:#ffffff;padding:12px 32px;border-radius:6px;font-size:13px;font-weight:bold;text-decoration:none;letter-spacing:1px;">REPLY TO ' . strtoupper($name) . '</a>
</div>';

$subject = '[SELAH] ' . ($subj ?: 'New Contact from ' . $name);
$html = selah_email_template('Contact Form Submission', $contentHtml);
$ok = selah_send_mail(ADMIN_EMAIL, $subject, $html, $mail);

echo json_encode($ok
    ? ['success' => true,  'message' => 'Your message has been sent successfully!']
    : ['success' => false, 'message' => 'Failed to send. Please email us directly at ' . ADMIN_EMAIL]
);
