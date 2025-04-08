<?php
header("Content-Type: application/json");

// Database connection (XAMPP defaults)
$host = "localhost";
$dbname = "cv_generator";
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $e->getMessage()]);
    exit;
}

// Start transaction
$pdo->beginTransaction();

try {
    // Handle file upload
    $photoPath = null;
    if (isset($_FILES["photoUpload"]) && $_FILES["photoUpload"]["error"] == 0) {
        $uploadDir = "uploads/";
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
        $photoPath = $uploadDir . basename($_FILES["photoUpload"]["name"]);
        move_uploaded_file($_FILES["photoUpload"]["tmp_name"], $photoPath);
    }

    // Insert into applicants table
    $stmt = $pdo->prepare("
        INSERT INTO applicants (domain, position, full_name, email, phone, location, linkedin, summary, photo)
        VALUES (:domain, :position, :full_name, :email, :phone, :location, :linkedin, :summary, :photo)
    ");
    $stmt->execute([
        ":domain" => $_POST["domain"],
        ":position" => $_POST["position"],
        ":full_name" => $_POST["fullName"],
        ":email" => $_POST["email"],
        ":phone" => $_POST["phone"],
        ":location" => $_POST["location"],
        ":linkedin" => $_POST["linkedin"],
        ":summary" => $_POST["summary"],
        ":photo" => $photoPath
    ]);
    $applicantId = $pdo->lastInsertId();

    // Insert work experience
    if (isset($_POST["job_title"])) {
        $stmt = $pdo->prepare("
            INSERT INTO work_experience (applicant_id, job_title, company, start_date, end_date, is_current, description)
            VALUES (:applicant_id, :job_title, :company, :start_date, :end_date, :is_current, :description)
        ");
        foreach ($_POST["job_title"] as $i => $jobTitle) {
            $isCurrent = isset($_POST["current_job"][$i]) && $_POST["current_job"][$i] === "on";
            $stmt->execute([
                ":applicant_id" => $applicantId,
                ":job_title" => $jobTitle,
                ":company" => $_POST["company"][$i],
                ":start_date" => $_POST["start_date"][$i],
                ":end_date" => $isCurrent ? null : $_POST["end_date"][$i],
                ":is_current" => $isCurrent,
                ":description" => $_POST["job_description"][$i]
            ]);
        }
    }

    // Insert education
    if (isset($_POST["degree"])) {
        $stmt = $pdo->prepare("
            INSERT INTO education (applicant_id, degree, institution, start_date, end_date, is_current)
            VALUES (:applicant_id, :degree, :institution, :start_date, :end_date, :is_current)
        ");
        foreach ($_POST["degree"] as $i => $degree) {
            $isCurrent = isset($_POST["current_education"][$i]) && $_POST["current_education"][$i] === "on";
            $stmt->execute([
                ":applicant_id" => $applicantId,
                ":degree" => $degree,
                ":institution" => $_POST["institution"][$i],
                ":start_date" => $_POST["edu_start_date"][$i],
                ":end_date" => $isCurrent ? null : $_POST["edu_end_date"][$i],
                ":is_current" => $isCurrent
            ]);
        }
    }

    // Insert skills
    if (!empty($_POST["skills"])) {
        $skills = explode(",", $_POST["skills"]);
        $stmt = $pdo->prepare("INSERT INTO skills (applicant_id, skill_name) VALUES (:applicant_id, :skill_name)");
        foreach ($skills as $skill) {
            $stmt->execute([":applicant_id" => $applicantId, ":skill_name" => trim($skill)]);
        }
    }

    // Insert certifications
    if (isset($_POST["certification_name"])) {
        $stmt = $pdo->prepare("
            INSERT INTO certifications (applicant_id, certification_name, issuing_organization, date_obtained, description)
            VALUES (:applicant_id, :certification_name, :issuing_organization, :date_obtained, :description)
        ");
        foreach ($_POST["certification_name"] as $i => $certificationName) {
            $stmt->execute([
                ":applicant_id" => $applicantId,
                ":certification_name" => $certificationName,
                ":issuing_organization" => $_POST["issuing_organization"][$i],
                ":date_obtained" => $_POST["certification_date"][$i],
                ":description" => $_POST["certification_description"][$i]
            ]);
        }
    }

    // Insert languages
    if (isset($_POST["language_name"])) {
        $stmt = $pdo->prepare("
            INSERT INTO languages (applicant_id, language_name, proficiency)
            VALUES (:applicant_id, :language_name, :proficiency)
        ");
        foreach ($_POST["language_name"] as $i => $languageName) {
            $stmt->execute([
                ":applicant_id" => $applicantId,
                ":language_name" => $languageName,
                ":proficiency" => $_POST["language_proficiency"][$i]
            ]);
        }
    }

    // Insert projects
    if (isset($_POST["project_title"])) {
        $stmt = $pdo->prepare("
            INSERT INTO projects (applicant_id, project_title, technologies, description, link)
            VALUES (:applicant_id, :project_title, :technologies, :description, :link)
        ");
        foreach ($_POST["project_title"] as $i => $projectTitle) {
            $stmt->execute([
                ":applicant_id" => $applicantId,
                ":project_title" => $projectTitle,
                ":technologies" => $_POST["project_technologies"][$i],
                ":description" => $_POST["project_description"][$i],
                ":link" => $_POST["project_link"][$i]
            ]);
        }
    }

    $pdo->commit();
    echo json_encode(["success" => true]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}