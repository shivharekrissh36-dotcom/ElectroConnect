/**
 * ElectroConnect App JS
 * Handles mock database state, local storage persistence, page navigation, 
 * dashboard editing, contact lead forwarding, and dynamic UI rendering.
 */

// --- Default Data Store ---
const DEFAULT_STATE = {
    companies: [
        {
            id: "apex-industrial",
            name: "Apex Industrial Systems",
            tagline: "High-voltage distribution & industrial substation automation",
            specialty: "High Voltage",
            logoClass: "fa-solid fa-tower-cell",
            rating: "5.0",
            completedProjectsCount: 340,
            electriciansCount: 120,
            description: "Apex Industrial Systems has delivered premium electrical contracting for steel production, chemical facilities, and regional utility grids for over two decades. Specialized in high voltage transmission, switchgear validation, and smart grid system designs.",
            featured: true
        },
        {
            id: "voltarc-power",
            name: "VoltArc Power Solutions",
            tagline: "Utility-scale solar infrastructure & battery storage (BESS) integration",
            specialty: "Renewables",
            logoClass: "fa-solid fa-solar-panel",
            rating: "4.9",
            completedProjectsCount: 210,
            electriciansCount: 75,
            description: "VoltArc is the premier renewable infrastructure installer in the Midwest corridor, providing utility-grade microgrid setups, commercial solar arrays, and high-capacity battery bank integrations.",
            featured: true
        },
        {
            id: "helix-automation",
            name: "Helix Automation",
            tagline: "Advanced SCADA systems engineering, machine safety audits, & smart controls",
            specialty: "Automation",
            logoClass: "fa-solid fa-microchip",
            rating: "4.9",
            completedProjectsCount: 490,
            electriciansCount: 85,
            description: "Helix Engineering specializes in zero-downtime control panel overhauls, PLC program migrations (Siemens, Allen-Bradley), and advanced automated factory assembly integrations.",
            featured: true
        }
    ],
    projects: [
        {
            id: "proj-1",
            title: "22KV Substation Overhaul",
            category: "High Voltage",
            scale: "Utility Grid / 3 Subsystems",
            image: "assets/project_substation.png",
            companyId: "apex-industrial"
        },
        {
            id: "proj-2",
            title: "Utility Solar Array Sync",
            category: "Renewables",
            scale: "150 MW Array / 8 Inverters",
            image: "assets/project_solar.png",
            companyId: "voltarc-power"
        },
        {
            id: "proj-3",
            title: "Automated PLC Assembly Line",
            category: "Automation",
            scale: "30-Node PLC Mesh & SCADA",
            image: "assets/project_automation.png",
            companyId: "helix-automation"
        },
        {
            id: "proj-4",
            title: "Generator Substation Upgrade",
            category: "High Voltage",
            scale: "2500 kVA Backup Setup",
            image: "assets/project_substation.png",
            companyId: "apex-industrial"
        }
    ],
    employees: [
        {
            id: "emp-1",
            name: "Dave Miller",
            role: "High-Voltage Grid Supervisor",
            experience: 18,
            badge: "HV Certified",
            companyId: "apex-industrial"
        },
        {
            id: "emp-2",
            name: "Sarah Jenkins",
            role: "Principal SCADA Engineer",
            experience: 14,
            badge: "PLC Specialist",
            companyId: "helix-automation"
        },
        {
            id: "emp-3",
            name: "Amir Al-Hassan",
            role: "Solar Integration Architect",
            experience: 11,
            badge: "Solar Architect",
            companyId: "voltarc-power"
        },
        {
            id: "emp-4",
            name: "Michael Vance",
            role: "Safety Compliance Director",
            experience: 15,
            badge: "Industrial Safety Lead",
            companyId: "apex-industrial"
        }
    ],
    leads: [
        {
            id: "lead-1",
            name: "Gregory Cole",
            email: "gcole@nucormetal.com",
            company: "Nucor Metal Corp",
            category: "High Voltage",
            budget: "$200k - $1M",
            description: "Diagnostics and preventive maintenance sweep for a 33kV main stepdown transformer inside our heavy stamping plant.",
            status: "pending",
            time: "2 hours ago"
        },
        {
            id: "lead-2",
            name: "Linus Miller",
            email: "lmiller@automatedfoods.com",
            company: "Global Foods Ltd",
            category: "Automation",
            budget: "$50k - $200k",
            description: "Migrating legacy PLC systems to modern Allen Bradley hardware with custom SCADA dashboard reporting.",
            status: "pending",
            time: "Yesterday"
        }
    ],
    activityLogs: [
        { text: "System Vetted Status Approved", time: "3 days ago" },
        { text: "Published updated project showcase", time: "2 days ago" },
        { text: "Received lead: Automated PLC Migration", time: "Yesterday" }
    ],
    gallery: [
        "assets/project_substation.png",
        "assets/project_automation.png",
        "assets/project_solar.png"
    ]
};

