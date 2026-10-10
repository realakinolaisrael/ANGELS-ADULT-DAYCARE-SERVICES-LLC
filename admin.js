(() => {
  const loginPanel = document.getElementById('loginPanel');
  const adminApp = document.getElementById('adminApp');
  const loginForm = document.getElementById('loginForm');
  const loginStatus = document.getElementById('loginStatus');
  const appStatus = document.getElementById('appStatus');
  const store = window.angelsStore;
  let isSettingPin = !store.hasAdminPin();

  if (!store) {
    loginStatus.textContent = 'Local storage is unavailable in this browser.';
    loginStatus.className = 'admin-status error';
    return;
  }

  const setStatus = (element, message, type = '') => {
    element.textContent = message;
    element.className = `admin-status ${type}`;
  };

  function updateLoginCopy() {
    const heading = loginPanel.querySelector('h1');
    const intro = loginPanel.querySelector(':scope > p:not(.section-tag)');
    const label = loginForm.querySelector('label');
    const button = loginForm.querySelector('button');
    if (isSettingPin) {
      heading.textContent = 'Create your admin PIN';
      intro.textContent = 'Choose a PIN for this browser to protect the local dashboard.';
      label.textContent = 'New admin PIN';
      button.textContent = 'Save PIN and continue';
    }
  }

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));
  }

  function loadBookings() {
    const filter = document.getElementById('bookingFilter').value;
    const allBookings = store.read('bookings', []);
    const bookings = filter === 'all' ? allBookings : allBookings.filter((booking) => booking.status === filter);
    const rows = document.getElementById('bookingsTable');
    rows.innerHTML = bookings.length ? bookings.map((booking) => `
      <tr>
        <td><strong>${escapeHtml(booking.name)}</strong><small>${escapeHtml(booking.email)}<br>${escapeHtml(booking.phone)}</small></td>
        <td>${escapeHtml(booking.appointment_type)}<small>${escapeHtml(booking.message)}</small></td>
        <td>${escapeHtml(booking.preferred_date || 'Flexible')}</td>
        <td><select class="booking-status" data-id="${booking.id}" aria-label="Status for ${escapeHtml(booking.name)}">
          ${['new', 'confirmed', 'completed', 'cancelled'].map((status) => `<option value="${status}" ${status === booking.status ? 'selected' : ''}>${status}</option>`).join('')}
        </select></td>
        <td><button class="table-delete" data-id="${booking.id}" type="button">Delete</button></td>
      </tr>`).join('') : '<tr><td colspan="5">No bookings found.</td></tr>';

    document.getElementById('newBookings').textContent = allBookings.filter((booking) => booking.status === 'new').length;
    document.getElementById('upcomingBookings').textContent = allBookings.filter((booking) => ['new', 'confirmed'].includes(booking.status)).length;
    document.getElementById('loggedCalls').textContent = store.read('calls', []).length;
    rows.querySelectorAll('.booking-status').forEach((select) => select.addEventListener('change', updateBooking));
    rows.querySelectorAll('.table-delete').forEach((button) => button.addEventListener('click', deleteBooking));
  }

  function updateBooking(event) {
    const bookings = store.read('bookings', []);
    const booking = bookings.find((item) => item.id === event.target.dataset.id);
    if (booking) booking.status = event.target.value;
    store.write('bookings', bookings);
    setStatus(appStatus, 'Booking status updated.', 'success');
    loadBookings();
  }

  function deleteBooking(event) {
    if (!window.confirm('Delete this booking? This cannot be undone.')) return;
    const bookings = store.read('bookings', []).filter((booking) => booking.id !== event.target.dataset.id);
    store.write('bookings', bookings);
    setStatus(appStatus, 'Booking deleted.', 'success');
    loadBookings();
  }

  function loadSettings() {
    const settings = store.read('settings', {
      booking_email: 'angelsadultdaycareservicesllc@gmail.com',
      phone: '(601) 480-6776',
      hours: 'Monday - Sunday, 7am - 5pm'
    });
    document.getElementById('settingsEmail').value = settings.booking_email;
    document.getElementById('settingsPhone').value = settings.phone;
    document.getElementById('settingsHours').value = settings.hours;
  }

  function loadApp() {
    loginPanel.hidden = true;
    adminApp.hidden = false;
    document.getElementById('adminEmail').textContent = 'Local admin';
    loadBookings();
    loadSettings();
  }

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const pin = document.getElementById('loginPassword').value;
    if (pin.length < 4) {
      setStatus(loginStatus, 'Use at least 4 characters for your PIN.', 'error');
      return;
    }
    if (isSettingPin) {
      store.setAdminPin(pin);
      isSettingPin = false;
      loadApp();
    } else if (store.checkAdminPin(pin)) {
      loadApp();
    } else {
      setStatus(loginStatus, 'Incorrect PIN.', 'error');
    }
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    adminApp.hidden = true;
    loginPanel.hidden = false;
    loginForm.reset();
    setStatus(loginStatus, 'Signed out.');
  });

  document.getElementById('bookingFilter').addEventListener('change', loadBookings);

  document.getElementById('callForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const calls = store.read('calls', []);
    calls.unshift({
      id: store.createId(),
      caller_name: document.getElementById('callName').value.trim(),
      phone: document.getElementById('callPhone').value.trim(),
      notes: document.getElementById('callNotes').value.trim(),
      created_at: new Date().toISOString()
    });
    store.write('calls', calls);
    event.target.reset();
    setStatus(appStatus, 'Call note saved.', 'success');
    loadBookings();
  });

  document.getElementById('settingsForm').addEventListener('submit', (event) => {
    event.preventDefault();
    store.write('settings', {
      booking_email: document.getElementById('settingsEmail').value.trim(),
      phone: document.getElementById('settingsPhone').value.trim(),
      hours: document.getElementById('settingsHours').value.trim()
    });
    setStatus(appStatus, 'Site settings saved on this browser.', 'success');
  });

  updateLoginCopy();
})();
