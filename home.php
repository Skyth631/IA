<?php
include 'config.php';

session_start();

if (!isset($_SESSION['user_id'])) {
  header('location: login.php');
  exit; // Add exit after redirection
}

// Fetch user's tasks using prepared statements
$user_id = $_SESSION['user_id'];
$sql = "SELECT * FROM " . HOMEWORK_TABLE . " WHERE user_id = ? ORDER BY due_date ASC";

// Prepare the statement
$stmt = mysqli_prepare($connection, $sql);
mysqli_stmt_bind_param($stmt, "i", $user_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$tasks = array();
if ($result && mysqli_num_rows($result) > 0) {
  while ($row = mysqli_fetch_assoc($result)) {
    $due_date = date('Y-m-d', strtotime($row['due_date']));
    if (!isset($tasks[$due_date])) {
      $tasks[$due_date] = array();
    }
    $tasks[$due_date][] = $row;
  }
}

// Close the statement
mysqli_stmt_close($stmt);

?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Homework Tracker - Home</title>
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="calendar.css">
  <script src="script.js"></script>
</head>
<body>
  <div class="home-container">
    <div class="header">
      <h1>Homework Tracker</h1>
      <div class="logo-container">
        <img src="logo.svg" alt="Logo">
      </div>
      <p class="welcome-message">Welcome <?php echo isset($_SESSION['username']) ? $_SESSION['username'] : 'User'; ?>!</p>
      <p class="description">This is your home page where you can see upcoming homework assignments, manage deadlines, and track your progress.</p>
      <nav class="main-nav">
        <a href="add_task.php" class="btn">Add New Task</a>
        <a href="tasks.php" class="btn">View All Tasks</a>
      </nav>
    </div>

    <div class="calendar-section">
      <h2>Calendar</h2>
      <div id="calendar-container">
        <?php
        // Get current month and year
        $currentMonth = date('m');
        $currentYear = date('Y');

        // Get first day of the current month and its weekday
        $firstDay = mktime(0, 0, 0, $currentMonth, 1, $currentYear);
        $firstDayWeekday = date('w', $firstDay); // Get weekday (0-Sunday, 6-Saturday)
        
        // Adjust for Monday as first day of week (0 = Monday, 6 = Sunday)
        $firstDayWeekday = $firstDayWeekday == 0 ? 6 : $firstDayWeekday - 1;

        // Get number of days in the current month
        $daysInMonth = date('t', $firstDay);

        // Generate calendar grid
        echo "<table class='calendar-table'>";
        echo "<tr><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th></tr>";

        // Fill empty cells before the first day of the month
        echo "<tr>";
        for ($i = 0; $i < $firstDayWeekday; $i++) {
          echo "<td></td>";
        }

        // Loop through days
        $column = $firstDayWeekday;
        for ($i = 1; $i <= $daysInMonth; $i++) {
          $day = $i;
          $date = mktime(0, 0, 0, $currentMonth, $day, $currentYear);
          $dateFormatted = date('Y-m-d', $date);
          
          // Check if this date has tasks
          $hasTask = isset($tasks[$dateFormatted]);
          $dayClass = $hasTask ? 'has-task' : '';

          // Display day with month and dropdown
          echo "<td class='$dayClass'>";
          echo "<div class='calendar-day'>";
          echo "<span class='day-number'>" . $day . "</span>";
          echo "<span class='month-name'>" . date('M', $date) . "</span>";
          
          // If there are tasks for this day, show task indicators and tooltip
          if ($hasTask) {
            foreach ($tasks[$dateFormatted] as $task) {
              echo "<span class='task-indicator " . $task['priority'] . "'></span>";
            }
            
            echo "<div class='task-tooltip'>";
            echo "<h4>Tasks for " . date('F j, Y', $date) . "</h4>";
            
            foreach ($tasks[$dateFormatted] as $task) {
              echo "<div class='task-item'>";
              echo "<div class='task-name'>" . htmlspecialchars($task['task_name']) . "</div>";
              echo "<div class='task-description'>" . htmlspecialchars($task['task_description']) . "</div>";
              echo "<div class='task-priority " . $task['priority'] . "'>Priority: " . ucfirst($task['priority']) . "</div>";
              echo "</div>";
            }
            
            echo "</div>";
          } else {
            // Add empty tooltip for days without tasks
            echo "<div class='task-tooltip'>";
            echo "<h4>Tasks for " . date('F j, Y', $date) . "</h4>";
            echo "<p>No tasks yet</p>";
            echo "<a href='add_task.php'>Add task</a>";
            echo "</div>";
          }
          
          echo "</div>";
          echo "</td>";

          $column++;
          // Close table row and start a new one if necessary
          if ($column % 7 == 0) {
            echo "</tr>";
            if ($i < $daysInMonth) {
              echo "<tr>";
            }
            $column = 0;
          }
        }

        // Fill empty cells after the last day of the month
        if ($column > 0) {
          for ($i = $column; $i < 7; $i++) {
            echo "<td></td>";
          }
          echo "</tr>";
        }

        echo "</table>";
        ?>
      </div>
    </div>

    <div class="logout-section">
      <a href="logout.php" class="btn btn-logout">Logout</a>
    </div>
  </div>
</body>
</html>
    
