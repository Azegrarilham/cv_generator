document.addEventListener("DOMContentLoaded", function () {
  let selectedDomain = "";
  let selectedPosition = "";
  let userPhoto = null;

  const steps = document.querySelectorAll(".step");
  const nextToStep2Button = document.getElementById("nextToStep2");
  const backToStep1Button = document.getElementById("backToStep1");
  const nextToStep3Button = document.getElementById("nextToStep3");
  const backToStep2Button = document.getElementById("backToStep2");
  const generateCVButton = document.getElementById("generateCV");
  const backToStep3Button = document.getElementById("backToStep3");
  const downloadPDFButton = document.getElementById("downloadPDF");

  const domainCards = document.querySelectorAll(".domain-card");

  domainCards.forEach((card) => {
    card.addEventListener("click", function () {
      domainCards.forEach((c) => c.classList.remove("selected"));
      this.classList.add("selected");
      selectedDomain = this.getAttribute("data-domain");
      nextToStep2Button.removeAttribute("disabled");
    });
  });

  const positionInput = document.getElementById("position");

  positionInput.addEventListener("input", function () {
    if (this.value.trim() !== "") {
      nextToStep3Button.removeAttribute("disabled");
    } else {
      nextToStep3Button.setAttribute("disabled", "disabled");
    }
  });

  const photoUpload = document.getElementById("photoUpload");
  const photoPreview = document.getElementById("photoPreview");

  photoUpload.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        photoPreview.style.backgroundImage = `url(${e.target.result})`;
        userPhoto = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  const addExperienceButton = document.getElementById("addExperience");
  const experienceContainer = document.getElementById("experienceContainer");

  addExperienceButton.addEventListener("click", function () {
    const experienceItem = document.createElement("div");
    experienceItem.className = "experience-item";
    experienceItem.innerHTML = `
            <div class="form-row">
                <div class="form-field">
                    <label>Job Title:</label>
                    <input type="text" class="job-title" name="job_title[]" placeholder="Senior Developer">
                </div>
                <div class="form-field">
                    <label>Company:</label>
                    <input type="text" class="company" name="company[]" placeholder="Tech Company Inc.">
                </div>
            </div>
            <div class="form-row">
                <div class="form-field">
                    <label>Start Date:</label>
                    <input type="month" class="start-date" name="start_date[]">
                </div>
                <div class="form-field">
                    <label>End Date:</label>
                    <input type="month" class="end-date" name="end_date[]">
                    <div class="checkbox-container">
                        <input type="checkbox" class="current-job" name="current_job[]">
                        <label>Current Job</label>
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="form-field full-width">
                    <label>Description:</label>
                    <textarea class="job-description" name="job_description[]" rows="3" placeholder="Describe your responsibilities and achievements"></textarea>
                </div>
            </div>
            <button type="button" class="button remove-button" style="background-color: #e74c3c; color: white; margin-top: 10px;">Remove</button>
        `;
    experienceContainer.appendChild(experienceItem);

    const removeButton = experienceItem.querySelector(".remove-button");
    removeButton.addEventListener("click", function () {
      experienceContainer.removeChild(experienceItem);
    });

    const currentJobCheckbox = experienceItem.querySelector(".current-job");
    const endDateInput = experienceItem.querySelector(".end-date");

    currentJobCheckbox.addEventListener("change", function () {
      if (this.checked) {
        endDateInput.disabled = true;
        endDateInput.value = "";
      } else {
        endDateInput.disabled = false;
      }
    });
  });

  const addEducationButton = document.getElementById("addEducation");
  const educationContainer = document.getElementById("educationContainer");

  addEducationButton.addEventListener("click", function () {
    const educationItem = document.createElement("div");
    educationItem.className = "education-item";
    educationItem.innerHTML = `
            <div class="form-row">
                <div class="form-field">
                    <label>Degree:</label>
                    <input type="text" class="degree" name="degree[]" placeholder="Bachelor of Science in Computer Science">
                </div>
                <div class="form-field">
                    <label>Institution:</label>
                    <input type="text" class="institution" name="institution[]" placeholder="University Name">
                </div>
            </div>
            <div class="form-row">
                <div class="form-field">
                    <label>Start Date:</label>
                    <input type="month" class="edu-start-date" name="edu_start_date[]">
                </div>
                <div class="form-field">
                    <label>End Date:</label>
                    <input type="month" class="edu-end-date" name="edu_end_date[]">
                    <div class="checkbox-container">
                        <input type="checkbox" class="current-education" name="current_education[]">
                        <label>Currently Studying</label>
                    </div>
                </div>
            </div>
            <button type="button" class="button remove-button" style="background-color: #e74c3c; color: white; margin-top: 10px;">Remove</button>
        `;
    educationContainer.appendChild(educationItem);

    const removeButton = educationItem.querySelector(".remove-button");
    removeButton.addEventListener("click", function () {
      educationContainer.removeChild(educationItem);
    });

    const currentEducationCheckbox =
      educationItem.querySelector(".current-education");
    const endDateInput = educationItem.querySelector(".edu-end-date");

    currentEducationCheckbox.addEventListener("change", function () {
      if (this.checked) {
        endDateInput.disabled = true;
        endDateInput.value = "";
      } else {
        endDateInput.disabled = false;
      }
    });
  });

  const addCertificationButton = document.getElementById("addCertification");
  const certificationsContainer = document.getElementById(
    "certificationsContainer"
  );

  addCertificationButton.addEventListener("click", function () {
    const certificationItem = document.createElement("div");
    certificationItem.className = "certification-item";
    certificationItem.innerHTML = `
            <div class="form-row">
                <div class="form-field">
                    <label>Certification Name:</label>
                    <input type="text" class="certification-name" name="certification_name[]" placeholder="e.g., Certified Scrum Master">
                </div>
                <div class="form-field">
                    <label>Issuing Organization:</label>
                    <input type="text" class="issuing-organization" name="issuing_organization[]" placeholder="e.g., Scrum Alliance">
                </div>
            </div>
            <div class="form-row">
                <div class="form-field">
                    <label>Date Obtained:</label>
                    <input type="month" class="certification-date" name="certification_date[]">
                </div>
                <div class="form-field full-width">
                    <label>Description (optional):</label>
                    <textarea class="certification-description" name="certification_description[]" rows="2" placeholder="Brief description of the certification"></textarea>
                </div>
            </div>
            <button type="button" class="button remove-button" style="background-color: #e74c3c; color: white; margin-top: 10px;">Remove</button>
        `;
    certificationsContainer.appendChild(certificationItem);

    const removeButton = certificationItem.querySelector(".remove-button");
    removeButton.addEventListener("click", function () {
      certificationsContainer.removeChild(certificationItem);
    });
  });

  const addLanguageButton = document.getElementById("addLanguage");
  const languagesContainer = document.getElementById("languagesContainer");

  addLanguageButton.addEventListener("click", function () {
    const languageItem = document.createElement("div");
    languageItem.className = "language-item";
    languageItem.innerHTML = `
            <div class="form-row">
                <div class="form-field">
                    <label>Language:</label>
                    <input type="text" class="language-name" name="language_name[]" placeholder="e.g., English">
                </div>
                <div class="form-field">
                    <label>Proficiency:</label>
                    <select class="language-proficiency" name="language_proficiency[]">
                        <option value="">Select Proficiency</option>
                        <option value="Native">Native</option>
                        <option value="Fluent">Fluent</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Basic">Basic</option>
                    </select>
                </div>
            </div>
            <button type="button" class="button remove-button" style="background-color: #e74c3c; color: white; margin-top: 10px;">Remove</button>
        `;
    languagesContainer.appendChild(languageItem);

    const removeButton = languageItem.querySelector(".remove-button");
    removeButton.addEventListener("click", function () {
      languagesContainer.removeChild(languageItem);
    });
  });

  const addProjectButton = document.getElementById("addProject");
  const projectsContainer = document.getElementById("projectsContainer");

  addProjectButton.addEventListener("click", function () {
    const projectItem = document.createElement("div");
    projectItem.className = "project-item";
    projectItem.innerHTML = `
            <div class="form-row">
                <div class="form-field">
                    <label>Project Title:</label>
                    <input type="text" class="project-title" name="project_title[]" placeholder="e.g., E-commerce Website">
                </div>
                <div class="form-field">
                    <label>Technologies Used:</label>
                    <input type="text" class="project-technologies" name="project_technologies[]" placeholder="e.g., React, Node.js, MongoDB">
                </div>
            </div>
            <div class="form-row">
                <div class="form-field full-width">
                    <label>Description:</label>
                    <textarea class="project-description" name="project_description[]" rows="3" placeholder="Describe the project, your role, and achievements"></textarea>
                </div>
            </div>
            <div class="form-row">
                <div class="form-field">
                    <label>Link (optional):</label>
                    <input type="text" class="project-link" name="project_link[]" placeholder="e.g., https://github.com/yourproject">
                </div>
            </div>
            <button type="button" class="button remove-button" style="background-color: #e74c3c; color: white; margin-top: 10px;">Remove</button>
        `;
    projectsContainer.appendChild(projectItem);

    const removeButton = projectItem.querySelector(".remove-button");
    removeButton.addEventListener("click", function () {
      projectsContainer.removeChild(projectItem);
    });
  });

  nextToStep2Button.addEventListener("click", function () {
    showStep(2);
    selectedPosition = "";
    positionInput.value = "";
    nextToStep3Button.setAttribute("disabled", "disabled");
  });

  backToStep1Button.addEventListener("click", function () {
    showStep(1);
  });

  nextToStep3Button.addEventListener("click", function () {
    showStep(3);
    selectedPosition = positionInput.value.trim();
    adjustFormForDomain();
  });

  backToStep2Button.addEventListener("click", function () {
    showStep(2);
  });

  generateCVButton.addEventListener("click", function (event) {
    event.preventDefault();
    if (validateForm()) {
      const form = document.getElementById("applicantForm");
      const formData = new FormData(form);
      formData.append("domain", selectedDomain);
      formData.append("position", selectedPosition);

      fetch("submit_applicant.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            generateCV();
            showStep(4);
            alert("Your data has been successfully submitted!");
          } else {
            alert("Error submitting data: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("An error occurred while submitting your data.");
        });
    } else {
      alert(
        "Please fill in all required fields (Name, Email, Phone, Summary, at least one Education)"
      );
    }
  });

  backToStep3Button.addEventListener("click", function () {
    showStep(3);
  });

  downloadPDFButton.addEventListener("click", function () {
    const cvContent = document.getElementById("cvContent");
    const options = {
      margin: 10,
      filename: `${document.getElementById("fullName").value.trim()}_CV.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(options).from(cvContent).save();
  });

  function showStep(stepNumber) {
    steps.forEach((step, index) => {
      if (index + 1 === stepNumber) {
        step.classList.add("active");
      } else {
        step.classList.remove("active");
      }
    });
    window.scrollTo(0, 0);
  }

  function adjustFormForDomain() {
    const summaryField = document.getElementById("summary");
    const skillsField = document.getElementById("skills");

    switch (selectedDomain) {
      case "IT":
        summaryField.placeholder =
          "Experienced IT professional with expertise in software development...";
        skillsField.placeholder =
          "Programming Languages (JavaScript, Python), Frameworks (React, Node.js)...";
        break;
      case "Marketing":
        summaryField.placeholder =
          "Results-driven marketing professional with a track record of successful campaigns...";
        skillsField.placeholder =
          "Digital Marketing, Content Strategy, SEO/SEM, Social Media Management...";
        break;
      case "Finance":
        summaryField.placeholder =
          "Detail-oriented finance professional with expertise in financial analysis...";
        skillsField.placeholder =
          "Financial Analysis, Forecasting, Budgeting, Excel, Financial Modeling...";
        break;
      case "Healthcare":
        summaryField.placeholder =
          "Dedicated healthcare professional committed to providing high-quality patient care...";
        skillsField.placeholder =
          "Patient Care, Medical Records, Healthcare Regulations, Clinical Procedures...";
        break;
      case "Education":
        summaryField.placeholder =
          "Passionate educator with experience in curriculum development...";
        skillsField.placeholder =
          "Curriculum Development, Classroom Management, Student Assessment...";
        break;
      default:
        summaryField.placeholder =
          "Brief overview of your professional background and key strengths...";
        skillsField.placeholder =
          "Enter your skills separated by commas (e.g., Teamwork, Project Management)";
    }
  }

  function validateForm() {
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const summary = document.getElementById("summary").value.trim();
    const educationItems = document.querySelectorAll(".education-item");
    let hasValidEducation = false;

    for (let i = 0; i < educationItems.length; i++) {
      const degree = educationItems[i].querySelector(".degree").value.trim();
      const institution = educationItems[i]
        .querySelector(".institution")
        .value.trim();
      if (degree && institution) {
        hasValidEducation = true;
        break;
      }
    }

    return fullName && email && phone && summary && hasValidEducation;
  }

  function formatDate(dateString, isCurrent) {
    if (isCurrent) return "Present";
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long" };
    return date.toLocaleDateString("en-US", options);
  }

  function generateCV() {
    const cvContent = document.getElementById("cvContent");
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const location = document.getElementById("location").value.trim();
    const linkedin = document.getElementById("linkedin").value.trim();
    const summary = document.getElementById("summary").value.trim();
    const templateClass =
      selectedDomain === "IT" || selectedDomain === "Marketing"
        ? "cv-modern"
        : "cv-minimal";
    const experienceHTML = getExperienceHTML(templateClass);
    const educationHTML = getEducationHTML(templateClass);
    const skillsHTML = getSkillsHTML(templateClass);
    const certificationsHTML = getCertificationsHTML(templateClass);
    const languagesHTML = getLanguagesHTML(templateClass);
    const projectsHTML = getProjectsHTML(templateClass);

    let cvHTML = "";
    if (templateClass === "cv-modern") {
      cvHTML = `
                <div class="${templateClass}">
                    <div class="cv-modern-header">
                        <div class="cv-modern-name-position">
                            <div class="cv-modern-name">${fullName}</div>
                            <div class="cv-modern-position">${selectedPosition}</div>
                        </div>
                        ${
                          userPhoto
                            ? `<img src="${userPhoto}" alt="Profile Photo" class="cv-modern-photo">`
                            : ""
                        }
                    </div>
                    <div class="cv-modern-contact">
                        ${
                          email
                            ? `<div class="cv-modern-contact-item">${email}</div>`
                            : ""
                        }
                        ${
                          phone
                            ? `<div class="cv-modern-contact-item">${phone}</div>`
                            : ""
                        }
                        ${
                          location
                            ? `<div class="cv-modern-contact-item">${location}</div>`
                            : ""
                        }
                        ${
                          linkedin
                            ? `<div class="cv-modern-contact-item">${linkedin}</div>`
                            : ""
                        }
                    </div>
                    <div class="cv-modern-section">
                        <div class="cv-modern-section-title">Professional Summary</div>
                        <div class="cv-modern-summary">${summary}</div>
                    </div>
                    ${
                      experienceHTML
                        ? `<div class="cv-modern-section"><div class="cv-modern-section-title">Experience</div>${experienceHTML}</div>`
                        : ""
                    }
                    ${
                      educationHTML
                        ? `<div class="cv-modern-section"><div class="cv-modern-section-title">Education</div>${educationHTML}</div>`
                        : ""
                    }
                    ${
                      skillsHTML
                        ? `<div class="cv-modern-section"><div class="cv-modern-section-title">Skills</div>${skillsHTML}</div>`
                        : ""
                    }
                    ${certificationsHTML}
                    ${languagesHTML}
                    ${projectsHTML}
                </div>
            `;
    } else {
      cvHTML = `
                <div class="${templateClass}">
                    <div class="cv-minimal-header">
                        ${
                          userPhoto
                            ? `<img src="${userPhoto}" alt="Profile Photo" class="cv-minimal-photo">`
                            : ""
                        }
                        <div class="cv-minimal-name">${fullName}</div>
                        <div class="cv-minimal-position">${selectedPosition}</div>
                        <div class="cv-minimal-contact">
                            ${email ? `<div>${email}</div>` : ""}
                            ${phone ? `<div>${phone}</div>` : ""}
                            ${location ? `<div>${location}</div>` : ""}
                            ${linkedin ? `<div>${linkedin}</div>` : ""}
                        </div>
                    </div>
                    <div class="cv-minimal-section">
                        <div class="cv-minimal-section-title">Professional Summary</div>
                        <p>${summary}</p>
                    </div>
                    ${
                      experienceHTML
                        ? `<div class="cv-minimal-section"><div class="cv-minimal-section-title">Experience</div>${experienceHTML}</div>`
                        : ""
                    }
                    ${
                      educationHTML
                        ? `<div class="cv-minimal-section"><div class="cv-minimal-section-title">Education</div>${educationHTML}</div>`
                        : ""
                    }
                    ${
                      skillsHTML
                        ? `<div class="cv-minimal-section"><div class="cv-minimal-section-title">Skills</div>${skillsHTML}</div>`
                        : ""
                    }
                    ${certificationsHTML}
                    ${languagesHTML}
                    ${projectsHTML}
                </div>
            `;
    }
    cvContent.innerHTML = cvHTML;
  }

  function getExperienceHTML(template) {
    const experienceItems = document.querySelectorAll(".experience-item");
    let html = "";
    experienceItems.forEach((item) => {
      const title = item.querySelector(".job-title").value.trim();
      const company = item.querySelector(".company").value.trim();
      const startDate = item.querySelector(".start-date").value;
      const isCurrentJob = item.querySelector(".current-job").checked;
      const endDate = isCurrentJob ? "" : item.querySelector(".end-date").value;
      const description = item.querySelector(".job-description").value.trim();
      if (title && company) {
        if (template === "cv-modern") {
          html += `
                        <div class="cv-modern-experience-item">
                            <div class="cv-modern-job-title">${title}</div>
                            <div class="cv-modern-company">${company}</div>
                            <div class="cv-modern-date">${formatDate(
                              startDate
                            )} - ${
            isCurrentJob ? "Present" : formatDate(endDate)
          }</div>
                            <div class="cv-modern-job-description">${description}</div>
                        </div>
                    `;
        } else {
          html += `
                        <div class="cv-minimal-experience-item">
                            <div class="cv-minimal-row">
                                <div class="cv-minimal-job-title">${title} at ${company}</div>
                                <div class="cv-minimal-date">${formatDate(
                                  startDate
                                )} - ${
            isCurrentJob ? "Present" : formatDate(endDate)
          }</div>
                            </div>
                            <p>${description}</p>
                        </div>
                    `;
        }
      }
    });
    return html;
  }

  function getEducationHTML(template) {
    const educationItems = document.querySelectorAll(".education-item");
    let html = "";
    educationItems.forEach((item) => {
      const degree = item.querySelector(".degree").value.trim();
      const institution = item.querySelector(".institution").value.trim();
      const startDate = item.querySelector(".edu-start-date").value;
      const isCurrentEducation =
        item.querySelector(".current-education").checked;
      const endDate = isCurrentEducation
        ? ""
        : item.querySelector(".edu-end-date").value;
      if (degree && institution) {
        if (template === "cv-modern") {
          html += `
                        <div class="cv-modern-education-item">
                            <div class="cv-modern-degree">${degree}</div>
                            <div class="cv-modern-institution">${institution}</div>
                            <div class="cv-modern-date">${formatDate(
                              startDate
                            )} - ${
            isCurrentEducation ? "Present" : formatDate(endDate)
          }</div>
                        </div>
                    `;
        } else {
          html += `
                        <div class="cv-minimal-education-item">
                            <div class="cv-minimal-row">
                                <div class="cv-minimal-degree">${degree}</div>
                                <div class="cv-minimal-date">${formatDate(
                                  startDate
                                )} - ${
            isCurrentEducation ? "Present" : formatDate(endDate)
          }</div>
                            </div>
                            <p>${institution}</p>
                        </div>
                    `;
        }
      }
    });
    return html;
  }

  function getSkillsHTML(template) {
    const skillsText = document.getElementById("skills").value.trim();
    if (!skillsText) return "";
    const skillsArray = skillsText
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill);
    let html = "";
    if (template === "cv-modern") {
      html = '<div class="cv-modern-skills">';
      skillsArray.forEach((skill) => {
        html += `<div class="cv-modern-skill">${skill}</div>`;
      });
      html += "</div>";
    } else {
      html = '<div class="cv-minimal-skills">';
      skillsArray.forEach((skill) => {
        html += `<div class="cv-minimal-skill">${skill}</div>`;
      });
      html += "</div>";
    }
    return html;
  }

  function getCertificationsHTML(template) {
    const certificationItems = document.querySelectorAll(".certification-item");
    let html = "";
    certificationItems.forEach((item) => {
      const name = item.querySelector(".certification-name").value.trim();
      const organization = item
        .querySelector(".issuing-organization")
        .value.trim();
      const date = item.querySelector(".certification-date").value;
      const description = item
        .querySelector(".certification-description")
        .value.trim();
      if (name && organization) {
        if (template === "cv-modern") {
          html += `
                        <div class="cv-modern-certification-item">
                            <div class="cv-modern-job-title">${name}</div>
                            <div class="cv-modern-company">${organization}</div>
                            <div class="cv-modern-date">${formatDate(
                              date
                            )}</div>
                            ${
                              description
                                ? `<div class="cv-modern-job-description">${description}</div>`
                                : ""
                            }
                        </div>
                    `;
        } else {
          html += `
                        <div class="cv-minimal-certification-item">
                            <div class="cv-minimal-row">
                                <div class="cv-minimal-job-title">${name}</div>
                                <div class="cv-minimal-date">${formatDate(
                                  date
                                )}</div>
                            </div>
                            <p>${organization}</p>
                            ${description ? `<p>${description}</p>` : ""}
                        </div>
                    `;
        }
      }
    });
    return html
      ? `<div class="cv-${template}-section"><div class="cv-${template}-section-title">Certifications</div>${html}</div>`
      : "";
  }

  function getLanguagesHTML(template) {
    const languageItems = document.querySelectorAll(".language-item");
    let html = "";
    languageItems.forEach((item) => {
      const name = item.querySelector(".language-name").value.trim();
      const proficiency = item.querySelector(".language-proficiency").value;
      if (name && proficiency) {
        if (template === "cv-modern") {
          html += `
                        <div class="cv-modern-language-item">
                            <div class="cv-modern-language-name">${name} - ${proficiency}</div>
                        </div>
                    `;
        } else {
          html += `
                        <div class="cv-minimal-language-item">
                            ${name} - ${proficiency}
                        </div>
                    `;
        }
      }
    });
    return html
      ? `<div class="cv-${template}-section"><div class="cv-${template}-section-title">Languages</div>${html}</div>`
      : "";
  }

  function getProjectsHTML(template) {
    const projectItems = document.querySelectorAll(".project-item");
    let html = "";
    projectItems.forEach((item) => {
      const title = item.querySelector(".project-title").value.trim();
      const technologies = item
        .querySelector(".project-technologies")
        .value.trim();
      const description = item
        .querySelector(".project-description")
        .value.trim();
      const link = item.querySelector(".project-link").value.trim();
      if (title && description) {
        if (template === "cv-modern") {
          html += `
                        <div class="cv-modern-project-item">
                            <div class="cv-modern-job-title">${title}</div>
                            ${
                              technologies
                                ? `<div class="cv-modern-company">Technologies: ${technologies}</div>`
                                : ""
                            }
                            <div class="cv-modern-job-description">${description}</div>
                            ${
                              link
                                ? `<div class="cv-modern-project-link"><a href="${link}" target="_blank">${link}</a></div>`
                                : ""
                            }
                        </div>
                    `;
        } else {
          html += `
                        <div class="cv-minimal-project-item">
                            <div class="cv-minimal-job-title">${title}</div>
                            ${
                              technologies
                                ? `<p>Technologies: ${technologies}</p>`
                                : ""
                            }
                            <p>${description}</p>
                            ${
                              link
                                ? `<p><a href="${link}" target="_blank">${link}</a></p>`
                                : ""
                            }
                        </div>
                    `;
        }
      }
    });
    return html
      ? `<div class="cv-${template}-section"><div class="cv-${template}-section-title">Projects</div>${html}</div>`
      : "";
  }
});
