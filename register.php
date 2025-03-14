<?php
include 'config.php';

$username = "";
$email = "";
$errors = array(); 

if (isset($_POST['register'])) {
  $username = mysqli_real_escape_string($connection, $_POST['username']);
  $email = mysqli_real_escape_string($connection, $_POST['email']);
  $password = mysqli_real_escape_string($connection, $_POST['password']);

  // Validate username is not blank
  if (empty($username)) {
    array_push($errors, "Username cannot be blank");
  }

  // Check for duplicate username
  $sql_check_username = "SELECT * FROM " . USERS_TABLE . " WHERE username='$username' LIMIT 1";
  $result_check_username = mysqli_query($connection, $sql_check_username);
  if (mysqli_num_rows($result_check_username) > 0) {
    array_push($errors, "Username already exists");
  }

  // Check for duplicate email
  $sql_check_email = "SELECT * FROM " . USERS_TABLE . " WHERE email='$email' LIMIT 1";
  $result_check_email = mysqli_query($connection, $sql_check_email);
  if (mysqli_num_rows($result_check_email) > 0) {
    array_push($errors, "Email already exists");
  }

  // If no errors, proceed with registration
  if (count($errors) == 0) {
    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Insert into db
    $sql = "INSERT INTO " . USERS_TABLE . " (username, email, password) VALUES ('$username', '$email', '$hashed_password')";
    $result = mysqli_query($connection, $sql);

    if ($result) {
      // Redirect
      header('location: login.php');
      exit; // Stop
    } else {
      array_push($errors, "Registration failed: " . mysqli_error($connection));
    }
  }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Homework Helper - Register</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Homework Helper</h1>
        <div class="logo-container">
          <img src="logo.svg" alt="Logo">
        </div>
        <?php include('errors.php'); ?>  <form method="post" action="register.php">
            <div class="input-group">
                <label for="username">Username</label>
                <input type="text" name="username" id="username" value="<?php echo $username; ?>">
            </div>
            <div class="input-group">
                <label for="email">Email</label>
                <input type="email" name="email" id="email" value="<?php echo $email; ?>">
            </div>
            <div class="input-group">
                <label for="password">Password</label>
                <input type="password" name="password" id="password">
            </div>
            <div class="input-group">
                <button type="submit" name="register" class="btn">Register</button>
            </div>
            <p>
                Already a member? <a href="login.php">Login</a>
            </p>
        </form>
    </div>
</body>
</html>