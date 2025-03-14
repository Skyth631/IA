<?php
include 'config.php';

$username = "";
$errors = array(); 

if (isset($_POST['login'])) {
  $username = $_POST['username'];
  $password = $_POST['password'];

  // Check if username exists using prepared statement
  $sql = "SELECT * FROM users WHERE username=? LIMIT 1";
  $stmt = mysqli_prepare($connection, $sql);
  mysqli_stmt_bind_param($stmt, "s", $username);
  mysqli_stmt_execute($stmt);
  $result = mysqli_stmt_get_result($stmt);

  if (mysqli_num_rows($result) > 0) {
    $user = mysqli_fetch_assoc($result);
    if (password_verify($password, $user['password'])) {
      // Login successful
      session_start();
      $_SESSION['user_id'] = $user['id'];
      $_SESSION['username'] = $user['username'];
      header('location: home.php');
      exit; // Add exit after redirection
    } else {
      array_push($errors, "Wrong username or password");
    }
  } else {
    array_push($errors, "Wrong username or password");
  }
  
  // Close the statement
  mysqli_stmt_close($stmt);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Homework Helper - Login</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Homework Helper</h1>
        <div class="logo-container">
          <img src="logo.svg" alt="Logo">
        </div> <form method="post" action="login.php">
            <?php include('errors.php'); ?>  <div class="input-group">
                <label for="username">Username</label>
                <input type="text" name="username" id="username" value="<?php echo $username; ?>">
            </div>
            <div class="input-group">
                <label for="password">Password</label>
                <input type="password" name="password" id="password">
            </div>
            <div class="input-group">
                <button type="submit" name="login" class="btn">Login</button>
            </div>
            <p>
                Not yet a member? <a href="register.php">Register</a>
            </p>
        </form>
    </div>
</body>
</html>
