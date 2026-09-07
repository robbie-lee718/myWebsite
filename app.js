document.addEventListener("DOMContentLoaded", () => {
  // Fetch the data from the local JSON file
  fetch("data.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      populatePortfolio(data);
    })
    .catch(error => {
      console.error("There was a problem fetching your portfolio data:", error);
      document.getElementById("hero-name").innerText = "Failed to load profile.";
    });
});

function populatePortfolio(data) {
  // 1. Brand & Header Setup
  document.title = `${data.name} | Portfolio`;
  document.getElementById("nav-brand").innerText = data.name;
  document.getElementById("hero-name").innerText = data.name;
  document.getElementById("hero-title").innerText = data.title;
  document.getElementById("hero-location").innerText = data.location;
  document.getElementById("hero-bio").innerText = data.bio;

  // Footer setup
  document.getElementById("footer-name").innerText = data.name;
  document.getElementById("footer-year").innerText = new Date().getFullYear();

  // 2. Social Links Setup
  const socialsContainer = document.getElementById("hero-socials");
  Object.entries(data.socials).forEach(([platform, url]) => {
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      // Capitalizes the platform name for display
      link.innerText = platform.charAt(0).toUpperCase() + platform.slice(1);
      socialsContainer.appendChild(link);
    }
  });

  // 3. Technical Skills Section
  const skillsGrid = document.getElementById("skills-grid");
  data.skills.forEach(skill => {
    const badge = document.createElement("span");
    badge.className = "skill-badge";
    badge.innerText = skill;
    skillsGrid.appendChild(badge);
  });

  // 4. Projects Section
  const projectsGrid = document.getElementById("projects-grid");
  data.projects.forEach(project => {
    const card = document.createElement("div");
    card.className = "project-card";

    // Generate inner tags strings
    const tagsHTML = project.tags.map(tag => `<span>${tag}</span>`).join("");
    let status = "";

    if (Array.isArray(project.link) && project.link.length > 0) {
      status = project.link.map(linkObj => `
      <a href="${linkObj.url}" target="_blank" rel="noopener noreferrer" class="project-link">
        ${linkObj.text} &rarr;
      </a>
    `).join("<br>");

    } else if (typeof project.link === "string" && project.link.trim() !== "") {
      status = `
      <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="project-link">
        View Project &rarr;
      </a>
    `;

    } else if (project.status) {
      status = `<p class="project-status">${project.status}</p>`;
    }

    card.innerHTML = `
      <div>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
      </div>
      <div>
        <div class="project-tags">${tagsHTML}</div>
        <div class="project-action">${status}</div>
      </div>
    `;
    projectsGrid.appendChild(card);
  });

  // 5. Experience/Timeline Section
  const timeline = document.getElementById("experience-timeline");
  data.experience.forEach(exp => {
    const item = document.createElement("div");
    item.className = "timeline-item";

    const descriptionsList = exp.description
    .map(desc => `<li>${desc}</li>`)
    .join("");

    item.innerHTML = `
      <div class="timeline-meta">
        <h3>${exp.role}</h3>
        <span class="timeline-date">${exp.period}</span>
      </div>
      <div class="timeline-company">${exp.company}</div>
      <ul style="color: var(--text-muted); font-size: 0.95rem;">
        ${descriptionsList}
      </ul>
    `;
    timeline.appendChild(item);
  });
}