/* ═══════════════════════════════════════════════════════════════
   SHIBIN SHAJI — CYBERSECURITY PORTFOLIO · SCRIPT.JS
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─── LOADING SCREEN ─── */
(function initLoader() {
  const screen = document.getElementById('loadingScreen');
  const cmdEl  = document.getElementById('loaderCmd');
  const outEl  = document.getElementById('loaderOutput');
  if (!screen) return;

  const sequence = [
    { cmd: 'nmap -sV shibin.shaji --init',   out: 'Initializing portfolio...' },
    { cmd: 'cat /etc/skills.conf',            out: 'Loading skill modules...' },
    { cmd: 'ssh shibin@portfolio --fast',     out: 'Establishing connection...' },
    { cmd: 'sudo ./launch_portfolio.sh',      out: '✓ Portfolio ready. Welcome!' },
  ];

  let si = 0, ci = 0;
  const TYPE_SPEED = 38, PAUSE = 600;

  function typeCmd() {
    if (si >= sequence.length) { hide(); return; }
    const { cmd, out } = sequence[si];
    if (ci <= cmd.length) {
      cmdEl.textContent = cmd.slice(0, ci++);
      setTimeout(typeCmd, TYPE_SPEED);
    } else {
      outEl.textContent = out;
      ci = 0; si++;
      setTimeout(() => { outEl.textContent = ''; typeCmd(); }, PAUSE);
    }
  }

  function hide() {
    screen.classList.add('hidden');
    document.body.style.overflow = '';
  }

  document.body.style.overflow = 'hidden';
  setTimeout(typeCmd, 400);
  setTimeout(hide, 5000);
})();

/* ─── AOS INIT ─── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 700, once: true, offset: 60, easing: 'ease-out-cubic' });
  }
  initCursor();
  initNavbar();
  initTypewriter();
  initMatrixCanvas();
  initParticleCanvas();
  initSkillBars();
  initContactForm();
  initScrollCue();
  initHoverEffects();
});

/* ═══════════════════════════════════════
   CUSTOM CURSOR — Antigravity Style + Blob
═══════════════════════════════════════ */
function initCursor() {
  const ring = document.getElementById('cursorRing');
  const dot  = document.getElementById('cursorDot');
  const blob = document.getElementById('bgBlob');
  if (!ring || !dot) return;

  // Current real mouse position
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  // Lagging positions for ring and blob
  let rx = mx, ry = my;   // ring (medium lag)
  let bx = mx, by = my;   // blob (slow lag)

  /* ── Mouse move ── */
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    // Dot follows instantly
    dot.style.transform = `translate(calc(-50% + ${mx}px), calc(-50% + ${my}px))`;
  });

  /* ── Smooth follow loop ── */
  (function animLoop() {
    // Ring: medium elastic (18% each frame)
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(calc(-50% + ${rx}px), calc(-50% + ${ry}px))`;

    // Blob: very slow elastic (3% each frame)
    bx += (mx - bx) * 0.03;
    by += (my - by) * 0.03;
    if (blob) { 
      // Using translate for performance instead of left/top
      blob.style.transform = `translate(calc(-50% + ${bx}px), calc(-50% + ${by}px))`; 
    }

    requestAnimationFrame(animLoop);
  })();

  /* ── Hover detection ── */
  const interactable = [
    'a', 'button',
    '.skill-card', '.proj-card', '.cert-card', '.cl-card',
    '.tool-pill', '.about-card', '.nav-link', '.btn', '.pl-btn',
    '.rc-btn', '.cert-link', '.footer-socials a'
  ].join(', ');

  document.querySelectorAll(interactable).forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('hovering');
    });
  });

  /* ── Click pulse ── */
  document.addEventListener('mousedown', () => {
    ring.classList.add('clicking');
  });
  document.addEventListener('mouseup', () => {
    ring.classList.remove('clicking');
  });
}


/* ═══════════════════════════════════════
   NAVBAR
═══════════════════════════════════════ */
function initNavbar() {
  const nav    = document.getElementById('navbar');
  const burger = document.getElementById('hamburger');
  const links  = document.getElementById('navLinks');
  const navls  = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
    highlightNav();
  });

  burger?.addEventListener('click', () => {
    burger.classList.toggle('open');
    links.classList.toggle('open');
  });
  navls.forEach(l => l.addEventListener('click', () => {
    burger?.classList.remove('open');
    links?.classList.remove('open');
  }));

  function highlightNav() {
    const sections = document.querySelectorAll('.section');
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
    navls.forEach(l => l.classList.toggle('active', l.dataset.nav === current));
  }
}

/* ═══════════════════════════════════════
   TYPEWRITER
═══════════════════════════════════════ */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const roles = [
    'Cybersecurity Learner',
    'Networking Enthusiast',
    'Ethical Hacking Student',
    'Linux Explorer',
    'Problem Solver',
  ];

  let ri = 0, ci = 0, deleting = false;
  const SPEED = 80, DEL_SPEED = 45, PAUSE = 1800;

  function tick() {
    const word = roles[ri];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(tick, PAUSE); return; }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(tick, deleting ? DEL_SPEED : SPEED);
  }
  tick();
}

/* ═══════════════════════════════════════
   MATRIX CANVAS
═══════════════════════════════════════ */
function initMatrixCanvas() {
  const canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const chars = '01アイウカキクケコサシスセソタチツテトABCDEFGHIJKLMN<>/\\{}[];:';
  let cols, drops;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols  = Math.floor(canvas.width / 16);
    drops = Array(cols).fill(1);
  }
  resize();
  window.addEventListener('resize', resize);

  setInterval(() => {
    ctx.fillStyle = 'rgba(5,11,24,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '13px Fira Code, monospace';
    drops.forEach((y, i) => {
      const c = chars[Math.floor(Math.random() * chars.length)];
      const hue = Math.random() > 0.6 ? '#a855f7' : '#00d4ff';
      ctx.fillStyle = hue;
      ctx.globalAlpha = Math.random() * 0.45 + 0.08;
      ctx.fillText(c, i * 16, y * 16);
      ctx.globalAlpha = 1;
      drops[i] = (y * 16 > canvas.height && Math.random() > 0.975) ? 0 : y + 1;
    });
  }, 60);
}

/* ═══════════════════════════════════════
   PARTICLE CANVAS
═══════════════════════════════════════ */
function initParticleCanvas() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  let mx = -1000, my = -1000;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', () => { resize(); buildParticles(); });
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function buildParticles() {
    particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
      r: Math.random() * 1.8 + .4, alpha: Math.random() * .4 + .1,
    }));
  }
  buildParticles();

  const CONNECT = 130;
  (function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      const dx = p.x - mx, dy = p.y - my, dist = Math.sqrt(dx*dx+dy*dy);
      if (dist < 80) { p.x += dx/dist; p.y += dy/dist; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      const col = p.r > 1.3 ? `rgba(168,85,247,${p.alpha})` : `rgba(0,212,255,${p.alpha})`;
      ctx.fillStyle = col; ctx.fill();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i+1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx*dx+dy*dy);
        if (d < CONNECT) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${(1 - d/CONNECT) * 0.15})`;
          ctx.lineWidth = 0.6; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  })();
}

