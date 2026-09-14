// ---------- Icon library (mapped from each Service's icon_key) ----------
const ICONS = {
  web: `<rect x="4" y="7" width="32" height="24" rx="2" stroke="#8FD9FF" stroke-width="1.3"/><path d="M4 13H36" stroke="#8FD9FF" stroke-width="1.3"/><circle cx="9" cy="10" r="0.9" fill="#8FD9FF"/><circle cx="13" cy="10" r="0.9" fill="#8FD9FF"/>`,
  mobile: `<rect x="12" y="4" width="16" height="32" rx="3" stroke="#8FD9FF" stroke-width="1.3"/><path d="M17 32H23" stroke="#8FD9FF" stroke-width="1.3"/>`,
  ai: `<circle cx="20" cy="20" r="4" stroke="#8FD9FF" stroke-width="1.3"/><circle cx="8" cy="10" r="2.5" stroke="#8FD9FF" stroke-width="1.2"/><circle cx="32" cy="10" r="2.5" stroke="#8FD9FF" stroke-width="1.2"/><circle cx="8" cy="30" r="2.5" stroke="#8FD9FF" stroke-width="1.2"/><circle cx="32" cy="30" r="2.5" stroke="#8FD9FF" stroke-width="1.2"/><path d="M17 18L10 12M23 18L30 12M17 22L10 28M23 22L30 28" stroke="#8FD9FF" stroke-width="1"/>`,
  security: `<path d="M20 4L33 10V19C33 27 27.5 32.5 20 36C12.5 32.5 7 27 7 19V10L20 4Z" stroke="#8FD9FF" stroke-width="1.3"/><path d="M15 20L18.5 23.5L26 15" stroke="#8FD9FF" stroke-width="1.3"/>`,
  generic: `<polygon points="20,4 36,20 20,36 4,20" stroke="#8FD9FF" stroke-width="1.3"/>`,
};

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

async function loadServices() {
  const mount = document.getElementById("services-mount");
  try {
    const res = await fetch("/api/services");
    const services = await res.json();
    if (!services.length) {
      mount.innerHTML = '<p class="loading-row">Services will appear here soon.</p>';
      return;
    }
    mount.innerHTML = services
      .map(
        (s) => `
      <div class="service-row">
        <svg class="service-icon" viewBox="0 0 40 40" fill="none">${ICONS[s.icon_key] || ICONS.generic}</svg>
        <h3>${escapeHtml(s.title)}</h3>
        <p>${escapeHtml(s.description)}</p>
      </div>`
      )
      .join("");
  } catch (e) {
    mount.innerHTML = '<p class="loading-row">Couldn\'t load services right now.</p>';
  }
}

async function loadWork() {
  const mount = document.getElementById("work-mount");
  try {
    const res = await fetch("/api/work");
    const projects = await res.json();
    if (!projects.length) {
      mount.innerHTML = '<p class="loading-row">Featured work coming soon.</p>';
      return;
    }
    mount.innerHTML = projects
      .map(
        (p) => `
      <div class="work-card">
        <div class="work-thumb" style="background:linear-gradient(135deg, ${p.color1} 0%, ${p.color2} 55%, ${p.color3} 100%);"></div>
        <div class="work-body">
          <span class="work-tag">${escapeHtml(p.tag)}</span>
          <h3>${escapeHtml(p.name)}</h3>
          <p>${escapeHtml(p.description)}</p>
        </div>
      </div>`
      )
      .join("");
  } catch (e) {
    mount.innerHTML = '<p class="loading-row">Couldn\'t load work right now.</p>';
  }
}

async function loadTestimonials() {
  const mount = document.getElementById("testimonials-mount");
  try {
    const res = await fetch("/api/testimonials");
    const items = await res.json();
    if (!items.length) {
      mount.innerHTML = '<p class="loading-row">Testimonials coming soon.</p>';
      return;
    }
    mount.innerHTML = items
      .map(
        (t) => `
      <div class="t-card">
        <blockquote>"${escapeHtml(t.quote)}"</blockquote>
        <div class="t-attrib">
          <div class="t-mark"><span>${escapeHtml(t.initials)}</span></div>
          <div><div class="t-name">${escapeHtml(t.name)}</div><div class="t-role">${escapeHtml(t.role)}</div></div>
        </div>
      </div>`
      )
      .join("");
  } catch (e) {
    mount.innerHTML = '<p class="loading-row">Couldn\'t load testimonials right now.</p>';
  }
}

function setupContactForm() {
  const form = document.getElementById("contact-form");
  const msg = document.getElementById("form-msg");
  const submitBtn = form.querySelector("button[type=submit]");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.className = "form-msg";
    msg.textContent = "";
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail ? JSON.stringify(body.detail) : "Something went wrong.");
      }
      msg.textContent = "Thanks — we'll be in touch shortly.";
      msg.className = "form-msg success";
      form.reset();
    } catch (err) {
      msg.textContent = "Couldn't send your message. Please try again.";
      msg.className = "form-msg error";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Book a Consultation";
    }
  });
}

// ---------- Subtle animated particle grid in hero background ----------
function setupGridCanvas() {
  const canvas = document.getElementById("grid-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, points = [];
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    const cols = Math.floor(w / (60 * devicePixelRatio));
    const rows = Math.floor(h / (60 * devicePixelRatio));
    points = [];
    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        points.push({ x: (i / cols) * w, y: (j / rows) * h, phase: Math.random() * Math.PI * 2 });
      }
    }
  }
  window.addEventListener("resize", resize);
  resize();

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(143,217,255,0.35)";
    for (const p of points) {
      const flicker = 0.3 + 0.3 * Math.sin(t * 0.4 + p.phase);
      ctx.globalAlpha = Math.max(0, flicker);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.4 * devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    t += 0.02;
    if (!prefersReduced) requestAnimationFrame(draw);
  }
  draw();
}

document.addEventListener("DOMContentLoaded", () => {
  setupGridCanvas();
  loadServices();
  loadWork();
  loadTestimonials();
  setupContactForm();
});
