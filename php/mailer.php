<?php
/*
 * SELAH International — SMTP Mailer
 * Uses PHPMailer (manual install, no Composer)
 */

require_once __DIR__ . '/smtp_config.php';
require_once __DIR__ . '/PHPMailer/src/Exception.php';
require_once __DIR__ . '/PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$GLOBALS['selah_mail_error'] = '';

function selah_send_mail($to, $subject, $htmlBody, $replyTo = '') {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = SMTP_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = SMTP_USER;
        $mail->Password   = SMTP_PASS;
        $mail->SMTPSecure = SMTP_SECURE;
        $mail->Port       = SMTP_PORT;
        $mail->CharSet    = 'UTF-8';
        $mail->SMTPDebug  = 0;

        $mail->setFrom(SMTP_FROM, SMTP_FROM_NAME);
        $mail->addAddress($to);

        if ($replyTo) {
            $mail->addReplyTo($replyTo);
        }

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $htmlBody;
        $mail->AltBody = strip_tags(str_replace(['<br>', '<br/>', '<br />'], "\n", $htmlBody));

        $mail->send();
        $GLOBALS['selah_mail_error'] = '';
        return true;
    } catch (Exception $e) {
        $GLOBALS['selah_mail_error'] = $mail->ErrorInfo;
        error_log('SELAH Mailer Error: ' . $mail->ErrorInfo);
        return false;
    }
}

function selah_email_template($title, $contentHtml, $footerNote = '') {
    $year = date('Y');
    return '
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(19,49,124,0.08);">

<!-- HEADER -->
<tr><td style="background:#13317C;padding:32px 40px;text-align:center;">
<img src="https://selahinter.com/images/logo/Asset%2040%4072x.webp" width="160" alt="SELAH INTERNATIONAL" style="display:inline-block;max-width:160px;height:auto;">
</td></tr>

<!-- TITLE BAR -->
<tr><td style="background:#39CCFF;padding:14px 40px;text-align:center;">
<div style="font-family:Arial,sans-serif;font-size:14px;font-weight:bold;color:#13317C;letter-spacing:2px;text-transform:uppercase;">' . htmlspecialchars($title) . '</div>
</td></tr>

<!-- CONTENT -->
<tr><td style="padding:36px 40px;">
' . $contentHtml . '
</td></tr>

<!-- FOOTER -->
<tr><td style="background:#f8f9fc;padding:24px 40px;border-top:1px solid #e8ebf2;">
' . ($footerNote ? '<div style="font-size:12px;color:#8892a8;line-height:1.7;margin-bottom:12px;">' . $footerNote . '</div>' : '') . '
<div style="font-size:11px;color:#b0b8cc;line-height:1.6;text-align:center;">
&copy; ' . $year . ' SELAH INTERNATIONAL CO.,LTD.<br>
No. 1, G.S. Mansion Bldg., Room 6A, Soi Sukhumvit 35<br>
Sukhumvit Rd., Khlong Tan Nuea, Vaddhana, Bangkok 10110<br>
<a href="https://selahinter.com" style="color:#39CCFF;text-decoration:none;">selahinter.com</a>
</div>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>';
}
