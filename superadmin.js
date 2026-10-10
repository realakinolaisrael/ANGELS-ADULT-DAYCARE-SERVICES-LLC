(() => {
  const store = window.angelsStore;
  const superLogin = document.getElementById('superLogin');
  const superApp = document.getElementById('superApp');
  const status = document.getElementById('superStatus');
  const loginStatus = document.getElementById('superLoginStatus');
  const setStatus = (element, message, type = '') => { element.textContent = message; element.className = `admin-status ${type}`; };
  if (!store) { setStatus(loginStatus, 'Local storage is unavailable in this browser.', 'error'); return; }

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));
  }

  function renderAccounts() {
    const accounts = store.getAccounts();
    document.getElementById('accountCount').textContent = `${accounts.length} staff account${accounts.length === 1 ? '' : 's'}`;
    document.getElementById('accountsTable').innerHTML = accounts.length ? accounts.map((account) => `
      <tr><td><strong>${escapeHtml(account.name)}</strong></td><td>${escapeHtml(account.role)}</td><td>${new Date(account.created_at).toLocaleDateString()}</td>
      <td>${account.active ? 'Active' : 'Revoked'}</td><td><button class="table-delete" data-id="${account.id}" type="button">${account.active ? 'Revoke' : 'Remove'}</button></td></tr>`).join('') : '<tr><td colspan="5">No staff access has been created.</td></tr>';
    document.querySelectorAll('#accountsTable button').forEach((button) => button.addEventListener('click', () => {
      const updated = store.getAccounts().filter((account) => account.id !== button.dataset.id);
      store.saveAccounts(updated);
      setStatus(status, 'Staff access removed.', 'success');
      renderAccounts();
    }));
  }

  function renderDiagnostics() {
    const keys = ['bookings', 'calls', 'staff_accounts', 'settings'];
    document.getElementById('diagnostics').innerHTML = keys.map((key) => `<div><span>${key}</span><strong>${store.read(key, []).length ?? Object.keys(store.read(key, {})).length}</strong></div>`).join('')
      + `<div><span>Browser</span><strong>${escapeHtml(navigator.userAgent.slice(0, 35))}</strong></div>`;
  }

  function loadApp() {
    superLogin.hidden = true;
    superApp.hidden = false;
    renderAccounts();
    renderDiagnostics();
  }

  document.getElementById('superLoginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    if (store.checkAdminPin(document.getElementById('superPin').value)) loadApp();
    else setStatus(loginStatus, 'Incorrect owner PIN.', 'error');
  });
  document.getElementById('superLogout').addEventListener('click', () => { superApp.hidden = true; superLogin.hidden = false; });
  document.getElementById('staffForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('staffName').value.trim();
    const accounts = store.getAccounts();
    if (name.toLowerCase() === 'owner' || accounts.some((account) => account.name.toLowerCase() === name.toLowerCase())) {
      setStatus(status, 'That access name is already in use.', 'error'); return;
    }
    accounts.push({ id: store.createId(), name, pin: document.getElementById('staffPin').value, role: document.getElementById('staffRole').value, active: true, created_at: new Date().toISOString() });
    store.saveAccounts(accounts);
    event.target.reset();
    setStatus(status, 'Staff access created.', 'success');
    renderAccounts();
  });
  document.getElementById('exportData').addEventListener('click', () => {
    const backup = { version: 1, exported_at: new Date().toISOString(), bookings: store.read('bookings', []), calls: store.read('calls', []), staff_accounts: store.getAccounts(), settings: store.read('settings', {}) };
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }));
    link.download = `angels-local-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    setStatus(status, 'Backup downloaded.', 'success');
  });
  document.getElementById('importData').addEventListener('change', (event) => {
    const file = event.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const backup = JSON.parse(reader.result);
        ['bookings', 'calls', 'staff_accounts', 'settings'].forEach((key) => { if (backup[key] !== undefined) store.write(key, backup[key]); });
        setStatus(status, 'Backup restored. Refreshing diagnostics.', 'success'); renderAccounts(); renderDiagnostics();
      } catch { setStatus(status, 'That backup file is not valid JSON.', 'error'); }
    };
    reader.readAsText(file);
  });
  document.getElementById('clearData').addEventListener('click', () => {
    if (!window.confirm('Clear all bookings and call notes? Staff access will remain.')) return;
    store.write('bookings', []); store.write('calls', []); setStatus(status, 'Bookings and calls cleared.', 'success'); renderDiagnostics();
  });
})();
