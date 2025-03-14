<?php
include 'config.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_POST['task_id'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

$task_id = intval($_POST['task_id']);
$user_id = $_SESSION['user_id'];

// Verify the task belongs to the user
$sql = "DELETE FROM " . HOMEWORK_TABLE . " WHERE id = ? AND user_id = ?";
$stmt = mysqli_prepare($connection, $sql);
mysqli_stmt_bind_param($stmt, "ii", $task_id, $user_id);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}

mysqli_stmt_close($stmt);
?> 