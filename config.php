<?php
session_start();

define('DB_HOST', 'localhost');
define('DB_USERNAME', 'php2446');
define('DB_PASSWORD', 'Tihad=Eyahe784');
define('DB_DATABASE', 'php2446');
define('USERS_TABLE', 'users');
define('HOMEWORK_TABLE', 'homework');

$connection = mysqli_connect(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE);

if(!$connection) {
  die("Connection failed: " . mysqli_connect_error());
}

// Security Headers
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: strict-origin-when-cross-origin");
header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'");

// Session Security
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_samesite', 'Strict');

// Error Reporting (disable in production)
if ($_SERVER['SERVER_NAME'] === 'localhost' || $_SERVER['SERVER_NAME'] === '127.0.0.1') {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
    ini_set('display_startup_errors', 0);
    error_reporting(0);
}

// CSRF Protection
if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

function csrf_token() {
    return $_SESSION['csrf_token'];
}

function verify_csrf_token() {
    if (!isset($_POST['csrf_token']) || !isset($_SESSION['csrf_token'])) {
        return false;
    }
    
    if (!hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
        return false;
    }
    
    return true;
}

// Input Sanitization
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Rate Limiting
function check_rate_limit($key, $max_requests = 5, $period = 60) {
    if (!isset($_SESSION['rate_limits'][$key])) {
        $_SESSION['rate_limits'][$key] = array(
            'count' => 0,
            'first_request' => time()
        );
    }

    $limit = &$_SESSION['rate_limits'][$key];
    
    if (time() - $limit['first_request'] > $period) {
        $limit['count'] = 1;
        $limit['first_request'] = time();
        return true;
    }

    if ($limit['count'] >= $max_requests) {
        return false;
    }

    $limit['count']++;
    return true;
}

// Database connection with improved security
function get_db_connection() {
    static $conn = null;
    
    if ($conn === null) {
        try {
            $conn = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_DATABASE . ";charset=utf8mb4",
                DB_USERNAME,
                DB_PASSWORD,
                array(
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
                )
            );
        } catch (PDOException $e) {
            error_log("Connection failed: " . $e->getMessage());
            die("Connection failed. Please try again later.");
        }
    }
    
    return $conn;
}

// Password Hashing
function hash_password($password) {
    return password_hash($password, PASSWORD_ARGON2ID, [
        'memory_cost' => 65536,
        'time_cost' => 4,
        'threads' => 1
    ]);
}

function verify_password($password, $hash) {
    return password_verify($password, $hash);
}

// Secure File Upload
function secure_file_upload($file, $allowed_types = ['image/jpeg', 'image/png'], $max_size = 5242880) {
    if (!isset($file['error']) || is_array($file['error'])) {
        throw new RuntimeException('Invalid parameters.');
    }

    switch ($file['error']) {
        case UPLOAD_ERR_OK:
            break;
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            throw new RuntimeException('File size exceeded.');
        default:
            throw new RuntimeException('Unknown error.');
    }

    if ($file['size'] > $max_size) {
        throw new RuntimeException('File size exceeded.');
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime_type = $finfo->file($file['tmp_name']);

    if (!in_array($mime_type, $allowed_types)) {
        throw new RuntimeException('Invalid file format.');
    }

    $filename = sprintf(
        '%s-%s.%s',
        bin2hex(random_bytes(16)),
        date('Y-m-d-H-i-s'),
        pathinfo($file['name'], PATHINFO_EXTENSION)
    );

    if (!move_uploaded_file(
        $file['tmp_name'],
        sprintf('./uploads/%s', $filename)
    )) {
        throw new RuntimeException('Failed to move uploaded file.');
    }

    return $filename;
}
