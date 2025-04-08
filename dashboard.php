<?php
session_start();
if (!isset($_SESSION["recruiter_id"])) {
    header("Location: login.php");
    exit;
}

$pdo = new PDO("mysql:host=localhost;dbname=cv_generator", "root", "");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Handle filtering
$where = [];
$params = [];
if (!empty($_GET["domain"])) {
    $where[] = "domain = :domain";
    $params[":domain"] = $_GET["domain"];
}
if (!empty($_GET["position"])) {
    $where[] = "position LIKE :position";
    $params[":position"] = "%" . $_GET["position"] . "%";
}
if (!empty($_GET["skills"])) {
    $skills = explode(",", $_GET["skills"]);
    $skillConditions = [];
    foreach ($skills as $i => $skill) {
        $skillConditions[] = "EXISTS (SELECT 1 FROM skills WHERE applicant_id = applicants.id AND skill_name LIKE :skill$i)";
        $params[":skill$i"] = "%" . trim($skill) . "%";
    }
    $where[] = "(" . implode(" AND ", $skillConditions) . ")";
}

$sql = "SELECT * FROM applicants" . (empty($where) ? "" : " WHERE " . implode(" AND ", $where));
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$applicants = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Recruiter Dashboard</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Recruiter Dashboard</h1>
        <a href="logout.php" class="button back-button">Logout</a>

        <!-- Filter Form -->
        <form method="GET" class="form-container">
            <div class="form-group">
                <label for="domain">Domain:</label>
                <select id="domain" name="domain">
                    <option value="">All</option>
                    <option value="IT" <?php echo ($_GET["domain"] ?? "") === "IT" ? "selected" : ""; ?>>IT</option>
                    <option value="Marketing" <?php echo ($_GET["domain"] ?? "") === "Marketing" ? "selected" : ""; ?>>Marketing</option>
                    <option value="Finance" <?php echo ($_GET["domain"] ?? "") === "Finance" ? "selected" : ""; ?>>Finance</option>
                    <option value="Healthcare" <?php echo ($_GET["domain"] ?? "") === "Healthcare" ? "selected" : ""; ?>>Healthcare</option>
                    <option value="Education" <?php echo ($_GET["domain"] ?? "") === "Education" ? "selected" : ""; ?>>Education</option>
                    <option value="Custom" <?php echo ($_GET["domain"] ?? "") === "Custom" ? "selected" : ""; ?>>Custom</option>
                </select>
            </div>
            <div class="form-group">
                <label for="position">Position:</label>
                <input type="text" id="position" name="position" value="<?php echo htmlspecialchars($_GET["position"] ?? ""); ?>">
            </div>
            <div class="form-group">
                <label for="skills">Skills (comma-separated):</label>
                <input type="text" id="skills" name="skills" value="<?php echo htmlspecialchars($_GET["skills"] ?? ""); ?>">
            </div>
            <button type="submit" class="button next-button">Filter</button>
        </form>

        <!-- Applicants List -->
        <div class="cv-preview-container">
            <h2>Applicants</h2>
            <?php foreach ($applicants as $applicant): ?>
                <div class="applicant-item" >
                    <h3><?php echo htmlspecialchars($applicant["full_name"]); ?> - <?php echo htmlspecialchars($applicant["position"]); ?></h3>
                    <p>Domain: <?php echo htmlspecialchars($applicant["domain"]); ?></p>
                    <p>Email: <?php echo htmlspecialchars($applicant["email"]); ?></p>
                    <a href="view_cv.php?id=<?php echo $applicant["id"]; ?>" class="button generate-button">View CV</a>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</body>
</html>