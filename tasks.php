<?php
include 'config.php';

session_start();

if (!isset($_SESSION['user_id'])) {
  header('location: login.php');
  exit;
}

// Get sorting parameters from URL
$sort_by = isset($_GET['sort']) ? $_GET['sort'] : 'due_date';
$order = isset($_GET['order']) ? $_GET['order'] : 'asc';

// Validate sort parameters and map them to correct column names
$sort_mapping = [
  'due_date' => 'due_date',
  'urgency' => 'priority',
  'title' => 'task_name',
  'created_at' => 'created_at'
];

$sort_by = isset($sort_mapping[$sort_by]) ? $sort_mapping[$sort_by] : 'due_date';
$order = strtoupper($order) === 'DESC' ? 'DESC' : 'ASC';

// Fetch tasks with sorting
$user_id = $_SESSION['user_id'];
$sql = "SELECT * FROM " . HOMEWORK_TABLE . " WHERE user_id = ? ORDER BY " . $sort_by . " " . $order;
$stmt = mysqli_prepare($connection, $sql);
mysqli_stmt_bind_param($stmt, "i", $user_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$tasks = mysqli_fetch_all($result, MYSQLI_ASSOC);
mysqli_stmt_close($stmt);
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Homework Tracker - All Tasks</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>All Tasks</h1>
      <div class="logo-container">
        <img src="logo.svg" alt="Logo">
      </div>
      <p class="welcome-message">Welcome <?php echo isset($_SESSION['username']) ? $_SESSION['username'] : 'User'; ?>!</p>
      <p class="description">View and manage all your tasks in one place. Sort them by different criteria to find what you need.</p>
      <nav class="main-nav">
        <a href="add_task.php" class="btn">Add New Task</a>
        <a href="home.php" class="btn">Back to Calendar</a>
      </nav>
    </div>

    <div class="tasks-controls">
      <div class="sort-controls">
        <label for="sort-select">Sort by:</label>
        <select id="sort-select" class="sort-select" onchange="updateSort()">
          <option value="due_date" <?php echo $_GET['sort'] === 'due_date' ? 'selected' : ''; ?>>Due Date</option>
          <option value="urgency" <?php echo $_GET['sort'] === 'urgency' ? 'selected' : ''; ?>>Urgency</option>
          <option value="title" <?php echo $_GET['sort'] === 'title' ? 'selected' : ''; ?>>Title</option>
          <option value="created_at" <?php echo $_GET['sort'] === 'created_at' ? 'selected' : ''; ?>>Created Date</option>
        </select>
        <button class="btn btn-secondary" onclick="toggleOrder()">
          <?php echo $order === 'ASC' ? '↑ Ascending' : '↓ Descending'; ?>
        </button>
      </div>
    </div>

    <?php if (empty($tasks)): ?>
      <div class="no-tasks">
        <h2>No tasks found</h2>
        <p>You haven't created any tasks yet. Click "Add New Task" to get started!</p>
      </div>
    <?php else: ?>
      <div class="tasks-list">
        <?php foreach ($tasks as $task): ?>
          <div class="task-card">
            <div class="task-header">
              <h3><?php echo htmlspecialchars($task['task_name']); ?></h3>
              <span class="urgency-badge urgency-<?php echo strtolower($task['priority']); ?>">
                <?php echo ucfirst($task['priority']); ?>
              </span>
            </div>
            <p class="task-description"><?php echo htmlspecialchars($task['task_description']); ?></p>
            <div class="task-meta">
              <div class="due-date">
                <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                Due: <?php echo date('M j, Y', strtotime($task['due_date'])); ?>
              </div>
              <div class="task-actions">
                <a href="edit_task.php?id=<?php echo $task['id']; ?>" class="btn btn-small btn-secondary">Edit</a>
                <button onclick="deleteTask(<?php echo $task['id']; ?>)" class="btn btn-small btn-danger">Delete</button>
              </div>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>

    <div class="logout-section">
      <a href="logout.php" class="btn btn-logout">Logout</a>
    </div>
  </div>

  <script>
    function updateSort() {
      const sortSelect = document.getElementById('sort-select');
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('sort', sortSelect.value);
      window.location.href = currentUrl.toString();
    }

    function toggleOrder() {
      const currentUrl = new URL(window.location.href);
      const currentOrder = currentUrl.searchParams.get('order') || 'asc';
      currentUrl.searchParams.set('order', currentOrder === 'asc' ? 'desc' : 'asc');
      window.location.href = currentUrl.toString();
    }

    function deleteTask(taskId) {
      if (confirm('Are you sure you want to delete this task?')) {
        fetch('delete_task.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'task_id=' + taskId
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            window.location.reload();
          } else {
            alert('Error deleting task: ' + data.message);
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('An error occurred while deleting the task.');
        });
      }
    }
  </script>
</body>
</html> 