# v2 Features Documentation

## Orbit Wheel Animation

### Overview

The orbit wheel is the hero section's primary visual element on `index.html`. It creates a rotating circle of text items ("hooks", "intentions", "memory", etc.) with a physics-based interaction model.

### Technical Implementation

**File**: `js/wheel.js` (8.4KB)

**Core Mechanics**:

```javascript
// Physics constants
const SCROLL_SENSITIVITY = 0.003;
const FRICTION = 0.95;
const SNAP_STRENGTH = 0.02;

// State
let velocity = 0;
let targetAngle = 0;
let currentAngle = 0;
```

**Interaction Model**:
1. **Scroll Detection**: Listens to `wheel` events in middle 50% of viewport
2. **Velocity Calculation**: Scroll delta → angular velocity
3. **Friction**: Velocity decays over time (`velocity *= FRICTION`)
4. **Snapping**: Gently pulls to nearest item position
5. **Rendering**: Updates transforms via `requestAnimationFrame`

### Visual Effects

**Gaussian Blur Focus**:
```javascript
const distance = Math.abs(/* angle from front */);
const blurAmount = gaussianBlur(distance);
element.style.filter = `blur(${blurAmount}px)`;
```

Items at the front (right side) are sharp; items moving away blur smoothly.

**Opacity Gradient**:
```javascript
const opacity = Math.max(0.3, 1 - distance * 0.01);
element.style.opacity = opacity;
```

### Content

**30 Orbiting Items**:
- "Hooks"
- "Intentions"
- "Memory Forms"
- "Cognitive Architecture"
- "Self-Evolution"
- "Reproducibility"
- (... 24 more)

**Purpose**: Communicates key concepts of agent engineering at a glance.

### Performance

- **GPU-accelerated**: Uses CSS `transform: translate3d()`
- **60fps target**: Optimized animation loop
- **Responsive**: Scales with viewport size
- **No layout thrashing**: Batch DOM reads/writes

### Accessibility

- **Keyboard-friendly**: Wheel doesn't block navigation
- **Screen readers**: Text is readable (not obscured)
- **Motion preferences**: Could respect `prefers-reduced-motion` (future enhancement)

### Browser Compatibility

- Chrome/Edge 90+: Full support
- Firefox 88+: Full support
- Safari 14+: Full support (with `-webkit-backdrop-filter` prefixes)

---

## Dynamic Theme Manager

### Overview

Randomizes the website's accent color on each page load, creating visual variety while maintaining brand consistency.

### Technical Implementation

**File**: `js/theme-manager.js` (3.0KB)

**Color Palettes** (5 options):

```javascript
const themes = [
  { primary: 'rgb(99, 102, 241)', glow: 'rgba(99, 102, 241, 0.3)' },  // Indigo
  { primary: 'rgb(59, 130, 246)', glow: 'rgba(59, 130, 246, 0.3)' },  // Blue
  { primary: 'rgb(236, 72, 153)', glow: 'rgba(236, 72, 153, 0.3)' },  // Pink
  { primary: 'rgb(34, 197, 94)', glow: 'rgba(34, 197, 94, 0.3)' },    // Green
  { primary: 'rgb(251, 146, 60)', glow: 'rgba(251, 146, 60, 0.3)' }   // Orange
];
```

**CSS Variable Injection**:

```javascript
const theme = themes[Math.floor(Math.random() * themes.length)];
document.documentElement.style.setProperty('--primary', theme.primary);
document.documentElement.style.setProperty('--primary-glow', theme.glow);
```

### Profile Picture Randomization

**On `about.html` only**:

```javascript
if (document.getElementById('profile-image')) {
  const pic = Math.random() < 0.5 ? 'profile-pic1.png' : 'profile-pic2.png';
  document.getElementById('profile-image').src = `assets/images/${pic}`;
}
```

**Two profile images**:
- `profile-pic1.png` (239KB)
- `profile-pic2.png` (152KB)

**Purpose**: Adds personality, prevents visual staleness.

### User Experience Implications

**Positives**:
- Fresh feel on each visit
- Demonstrates dynamic capability
- Memorable "which color will I get?" moment

**Negatives**:
- No theme persistence (changes on every page load)
- Users can't choose preferred theme

**Future Enhancement**: Add `localStorage` to remember user's theme or allow manual selection.

### Performance

- **Execution time**: <5ms on modern browsers
- **Blocking**: Runs immediately on page load (minimal FOUC)
- **No external requests**: All logic is inline

---

## Blog Article System

### Overview

A client-side blog system using inline JavaScript. No backend, no build step, no database.

### Architecture

**File**: `blog.html` (11.4KB including inline JS)

**Data Structure**:

```javascript
const articles = [
  {
    id: 0,
    title: "Welcome to the Hadosh Academy Blog",
    date: "Nov 23, 2025",
    readTime: "2 min read",
    tags: ["News", "Vision"],
    content: `<h1>...</h1><p>...</p>` // Full HTML
  },
  // ... more articles
];
```

### UI Components

**Main Article Area**:
- Full article display
- Fade-in transition on article switch
- Responsive typography
- Tag badges
- Read time estimate

**Sidebar**:
- Sticky positioning (`position: sticky; top: 120px`)
- Article cards (title, date, tags, read time)
- Active article highlighting
- Click to switch articles

### Interaction

