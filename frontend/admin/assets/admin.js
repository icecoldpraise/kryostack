const TOKEN_KEY = "kryostack_admin_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function logout() {
  localStorage.removeItem(TOKEN_KEY);
  window.location.href = "/admin/login.html";
}

// Wraps fetch(): adds the bearer token, and boots back to login on 401.
async function authFetch(path, options = {}) {
  const token = getToken();
  if (!token) {
    logout();
    return null;
  }
  const res = await fetch(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 401) {
    logout();
    return null;
  }
  return res;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function showBanner(key, type, text) {
  const el = document.getElementById(`banner-${key}`);
  if (!el) return;
  el.textContent = text;
  el.className = `banner show ${type}`;
  setTimeout(() => el.classList.remove("show"), 4000);
}

function formToPayload(formEl, numberFields = []) {
  const fd = new FormData(formEl);
  const payload = {};
  for (const [k, v] of fd.entries()) {
    if (k === "id") continue;
    payload[k] = numberFields.includes(k) ? Number(v) || 0 : v;
  }
  return payload;
}

// ---------------------------------------------------------------
// Generic CRUD wiring shared by Services / Projects / Testimonials
// ---------------------------------------------------------------
function setupCrud({ key, endpoint, addLabel, editLabel, numberFields, renderItem }) {
  const listEl = document.getElementById(`list-${key}`);
  const formEl = document.getElementById(`form-${key}`);
  const titleEl = document.getElementById(`form-title-${key}`);
  let currentItems = [];

  async function load() {
    const res = await authFetch(`/api/admin/${endpoint}`);
    if (!res) return;
    if (!res.ok) {
      listEl.innerHTML = '<p class="empty-state">Couldn\'t load this list.</p>';
      return;
    }
    currentItems = await res.json();
    if (!currentItems.length) {
      listEl.innerHTML = '<p class="empty-state">Nothing here yet — add your first one above.</p>';
      return;
    }
    listEl.innerHTML = currentItems.map(renderItem).join("");
    listEl.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = currentItems.find((i) => i.id === Number(btn.dataset.edit));
        if (item) openForm(item);
      });
    });
    listEl.querySelectorAll("[data-delete]").forEach((btn) => {
      btn.addEventListener("click", () => remove(Number(btn.dataset.delete)));
    });
  }

  function openForm(item) {
    formEl.style.display = "block";
    formEl.reset();
    if (item) {
      titleEl.textContent = editLabel;
      formEl.elements["id"].value = item.id;
      for (const key of Object.keys(item)) {
        if (formEl.elements[key]) formEl.elements[key].value = item[key];
      }
    } else {
      titleEl.textContent = addLabel;
      formEl.elements["id"].value = "";
    }
    formEl.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function closeForm() {
    formEl.style.display = "none";
    formEl.reset();
  }

  async function remove(id) {
    if (!confirm("Delete this item? This can't be undone.")) return;
    const res = await authFetch(`/api/admin/${endpoint}/${id}`, { method: "DELETE" });
    if (res && res.ok) {
      showBanner(key, "success", "Deleted.");
      load();
    } else {
      showBanner(key, "error", "Couldn't delete that item.");
    }
  }

  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = formEl.elements["id"].value;
    const payload = formToPayload(formEl, numberFields);
    const url = id ? `/api/admin/${endpoint}/${id}` : `/api/admin/${endpoint}`;
    const method = id ? "PUT" : "POST";
    const res = await authFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res && res.ok) {
      showBanner(key, "success", id ? "Changes saved." : "Added.");
      closeForm();
      load();
    } else {
      showBanner(key, "error", "Couldn't save. Check the fields and try again.");
    }
  });

  document.querySelector(`[data-add="${key}"]`)?.addEventListener("click", () => openForm(null));
  document.querySelector(`[data-cancel="${key}"]`)?.addEventListener("click", closeForm);

  load();
}

// ---------------------------------------------------------------
// Renderers
// ---------------------------------------------------------------
function renderServiceItem(item) {
  return `
    <div class="item-row">
      <div class="item-main">
        <h4>${escapeHtml(item.title)}</h4>
        <p>${escapeHtml(item.description)}</p>
        <div class="item-meta">Icon: ${escapeHtml(item.icon_key)} · Order: ${item.sort_order}</div>
      </div>
      <div class="item-actions">
        <button class="icon-btn" data-edit="${item.id}">Edit</button>
        <button class="icon-btn danger" data-delete="${item.id}">Delete</button>
      </div>
    </div>`;
}

