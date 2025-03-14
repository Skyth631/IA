<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf_token()) {
        die('CSRF token validation failed');
    }

    if (!check_rate_limit('login', 5, 300)) {
        die('Too many login attempts. Please try again later.');
    }

    $username = sanitize_input($_POST['username']);
    $password = $_POST['password'];

    $conn = get_db_connection();
    $stmt = $conn->prepare("SELECT id, username, password FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user && verify_password($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        
        // Regenerate session ID to prevent session fixation
        session_regenerate_id(true);
        
        header('Location: home.php');
        exit();
    } else {
        $error = "Invalid username or password";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Task Manager</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap">
</head>
<body>
    <a href="#main" class="skip-link">Skip to main content</a>
    
    <div class="container">
        <main id="main">
            <div class="logo-container">
                <img src="logo.svg" alt="Task Manager Logo" width="150" height="150">
            </div>
            
            <h1>Welcome Back</h1>
            
            <?php if (isset($error)): ?>
                <div class="error" role="alert">
                    <?php echo $error; ?>
                </div>
            <?php endif; ?>
            
            <form method="POST" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" class="login-form" novalidate>
                <input type="hidden" name="csrf_token" value="<?php echo csrf_token(); ?>">
                
                <div class="input-group">
                    <label for="username">Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        required 
                        autocomplete="username"
                        aria-required="true"
                        pattern="[a-zA-Z0-9_-]{3,16}"
                        title="Username must be between 3 and 16 characters and can only contain letters, numbers, underscores, and hyphens"
                    >
                </div>
                
                <div class="input-group">
                    <label for="password">Password</label>
                    <div class="password-input-wrapper">
                        <input type="password" id="password" name="password" required autocomplete="current-password" minlength="8">
                        <button type="button" class="toggle-password" aria-label="Show password">
                            <svg class="eye-icon" viewBox="0 0 24 24" width="24" height="24">
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                            </svg>
                            <svg class="eye-off-icon" viewBox="0 0 24 24" width="24" height="24">
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <button type="submit" class="btn">
                    <span class="btn-text">Log In</span>
                    <div class="btn-loader"></div>
                </button>
            </form>
            
            <p class="register-link">
                Don't have an account? <a href="register.php">Sign up</a>
            </p>
        </main>
    </div>

    <script src="ui.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const togglePassword = document.querySelector('.toggle-password');
            const password = document.querySelector('#password');

            togglePassword.addEventListener('click', function() {
                const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
                password.setAttribute('type', type);
                
                // Toggle the aria-label
                const isPassword = type === 'password';
                this.setAttribute('aria-label', isPassword ? 'Show password' : 'Hide password');
            });
        });

        // Form submission handling
        document.querySelector('form')?.addEventListener('submit', function(e) {
            const submitButton = this.querySelector('button[type="submit"]');
            
            if (!FormValidator.validate(this)) {
                e.preventDefault();
                return;
            }
            
            LoadingState.add(submitButton);
        });
    </script>
</body>
</html>
