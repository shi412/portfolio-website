/* ══════════════════════════════════════════════════════════════
   SHIBIN PORTFOLIO — JAVASCRIPT
   Particles · Typewriter · Nav · AOS · Filters · Form
   Enhanced: Cursor follower, 3D parallax, card tilt, loading
             screen, dynamic grid, interactive blob, count-up
══════════════════════════════════════════════════════════════ */

'use strict';

// ─── GLOBAL MOUSE STATE ────────────────────────────────────────
const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
const isMobile = window.matchMedia('(hover: none)').matches || window.innerWidth < 768;

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}, { passive: true });

// ─── 0. ANIMATED LOADING SCREEN ───────────────────────────────
(function initLoadingScreen() {
  const screen = document.getElementById('loadingScreen');
  const barFill = document.getElementById('loaderBarFill');
  const status = document.getElementById('loaderStatus');
  if (!screen) return;

  const messages = [
    'Initializing...',
    'Loading assets...',
    'Preparing effects...',
    'Rendering particles...',
    'Almost ready...',
  ];

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress > 100) progress = 100;
    barFill.style.width = progress + '%';
    const msgIdx = Math.min(Math.floor(progress / 22), messages.length - 1);
    status.textContent = messages[msgIdx];
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        screen.classList.add('hidden');
        document.body.style.overflow = '';
      }, 400);
    }
  }, 200);

  // Prevent scroll during loading
  document.body.style.overflow = 'hidden';
})();

// ─── 1. AOS INIT ───────────────────────────────────────────────
AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: true,
  offset: 80,
});

// ─── 2. GLOWING CURSOR FOLLOWER ────────────────────────────────
(function initCursorFollower() {
  if (isMobile) return;

  const follower = document.getElementById('cursorFollower');
  const dot = document.getElementById('cursorDot');
  const blob = document.getElementById('cursorBlob');
  if (!follower || !dot) return;

  let fx = mouse.x, fy = mouse.y;
  let bx = mouse.x, by = mouse.y;

  function animate() {
    // Smooth follow for ring
    fx += (mouse.x - fx) * 0.12;
    fy += (mouse.y - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';

    // Instant dot
    dot.style.left = mouse.x + 'px';
    dot.style.top = mouse.y + 'px';

    // Slow blob follow
    if (blob) {
      bx += (mouse.x - bx) * 0.04;
      by += (mouse.y - by) * 0.04;
      blob.style.left = bx + 'px';
      blob.style.top = by + 'px';
    }

    requestAnimationFrame(animate);
  }
  animate();

  // Hover state — expand on interactive elements
  const interactive = 'a, button, .btn, .proj-btn, .nav-link, .social-btn, .filter-btn, .skill-tag, .contact-card, input, textarea';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactive)) {
      follower.classList.add('hovering');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactive)) {
      follower.classList.remove('hovering');
    }
  });
})();

// ─── 3. PARTICLE BACKGROUND (CURSOR-INTERACTIVE) ──────────────
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  const PARTICLE_COUNT = isMobile ? 40 : 80;
  const COLORS = ['rgba(0,212,255,', 'rgba(168,85,247,', 'rgba(0,255,157,', 'rgba(244,114,182,'];
  const CONNECT_DIST = 120;
  const MOUSE_RADIUS = 150;

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.baseX = this.x;
      this.baseY = this.y;
      this.size = Math.random() * 2 + 0.5;
      this.speedY = Math.random() * 0.6 + 0.2;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.55 + 0.1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.pulse += 0.02;

      // Mouse repulsion
      if (!isMobile) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          this.x -= dx * force * 0.03;
          this.y -= dy * force * 0.03;
        }
      }

      const alpha = this.opacity * (0.85 + 0.15 * Math.sin(this.pulse));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + alpha + ')';
      ctx.fill();
      if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset(false);
    }
  }

  const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[j].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => p.update());
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  });
})();

// ─── 4. DYNAMIC GRID DISTORTION ───────────────────────────────
(function initDynamicGrid() {
  if (isMobile) return;
  const canvas = document.getElementById('gridCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  const GRID_SIZE = 60;
  const DISTORT_RADIUS = 200;
  const DISTORT_STRENGTH = 15;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(0,212,255,0.04)';
    ctx.lineWidth = 0.5;

    // Vertical lines
    for (let x = 0; x <= W; x += GRID_SIZE) {
      ctx.beginPath();
      for (let y = 0; y <= H; y += 5) {
        const dx = mouse.x - x;
        const dy = mouse.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let offsetX = 0;
        if (dist < DISTORT_RADIUS) {
          const force = (DISTORT_RADIUS - dist) / DISTORT_RADIUS;
          offsetX = -dx * force * DISTORT_STRENGTH / DISTORT_RADIUS;
        }
        if (y === 0) ctx.moveTo(x + offsetX, y);
        else ctx.lineTo(x + offsetX, y);
      }
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= H; y += GRID_SIZE) {
      ctx.beginPath();
      for (let x = 0; x <= W; x += 5) {
        const dx = mouse.x - x;
        const dy = mouse.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let offsetY = 0;
        if (dist < DISTORT_RADIUS) {
          const force = (DISTORT_RADIUS - dist) / DISTORT_RADIUS;
          offsetY = -dy * force * DISTORT_STRENGTH / DISTORT_RADIUS;
        }
        if (x === 0) ctx.moveTo(x, y + offsetY);
        else ctx.lineTo(x, y + offsetY);
      }
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  });
})();

