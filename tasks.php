<?php
require_once 'config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

// Get sort parameter from URL
$sort = isset($_GET['sort']) ? sanitize_input($_GET['sort']) : 'due_date';
$order = isset($_GET['order']) ? sanitize_input($_GET['order']) : 'asc';

// Validate sort parameter
$allowed_sorts = ['due_date', 'urgency', 'title', 'created_at'];
$sort = in_array($sort, $allowed_sorts) ? $sort : 'due_date';
$order = $order === 'desc' ? 'desc' : 'asc';

// Get tasks from database
$conn = get_db_connection();
$stmt = $conn->prepare("
    SELECT * FROM tasks 
    WHERE user_id = ? 
    ORDER BY 
        CASE 
            WHEN ? = 'due_date' THEN due_date
            WHEN ? = 'urgency' THEN urgency
            WHEN ? = 'title' THEN title
            ELSE created_at
        END 
    ?
");
$stmt->execute([$_SESSION['user_id'], $sort, $sort, $sort, $order]);
$tasks = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Tasks - Task Manager</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap">
</head>
<body>
    <a href="#main" class="skip-link">Skip to main content</a>
    
    <div class="container">
        <main id="main">
            <div class="logo-container">
                <img src="logo.svg" alt="Task Manager Logo" width="120" height="120">
            </div>
            
            <h1>My Tasks</h1>
            
            <div class="tasks-controls">
                <div class="sort-controls">
                    <label for="sort-select">Sort by:</label>
                    <select id="sort-select" class="sort-select" onchange="updateSort(this.value)">
                        <option value="due_date" <?php echo $sort === 'due_date' ? 'selected' : ''; ?>>Due Date</option>
                        <option value="urgency" <?php echo $sort === 'urgency' ? 'selected' : ''; ?>>Urgency</option>
                        <option value="title" <?php echo $sort === 'title' ? 'selected' : ''; ?>>Title</option>
                        <option value="created_at" <?php echo $sort === 'created_at' ? 'selected' : ''; ?>>Created Date</option>
                    </select>
                    
                    <button class="btn btn-secondary" onclick="toggleOrder()" aria-label="Toggle sort order">
                        <?php echo $order === 'asc' ? '↑' : '↓'; ?>
                    </button>
                </div>
                
                <a href="add_task.php" class="btn">Add New Task</a>
            </div>

            <?php if (empty($tasks)): ?>
                <div class="no-tasks">
                    <p>No tasks found. <a href="add_task.php">Add your first task</a></p>
                </div>
            <?php else: ?>
                <div class="tasks-list" role="list">
                    <?php foreach ($tasks as $task): ?>
                        <div class="task-card" role="listitem">
                            <div class="task-header">
                                <h3><?php echo htmlspecialchars($task['title']); ?></h3>
                                <span class="urgency-badge urgency-<?php echo strtolower($task['urgency']); ?>">
                                    <?php echo htmlspecialchars($task['urgency']); ?>
                                </span>
                            </div>
                            
                            <p class="task-description"><?php echo htmlspecialchars($task['description']); ?></p>
                            
                            <div class="task-meta">
                                <div class="due-date">
                                    <svg class="icon" viewBox="0 0 24 24" width="16" height="16">
                                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                                    </svg>
                                    Due: <?php echo date('M d, Y', strtotime($task['due_date'])); ?>
                                </div>
                                
                                <div class="task-actions">
                                    <a href="edit_task.php?id=<?php echo $task['id']; ?>" class="btn btn-small">Edit</a>
                                    <button onclick="deleteTask(<?php echo $task['id']; ?>)" class="btn btn-small btn-danger">Delete</button>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </main>
    </div>

    <script src="ui.js"></script>
    <script>
        function updateSort(sortBy) {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('sort', sortBy);
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
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ task_id: taskId })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.reload();
                    } else {
                        alert('Error deleting task');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error deleting task');
                });
            }
        }
    </script>
</body>
</html> 