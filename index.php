<?php
session_start();

// Check if user is already logged in
if (isset($_SESSION['user_id'])) {
    // Redirect to home page
    header('location: home.php');
    exit;
} else {
    // Redirect to welcome page
    header('location: welcome.php');
    exit;
}
?> 