function renderProjectItem(item) {
  return `
    <div class="item-row">
      <div class="item-main">
        <h4>${escapeHtml(item.name)} <span style="color:var(--muted-2); font-weight:400;">— ${escapeHtml(item.tag)}</span></h4>
        <p>${escapeHtml(item.description)}</p>
        <div class="item-meta">
          <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${item.color1};margin-right:4px;"></span>
          <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${item.color2};margin-right:4px;"></span>
          <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${item.color3};margin-right:8px;"></span>
          Order: ${item.sort_order}
        </div>
      </div>
      <div class="item-actions">
        <button class="icon-btn" data-edit="${item.id}">Edit</button>
        <button class="icon-btn danger" data-delete="${item.id}">Delete</button>
      </div>
    </div>`;
}

function renderTestimonialItem(item) {
  return `
    <div class="item-row">
      <div class="item-main">
        <h4>${escapeHtml(item.name)} <span style="color:var(--muted-2); font-weight:400;">— ${escapeHtml(item.role)}</span></h4>
        <p>"${escapeHtml(item.quote)}"</p>
        <div class="item-meta">Initials: ${escapeHtml(item.initials)} · Order: ${item.sort_order}</div>
      </div>
      <div class="item-actions">
        <button class="icon-btn" data-edit="${item.id}">Edit</button>
        <button class="icon-btn danger" data-delete="${item.id}">Delete</button>
      </div>
    </div>`;
}

function renderContactItem(item) {
  const date = new Date(item.created_at).toLocaleString();
  return `
    <div class="item-row">
      <div class="item-main">
        <h4>${escapeHtml(item.name)} <span style="color:var(--muted-2); font-weight:400;">— ${escapeHtml(item.email)}</span></h4>
        <p>${escapeHtml(item.message)}</p>
        <div class="item-meta">${date}</div>
      </div>
      <div class="item-actions">
        <button class="icon-btn danger" data-delete="${item.id}">Delete</button>
      </div>
    </div>`;
}

// ---------------------------------------------------------------
// Contacts (read + delete only, no form)
// ---------------------------------------------------------------
async function loadContacts() {
  const listEl = document.getElementById("list-contacts");
  const res = await authFetch("/api/admin/contacts");
  if (!res) return;
  if (!res.ok) {
    listEl.innerHTML = '<p class="empty-state">Couldn\'t load messages.</p>';
    return;
  }
  const items = await res.json();
  if (!items.length) {
    listEl.innerHTML = '<p class="empty-state">No messages yet.</p>';
    return;
  }
  listEl.innerHTML = items.map(renderContactItem).join("");
  listEl.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("Delete this message?")) return;
      const res = await authFetch(`/api/admin/contacts/${btn.dataset.delete}`, { method: "DELETE" });
      if (res && res.ok) {
        showBanner("contacts", "success", "Deleted.");
        loadContacts();
      }
    });
  });
}

// ---------------------------------------------------------------
// Settings: change password
// ---------------------------------------------------------------
function setupSettings() {
  const form = document.getElementById("form-password");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      current_password: form.current_password.value,
      new_password: form.new_password.value,
    };
    const res = await authFetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res && res.ok) {
      showBanner("settings", "success", "Password updated.");
      form.reset();
    } else {
      const body = res ? await res.json().catch(() => ({})) : {};
      showBanner("settings", "error", body.detail || "Couldn't update password.");
    }
  });
}

// ---------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------
function setupTabs() {
  const buttons = document.querySelectorAll(".side-nav button");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
      document.getElementById(`panel-${btn.dataset.panel}`).classList.add("active");
    });
  });
}

// ---------------------------------------------------------------
// Boot
// ---------------------------------------------------------------
async function init() {
  if (!getToken()) {
    window.location.href = "/admin/login.html";
    return;
  }

  const me = await authFetch("/api/auth/me");
  if (me && me.ok) {
    const data = await me.json();
    document.getElementById("who-label").textContent = `Signed in as ${data.username}`;
  }

  document.getElementById("logout-btn").addEventListener("click", logout);

  setupTabs();
  setupSettings();

  setupCrud({
    key: "services",
    endpoint: "services",
    addLabel: "Add service",
    editLabel: "Edit service",
    numberFields: ["sort_order"],
    renderItem: renderServiceItem,
  });

  setupCrud({
    key: "projects",
    endpoint: "projects",
    addLabel: "Add project",
    editLabel: "Edit project",
    numberFields: ["sort_order"],
    renderItem: renderProjectItem,
  });

  setupCrud({
    key: "testimonials",
    endpoint: "testimonials",
    addLabel: "Add testimonial",
    editLabel: "Edit testimonial",
    numberFields: ["sort_order"],
    renderItem: renderTestimonialItem,
  });

  loadContacts();
}

document.addEventListener("DOMContentLoaded", init);