/* ═══════════════════════════════════════
   SKILL BARS & LEARNING PROGRESS
═══════════════════════════════════════ */
function initSkillBars() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.skill-bar').forEach(bar => {
        const fill = bar.querySelector('.skill-bar-fill');
        if (fill) fill.style.width = (bar.dataset.width || 0) + '%';
      });
      entry.target.querySelectorAll('.lp-fill').forEach(fill => {
        fill.style.width = (fill.dataset.w || 0) + '%';
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skills-section, .certs-section').forEach(s => observer.observe(s));
}

/* ═══════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════ */
function initContactForm() {
  const form     = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const btn      = document.getElementById('sendBtn');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name  = form.name.value.trim();
    const email = form.email.value.trim();
    const msg   = form.message.value.trim();

    if (!name || !email || !msg) { setFeedback('error', '✗ Please fill in all required fields.'); return; }
    if (!isValidEmail(email))    { setFeedback('error', '✗ Invalid email address.'); return; }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> &nbsp;./sending...';
    setTimeout(() => {
      setFeedback('success', '✓ Message received! I\'ll get back to you soon.');
      form.reset(); btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> &nbsp;./send_message';
      setTimeout(() => { feedback.textContent = ''; }, 5000);
    }, 1200);
  });

  function setFeedback(type, msg) {
    if (!feedback) return;
    feedback.className = 'form-feedback ' + type;
    feedback.textContent = msg;
  }
}

function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

/* ═══════════════════════════════════════
   SCROLL CUE FADE
═══════════════════════════════════════ */
function initScrollCue() {
  const cue = document.querySelector('.scroll-cue');
  if (!cue) return;
  window.addEventListener('scroll', () => { cue.style.opacity = window.scrollY > 80 ? '0' : '1'; });
}

/* ═══════════════════════════════════════
   3D HOVER EFFECTS ON CARDS
═══════════════════════════════════════ */
function initHoverEffects() {
  document.querySelectorAll('.proj-card, .skill-card, .cert-card, .about-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 16;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 16;
      card.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}
