<?php
session_start();
if (!isset($_SESSION["recruiter_id"])) {
    header("Location: login.php");
    exit;
}

$pdo = new PDO("mysql:host=localhost;dbname=cv_generator", "root", "");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$applicantId = $_GET["id"];
$stmt = $pdo->prepare("SELECT * FROM applicants WHERE id = :id");
$stmt->execute([":id" => $applicantId]);
$applicant = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$applicant) {
    die("Applicant not found.");
}

// Fetch related data
$workStmt = $pdo->prepare("SELECT * FROM work_experience WHERE applicant_id = :id");
$workStmt->execute([":id" => $applicantId]);
$workExperience = $workStmt->fetchAll(PDO::FETCH_ASSOC);

$eduStmt = $pdo->prepare("SELECT * FROM education WHERE applicant_id = :id");
$eduStmt->execute([":id" => $applicantId]);
$education = $eduStmt->fetchAll(PDO::FETCH_ASSOC);

$skillStmt = $pdo->prepare("SELECT * FROM skills WHERE applicant_id = :id");
$skillStmt->execute([":id" => $applicantId]);
$skills = $skillStmt->fetchAll(PDO::FETCH_ASSOC);

$certStmt = $pdo->prepare("SELECT * FROM certifications WHERE applicant_id = :id");
$certStmt->execute([":id" => $applicantId]);
$certifications = $certStmt->fetchAll(PDO::FETCH_ASSOC);

$langStmt = $pdo->prepare("SELECT * FROM languages WHERE applicant_id = :id");
$langStmt->execute([":id" => $applicantId]);
$languages = $langStmt->fetchAll(PDO::FETCH_ASSOC);

$projStmt = $pdo->prepare("SELECT * FROM projects WHERE applicant_id = :id");
$projStmt->execute([":id" => $applicantId]);
$projects = $projStmt->fetchAll(PDO::FETCH_ASSOC);

// Determine template based on domain
$templateClass = $applicant["domain"] === "IT" || $applicant["domain"] === "Marketing" ? "cv-modern" : "cv-minimal";

// Generate CV sections
$experienceHTML = "";
foreach ($workExperience as $exp) {
    $endDate = $exp["is_current"] ? "Present" : ($exp["end_date"] ? date("F Y", strtotime($exp["end_date"])) : "");
    $startDate = $exp["start_date"] ? date("F Y", strtotime($exp["start_date"])) : "";
    $experienceHTML .= "
        <div class='${templateClass}-experience-item'>
            <div class='${templateClass}-job-title'>" . htmlspecialchars($exp["job_title"]) . "</div>
            <div class='${templateClass}-company'>" . htmlspecialchars($exp["company"]) . "</div>
            <div class='${templateClass}-date'>${startDate} - ${endDate}</div>
            <div class='${templateClass}-job-description'>" . htmlspecialchars($exp["description"]) . "</div>
        </div>
    ";
}

$educationHTML = "";
foreach ($education as $edu) {
    $endDate = $edu["is_current"] ? "Present" : ($edu["end_date"] ? date("F Y", strtotime($edu["end_date"])) : "");
    $startDate = $edu["start_date"] ? date("F Y", strtotime($edu["start_date"])) : "";
    $educationHTML .= "
        <div class='${templateClass}-education-item'>
            <div class='${templateClass}-degree'>" . htmlspecialchars($edu["degree"]) . "</div>
            <div class='${templateClass}-institution'>" . htmlspecialchars($edu["institution"]) . "</div>
            <div class='${templateClass}-date'>${startDate} - ${endDate}</div>
        </div>
    ";
}

$skillsHTML = "<div class='${templateClass}-skills'>";
foreach ($skills as $skill) {
    $skillsHTML .= "<div class='${templateClass}-skill'>" . htmlspecialchars($skill["skill_name"]) . "</div>";
}
$skillsHTML .= "</div>";

$certificationsHTML = "";
foreach ($certifications as $cert) {
    $dateObtained = $cert["date_obtained"] ? date("F Y", strtotime($cert["date_obtained"])) : "";
    $certificationsHTML .= "
        <div class='${templateClass}-certification-item'>
            <div class='${templateClass}-job-title'>" . htmlspecialchars($cert["certification_name"]) . "</div>
            <div class='${templateClass}-company'>" . htmlspecialchars($cert["issuing_organization"]) . "</div>
            <div class='${templateClass}-date'>${dateObtained}</div>
            " . ($cert["description"] ? "<div class='${templateClass}-job-description'>" . htmlspecialchars($cert["description"]) . "</div>" : "") . "
        </div>
    ";
}

$languagesHTML = "";
foreach ($languages as $lang) {
    $languagesHTML .= "
        <div class='${templateClass}-language-item'>
            <div class='${templateClass}-language-name'>" . htmlspecialchars($lang["language_name"]) . " - " . htmlspecialchars($lang["proficiency"]) . "</div>
        </div>
    ";
}

$projectsHTML = "";
foreach ($projects as $proj) {
    $projectsHTML .= "
        <div class='${templateClass}-project-item'>
            <div class='${templateClass}-job-title'>" . htmlspecialchars($proj["project_title"]) . "</div>
            " . ($proj["technologies"] ? "<div class='${templateClass}-company'>Technologies: " . htmlspecialchars($proj["technologies"]) . "</div>" : "") . "
            <div class='${templateClass}-job-description'>" . htmlspecialchars($proj["description"]) . "</div>
            " . ($proj["link"] ? "<div class='${templateClass}-project-link'><a href='" . htmlspecialchars($proj["link"]) . "' target='_blank'>" . htmlspecialchars($proj["link"]) . "</a></div>" : "") . "
        </div>
    ";
}

