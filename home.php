<?php
include 'config.php';

session_start();

if (!isset($_SESSION['user_id'])) {
  header('location: login.php');
}

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
      <p class="welcome-message">Welcome <?php echo $_SESSION['username']; ?>!</p>
      <p class="description">This is your home page where you can see upcoming homework assignments, manage deadlines, and track your progress.</p>
      <a href="logout.php" class="btn">Logout</a>
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

        // Get number of days in the current month
        $daysInMonth = date('t', $firstDay);

        // Generate calendar grid
        echo "<table class='calendar-table'>";
        echo "<tr><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th></tr>";

        // Fill empty cells before the first day of the month
        for ($i = 0; $i < $firstDayWeekday; $i++) {
          echo "<td></td>";
        }

        // Loop through days
        for ($i = 1; $i <= $daysInMonth; $i++) {
          $day = $i;
          $date = mktime(0, 0, 0, $currentMonth, $day, $currentYear);

          // Check for new week
          if (($i + $firstDayWeekday - 1) % 7 == 0) {
            echo "<tr>";
          }

          // Display day with month and dropdown
          echo "<td>";
          echo "<div class='calendar-day'>";
          echo "<span class='day-number'>" . $day . "</span>";
          echo "<span class='month-name'>" . date('M', $date) . "</span>";
          echo "<div class='dropdown'>";
          echo "<button class='dropbtn'>Tasks</button>";
          echo "<div class='dropdown-content'>";
          echo "<p>No tasks yet</p>";
          echo "</div>";
          echo "</div>";
          echo "</div>";
          echo "</td>";

          // Close table row
          if (($i + $firstDayWeekday - 1) % 7 == 6) {
            echo "</tr>";
          }
        }

        // Fill empty cells after the last day of the month
        $remainingCells = (6 - ($i + $firstDayWeekday - 1) % 7) % 7;
        for ($i = 0; $i < $remainingCells; $i++) {
          echo "<td></td>";
        }

        echo "</table>";
        ?>
      </div>
    </div>
  </div>
</body>
</html>
    
