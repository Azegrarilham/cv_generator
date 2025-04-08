<?php
session_start();
$pdo = new PDO("mysql:host=localhost;dbname=cv_generator", "root", "");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];

    $stmt = $pdo->prepare("SELECT * FROM recruiters WHERE username = :username");
    $stmt->execute([":username" => $username]);
    $recruiter = $stmt->fetch(PDO::FETCH_ASSOC);

    // Compare plain text password
    if ($recruiter && $recruiter["password"] === $password) {
        $_SESSION["recruiter_id"] = $recruiter["id"];
        header("Location: dashboard.php");
        exit;
    } else {
        echo "Invalid username or password!";
    }
}