(() => {
  const form = document.querySelector('.appointment-form');
  if (!form || !window.angelsStore) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const values = new FormData(form);
    const bookings = window.angelsStore.read('bookings', []);

    bookings.unshift({
      id: window.angelsStore.createId(),
      name: values.get('Name'),
      email: values.get('Email'),
      phone: values.get('Phone'),
      preferred_date: values.get('Preferred date') || '',
      appointment_type: values.get('Appointment type'),
      message: values.get('Message') || '',
      status: 'new',
      created_at: new Date().toISOString()
    });

    if (!window.angelsStore.write('bookings', bookings)) {
      form.insertAdjacentHTML('afterbegin', '<p class="form-status error">We could not save your request. Please call us directly.</p>');
      return;
    }

    button.disabled = true;
    form.innerHTML = '<div class="form-status success"><strong>Thank you!</strong><br>Your appointment request has been saved. Our team will contact you soon.</div>';
  });
})();