// Global State Instance
let state = {};

// Active Company being managed in the SaaS Dashboard (apex-industrial by default)
const ACTIVE_COMPANY_ID = "apex-industrial";

// --- Initialize App ---
document.addEventListener("DOMContentLoaded", () => {
    loadState();
    initNavigation();
    initStatsCounters();
    initFilters();
    initTestimonials();
    initLeadIntake();
    initDashboard();
    
    // Initial Render
    renderLandingPage();
    renderDashboard();
});

// --- State Management Helpers ---
function loadState() {
    const saved = localStorage.getItem("electroconnect_db");
    if (saved) {
        try {
            state = JSON.parse(saved);
        } catch (e) {
            console.error("Error parsing local db, reloading defaults", e);
            state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        }
    } else {
        state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        saveState();
    }
}

function saveState() {
    localStorage.setItem("electroconnect_db", JSON.stringify(state));
}

// --- Landing Page Nav & Transitions ---
function initNavigation() {
    const header = document.querySelector(".main-header");
    const mobileToggle = document.getElementById("mobile-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    // Scroll header effect
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // Mobile Navigation
    mobileToggle.addEventListener("click", () => {
        navMenu.classList.toggle("mobile-active");
        mobileToggle.querySelector("i").classList.toggle("fa-bars");
        mobileToggle.querySelector("i").classList.toggle("fa-xmark");
    });

    // Smooth scroll for nav items
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            navMenu.classList.remove("mobile-active");
            mobileToggle.querySelector("i").className = "fa-solid fa-bars";
            
            const targetId = link.getAttribute("href");
            const targetSec = document.querySelector(targetId);
            if (targetSec) {
                const headerOffset = 80;
                const elementPosition = targetSec.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }

            // Set active class
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
        });
    });
}

// --- Stat Counters Animation ---
function initStatsCounters() {
    const stats = document.querySelectorAll(".stat-num");
    const speed = 100;

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute("data-target");
                    const count = +counter.innerText;
                    const inc = Math.ceil(target / speed);

                    if (count < target) {
                        counter.innerText = count + inc;
                        setTimeout(updateCount, 15);
                    } else {
                        counter.innerText = target.toLocaleString() + "+";
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

// --- Filter Companies ---
function initFilters() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const filter = btn.getAttribute("data-filter");
            renderCompanies(filter);
        });
    });
}

// --- Testimonial Slider ---
function initTestimonials() {
    const slides = document.querySelectorAll(".testimonial-slide");
    const dots = document.querySelectorAll(".slider-dots .dot");
    let currentIdx = 0;

    const showSlide = (idx) => {
        slides.forEach(s => s.classList.remove("active"));
        dots.forEach(d => d.classList.remove("active"));
        slides[idx].classList.add("active");
        dots[idx].classList.add("active");
        currentIdx = idx;
    };

    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            const index = parseInt(dot.getAttribute("data-index"));
            showSlide(index);
        });
    });

    // Auto rotate every 8 seconds
    setInterval(() => {
        let next = (currentIdx + 1) % slides.length;
        showSlide(next);
    }, 8000);
}

