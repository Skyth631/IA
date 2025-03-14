<?php
include 'config.php';

session_start();

if (!isset($_SESSION['user_id'])) {
  header('location: login.php');
  exit;
}

$task_id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$user_id = $_SESSION['user_id'];

// Fetch task details
$sql = "SELECT * FROM " . HOMEWORK_TABLE . " WHERE id = ? AND user_id = ?";
$stmt = mysqli_prepare($connection, $sql);
mysqli_stmt_bind_param($stmt, "ii", $task_id, $user_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (mysqli_num_rows($result) === 0) {
  header('location: home.php');
  exit;
}

$task = mysqli_fetch_assoc($result);
mysqli_stmt_close($stmt);

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $task_name = trim($_POST['task_name']);
  $task_description = trim($_POST['task_description']);
  $due_date = $_POST['due_date'];
  $priority = $_POST['priority'];
  
  // Validate input
  $errors = [];
  if (empty($task_name)) {
    $errors[] = "Task name is required";
  }
  if (empty($due_date)) {
    $errors[] = "Due date is required";
  }
  if (!in_array($priority, ['high', 'medium', 'low'])) {
    $errors[] = "Invalid priority level";
  }
  
  if (empty($errors)) {
    $sql = "UPDATE " . HOMEWORK_TABLE . " SET task_name = ?, task_description = ?, due_date = ?, priority = ? WHERE id = ? AND user_id = ?";
    $stmt = mysqli_prepare($connection, $sql);
    mysqli_stmt_bind_param($stmt, "ssssii", $task_name, $task_description, $due_date, $priority, $task_id, $user_id);
    
    if (mysqli_stmt_execute($stmt)) {
      header('location: home.php');
      exit;
    } else {
      $errors[] = "Error updating task";
    }
    mysqli_stmt_close($stmt);
  }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Homework Tracker - Edit Task</title>
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="calendar.css">
</head>
<body>
  <div class="home-container">
    <div class="header">
      <h1>Edit Task</h1>
      <div class="logo-container">
        <img src="logo.svg" alt="Logo">
      </div>
      <p class="welcome-message">Welcome <?php echo isset($_SESSION['username']) ? $_SESSION['username'] : 'User'; ?>!</p>
      <p class="description">Update your task details below.</p>
      <nav class="main-nav">
        <a href="home.php" class="btn">Back to Calendar</a>
      </nav>
    </div>

    <?php if (!empty($errors)): ?>
      <div class="error">
        <?php foreach ($errors as $error): ?>
          <p><?php echo htmlspecialchars($error); ?></p>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>

    <div class="task-form-section">
      <form method="POST" class="task-form">
        <div class="form-group">
          <label for="task_name">Task Name</label>
          <input type="text" id="task_name" name="task_name" value="<?php echo htmlspecialchars($task['task_name']); ?>" required>
        </div>

        <div class="form-group">
          <label for="task_description">Description</label>
          <textarea id="task_description" name="task_description" rows="4"><?php echo htmlspecialchars($task['task_description']); ?></textarea>
        </div>

        <div class="form-group">
          <label for="due_date">Due Date</label>
          <input type="date" id="due_date" name="due_date" value="<?php echo $task['due_date']; ?>" required>
        </div>

        <div class="form-group">
          <label for="priority">Priority</label>
          <select id="priority" name="priority" required>
            <option value="high" <?php echo $task['priority'] === 'high' ? 'selected' : ''; ?>>High</option>
            <option value="medium" <?php echo $task['priority'] === 'medium' ? 'selected' : ''; ?>>Medium</option>
            <option value="low" <?php echo $task['priority'] === 'low' ? 'selected' : ''; ?>>Low</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn">Update Task</button>
        </div>
      </form>
    </div>

    <div class="logout-section">
      <a href="logout.php" class="btn btn-logout">Logout</a>
    </div>
  </div>
</body>
</html> 