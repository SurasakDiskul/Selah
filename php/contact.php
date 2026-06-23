<?php
header('Content-Type: application/json; charset=utf-8');

define('TO',   'SELAH@SELAH-INTER.COM');
define('SITE', 'SELAH INTERNATIONAL');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success'=>false,'message'=>'Method not allowed']);
    exit;
}

function s($v){ return htmlspecialchars(strip_tags(trim($v??'')),ENT_QUOTES,'UTF-8'); }

$loc  = s($_POST['location'] ?? '');
$name = s($_POST['name']     ?? '');
$subj = s($_POST['subject']  ?? '');
$mail = filter_var(trim($_POST['email']??''), FILTER_VALIDATE_EMAIL);
$tel  = s($_POST['number']   ?? '');
$msg  = s($_POST['message']  ?? '');

if (!$name || !$mail || !$msg) {
    http_response_code(400);
    echo json_encode(['success'=>false,'message'=>'Name, email and message are required.']);
    exit;
}

$subject = '['.SITE.'] '.($subj?:'New Contact Form Submission');
$body    = "New message from ".SITE."\n".str_repeat('-',50)."\n"
         . "Name     : $name\nEmail    : $mail\nPhone    : $tel\n"
         . "Location : $loc\nSubject  : $subj\n".str_repeat('-',50)."\n"
         . "Message  :\n$msg\n".str_repeat('-',50)."\n"
         . "Time     : ".date('Y-m-d H:i:s')."\nIP       : ".($_SERVER['REMOTE_ADDR']??'-')."\n";

$headers = "From: noreply@selah-inter.com\r\nReply-To: $mail\r\n"
         . "Content-Type: text/plain; charset=UTF-8\r\nX-Mailer: PHP/".phpversion();

$ok = mail(TO, $subject, $body, $headers);
echo json_encode($ok
    ? ['success'=>true, 'message'=>'Your message has been sent successfully!']
    : ['success'=>false,'message'=>'Failed to send. Please email us directly at '.TO]
);