// --- RFP Lead Submission (Contact Form) ---
function initLeadIntake() {
    const form = document.getElementById("lead-intake-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const newLead = {
            id: "lead-" + Date.now(),
            name: document.getElementById("lead-name").value,
            email: document.getElementById("lead-email").value,
            company: document.getElementById("lead-company").value,
            category: document.getElementById("lead-category").value,
            budget: document.getElementById("lead-budget").value,
            description: document.getElementById("lead-description").value,
            status: "pending",
            time: "Just now"
        };

        state.leads.unshift(newLead);
        state.activityLogs.unshift({
            text: `Received new lead: ${newLead.company} (${newLead.category})`,
            time: "Just now"
        });

        saveState();
        showToast("RFP Lead dispatched successfully to directory partners!", "success");
        form.reset();
        
        // Re-render
        renderDashboard();
    });
}

// --- Main Render Functions (Landing Page) ---
function renderLandingPage() {
    renderCompanies("all");
    renderProjects();
    renderEmployees();
}

function renderCompanies(filter) {
    const grid = document.getElementById("companies-grid-container");
    if (!grid) return;
    grid.innerHTML = "";

    const filtered = filter === "all" 
        ? state.companies 
        : state.companies.filter(c => c.specialty === filter);

    filtered.forEach(comp => {
        // Count dynamic projects in database for this company
        const projectsCount = state.projects.filter(p => p.companyId === comp.id).length;
        // Count dynamic crew members
        const crewCount = state.employees.filter(e => e.companyId === comp.id).length;

        const card = document.createElement("div");
        card.className = "company-card";
        card.innerHTML = `
            <div class="comp-header">
                <div class="comp-logo-box">
                    <i class="${comp.logoClass}"></i>
                </div>
                <div class="comp-rating">
                    <i class="fa-solid fa-star"></i> ${comp.rating}
                </div>
            </div>
            <div class="comp-body">
                <h3>${comp.name}</h3>
                <p class="comp-tagline">${comp.tagline}</p>
                <div class="comp-services">
                    <span class="service-tag">${comp.specialty} Specialist</span>
                    <span class="service-tag">Vetted Premium</span>
                </div>
            </div>
            <div class="comp-footer">
                <div class="comp-meta-item">Projects: <span>${comp.completedProjectsCount + projectsCount}</span></div>
                <div class="comp-meta-item">Electricians: <span>${comp.electriciansCount + crewCount}</span></div>
            </div>
        `;
        
        // Click to scroll to contact with company prefilled if wanted, or just fancy effect
        card.addEventListener("click", () => {
            const selectCategory = document.getElementById("lead-category");
            if (selectCategory) {
                // Map specialty to option values
                if (comp.specialty === "High Voltage") selectCategory.value = "High Voltage";
                else if (comp.specialty === "Automation") selectCategory.value = "Automation";
                else if (comp.specialty === "Renewables") selectCategory.value = "Renewables";
            }
            
            document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
            showToast(`Sourcing request tailored for ${comp.name}`, "info");
        });

        grid.appendChild(card);
    });
}

