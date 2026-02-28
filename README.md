# ANGELS ADULT DAYCARE SERVICES LLC - Website

A modern, responsive website for ANGELS ADULT DAYCARE SERVICES LLC, a compassionate adult daycare facility located in Meridian, Mississippi.

---

## 📁 Project Structure

```
ANGELS-ADULT-DAYCARE-SERVICES-LLC/
├── index.html          # Main landing page
├── about.html          # About page with company story & Board of Directors
├── careers.html        # Job listings & application form
├── styles.css          # All CSS styles (single file)
├── script.js           # JavaScript functionality
├── intro-video.mp4     # Hero section background video
├── media/              # Image assets
│   ├── social-worker-taking-care-senior-woman.jpg
│   ├── nurse-helping-senior-patient.jpg
│   ├── happy-seniors-activity.jpg
│   └── director-placeholder-*.jpg   # Board of Directors photos
└── README.md           # This documentation
```

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic markup |
| **CSS3** | Styling with CSS variables, Flexbox, Grid |
| **Vanilla JavaScript** | Interactivity (no frameworks) |
| **Google Fonts** | Typography (DM Sans, Playfair Display) |
| **FormSubmit.co** | Form handling (no backend required) |

---

## 🎨 Design System

### Colors (CSS Variables)

Located in `styles.css` under `:root`:

```css
--primary: #2d5a4a;        /* Main green */
--primary-dark: #1e3d32;   /* Darker green */
--primary-light: #e8f0ed;  /* Light green background */
--accent: #c9a962;         /* Gold accent */
--charcoal: #3d3a36;       /* Text color */
--cream: #f4f1eb;          /* Background sections */
--off-white: #f8f7f4;      /* Alternate background */
```

### Typography

- **Body text:** DM Sans (400, 500, 600, 700)
- **Headlines:** Playfair Display (500, 600, 700)
- **Font sizes:** Use `rem` units throughout

### Spacing & Layout

- **Container max-width:** 1200px
- **Section padding:** 5rem (desktop), 3rem (mobile)
- **Border radius:** `--radius-sm` (8px), `--radius-md` (12px), `--radius-lg` (20px)

---

## 📄 Page Breakdown

### index.html (Home)
- **Hero Section:** Full-screen video background with overlay
- **About Preview:** Image + text grid
- **Services Section:** 6-card grid layout
- **Gallery Section:** 3-image showcase
- **CTA Banner:** Call-to-action with contact info
- **Footer:** 4-column grid with social icons
- **WhatsApp Widget:** Floating button with popup

### about.html (About Us)
- **Story Section:** Text + image layout
- **Mission/Vision/Values:** 3-card grid
- **What Sets Us Apart:** Feature list
- **Board of Directors:** 4-person team grid
- **CTA Banner:** Careers redirect

### careers.html (Careers)
- **Why Work Here:** Benefits + image
- **Job Listings:** 4-card grid (CNA, Activity Coordinator, Caregiver, Admin)
- **Application Form:** Full form with file upload

---

## 🔒 Security Features

### HTTP Security Headers (Meta Tags)

All HTML files include:

```html
<meta http-equiv="X-Content-Type-Options" content="nosniff" />
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN" />
<meta name="referrer" content="strict-origin-when-cross-origin" />
<meta http-equiv="Content-Security-Policy" content="..." />
```

### Form Protection (careers.html)

1. **reCAPTCHA** - Enabled via FormSubmit.co (`_captcha` = true)
2. **Honeypot Fields** - 3 hidden fields to catch bots:
   - `_honey` (FormSubmit default)
   - `website` (custom)
   - `company` (custom)
3. **Input Validation** - HTML5 patterns + maxlength attributes
4. **File Validation** - Accepts only PDF, DOC, DOCX (max 5MB)

### JavaScript Validation (script.js)

- **Time-based detection:** Rejects forms submitted in < 3 seconds
- **XSS pattern blocking:** Detects `<script>`, `javascript:`, `onerror=`, etc.
- **Double submission prevention:** Disables button after first click
- **Input sanitization:** Escapes `<`, `>`, `"`, `'`, `/`