// Full CV HTML
$cvHTML = $templateClass === "cv-modern" ? "
    <div class='${templateClass}'>
        <div class='cv-modern-header'>
            <div class='cv-modern-name-position'>
                <div class='cv-modern-name'>" . htmlspecialchars($applicant["full_name"]) . "</div>
                <div class='cv-modern-position'>" . htmlspecialchars($applicant["position"]) . "</div>
            </div>
            " . ($applicant["photo"] ? "<img src='" . htmlspecialchars($applicant["photo"]) . "' alt='Profile Photo' class='cv-modern-photo'>" : "") . "
        </div>
        <div class='cv-modern-contact'>
            " . ($applicant["email"] ? "<div class='cv-modern-contact-item'>" . htmlspecialchars($applicant["email"]) . "</div>" : "") . "
            " . ($applicant["phone"] ? "<div class='cv-modern-contact-item'>" . htmlspecialchars($applicant["phone"]) . "</div>" : "") . "
            " . ($applicant["location"] ? "<div class='cv-modern-contact-item'>" . htmlspecialchars($applicant["location"]) . "</div>" : "") . "
            " . ($applicant["linkedin"] ? "<div class='cv-modern-contact-item'>" . htmlspecialchars($applicant["linkedin"]) . "</div>" : "") . "
        </div>
        <div class='cv-modern-section'>
            <div class='cv-modern-section-title'>Professional Summary</div>
            <div class='cv-modern-summary'>" . htmlspecialchars($applicant["summary"]) . "</div>
        </div>
        " . ($experienceHTML ? "<div class='cv-modern-section'><div class='cv-modern-section-title'>Experience</div>${experienceHTML}</div>" : "") . "
        " . ($educationHTML ? "<div class='cv-modern-section'><div class='cv-modern-section-title'>Education</div>${educationHTML}</div>" : "") . "
        " . ($skillsHTML ? "<div class='cv-modern-section'><div class='cv-modern-section-title'>Skills</div>${skillsHTML}</div>" : "") . "
        " . ($certificationsHTML ? "<div class='cv-modern-section'><div class='cv-modern-section-title'>Certifications</div>${certificationsHTML}</div>" : "") . "
        " . ($languagesHTML ? "<div class='cv-modern-section'><div class='cv-modern-section-title'>Languages</div>${languagesHTML}</div>" : "") . "
        " . ($projectsHTML ? "<div class='cv-modern-section'><div class='cv-modern-section-title'>Projects</div>${projectsHTML}</div>" : "") . "
    </div>
" : "
    <div class='${templateClass}'>
        <div class='cv-minimal-header'>
            " . ($applicant["photo"] ? "<img src='" . htmlspecialchars($applicant["photo"]) . "' alt='Profile Photo' class='cv-minimal-photo'>" : "") . "
            <div class='cv-minimal-name'>" . htmlspecialchars($applicant["full_name"]) . "</div>
            <div class='cv-minimal-position'>" . htmlspecialchars($applicant["position"]) . "</div>
            <div class='cv-minimal-contact'>
                " . ($applicant["email"] ? "<div>" . htmlspecialchars($applicant["email"]) . "</div>" : "") . "
                " . ($applicant["phone"] ? "<div>" . htmlspecialchars($applicant["phone"]) . "</div>" : "") . "
                " . ($applicant["location"] ? "<div>" . htmlspecialchars($applicant["location"]) . "</div>" : "") . "
                " . ($applicant["linkedin"] ? "<div>" . htmlspecialchars($applicant["linkedin"]) . "</div>" : "") . "
            </div>
        </div>
        <div class='cv-minimal-section'>
            <div class='cv-minimal-section-title'>Professional Summary</div>
            <p>" . htmlspecialchars($applicant["summary"]) . "</p>
        </div>
        " . ($experienceHTML ? "<div class='cv-minimal-section'><div class='cv-minimal-section-title'>Experience</div>${experienceHTML}</div>" : "") . "
        " . ($educationHTML ? "<div class='cv-minimal-section'><div class='cv-minimal-section-title'>Education</div>${educationHTML}</div>" : "") . "
        " . ($skillsHTML ? "<div class='cv-minimal-section'><div class='cv-minimal-section-title'>Skills</div>${skillsHTML}</div>" : "") . "
        " . ($certificationsHTML ? "<div class='cv-minimal-section'><div class='cv-minimal-section-title'>Certifications</div>${certificationsHTML}</div>" : "") . "
        " . ($languagesHTML ? "<div class='cv-minimal-section'><div class='cv-minimal-section-title'>Languages</div>${languagesHTML}</div>" : "") . "
        " . ($projectsHTML ? "<div class='cv-minimal-section'><div class='cv-minimal-section-title'>Projects</div>${projectsHTML}</div>" : "") . "
    </div>
";
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>View CV - <?php echo htmlspecialchars($applicant["full_name"]); ?></title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>CV of <?php echo htmlspecialchars($applicant["full_name"]); ?></h1>
        <a href="dashboard.php" class="button back-button">Back to Dashboard</a>
        <div class="cv-preview-container">
            <?php echo $cvHTML; ?>
        </div>
    </div>
</body>
</html>