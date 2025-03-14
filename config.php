<?php

define('DB_HOST', 'localhost');
define('DB_USERNAME', 'php2446');
define('DB_PASSWORD', 'Tihad=Eyahe784');
define('DB_DATABASE', 'php2446');
define('USERS_TABLE', 'users');
define('HOMEWORK_TABLE', 'homework');

$connection = mysqli_connect(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE);

if(!$connection) {
  die("Connection failed: " . mysqli_connect_error());
}
