<?php
header('Content-Type: text/html; charset=utf-8');
echo '<div style="font-family:Arial;max-width:600px;margin:40px auto;padding:20px;">';
echo '<h2 style="color:#13317C;">SELAH Email Test</h2>';

require_once __DIR__ . '/mailer.php';

// Config info
echo '<div style="background:#f4f6fb;padding:16px;border-radius:8px;margin-bottom:20px;font-size:13px;">';
echo '<strong>SMTP Host:</strong> ' . SMTP_HOST . '<br>';
echo '<strong>SMTP Port:</strong> ' . SMTP_PORT . '<br>';
echo '<strong>SMTP User:</strong> ' . SMTP_USER . '<br>';
echo '<strong>SMTP Pass:</strong> ' . (SMTP_PASS === 'YOUR_APP_PASSWORD_HERE' ? '⚠️ NOT SET' : '✅ Set (' . strlen(SMTP_PASS) . ' chars)') . '<br>';
echo '<strong>Send To:</strong> ' . ADMIN_EMAIL . '<br>';
echo '<strong>PHPMailer:</strong> ' . (class_exists('PHPMailer\PHPMailer\PHPMailer') ? '✅ Loaded' : '❌ Missing') . '<br>';
echo '</div>';

// Simple test email
echo '<p>Sending test email...</p>';

$testHtml = selah_email_template('Email Test', '
<div style="text-align:center;padding:20px 0;">
<div style="font-size:48px;margin-bottom:16px;">✉️</div>
<div style="font-size:20px;color:#13317C;font-weight:bold;margin-bottom:8px;">Test Email Successful!</div>
<div style="font-size:14px;color:#666;line-height:1.8;">
This email was sent from <strong>selahinter.com</strong><br>
via <strong>' . SMTP_HOST . '</strong> SMTP<br>
at ' . date('d M Y, H:i:s') . '
</div>
</div>');

$ok = selah_send_mail(ADMIN_EMAIL, '[SELAH TEST] Email Test ' . date('H:i:s'), $testHtml);

if ($ok) {
    echo '<div style="background:#e8f8f0;color:#1B8C1B;padding:16px;border-radius:8px;font-weight:bold;">';
    echo '✅ Email sent successfully to ' . ADMIN_EMAIL . '</div>';
    echo '<p>Check your inbox (and spam folder).</p>';
} else {
    echo '<div style="background:#fef3f3;color:#e34948;padding:16px;border-radius:8px;border-left:4px solid #e34948;">';
    echo '<strong>❌ Email FAILED</strong><br><br>';
    echo '<strong>Error:</strong> ' . htmlspecialchars($GLOBALS['selah_mail_error']) . '<br><br>';

    $err = $GLOBALS['selah_mail_error'];
    echo '<strong>Possible fix:</strong><br>';
    if (strpos($err, 'authentication') !== false || strpos($err, 'AUTH') !== false || strpos($err, '535') !== false) {
        echo '→ Wrong password or App Password needed<br>';
        echo '→ Go to <a href="https://myaccount.google.com/apppasswords">Google App Passwords</a><br>';
        echo '→ Make sure 2-Step Verification is ON first';
    } elseif (strpos($err, 'connect') !== false || strpos($err, 'Connection') !== false) {
        echo '→ Server cannot connect to ' . SMTP_HOST . ':' . SMTP_PORT . '<br>';
        echo '→ Hosting may block outgoing SMTP. Contact hosting support.';
    } elseif (strpos($err, 'certificate') !== false || strpos($err, 'SSL') !== false) {
        echo '→ SSL/TLS certificate issue. Try changing SMTP_SECURE or SMTP_PORT.';
    } else {
        echo '→ Check the error message above for details.';
    }
    echo '</div>';
}

echo '<p style="color:#e34948;font-size:13px;margin-top:24px;">⚠️ <strong>DELETE this file after testing!</strong></p>';
echo '</div>';