function renderProjects() {
    const container = document.getElementById("projects-masonry-container");
    if (!container) return;
    container.innerHTML = "";

    state.projects.forEach((proj, index) => {
        const card = document.createElement("div");
        // Distribute sizing classes for premium masonry design
        let classStr = "project-card";
        if (index === 0) classStr += " project-card-large";
        if (index === 1) classStr += " project-card-wide";

        card.className = classStr;
        card.innerHTML = `
            <img class="project-img" src="${proj.image}" alt="${proj.title}" onerror="this.src='https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=600&q=80'">
            <div class="project-overlay">
                <span class="project-category">${proj.category}</span>
                <h3 class="project-title">${proj.title}</h3>
                <span class="project-scale"><i class="fa-solid fa-industry"></i> ${proj.scale}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderEmployees() {
    const container = document.getElementById("employees-grid-container");
    if (!container) return;
    container.innerHTML = "";

    state.employees.forEach(emp => {
        const initials = emp.name.split(" ").map(n => n[0]).join("");
        const card = document.createElement("div");
        card.className = "employee-card";
        card.innerHTML = `
            <div class="emp-avatar-wrapper">
                <div class="emp-avatar">${initials}</div>
                <div class="emp-exp-badge">${emp.experience} Yrs</div>
            </div>
            <h3>${emp.name}</h3>
            <p class="emp-role">${emp.role}</p>
            <div class="emp-skills">
                <span class="skill-badge">${emp.badge}</span>
                <span class="skill-badge">OSHA Vetted</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- Dashboard Module ---
function initDashboard() {
    const landingView = document.getElementById("landing-page-view");
    const dashView = document.getElementById("dashboard-page-view");
    
    // Trigger buttons
    const btnLogin = document.getElementById("btn-portal-login");
    const btnSignup = document.getElementById("btn-portal-signup");
    const heroBtnCreate = document.getElementById("hero-btn-create");
    const btnBack = document.getElementById("btn-back-to-landing");

    const openDashboard = () => {
        landingView.classList.add("hidden");
        dashView.classList.remove("hidden");
        document.body.classList.add("dashboard-mode");
        window.scrollTo({ top: 0 });
        
        // Re-draw chart on visible container
        setTimeout(drawAnalyticsChart, 150);
        showToast("Connected to ElectroSaaS Portal successfully.", "success");
    };

    const closeDashboard = () => {
        dashView.classList.add("hidden");
        landingView.classList.remove("hidden");
        document.body.classList.remove("dashboard-mode");
        renderLandingPage(); // Sync back changes
    };

    if (btnLogin) btnLogin.addEventListener("click", openDashboard);
    if (btnSignup) btnSignup.addEventListener("click", openDashboard);
    if (heroBtnCreate) heroBtnCreate.addEventListener("click", openDashboard);
    if (btnBack) btnBack.addEventListener("click", closeDashboard);

    // Sidebar tab selection
    const menuItems = document.querySelectorAll(".dash-menu-item");
    const tabs = document.querySelectorAll(".dash-tab-content");
    const activeBreadcrumb = document.getElementById("breadcrumb-active");

    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            menuItems.forEach(i => i.classList.remove("active"));
            tabs.forEach(t => t.classList.remove("active"));

            item.classList.add("active");
            const tabId = item.getAttribute("data-tab");
            document.getElementById(`tab-${tabId}`).classList.add("active");
            
            // Set breadcrumb
            activeBreadcrumb.innerText = item.innerText.trim();

            if (tabId === "overview" || tabId === "analytics") {
                setTimeout(drawAnalyticsChart, 100);
            }
        });
    });

    // Form: Profile Editor
    const profileForm = document.getElementById("dash-profile-form");
    profileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const activeComp = state.companies.find(c => c.id === ACTIVE_COMPANY_ID);
        if (activeComp) {
            activeComp.name = document.getElementById("edit-comp-name").value;
            activeComp.tagline = document.getElementById("edit-comp-tagline").value;
            activeComp.specialty = document.getElementById("edit-comp-specialty").value;
            activeComp.logoClass = document.getElementById("edit-comp-logo").value;
            activeComp.rating = document.getElementById("edit-comp-rating").value;
            activeComp.description = document.getElementById("edit-comp-description").value;

            state.activityLogs.unshift({
                text: "Updated company profile configuration",
                time: "Just now"
            });

            saveState();
            showToast("Company profile changes applied successfully!", "success");
            renderDashboard();
        }
    });

    // Modals open/close
    setupModal("btn-open-add-crew-modal", "btn-close-crew-modal", "modal-crew");
    setupModal("btn-open-add-project-modal", "btn-close-project-modal", "modal-project");

    // Modal Form: Add Crew Member
    const addCrewForm = document.getElementById("add-crew-form");
    addCrewForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const newCrew = {
            id: "emp-" + Date.now(),
            name: document.getElementById("crew-name").value,
            role: document.getElementById("crew-role").value,
            experience: parseInt(document.getElementById("crew-experience").value),
            badge: document.getElementById("crew-badge").value,
            companyId: ACTIVE_COMPANY_ID
        };

        state.employees.push(newCrew);
        state.activityLogs.unshift({
            text: `Added crew member: ${newCrew.name}`,
            time: "Just now"
        });

        saveState();
        showToast(`Crew member ${newCrew.name} added.`, "success");
        
        document.getElementById("modal-crew").classList.add("hidden");
        addCrewForm.reset();
        renderDashboard();
    });

    // Modal Form: Add Project
    const addProjForm = document.getElementById("add-project-form");
    addProjForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const newProj = {
            id: "proj-" + Date.now(),
            title: document.getElementById("project-title").value,
            category: document.getElementById("project-category").value,
            scale: document.getElementById("project-scale").value,
            image: document.getElementById("project-image-select").value,
            companyId: ACTIVE_COMPANY_ID
        };

        state.projects.push(newProj);
        state.activityLogs.unshift({
            text: `Published project: ${newProj.title}`,
            time: "Just now"
        });

        saveState();
        showToast(`Project ${newProj.title} published.`, "success");
        
        document.getElementById("modal-project").classList.add("hidden");
        addProjForm.reset();
        renderDashboard();
    });
}

