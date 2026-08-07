const siteData = {
  taglines: [
    "Brand identity that moves people.",
    "Design systems built for growth.",
    "Digital experiences made with purpose.",
    "Launch-ready websites that feel timeless.",
  ],
  heroHighlights: [
    "Brand-forward web experiences",
    "Modern UI systems and interfaces",
    "Launch-ready sites and product pages",
  ],
  services: [
    {
      title: "Brand Identity",
      description: "Positioning, messaging, and visual direction that feel true to your story.",
      icon: `
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="18" stroke="#DDE8FF" stroke-width="4" />
          <path d="M16 24C16 18.477 20.477 14 26 14" stroke="#7C9DFF" stroke-width="4" stroke-linecap="round" />
          <path d="M22 28L28 24L22 20" stroke="#4CE0C2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      `,
    },
    {
      title: "Web Design",
      description: "Elegant interfaces designed for clarity, personality, and conversion.",
      icon: `
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="12" width="32" height="24" rx="6" fill="#0E2131" stroke="#7C9DFF" stroke-width="4" />
          <path d="M16 20H32" stroke="#DDE8FF" stroke-width="3" stroke-linecap="round" />
          <path d="M16 26H28" stroke="#DDE8FF" stroke-width="3" stroke-linecap="round" />
          <circle cx="16" cy="34" r="2" fill="#4CE0C2" />
          <circle cx="22" cy="34" r="2" fill="#4CE0C2" />
        </svg>
      `,
    },
    {
      title: "Development",
      description: "Responsive, performant builds that bring your product to life online.",
      icon: `
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 14L10 24L18 34" stroke="#DDE8FF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M30 14L38 24L30 34" stroke="#DDE8FF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M18 24H30" stroke="#7C9DFF" stroke-width="4" stroke-linecap="round" />
        </svg>
      `,
    },
  ],
  mission: {
    headline: "Helping businesses express their identity through strategic, timeless, and memorable logo design.",
    text: "To help businesses express their identity through strategic, timeless, and memorable logo design that builds recognition, trust, and lasting value.",
  },
};

function updateYear() {
  const yearEl = document.getElementById('footer-year');
  const year = new Date().getFullYear();
  if (yearEl) {
    yearEl.textContent = `© ${year} CYRS STUDIO`;
  }
}

function renderHighlights() {
  const highlightList = document.getElementById('highlight-list');
  if (!highlightList) return;
  highlightList.innerHTML = siteData.heroHighlights
    .map((item) => `<li>${item}</li>`)
    .join('');
}

function rotateTagline() {
  const taglineEl = document.getElementById('dynamic-tagline');
  if (!taglineEl) return;
  let index = 0;
  setInterval(() => {
    index = (index + 1) % siteData.taglines.length;
    taglineEl.classList.remove('visible');
    setTimeout(() => {
      taglineEl.textContent = siteData.taglines[index];
      taglineEl.classList.add('visible');
    }, 280);
  }, 4800);
}

function revealOnScroll() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    },
  );

  document.querySelectorAll('.fade-in').forEach((node) => observer.observe(node));
}

function renderServices() {
  const servicesGrid = document.getElementById('services-grid');
  if (!servicesGrid) return;
  servicesGrid.innerHTML = siteData.services
    .map(
      (service) => `
        <article class="info-card fade-in">
          <div class="card-icon">${service.icon}</div>
          <h3>${service.title}</h3>
          <p>${service.description}</p>
        </article>
      `,
    )
    .join('');
}

function init() {
  updateYear();
  renderHighlights();
  renderServices();
  revealOnScroll();
  rotateTagline();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