---

## 📝 Form Configuration

The application form uses [FormSubmit.co](https://formsubmit.co/) - a free form backend service.

### Setup Required

1. **Update email** in `careers.html` (line ~217):
   ```html
   action="https://formsubmit.co/YOUR-ACTUAL-EMAIL@example.com"
   ```

2. **Activate form:** After first submission, check your email to confirm

3. **Update redirect URL** (optional):
   ```html
   <input type="hidden" name="_next" value="https://your-domain.com/careers.html?submitted=true">
   ```

### Form Fields

| Field | Name | Required | Validation |
|-------|------|----------|------------|
| Full Name | `fullName` | Yes | Letters, spaces, hyphens |
| Email | `email` | Yes | Email pattern |
| Phone | `phone` | Yes | Digits, spaces, parentheses |
| Address | `address` | No | Max 200 chars |
| Position | `position` | Yes | Select dropdown |
| Availability | `availability` | Yes | Select dropdown |
| Start Date | `startDate` | No | Date picker |
| Experience | `experience` | No | Select dropdown |
| Certifications | `certifications` | No | Max 200 chars |
| Education | `education` | No | Select dropdown |
| Resume | `resume` | No | PDF/DOC/DOCX, 5MB |
| Cover Letter | `coverLetter` | Yes | Max 2000 chars |
| References | `references` | No | Max 1000 chars |
| Consent | `consent` | Yes | Checkbox |

---

## 📱 Responsive Breakpoints

```css
/* Tablet and below */
@media (max-width: 900px) {
  /* 2-column grids become 1-column */
  /* Navigation becomes hamburger menu */
}

/* Mobile */
@media (max-width: 600px) {
  /* Smaller padding, font sizes */
  /* Team grid stacks to single column */
}
```

---

## 🚀 Deployment

This is a static website - deploy to any static hosting:

| Platform | Command/Method |
|----------|----------------|
| **GitHub Pages** | Push to `gh-pages` branch or enable in Settings |
| **Netlify** | Drag & drop folder or connect Git repo |
| **Vercel** | Connect Git repo, auto-deploys on push |
| **Traditional** | FTP upload all files to web root |

### For Production

1. Replace placeholder images in `about.html` (Board of Directors)
2. Update FormSubmit email in `careers.html`
3. Add actual social media URLs in footer
4. Add your `intro-video.mp4` to root directory
5. Optimize images (compress JPGs)

---

## 🔧 Customization Guide

### Adding New Pages

1. Copy `about.html` as template
2. Update `<title>` and `<meta description>`
3. Keep header and footer intact
4. Add content between header and footer
5. Update navigation in ALL HTML files

### Modifying Colors

Edit CSS variables in `styles.css` (lines 1-30):

```css
:root {
  --primary: #YOUR_COLOR;
  /* etc. */
}
```

### Adding New Job Listings

Copy a `.job-card` block in `careers.html` and update:
- Job type span
- Job title (h3)
- Description (p)
- Requirements list

### Adding Team Members

Copy a `.team-card` block in `about.html` and update:
- Image path
- Name (h4)
- Title (p)

---

## 📞 Contact Information

**Business Contact:**
- Address: 5150 29th Avenue Suite 200, Meridian, MS 39305
- Phone: +1 (601) 480-6776
- WhatsApp: +1 (601) 480-6776

---

## 📋 Maintenance Checklist

- [ ] Update copyright year in footer (auto-updates via JS)
- [ ] Replace director placeholder images
- [ ] Configure FormSubmit email
- [ ] Add actual social media links
- [ ] Add intro video file
- [ ] Test form submission
- [ ] Test mobile responsiveness
- [ ] Verify all links work

---

## 📜 License

© 2026 ANGELS ADULT DAYCARE SERVICES LLC. All rights reserved.

---

*Last updated: February 2026*