function setupModal(openBtnId, closeBtnId, modalId) {
    const openBtn = document.getElementById(openBtnId);
    const closeBtn = document.getElementById(closeBtnId);
    const modal = document.getElementById(modalId);

    if (openBtn && modal) {
        openBtn.addEventListener("click", () => modal.classList.remove("hidden"));
    }
    if (closeBtn && modal) {
        closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
    }
}

// --- Render Dashboard Modules ---
function renderDashboard() {
    const activeComp = state.companies.find(c => c.id === ACTIVE_COMPANY_ID);
    if (!activeComp) return;

    // Set Sidebar info
    document.getElementById("current-user-company").innerText = activeComp.name;
    document.getElementById("current-user-avatar").innerText = activeComp.name.split(" ").map(n => n[0]).join("");

    // Set Form Editor initial values (only if not currently focused by user)
    const editName = document.getElementById("edit-comp-name");
    if (editName && document.activeElement !== editName) {
        editName.value = activeComp.name;
        document.getElementById("edit-comp-tagline").value = activeComp.tagline;
        document.getElementById("edit-comp-specialty").value = activeComp.specialty;
        document.getElementById("edit-comp-logo").value = activeComp.logoClass;
        document.getElementById("edit-comp-rating").value = activeComp.rating;
        document.getElementById("edit-comp-description").value = activeComp.description;
    }

    // Set Overview KPIs
    const activeLeadsCount = state.leads.filter(l => l.status === "pending").length;
    const publishedProjectsCount = state.projects.filter(p => p.companyId === ACTIVE_COMPANY_ID).length;
    const crewMembersCount = state.employees.filter(e => e.companyId === ACTIVE_COMPANY_ID).length;

    document.getElementById("kpi-active-leads").innerText = activeLeadsCount;
    document.getElementById("kpi-published-projects").innerText = publishedProjectsCount;
    document.getElementById("kpi-crew-members").innerText = crewMembersCount;
    
    // Sidebar leads badge
    const badge = document.getElementById("leads-count-badge");
    if (badge) {
        badge.innerText = activeLeadsCount;
        badge.style.display = activeLeadsCount > 0 ? "inline-block" : "none";
    }

    // System Logs Activity
    renderSystemLogs();

    // Crew Manager Table
    renderCrewTable();

    // Project Manager Table
    renderProjectTable();

    // Leads Inbox
    renderLeadsInbox();

    // Gallery Manager
    renderGalleryManager();
}