```javascript
function selectArticle(id) {
  activeId = id;
  const article = articles.find(a => a.id === id);
  
  // Fade out
  contentDiv.style.opacity = '0';
  
  // Replace content
  setTimeout(() => {
    contentDiv.innerHTML = article.content;
    contentDiv.style.opacity = '1';
  }, 200);
  
  // Update sidebar
  renderSidebar();
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
```

### Current Articles

1. **"Welcome to the Hadosh Academy Blog"** (published)
2. "The Death of the Chatbot" (coming soon)
3. "Why Agents Need Intentions" (coming soon)
4. "Memory Is Not Just Storage" (coming soon)

### Scalability

**Works well for**:
- 5-15 articles
- Primarily text content
- Infrequent updates (monthly)

**Breaks down when**:
- 20+ articles (page bloat)
- Rich media (videos, images)
- Frequent updates (editing HTML is tedious)

### Future Migration Path

When blog outgrows inline JS:

**Option 1: Static Site Generator**
- Convert to markdown files
- Use Eleventy, Hugo, or Jekyll
- Build step generates HTML
- Deploy to GitHub Pages

**Option 2: Headless CMS**
- Use Contentful, Sanity, or Strapi
- Fetch articles client-side via API
- Maintain static hosting

---

## FormSubmit Integration

### Overview

Contact form using FormSubmit.co, a free form backend service.

### Implementation

**File**: `contact.html`

**Form Configuration**:

```html
<form action="https://formsubmit.co/hadinayebi+hadoshacademy@earthone.life" method="POST">
  <!-- Hidden fields for FormSubmit config -->
  <input type="hidden" name="_subject" value="New Submission from Hadosh Academy Website">
  <input type="hidden" name="_next" value="https://hadosh-academy.github.io/thanks.html">
  <input type="hidden" name="_captcha" value="false">
  
  <!-- User fields -->
  <input type="text" name="name" required>
  <input type="email" name="email" required>
  <textarea name="message" required></textarea>
  
  <button type="submit">Send Message</button>
</form>
```

### FormSubmit Features Used

| Feature | Value | Purpose |
|---------|-------|---------|
| `_subject` | Custom subject line | Email identification |
| `_next` | `thanks.html` | Redirect after submit |
| `_captcha` | `false` | Disable reCAPTCHA |

### Flow

1. User fills form on `contact.html`
2. Clicks "Send Message"
3. FormSubmit receives POST request
4. Sends email to `hadinayebi+hadoshacademy@earthone.life`
5. Redirects to `thanks.html`

### Email Format

FormSubmit sends:

```
From: FormSubmit <noreply@formsubmit.co>
To: hadinayebi+hadoshacademy@earthone.life
Subject: New Submission from Hadosh Academy Website

Name: [user input]
Email: [user input]
Message: [user input]
```

### Advantages

- **No backend**: Zero server-side code
- **No API keys**: No authentication needed
- **Free**: No cost for basic usage
- **Reliable**: FormSubmit handles delivery
- **GDPR-friendly**: No data storage

### Limitations

- **No file uploads**: Text only
- **No custom validation**: Client-side only
- **Spam risk**: No built-in spam protection (captcha disabled)
- **Rate limits**: 50 submissions/month on free tier

### Alternative Services

If FormSubmit becomes insufficient:

- **Formspree**: Similar, more features
- **Netlify Forms**: Free with Netlify hosting
- **Google Forms**: Embed iframe
- **Custom backend**: Express.js + SendGrid

---

## 404 Page

### Overview

Custom 404 error page matching site design.

**File**: `404.html` (1.4KB)

### Features

- Matches main site design (glassmorphism, colors)
- Central circle UI element (consistent with design system)
- "Return Home" button
- Full navigation bar
- Custom footer

### GitHub Pages Configuration

**Required**: Add `404.html` to repository root

GitHub Pages automatically serves this file for:
- Non-existent pages (e.g., `/nonexistent-page`)
- Broken links
- Typos in URLs

### Content

```html
<h1 style="font-size: 6rem;">404</h1>
<p style="font-size: 1.5rem;">Page Not Found</p>
<a href="index.html" class="btn btn-primary">Return Home</a>
```

**Minimalist approach**: Simple message, clear action.

---

## Thanks Page

### Overview

Success page after contact form submission.

**File**: `thanks.html` (1.5KB)

### Purpose

- Confirms message sent
- Provides next action (return home)
- Maintains professional UX

### Flow Integration

```
contact.html (form) 
  → FormSubmit.co (processing) 
    → thanks.html (success)
```

### Content

```html
<h1>Message Sent!</h1>
<p>Thank you for reaching out. I will get back to you as soon as possible.</p>
<a href="index.html" class="btn btn-primary">Return Home</a>
```

### Future Enhancements

- Add "What happens next?" timeline
- Link to blog or other resources
- Social media links
- Estimated response time

---

## Summary

v2 features demonstrate modern web development capabilities while maintaining the project's core constraints:

- ✅ No frameworks (pure HTML/CSS/JS)
- ✅ No build step (manual editing)
- ✅ Static hosting (GitHub Pages)
- ✅ Fast performance (<25KB critical path)
- ✅ Accessibility (semantic HTML, keyboard nav)
- ✅ Responsive design (mobile-first)

These features transform the site from a simple landing page (v1) to a comprehensive web presence (v2) while respecting the "easy, smooth, relaxed" design philosophy.
