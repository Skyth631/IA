# 📚 Homework Helper

A comprehensive web-based task management system designed specifically for students to organize and track their homework assignments. This application helps students manage their academic workload efficiently with an intuitive interface and powerful features.

## 🌟 Features

- **User Authentication System**
  - Secure registration and login
  - Password encryption
  - Session management

- **Task Management**
  - Create, edit, and delete homework tasks
  - Set task priorities (low, medium, high)
  - Add detailed task descriptions
  - Mark tasks as completed
  - Due date tracking

- **User Interface**
  - Clean and responsive design
  - Calendar view for task visualization
  - Intuitive task organization
  - Modern and user-friendly interface

## 🛠️ Technologies Used

- **Backend**
  - PHP
  - MySQL Database
  - Apache/Nginx Server

- **Frontend**
  - HTML5
  - CSS3
  - JavaScript
  - Modern UI/UX design

## 📋 Prerequisites

- PHP 7.0 or higher
- MySQL 5.7 or higher
- Web server (Apache/Nginx)
- Modern web browser

## 🚀 Installation

1. Clone the repository to your web server directory:
   ```bash
   git clone https://github.com/Skyth631/IA.git
   ```

2. Import the database structure:
   ```bash
   mysql -u your_username -p your_database_name < setup_database.sql
   ```

3. Configure the database connection:
   - Open `config.php`
   - Update the database credentials with your settings

4. Ensure proper permissions:
   ```bash
   chmod 755 -R /path/to/project
   chmod 777 -R /path/to/project/uploads (if applicable)
   ```

5. Access the application through your web browser:
   ```
   http://your-domain/path-to-project
   ```

## 🔒 Security Features

- Password hashing
- Prepared SQL statements to prevent SQL injection
- Session security
- Input validation and sanitization

## 📁 Project Structure

```
├── add_task.php      # Task creation functionality
├── config.php        # Database and configuration settings
├── home.php         # Main dashboard
├── login.php        # User authentication
├── register.php     # User registration
├── tasks.php        # Task management
├── style.css        # Main stylesheet
├── script.js        # Core JavaScript functionality
├── ui.js           # UI-specific JavaScript
└── setup_database.sql # Database structure
```

## 💡 Usage

1. Register a new account or login with existing credentials
2. Add new homework tasks with details like:
   - Task name
   - Description
   - Due date
   - Priority level
3. View your tasks in the dashboard
4. Edit or mark tasks as complete as needed
5. Use the calendar view to plan your schedule

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- David Bartos - *Initial work*

## 🙏 Acknowledgments

- Special thanks to BG/BRG Klosterneuburg for the project opportunity 