function renderSystemLogs() {
    const container = document.getElementById("activity-timeline-container");
    if (!container) return;
    container.innerHTML = "";

    state.activityLogs.slice(0, 4).forEach(log => {
        const item = document.createElement("div");
        item.className = "timeline-item";
        item.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <h5>${log.text}</h5>
                <p class="timeline-time"><i class="fa-regular fa-clock"></i> ${log.time}</p>
            </div>
        `;
        container.appendChild(item);
    });
}

function renderCrewTable() {
    const tbody = document.getElementById("dash-crew-table-body");
    if (!tbody) return;
    tbody.innerHTML = "";

    const activeCrew = state.employees.filter(e => e.companyId === ACTIVE_COMPANY_ID);

    activeCrew.forEach(emp => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${emp.name}</strong></td>
            <td>${emp.role}</td>
            <td>${emp.experience} Years</td>
            <td><span class="badge badge-active">${emp.badge}</span></td>
            <td>
                <button class="btn-icon btn-icon-danger" onclick="deleteCrewMember('${emp.id}')">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderProjectTable() {
    const tbody = document.getElementById("dash-projects-table-body");
    if (!tbody) return;
    tbody.innerHTML = "";

    const activeProj = state.projects.filter(p => p.companyId === ACTIVE_COMPANY_ID);

    activeProj.forEach(proj => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${proj.title}</strong></td>
            <td>${proj.category}</td>
            <td>${proj.scale}</td>
            <td><span class="badge badge-active"><i class="fa-solid fa-image"></i> Asset Linked</span></td>
            <td>
                <button class="btn-icon btn-icon-danger" onclick="deleteProject('${proj.id}')">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderLeadsInbox() {
    const container = document.getElementById("dash-leads-container");
    if (!container) return;
    container.innerHTML = "";

    const pendingLeads = state.leads.filter(l => l.status === "pending");

    if (pendingLeads.length === 0) {
        container.innerHTML = `
            <div class="gallery-drag-area" style="padding: 40px; margin-bottom: 0;">
                <div class="drag-icon" style="color: var(--color-success);"><i class="fa-solid fa-circle-check"></i></div>
                <h3>Your Lead Inbox is Clear!</h3>
                <p>Submit mock leads on the landing page contact form to see them instantly load here.</p>
            </div>
        `;
        return;
    }

    pendingLeads.forEach(lead => {
        const card = document.createElement("div");
        card.className = "lead-detail-card";
        card.innerHTML = `
            <div class="lead-main">
                <div class="lead-head-row">
                    <h3>${lead.company}</h3>
                    <div class="lead-badges">
                        <span class="badge badge-active">${lead.category}</span>
                        <span class="badge badge-pending">${lead.budget}</span>
                    </div>
                </div>
                <div class="lead-meta">
                    <span><i class="fa-solid fa-user"></i> Contact: ${lead.name}</span>
                    <span><i class="fa-solid fa-envelope"></i> ${lead.email}</span>
                    <span><i class="fa-regular fa-clock"></i> ${lead.time}</span>
                </div>
                <div class="lead-desc-box">
                    <strong>Project Scope:</strong><br>
                    ${lead.description}
                </div>
            </div>
            <div class="lead-actions">
                <button class="btn btn-primary btn-sm btn-block" onclick="acceptLead('${lead.id}')">
                    <i class="fa-solid fa-check"></i> Accept RFP
                </button>
                <button class="btn btn-secondary btn-sm btn-block" onclick="declineLead('${lead.id}')" style="color: var(--color-danger); border-color: rgba(239, 68, 68, 0.3)">
                    <i class="fa-solid fa-xmark"></i> Decline
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderGalleryManager() {
    const container = document.getElementById("gallery-grid-manager");
    if (!container) return;
    container.innerHTML = "";

    state.gallery.forEach((imgSrc, idx) => {
        const card = document.createElement("div");
        card.className = "gallery-manager-card";
        card.innerHTML = `
            <img src="${imgSrc}" alt="Gallery Asset" onerror="this.src='https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=300&q=80'">
            <div class="gallery-card-del" onclick="deleteGalleryItem(${idx})">
                <i class="fa-solid fa-trash"></i>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- Global Dynamic Actions called from tables ---
window.deleteCrewMember = function(id) {
    const empIndex = state.employees.findIndex(e => e.id === id);
    if (empIndex > -1) {
        const empName = state.employees[empIndex].name;
        state.employees.splice(empIndex, 1);
        state.activityLogs.unshift({
            text: `Removed crew member: ${empName}`,
            time: "Just now"
        });
        saveState();
        showToast(`Crew member ${empName} deleted.`, "info");
        renderDashboard();
    }
};

window.deleteProject = function(id) {
    const projIndex = state.projects.findIndex(p => p.id === id);
    if (projIndex > -1) {
        const title = state.projects[projIndex].title;
        state.projects.splice(projIndex, 1);
        state.activityLogs.unshift({
            text: `Deleted project: ${title}`,
            time: "Just now"
        });
        saveState();
        showToast(`Project ${title} deleted.`, "info");
        renderDashboard();
    }
};

window.acceptLead = function(id) {
    const lead = state.leads.find(l => l.id === id);
    if (lead) {
        lead.status = "accepted";
        state.activityLogs.unshift({
            text: `Accepted RFP Lead from ${lead.company}`,
            time: "Just now"
        });
        saveState();
        showToast(`RFP Lead accepted! Contact details sent to ${lead.email}`, "success");
        renderDashboard();
    }
};

window.declineLead = function(id) {
    const lead = state.leads.find(l => l.id === id);
    if (lead) {
        lead.status = "declined";
        state.activityLogs.unshift({
            text: `Declined RFP Lead from ${lead.company}`,
            time: "Just now"
        });
        saveState();
        showToast("Lead proposal declined.", "info");
        renderDashboard();
    }
};

window.deleteGalleryItem = function(idx) {
    state.gallery.splice(idx, 1);
    saveState();
    showToast("Gallery asset deleted.", "info");
    renderDashboard();
};

// --- Custom Toast System ---
function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let icon = '<i class="fa-solid fa-circle-check"></i>';
    if (type === "error") icon = '<i class="fa-solid fa-circle-exclamation"></i>';
    if (type === "info") icon = '<i class="fa-solid fa-circle-info"></i>';

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// --- Analytics Chart Draw (HTML5 Canvas) ---
function drawAnalyticsChart() {
    const canvas = document.getElementById("dashboard-leads-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    
    // Scale for high DPI displays
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Draw background grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    
    const columns = 6;
    const rows = 4;
    
    for (let i = 0; i <= columns; i++) {
        const x = (width / columns) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height - 20);
        ctx.stroke();
    }
    
    for (let j = 0; j <= rows; j++) {
        const y = ((height - 20) / rows) * j;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // Chart Data Points (Lead Count over last 6 weeks)
    const labels = ["Wk 21", "Wk 22", "Wk 23", "Wk 24", "Wk 25", "Wk 26"];
    const dataPoints = [4, 8, 5, 12, 9, 14];
    const maxVal = 16;

    // Map data points to coordinates
    const points = dataPoints.map((val, idx) => {
        return {
            x: (width / (columns - 1)) * idx,
            y: (height - 30) - ((val / maxVal) * (height - 50))
        };
    });

    // Draw Area Fill Gradient
    const fillGrad = ctx.createLinearGradient(0, 0, 0, height - 20);
    fillGrad.addColorStop(0, "rgba(0, 162, 255, 0.35)");
    fillGrad.addColorStop(1, "rgba(0, 162, 255, 0)");
    
    ctx.fillStyle = fillGrad;
    ctx.beginPath();
    ctx.moveTo(points[0].x, height - 20);
    for (let p of points) {
        ctx.lineTo(p.x, p.y);
    }
    ctx.lineTo(points[points.length - 1].x, height - 20);
    ctx.closePath();
    ctx.fill();

    // Draw glowing line
    ctx.strokeStyle = "rgb(0, 162, 255)";
    ctx.shadowColor = "rgba(0, 162, 255, 0.6)";
    ctx.shadowBlur = 10;
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let k = 1; k < points.length; k++) {
        ctx.lineTo(points[k].x, points[k].y);
    }
    ctx.stroke();
    
    // Reset shadow
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    // Draw circles at data points
    points.forEach((p, idx) => {
        ctx.fillStyle = "rgb(0, 162, 255)";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw tooltips / text above nodes
        ctx.fillStyle = "rgb(45, 170, 255)";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(dataPoints[idx], p.x, p.y - 10);
    });

    // Draw labels at bottom
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "9px 'Space Grotesk', sans-serif";
    ctx.textAlign = "center";
    
    points.forEach((p, idx) => {
        ctx.fillText(labels[idx], p.x, height - 5);
    });
}
