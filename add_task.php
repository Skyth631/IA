<?php
include 'config.php';

session_start();

if (!isset($_SESSION['user_id'])) {
  header('location: login.php');
  exit;
}

$success_message = "";
$error_message = "";

// Handle task submission
if (isset($_POST['add_task'])) {
  $task_name = $_POST['task_name'];
  $task_description = $_POST['task_description'];
  $due_date = $_POST['due_date'];
  $priority = $_POST['priority'];
  $user_id = $_SESSION['user_id'];

  // Basic validation
  if (empty($task_name) || empty($due_date)) {
    $error_message = "Task name and due date are required";
  } else {
    // Insert task into database using prepared statement
    $sql = "INSERT INTO " . HOMEWORK_TABLE . " (user_id, task_name, task_description, due_date, priority) 
            VALUES (?, ?, ?, ?, ?)";
    
    $stmt = mysqli_prepare($connection, $sql);
    mysqli_stmt_bind_param($stmt, "issss", $user_id, $task_name, $task_description, $due_date, $priority);
    
    if (mysqli_stmt_execute($stmt)) {
      $success_message = "Task added successfully!";
      // Clear form fields
      $task_name = "";
      $task_description = "";
      $due_date = "";
      $priority = "medium";
    } else {
      $error_message = "Error: " . mysqli_error($connection);
    }
    
    // Close the statement
    mysqli_stmt_close($stmt);
  }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Add Task - Homework Tracker</title>
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="calendar.css">
</head>
<body>
  <div class="home-container">
    <div class="header">
      <h1>Add New Task</h1>
      <div class="logo-container">
        <img src="logo.svg" alt="Logo">
      </div>
      <p class="description">Add a new task to your homework calendar</p>
      <nav class="main-nav">
        <a href="home.php" class="btn">Back to Calendar</a>
        <a href="logout.php" class="btn">Logout</a>
      </nav>
    </div>

    <div class="task-form-section">
      <?php if (!empty($success_message)): ?>
        <div class="success-message">
          <p><?php echo $success_message; ?></p>
        </div>
      <?php endif; ?>
      
      <?php if (!empty($error_message)): ?>
        <div class="error">
          <p><?php echo $error_message; ?></p>
        </div>
      <?php endif; ?>

      <form method="post" action="add_task.php" class="task-form">
        <div class="form-group">
          <label for="task_name">Task Name:</label>
          <input type="text" id="task_name" name="task_name" required value="<?php echo isset($task_name) ? $task_name : ''; ?>">
        </div>
        
        <div class="form-group">
          <label for="task_description">Description:</label>
          <textarea id="task_description" name="task_description" rows="4"><?php echo isset($task_description) ? $task_description : ''; ?></textarea>
        </div>
        
        <div class="form-group">
          <label for="due_date">Due Date:</label>
          <input type="date" id="due_date" name="due_date" required value="<?php echo isset($_GET['date']) ? $_GET['date'] : (isset($due_date) ? $due_date : ''); ?>">
        </div>
        
        <div class="form-group">
          <label for="priority">Priority:</label>
          <select id="priority" name="priority">
            <option value="low" <?php echo (isset($priority) && $priority == 'low') ? 'selected' : ''; ?>>Low</option>
            <option value="medium" <?php echo (!isset($priority) || $priority == 'medium') ? 'selected' : ''; ?>>Medium</option>
            <option value="high" <?php echo (isset($priority) && $priority == 'high') ? 'selected' : ''; ?>>High</option>
          </select>
        </div>
        
        <div class="form-group">
          <button type="submit" name="add_task" class="btn">Add Task</button>
        </div>
      </form>
    </div>
  </div>
</body>
</html> 