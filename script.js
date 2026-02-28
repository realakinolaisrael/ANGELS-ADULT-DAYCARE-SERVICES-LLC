// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    menuToggle.classList.toggle('active');
  });

  // Close menu when clicking a link
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.classList.remove('active');
    });
  });
}

// WhatsApp popup and tooltip
const waBtn = document.getElementById('waBtn');
const waPopup = document.getElementById('waPopup');
const waClose = document.getElementById('waClose');
const waWidget = document.querySelector('.wa-widget');

if (waBtn && waPopup && waClose) {
  waBtn.addEventListener('click', () => {
    waPopup.classList.toggle('open');
    // Hide tooltip when popup opens
    if (waWidget) {
      waWidget.classList.remove('show-tooltip');
    }
  });

  waClose.addEventListener('click', () => {
    waPopup.classList.remove('open');
  });

  // Close popup when clicking outside
  document.addEventListener('click', (e) => {
    if (!waPopup.contains(e.target) && !waBtn.contains(e.target)) {
      waPopup.classList.remove('open');
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      waPopup.classList.remove('open');
    }
  });
}

// Touch support for WhatsApp tooltip
if (waWidget) {
  let tooltipTimeout;
  
  // Show tooltip on touch (for mobile devices)
  waWidget.addEventListener('touchstart', (e) => {
    // Show tooltip
    waWidget.classList.add('show-tooltip');
    
    // Hide tooltip after 3 seconds
    clearTimeout(tooltipTimeout);
    tooltipTimeout = setTimeout(() => {
      waWidget.classList.remove('show-tooltip');
    }, 3000);
  }, { passive: true });
  
  // Show tooltip periodically to grab attention
  let attentionTimeout;
  const showAttentionTooltip = () => {
    // Only show if popup is not open
    if (waPopup && !waPopup.classList.contains('open')) {
      waWidget.classList.add('show-tooltip');
      
      setTimeout(() => {
        waWidget.classList.remove('show-tooltip');
      }, 4000);
    }
    
    // Show again after 30 seconds
    attentionTimeout = setTimeout(showAttentionTooltip, 30000);
  };
  
  // Start attention tooltip after 5 seconds on page load
  setTimeout(showAttentionTooltip, 5000);
  
  // Clear attention timeout when user interacts with widget
  waWidget.addEventListener('click', () => {
    clearTimeout(attentionTimeout);
    waWidget.classList.remove('show-tooltip');
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const headerHeight = document.querySelector('.header').offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Header background on scroll
const header = document.querySelector('.header');
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
    } else {
      header.style.boxShadow = 'none';
    }
  });
}

// ============================================
// FORM SECURITY & VALIDATION
// ============================================

// Application form security
const applicationForm = document.getElementById('applicationForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

if (applicationForm) {
  // Track form start time (bots submit too quickly)
  const formLoadTime = Date.now();
  
  // Character counter for cover letter
  const coverLetter = document.getElementById('coverLetter');
  const coverLetterCount = document.getElementById('coverLetterCount');
  
  if (coverLetter && coverLetterCount) {
    coverLetter.addEventListener('input', () => {
      coverLetterCount.textContent = coverLetter.value.length;
    });
  }
  
  // Sanitize input function - strip potential XSS
  function sanitizeInput(str) {
    if (!str) return '';
    return str
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
  
  // Validate email format
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Validate phone format
  function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\(\)\-\+]{10,20}$/;
    return phoneRegex.test(phone);
  }
  
  // Check for suspicious patterns (potential injection)
  function hasSuspiciousContent(str) {
    if (!str) return false;
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /data:/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /eval\s*\(/i,
      /expression\s*\(/i
    ];
    return suspiciousPatterns.some(pattern => pattern.test(str));
  }
  
  // Prevent double submission
  let isSubmitting = false;
  
  applicationForm.addEventListener('submit', function(e) {
    // Check honeypot fields (if filled, it's a bot)
    const honeypot1 = this.querySelector('input[name="website"]');
    const honeypot2 = this.querySelector('input[name="company"]');
    
    if ((honeypot1 && honeypot1.value) || (honeypot2 && honeypot2.value)) {
      e.preventDefault();
      return false;
    }
    
    // Check if form was submitted too quickly (less than 3 seconds - likely a bot)
    const submitTime = Date.now();
    if (submitTime - formLoadTime < 3000) {
      e.preventDefault();
      showFormStatus('Please take your time filling out the form.', 'error');
      return false;
    }
    
    // Prevent double submission
    if (isSubmitting) {
      e.preventDefault();
      return false;
    }
    
    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const position = document.getElementById('position').value;
    const availability = document.getElementById('availability').value;
    const coverLetterValue = document.getElementById('coverLetter').value.trim();
    const consent = document.getElementById('consent').checked;
    
    // Validate required fields
    if (!fullName || !email || !phone || !position || !availability || !coverLetterValue || !consent) {
      e.preventDefault();
      showFormStatus('Please fill in all required fields.', 'error');
      return false;
    }
    
    // Validate email
    if (!isValidEmail(email)) {
      e.preventDefault();
      showFormStatus('Please enter a valid email address.', 'error');
      document.getElementById('email').focus();
      return false;
    }
    
    // Validate phone
    if (!isValidPhone(phone)) {
      e.preventDefault();
      showFormStatus('Please enter a valid phone number.', 'error');
      document.getElementById('phone').focus();
      return false;
    }
    
    // Check for suspicious content
    const allInputs = [fullName, email, phone, coverLetterValue];
    const addressInput = document.getElementById('address');
    if (addressInput) allInputs.push(addressInput.value);
    const certInput = document.getElementById('certifications');
    if (certInput) allInputs.push(certInput.value);
    const refsInput = document.getElementById('references');
    if (refsInput) allInputs.push(refsInput.value);
    
    if (allInputs.some(input => hasSuspiciousContent(input))) {
      e.preventDefault();
      showFormStatus('Invalid characters detected. Please check your input.', 'error');
      return false;
    }
    
    // Validate file upload if present
    const resumeInput = document.getElementById('resume');
    if (resumeInput && resumeInput.files.length > 0) {
      const file = resumeInput.files[0];
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!allowedTypes.includes(file.type)) {
        e.preventDefault();
        showFormStatus('Please upload only PDF, DOC, or DOCX files.', 'error');
        return false;
      }
      
      if (file.size > maxSize) {
        e.preventDefault();
        showFormStatus('File size must be less than 5MB.', 'error');
        return false;
      }
    }
    
    // All validations passed - submit form
    isSubmitting = true;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    showFormStatus('Processing your application...', 'info');
    
    // Form will submit naturally to FormSubmit.co
  });
  
  function showFormStatus(message, type) {
    if (formStatus) {
      formStatus.textContent = message;
      formStatus.style.display = 'block';
      formStatus.className = 'form-status ' + type;
    }
  }
}

// Check for successful submission (redirect back with query param)
if (window.location.search.includes('submitted=true')) {
  const successBanner = document.createElement('div');
  successBanner.className = 'submission-success';
  successBanner.innerHTML = `
    <div class="container">
      <p><strong>Thank you!</strong> Your application has been submitted successfully. We'll be in touch soon.</p>
      <button onclick="this.parentElement.parentElement.remove(); history.replaceState({}, '', location.pathname);">×</button>
    </div>
  `;
  document.body.insertBefore(successBanner, document.body.firstChild);
}
