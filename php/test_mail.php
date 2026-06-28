<?php
/*
 * SELAH — Email Test Script
 * Upload to server, open in browser: https://selahinter.com/php/test_mail.php
 * DELETE THIS FILE after testing!
 */

header('Content-Type: text/html; charset=utf-8');

echo '<h2 style="font-family:Arial;color:#13317C;">SELAH Email Test</h2>';

require_once __DIR__ . '/mailer.php';

// Test 1: Contact form email
echo '<p>Sending contact form test...</p>';

$contentHtml = '
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td colspan="2" style="padding-bottom:20px;">
<div style="font-family:Arial;font-size:16px;color:#13317C;font-weight:bold;margin-bottom:6px;">Test Contact Message</div>
<div style="font-family:Arial;font-size:13px;color:#8892a8;">Sent on ' . date('d M Y, H:i') . '</div>
</td></tr>
<tr>
<td style="padding:12px 16px;background:#f8f9fc;border-radius:8px 8px 0 0;border-bottom:1px solid #e8ebf2;width:120px;">
<div style="font-size:11px;color:#8892a8;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">Name</div>
</td>
<td style="padding:12px 16px;background:#f8f9fc;border-radius:8px 8px 0 0;border-bottom:1px solid #e8ebf2;">
<div style="font-size:14px;color:#13317C;font-weight:bold;">Test User</div>
</td>
</tr>
<tr>
<td style="padding:12px 16px;border-bottom:1px solid #f0f2f7;">
<div style="font-size:11px;color:#8892a8;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">Email</div>
</td>
<td style="padding:12px 16px;border-bottom:1px solid #f0f2f7;">
<a href="mailto:test@example.com" style="font-size:14px;color:#39CCFF;text-decoration:none;">test@example.com</a>
</td>
</tr>
<tr>
<td colspan="2" style="padding:20px 0 0;">
<div style="font-size:11px;color:#8892a8;text-transform:uppercase;letter-spacing:1px;font-weight:bold;margin-bottom:8px;">Message</div>
<div style="background:#f8f9fc;border-radius:8px;padding:20px;border-left:4px solid #39CCFF;">
<div style="font-size:14px;color:#333;line-height:1.8;">This is a test email from SELAH International website. If you see this beautifully formatted in your inbox (not spam), everything is working correctly!</div>
</div>
</td>
</tr>
</table>
<div style="margin-top:24px;text-align:center;">
<a href="mailto:test@example.com" style="display:inline-block;background:#13317C;color:#ffffff;padding:12px 32px;border-radius:6px;font-size:13px;font-weight:bold;text-decoration:none;letter-spacing:1px;">REPLY TO TEST USER</a>
</div>';

$html = selah_email_template('Contact Form Test', $contentHtml);
$ok1 = selah_send_mail(ADMIN_EMAIL, '[SELAH TEST] Contact Form', $html, 'test@example.com');

echo $ok1
    ? '<p style="color:green;font-weight:bold;">&#10004; Contact email sent to ' . ADMIN_EMAIL . '</p>'
    : '<p style="color:red;font-weight:bold;">&#10008; Contact email FAILED</p>';

// Test 2: Subscribe email
echo '<p>Sending subscribe test...</p>';

$contentHtml2 = '
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="text-align:center;padding-bottom:24px;">
<div style="display:inline-block;background:#e8f8f0;border-radius:50%;width:64px;height:64px;line-height:64px;text-align:center;font-size:28px;">&#9989;</div>
</td></tr>
<tr><td style="text-align:center;padding-bottom:8px;">
<div style="font-size:18px;color:#13317C;font-weight:bold;">New Email Subscriber (TEST)</div>
</td></tr>
<tr><td style="text-align:center;padding-bottom:28px;">
<div style="font-size:13px;color:#8892a8;">' . date('d M Y, H:i') . '</div>
</td></tr>
<tr><td>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fc;border-radius:8px;">
<tr><td style="padding:16px 20px;border-bottom:1px solid #e8ebf2;">
<div style="font-size:11px;color:#8892a8;text-transform:uppercase;letter-spacing:1px;font-weight:bold;margin-bottom:4px;">Email Address</div>
<a href="mailto:subscriber@test.com" style="font-size:16px;color:#39CCFF;text-decoration:none;font-weight:bold;">subscriber@test.com</a>
</td></tr>
<tr><td style="padding:16px 20px;">
<div style="font-size:11px;color:#8892a8;text-transform:uppercase;letter-spacing:1px;font-weight:bold;margin-bottom:4px;">Total Subscribers</div>
<div style="font-size:24px;color:#13317C;font-weight:bold;">42</div>
</td></tr>
</table>
</td></tr>
</table>';

$html2 = selah_email_template('New Subscriber Test', $contentHtml2);
$ok2 = selah_send_mail(ADMIN_EMAIL, '[SELAH TEST] New Subscriber', $html2, 'subscriber@test.com');

echo $ok2
    ? '<p style="color:green;font-weight:bold;">&#10004; Subscribe email sent to ' . ADMIN_EMAIL . '</p>'
    : '<p style="color:red;font-weight:bold;">&#10008; Subscribe email FAILED</p>';

// Summary
echo '<hr>';
echo '<h3 style="font-family:Arial;color:#13317C;">Configuration</h3>';
echo '<pre style="background:#f4f6fb;padding:16px;border-radius:8px;font-size:13px;">';
echo 'SMTP Host : ' . SMTP_HOST . "\n";
echo 'SMTP Port : ' . SMTP_PORT . "\n";
echo 'SMTP User : ' . SMTP_USER . "\n";
echo 'SMTP Pass : ' . (SMTP_PASS === 'YOUR_PASSWORD_HERE' ? '⚠️ NOT SET (using fallback mail())' : '✅ Configured') . "\n";
echo 'Admin Email: ' . ADMIN_EMAIL . "\n";
echo 'PHPMailer : ' . (class_exists('PHPMailer\PHPMailer\PHPMailer') ? '✅ Loaded' : '❌ Not found') . "\n";
echo '</pre>';

if (SMTP_PASS === 'YOUR_PASSWORD_HERE') {
    echo '<p style="color:#e34948;font-family:Arial;font-size:14px;background:#fef3f3;padding:16px;border-radius:8px;border-left:4px solid #e34948;">';
    echo '<strong>⚠️ SMTP password not set!</strong><br>';
    echo 'Email was sent using PHP mail() fallback which may go to spam.<br>';
    echo 'Set the real password in <code>php/smtp_config.php</code> to send via Microsoft 365 SMTP.';
    echo '</p>';
}

echo '<p style="color:#e34948;font-family:Arial;font-size:13px;margin-top:24px;">⚠️ <strong>DELETE this file after testing!</strong> (php/test_mail.php)</p>';
