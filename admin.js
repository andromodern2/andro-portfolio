// Secret Owner Management Modal & Authentication
(function() {
  let isUnlocked = false;
  let cachedPasscode = '';

  // Inject Secret Modal HTML & CSS into the page
  const style = document.createElement('style');
  style.textContent = `
    .secret-trigger-dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.25);
      margin-left: 6px;
      vertical-align: middle;
      cursor: pointer;
      transition: background 0.3s ease, transform 0.2s ease;
    }
    .secret-trigger-dot:hover {
      background: #ff4811;
      transform: scale(1.6);
    }
    .owner-modal-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(6, 7, 9, 0.88);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      z-index: 99999;
      justify-content: center;
      align-items: center;
      padding: 20px;
      opacity: 0;
      transition: opacity 0.25s ease;
    }
    .owner-modal-backdrop.active {
      display: flex;
      opacity: 1;
    }
    .owner-modal-card {
      background: #111318;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 28px;
      width: 100%;
      max-width: 680px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 72, 17, 0.2);
      color: #fff;
      font-family: 'Plus Jakarta Sans', sans-serif;
      padding: 32px;
      position: relative;
    }
    .owner-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 18px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .owner-title-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .owner-title-badge span.pill {
      background: rgba(255, 72, 17, 0.2);
      color: #ff5424;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 999px;
      letter-spacing: 0.06em;
    }
    .owner-close-btn {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #aaa;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all 0.2s;
    }
    .owner-close-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
    }
    .owner-tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 12px;
    }
    .owner-tab-btn {
      background: transparent;
      border: none;
      color: #888;
      font-size: 13.5px;
      font-weight: 700;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .owner-tab-btn.active {
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
    }
    .form-group {
      margin-bottom: 18px;
    }
    .form-group label {
      display: block;
      font-size: 12.5px;
      font-weight: 700;
      color: #aaa;
      margin-bottom: 8px;
      letter-spacing: -0.01em;
    }
    .form-control {
      width: 100%;
      background: #171a22;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 12px 16px;
      color: #fff;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
    }
    .form-control:focus {
      border-color: #ff4811;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .btn-submit {
      background: #ff4811;
      color: #fff;
      border: none;
      border-radius: 999px;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 6px 20px rgba(255, 72, 17, 0.4);
      transition: transform 0.2s, background 0.2s;
      width: 100%;
      justify-content: center;
      margin-top: 10px;
    }
    .btn-submit:hover {
      background: #ff5a26;
      transform: translateY(-1px);
    }
    .owner-proj-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-height: 400px;
      overflow-y: auto;
    }
    .owner-proj-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #171a22;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 12px 16px;
      gap: 14px;
    }
    .owner-proj-info {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }
    .owner-proj-thumb {
      width: 48px;
      height: 36px;
      border-radius: 6px;
      object-fit: cover;
      background: #0a0b0e;
    }
    .owner-proj-text h4 {
      font-size: 14px;
      font-weight: 700;
      margin: 0 0 2px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .owner-proj-text span {
      font-size: 12px;
      color: #888;
    }
    .btn-delete-proj {
      background: rgba(255, 59, 48, 0.15);
      border: 1px solid rgba(255, 59, 48, 0.3);
      color: #ff5b5b;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .btn-delete-proj:hover {
      background: #ff3b30;
      color: #fff;
    }
    .auth-box {
      text-align: center;
      padding: 30px 10px;
    }
    .auth-box .lock-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: rgba(255, 72, 17, 0.15);
      color: #ff5424;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }
    .auth-status-msg {
      margin-top: 14px;
      font-size: 13px;
      min-height: 18px;
    }
    .shake {
      animation: modalShake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
    @keyframes modalShake {
      10%, 90% { transform: translate3d(-2px, 0, 0); }
      20%, 80% { transform: translate3d(4px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
      40%, 60% { transform: translate3d(6px, 0, 0); }
    }
    @media (max-width: 600px) {
      .owner-modal-card {
        padding: 22px 18px;
        border-radius: 22px;
        max-height: 92vh;
      }
      .owner-header {
        margin-bottom: 16px;
        padding-bottom: 14px;
      }
      .owner-title-badge {
        font-size: 15.5px;
      }
      .form-row {
        grid-template-columns: 1fr;
        gap: 12px;
      }
      .form-control {
        padding: 10px 14px;
        font-size: 13.5px;
      }
      .owner-tabs {
        overflow-x: auto;
        gap: 6px;
        padding-bottom: 8px;
      }
      .owner-tab-btn {
        padding: 6px 12px;
        font-size: 12px;
        white-space: nowrap;
      }
      .owner-proj-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
      .btn-delete-proj {
        align-self: flex-end;
      }
    }
  `;
  document.head.appendChild(style);

  // Create Modal element
  const modal = document.createElement('div');
  modal.className = 'owner-modal-backdrop';
  modal.id = 'ownerModal';
  modal.innerHTML = `
    <div class="owner-modal-card" id="ownerModalCard">
      <div class="owner-header">
        <div class="owner-title-badge">
          <span>Owner Control Center</span>
          <span class="pill">Secret Access</span>
        </div>
        <button class="owner-close-btn" id="closeOwnerModal">&times;</button>
      </div>

      <!-- Auth State: Passcode Lock -->
      <div id="ownerAuthView" class="auth-box">
        <div class="lock-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h3 style="font-size: 20px; font-weight: 800; margin-bottom: 8px;">Restricted Owner Access</h3>
        <p style="color: #888; font-size: 13.5px; margin-bottom: 24px;">Please enter your secret owner passcode to manage your sites and projects.</p>
        <form id="ownerAuthForm" style="max-width: 320px; margin: 0 auto;">
          <input type="password" id="ownerPasscode" class="form-control" placeholder="Enter owner passcode..." style="text-align: center; font-size: 16px; letter-spacing: 2px;" autofocus autocomplete="current-password" required>
          <button type="submit" class="btn-submit" style="margin-top: 16px;">Verify Identity</button>
        </form>
        <div id="authMsg" class="auth-status-msg"></div>
      </div>

      <!-- Dashboard View: Add / Manage Projects -->
      <div id="ownerDashboardView" style="display: none;">
        <div class="owner-tabs">
          <button class="owner-tab-btn active" data-tab="tabAdd">+ Add New Project</button>
          <button class="owner-tab-btn" data-tab="tabManage">Manage Projects (<span id="dashProjCount">0</span>)</button>
          <button class="owner-tab-btn" data-tab="tabSecurity">Passcode Security</button>
          <button class="owner-tab-btn" id="btnLockOwner" style="margin-left: auto; color: #ff5b5b;">🔒 Lock</button>
        </div>

        <!-- Tab: Add New Project -->
        <div id="tabAdd" class="owner-tab-pane">
          <form id="addProjectForm">
            <div class="form-row">
              <div class="form-group">
                <label>Project Title *</label>
                <input type="text" id="projTitle" class="form-control" placeholder="e.g. Solis Cybernetic Web" required>
              </div>
              <div class="form-group">
                <label>Category *</label>
                <select id="projCategory" class="form-control" required>
                  <option value="Web Applications">Web Applications</option>
                  <option value="Interactive & 3D">Interactive & 3D</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Brand Sites">Brand Sites</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Live Website URL</label>
                <input type="url" id="projLiveUrl" class="form-control" placeholder="https://example.com" value="https://">
              </div>
              <div class="form-group">
                <label>Completion Year</label>
                <input type="text" id="projYear" class="form-control" placeholder="2026" value="${new Date().getFullYear()}">
              </div>
            </div>

            <div class="form-group">
              <label>Tech Stack Tags (Comma separated)</label>
              <input type="text" id="projTags" class="form-control" placeholder="e.g. Next.js, WebGL, Tailwind, Three.js">
            </div>

            <div class="form-group">
              <label>Project Image / Screenshot</label>
              <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 8px;">
                <input type="file" id="projFileInput" accept="image/*" style="display: none;">
                <button type="button" id="btnPickFile" class="form-control" style="width: auto; cursor: pointer; background: #222632; font-weight: 700;">📁 Upload From Computer</button>
                <span id="fileNameLabel" style="font-size: 12px; color: #888;">or paste image URL below:</span>
              </div>
              <input type="text" id="projImageUrl" class="form-control" placeholder="e.g. assets/project1.jpg or uploaded image URL" value="assets/project1.jpg">
            </div>

            <div class="form-group">
              <label>Short Description *</label>
              <textarea id="projDesc" class="form-control" rows="3" placeholder="Briefly describe what this site or web app does and its impact..." required></textarea>
            </div>

            <button type="submit" class="btn-submit" id="btnSaveProj">🚀 Publish Project To Portfolio</button>
            <div id="addProjMsg" class="auth-status-msg" style="text-align: center;"></div>
          </form>
        </div>

        <!-- Tab: Manage Projects -->
        <div id="tabManage" class="owner-tab-pane" style="display: none;">
          <div class="owner-proj-list" id="ownerProjList">
            <!-- Rendered dynamically -->
          </div>
        </div>

        <!-- Tab: Change Passcode -->
        <div id="tabSecurity" class="owner-tab-pane" style="display: none;">
          <form id="changePasscodeForm" style="max-width: 400px; margin: 0 auto; padding: 20px 0;">
            <div class="form-group">
              <label>Current Passcode</label>
              <input type="password" id="currPass" class="form-control" required>
            </div>
            <div class="form-group">
              <label>New Secret Passcode</label>
              <input type="password" id="newPass" class="form-control" required minlength="3">
            </div>
            <button type="submit" class="btn-submit">Update Owner Passcode</button>
            <div id="changePassMsg" class="auth-status-msg" style="text-align: center;"></div>
          </form>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Secret Triggers Setup
  function openOwnerPortal() {
    modal.classList.add('active');
    if (isUnlocked) {
      document.getElementById('ownerAuthView').style.display = 'none';
      document.getElementById('ownerDashboardView').style.display = 'block';
      loadAdminProjects();
    } else {
      document.getElementById('ownerAuthView').style.display = 'block';
      document.getElementById('ownerDashboardView').style.display = 'none';
      setTimeout(() => document.getElementById('ownerPasscode').focus(), 100);
    }
  }

  function closeOwnerPortal() {
    modal.classList.remove('active');
  }

  document.getElementById('closeOwnerModal').addEventListener('click', closeOwnerPortal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeOwnerPortal();
  });

  // Keyboard shortcut: Ctrl + Shift + O (Owner)
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'O' || e.key === 'o' || e.key === 'P' || e.key === 'p')) {
      e.preventDefault();
      openOwnerPortal();
    }
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeOwnerPortal();
    }
  });

  // Secret dot in footer
  document.querySelectorAll('.secret-trigger-dot, .secret-owner-btn').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openOwnerPortal();
    });
  });

  // Triple-click logo trigger
  let logoClicks = 0;
  let logoTimer = null;
  document.querySelectorAll('.brand-logo').forEach(logo => {
    logo.addEventListener('click', (e) => {
      logoClicks++;
      clearTimeout(logoTimer);
      if (logoClicks >= 3) {
        logoClicks = 0;
        e.preventDefault();
        openOwnerPortal();
      } else {
        logoTimer = setTimeout(() => { logoClicks = 0; }, 600);
      }
    });
  });

  // Tab switching
  const tabs = document.querySelectorAll('.owner-tab-btn[data-tab]');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.owner-tab-pane').forEach(p => p.style.display = 'none');
      btn.classList.add('active');
      const target = document.getElementById(btn.getAttribute('data-tab'));
      if (target) target.style.display = 'block';
      if (btn.getAttribute('data-tab') === 'tabManage') {
        loadAdminProjects();
      }
    });
  });

  // File upload handler
  const btnPickFile = document.getElementById('btnPickFile');
  const projFileInput = document.getElementById('projFileInput');
  const projImageUrl = document.getElementById('projImageUrl');
  const fileNameLabel = document.getElementById('fileNameLabel');

  btnPickFile.addEventListener('click', () => projFileInput.click());
  projFileInput.addEventListener('change', async () => {
    const file = projFileInput.files[0];
    if (!file) return;

    fileNameLabel.textContent = 'Uploading ' + file.name + '...';
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target.result;
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            passcode: cachedPasscode,
            filename: file.name,
            data: base64Data
          })
        });
        const data = await res.json();
        if (data.success) {
          projImageUrl.value = data.url;
          fileNameLabel.textContent = '✓ Uploaded: ' + file.name;
        } else {
          fileNameLabel.textContent = 'Upload failed: ' + (data.message || 'Error');
        }
      } catch (err) {
        fileNameLabel.textContent = 'Upload failed: ' + err.message;
      }
    };
    reader.readAsDataURL(file);
  });

  // Verify Passcode
  const authForm = document.getElementById('ownerAuthForm');
  const authMsg = document.getElementById('authMsg');
  const card = document.getElementById('ownerModalCard');

  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const enteredPass = document.getElementById('ownerPasscode').value.trim();
    authMsg.innerHTML = '<span style="color:#aaa;">Verifying passcode...</span>';

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: enteredPass })
      });
      const data = await res.json();
      if (data.success) {
        isUnlocked = true;
        cachedPasscode = enteredPass;
        sessionStorage.setItem('ownerAuth', enteredPass);
        authMsg.innerHTML = '<span style="color:#4cd964;">✓ Access Granted</span>';
        setTimeout(() => {
          document.getElementById('ownerAuthView').style.display = 'none';
          document.getElementById('ownerDashboardView').style.display = 'block';
          loadAdminProjects();
        }, 300);
      } else {
        authMsg.innerHTML = '<span style="color:#ff4b4b;">✕ Access Denied: Incorrect passcode</span>';
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 400);
        document.getElementById('ownerPasscode').value = '';
      }
    } catch (err) {
      authMsg.innerHTML = '<span style="color:#ff4b4b;">Server error during verification</span>';
    }
  });

  // Lock button
  document.getElementById('btnLockOwner').addEventListener('click', () => {
    isUnlocked = false;
    cachedPasscode = '';
    sessionStorage.removeItem('ownerAuth');
    document.getElementById('ownerDashboardView').style.display = 'none';
    document.getElementById('ownerAuthView').style.display = 'block';
    document.getElementById('ownerPasscode').value = '';
    authMsg.innerHTML = '';
  });

  // Add Project
  const addForm = document.getElementById('addProjectForm');
  const addMsg = document.getElementById('addProjMsg');

  addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    addMsg.innerHTML = '<span style="color:#aaa;">Saving project...</span>';

    const projectData = {
      passcode: cachedPasscode,
      title: document.getElementById('projTitle').value.trim(),
      category: document.getElementById('projCategory').value,
      liveUrl: document.getElementById('projLiveUrl').value.trim(),
      year: document.getElementById('projYear').value.trim(),
      tags: document.getElementById('projTags').value.trim(),
      image: document.getElementById('projImageUrl').value.trim(),
      description: document.getElementById('projDesc').value.trim()
    };

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      const data = await res.json();
      if (data.success) {
        addMsg.innerHTML = '<span style="color:#4cd964;">✓ Project successfully published!</span>';
        addForm.reset();
        document.getElementById('projImageUrl').value = 'assets/project1.jpg';
        fileNameLabel.textContent = '';
        setTimeout(() => {
          addMsg.innerHTML = '';
          // Refresh project displays on page if function exists
          if (window.refreshProjectsList) window.refreshProjectsList();
        }, 1200);
      } else {
        addMsg.innerHTML = `<span style="color:#ff4b4b;">Error: ${data.message}</span>`;
      }
    } catch (err) {
      addMsg.innerHTML = `<span style="color:#ff4b4b;">Error: ${err.message}</span>`;
    }
  });

  // Load projects in admin list
  async function loadAdminProjects() {
    try {
      const res = await fetch('/api/projects');
      const list = await res.json();
      document.getElementById('dashProjCount').textContent = list.length;
      const container = document.getElementById('ownerProjList');

      if (list.length === 0) {
        container.innerHTML = '<div style="text-align:center;color:#888;padding:20px;">No projects in portfolio yet.</div>';
        return;
      }

      container.innerHTML = list.map(p => `
        <div class="owner-proj-row">
          <div class="owner-proj-info">
            <img src="${p.image}" class="owner-proj-thumb" onerror="this.src='assets/card1.jpg'">
            <div class="owner-proj-text">
              <h4>${escapeHtml(p.title)}</h4>
              <span>${escapeHtml(p.category)} · ${escapeHtml(p.year || '')}</span>
            </div>
          </div>
          <button class="btn-delete-proj" data-id="${p.id}">Delete</button>
        </div>
      `).join('');

      container.querySelectorAll('.btn-delete-proj').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.getAttribute('data-id');
          if (!confirm('Are you sure you want to delete this project?')) return;
          try {
            const delRes = await fetch('/api/projects/' + id, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ passcode: cachedPasscode })
            });
            const delData = await delRes.json();
            if (delData.success) {
              loadAdminProjects();
              if (window.refreshProjectsList) window.refreshProjectsList();
            }
          } catch (err) {
            alert('Failed to delete project: ' + err.message);
          }
        });
      });
    } catch (e) {
      console.error('Failed to load admin projects:', e);
    }
  }

  // Change Passcode Form
  const changePassForm = document.getElementById('changePasscodeForm');
  const changePassMsg = document.getElementById('changePassMsg');
  changePassForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    changePassMsg.innerHTML = '<span style="color:#aaa;">Updating passcode...</span>';

    try {
      const res = await fetch('/api/change-passcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPasscode: document.getElementById('currPass').value.trim(),
          newPasscode: document.getElementById('newPass').value.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        changePassMsg.innerHTML = '<span style="color:#4cd964;">✓ Passcode updated successfully!</span>';
        cachedPasscode = document.getElementById('newPass').value.trim();
        sessionStorage.setItem('ownerAuth', cachedPasscode);
        changePassForm.reset();
      } else {
        changePassMsg.innerHTML = `<span style="color:#ff4b4b;">Error: ${data.message}</span>`;
      }
    } catch (err) {
      changePassMsg.innerHTML = `<span style="color:#ff4b4b;">Error: ${err.message}</span>`;
    }
  });

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[m]);
  }

  // Restore session if active
  const storedAuth = sessionStorage.getItem('ownerAuth');
  if (storedAuth) {
    cachedPasscode = storedAuth;
    isUnlocked = true;
  }

  window.openOwnerPortal = openOwnerPortal;
})();
