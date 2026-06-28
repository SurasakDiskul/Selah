<?php
/*
 * SMTP Configuration for SELAH International
 * ============================================
 * Mail server: Microsoft 365 (Outlook)
 *
 * HOW TO SET UP:
 * 1. Replace 'YOUR_PASSWORD_HERE' with the actual password
 *    of SELAH@SELAH-INTER.COM (Microsoft 365 account)
 * 2. Upload this file to server at /php/smtp_config.php
 * 3. Make sure this file is NOT accessible from browser
 *    (the .htaccess in this folder blocks it)
 *
 * If using App Password (recommended for accounts with MFA):
 * - Go to https://mysignins.microsoft.com/security-info
 * - Add sign-in method > App password
 * - Use that generated password below instead
 */

define('SMTP_HOST',     'smtp.gmail.com');
define('SMTP_PORT',     587);
define('SMTP_SECURE',   'tls');
define('SMTP_USER',     'pukpik1337@gmail.com');
define('SMTP_PASS',     'YOUR_APP_PASSWORD_HERE');
define('SMTP_FROM',     'pukpik1337@gmail.com');
define('SMTP_FROM_NAME','SELAH INTERNATIONAL');
define('ADMIN_EMAIL',   'pukpik1337@gmail.com');