// ─── 5. TYPEWRITER EFFECT ──────────────────────────────────────
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'AI Developer',
    'Data Scientist',
    'ML Engineer',
    'Cyber Security Analyst',
    'Problem Solver',
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pause = false;

  function type() {
    const current = phrases[phraseIdx];
    if (pause) { setTimeout(type, 1400); pause = false; return; }

    if (!deleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) { pause = true; deleting = true; }
      setTimeout(type, 100);
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
      setTimeout(type, 55);
    }
  }

  type();
})();

// ─── 6. NAVBAR — SCROLL + HAMBURGER + ACTIVE LINK ──────────────
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu  = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });
})();

// ─── 7. 3D PARALLAX ON MOUSE MOVE ─────────────────────────────
(function initParallax() {
  if (isMobile) return;

  const elements = document.querySelectorAll('[data-parallax]');
  if (!elements.length) return;

  window.addEventListener('mousemove', (e) => {
    const xRatio = (e.clientX / window.innerWidth - 0.5);
    const yRatio = (e.clientY / window.innerHeight - 0.5);

    elements.forEach(el => {
      const speed = parseFloat(el.dataset.speed) || 0.02;
      const x = xRatio * 100 * speed;
      const y = yRatio * 100 * speed;
      const rotX = yRatio * 5 * speed * 100;
      const rotY = -xRatio * 5 * speed * 100;
      el.style.transform = `translate(${x}px, ${y}px) perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
  }, { passive: true });
})();

// ─── 8. PROJECT CARD TILT + GLOW ON HOVER ─────────────────────
(function initCardTilt() {
  if (isMobile) return;

  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach(card => {
    // Add glow overlay
    const glow = document.createElement('div');
    glow.className = 'card-tilt-glow';
    card.style.position = 'relative';
    card.appendChild(glow);

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      // Position-based glow
      glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0,212,255,0.12) 0%, transparent 60%)`;

      // Extra neon border glow for project cards with glare
      if (card.hasAttribute('data-tilt-glare')) {
        card.style.boxShadow = `0 0 20px rgba(0,212,255,0.12), 0 20px 50px rgba(0,212,255,0.08)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
      glow.style.background = '';
    });
  });
})();

// ─── 9. ANIMATED PROGRESS BARS ─────────────────────────────────
(function initProgressBars() {
  const bars = document.querySelectorAll('.progress-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.dataset.width;
        setTimeout(() => { bar.style.width = width + '%'; }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();

// ─── 10. COUNT-UP ANIMATION ───────────────────────────────────
(function initCountUp() {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        let current = 0;
        const increment = target / 40;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current);
        }, 40);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  nums.forEach(n => observer.observe(n));
})();

// ─── 11. PROJECT FILTER ────────────────────────────────────────
(function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';

        setTimeout(() => {
          if (match) {
            card.style.display = '';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = '';
            }, 20);
          } else {
            card.style.display = 'none';
          }
        }, 200);
      });
    });
  });

  cards.forEach(card => {
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });
})();

// ─── 12. CONTACT FORM — SECURITY HARDENED ──────────────────────
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const successEl = document.getElementById('formSuccess');
  const errorEl = document.getElementById('formError');
  const errorMsg = document.getElementById('formErrorMsg');
  const sendBtn = document.getElementById('sendBtn');
  const msgCounter = document.getElementById('msgCounter');
  const honeypot = document.getElementById('hp_website');
  const csrfInput = document.getElementById('csrfToken');
  const tsInput = document.getElementById('formTimestamp');
  if (!form) return;

  function generateToken() {
    const arr = new Uint8Array(24);
    crypto.getRandomValues(arr);
    return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
  }

  function sanitize(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/data:/gi, '')
      .trim();
  }

  function isValidEmail(email) {
    const re = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }

  const RATE_LIMIT = 3;
  const RATE_WINDOW = 5 * 60 * 1000;
  let submissions = [];

  function isRateLimited() {
    const now = Date.now();
    submissions = submissions.filter(ts => now - ts < RATE_WINDOW);
    return submissions.length >= RATE_LIMIT;
  }

  function recordSubmission() {
    submissions.push(Date.now());
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    errorEl.classList.add('show');
    successEl.classList.remove('show');
    setTimeout(() => errorEl.classList.remove('show'), 5000);
  }

  csrfInput.value = generateToken();
  tsInput.value = Date.now().toString();

  const msgField = document.getElementById('contactMessage');
  if (msgField && msgCounter) {
    msgField.addEventListener('input', () => {
      const len = msgField.value.length;
      const max = parseInt(msgField.getAttribute('maxlength') || '2000');
      msgCounter.textContent = `${len} / ${max}`;
      msgCounter.classList.remove('warn', 'max');
      if (len > max * 0.9) msgCounter.classList.add('max');
      else if (len > max * 0.75) msgCounter.classList.add('warn');
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (honeypot && honeypot.value.length > 0) {
      sendBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
      return;
    }

    if (!csrfInput.value || csrfInput.value.length < 10) {
      showError('Security token missing. Please refresh and try again.');
      return;
    }

    const formAge = Date.now() - parseInt(tsInput.value || '0');
    if (formAge < 3000) {
      showError('Please take a moment to fill out the form properly.');
      return;
    }

    if (isRateLimited()) {
      showError('Too many messages sent. Please try again in a few minutes.');
      return;
    }

    const name = sanitize(document.getElementById('contactName').value);
    const email = sanitize(document.getElementById('contactEmail').value);
    const subject = sanitize(document.getElementById('contactSubject').value);
    const message = sanitize(document.getElementById('contactMessage').value);

    if (!name || name.length < 2) { showError('Please enter a valid name (at least 2 characters).'); shakeForm(form); return; }
    if (name.length > 80) { showError('Name is too long (max 80 characters).'); return; }
    if (!email || !isValidEmail(email)) { showError('Please enter a valid email address.'); shakeForm(form); return; }
    if (subject.length > 150) { showError('Subject is too long (max 150 characters).'); return; }
    if (!message || message.length < 10) { showError('Message is too short (min 10 characters).'); shakeForm(form); return; }
    if (message.length > 2000) { showError('Message is too long (max 2000 characters).'); return; }

    errorEl.classList.remove('show');
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending securely...';

    recordSubmission();

    setTimeout(() => {
      sendBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
      sendBtn.style.background = 'linear-gradient(135deg, #00ff9d, #00c484)';
      successEl.classList.add('show');
      form.reset();

      csrfInput.value = generateToken();
      tsInput.value = Date.now().toString();
      if (msgCounter) { msgCounter.textContent = '0 / 2000'; msgCounter.classList.remove('warn', 'max'); }

      setTimeout(() => {
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        sendBtn.style.background = '';
        successEl.classList.remove('show');
      }, 4000);
    }, 1500);
  });

  function shakeForm(el) {
    el.style.animation = 'shake 0.4s ease';
    setTimeout(() => { el.style.animation = ''; }, 500);
  }
})();

// ─── 13. EMAIL OBFUSCATION ────────────────────────────────────
(function initEmailProtection() {
  const card = document.getElementById('emailCard');
  const display = document.getElementById('emailDisplay');
  if (!card || !display) return;

  const u = card.dataset.u;
  const d = card.dataset.d;
  if (u && d) {
    const addr = u + '@' + d;
    display.textContent = addr;
    card.href = 'mai' + 'lto:' + addr;
    card.removeAttribute('data-u');
    card.removeAttribute('data-d');
  }
})();

// ─── 14. BACK TO TOP ──────────────────────────────────────────
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ─── 15. SMOOTH SECTION REVEAL ─────────────────────────────────
(function initSectionGlow() {
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(sec => {
    sec.style.opacity = '0';
    sec.style.transform = 'translateY(20px)';
    sec.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(sec);
  });
})();

// ─── 16. SKILL TAG STAGGER ─────────────────────────────────────
(function initSkillTagStagger() {
  const categories = document.querySelectorAll('.skill-category');
  categories.forEach(cat => {
    const tags = cat.querySelectorAll('.skill-tag');
    cat.addEventListener('mouseenter', () => {
      tags.forEach((tag, i) => {
        tag.style.transitionDelay = `${i * 30}ms`;
        tag.style.transform = 'translateY(-3px)';
      });
    });
    cat.addEventListener('mouseleave', () => {
      tags.forEach(tag => {
        tag.style.transitionDelay = '0ms';
        tag.style.transform = '';
      });
    });
  });
})();

// ─── 17. CSS SHAKE KEYFRAME (injected) ─────────────────────────
(function injectShakeKeyframe() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-6px); }
      80% { transform: translateX(6px); }
    }
  `;
  document.head.appendChild(style);
})();

console.log('%c🤖 Shibin Portfolio Loaded!', 'color:#00d4ff;font-size:16px;font-weight:bold;');
console.log('%cBuilt with ❤️ — AI & Data Science Developer', 'color:#a855f7;font-size:12px;');
