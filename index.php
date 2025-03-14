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

<div class="main-nav">
    <a href="add_task.php" class="btn">Add New Task</a>
    <a href="tasks.php" class="btn">View All Tasks</a>
    <a href="logout.php" class="btn">Logout</a>
</div>
?> 