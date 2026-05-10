/* ═══════════════════════════════════════════════════════════════
   NoFapTracker — Shared JavaScript
   script.js · Used by index.html + changelog.html
═══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   CUSTOM CURSOR SYSTEM
───────────────────────────────────────────── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;
let cursorEnabled = true;

/* Create trail dots */
const TRAIL_COUNT = 8;
const trails = [];
for (let i = 0; i < TRAIL_COUNT; i++) {
  const el = document.createElement('div');
  el.classList.add('cursor-trail');
  document.body.appendChild(el);
  trails.push({ el, x: 0, y: 0 });
}

/* Track mouse position */
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

/* Smooth ring lag + trail loop */
let prevPositions = Array(TRAIL_COUNT).fill({ x: 0, y: 0 });
function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';

  prevPositions.unshift({ x: mouseX, y: mouseY });
  prevPositions = prevPositions.slice(0, TRAIL_COUNT + 1);

  trails.forEach((t, i) => {
    const pos = prevPositions[Math.min(i * 2 + 2, prevPositions.length - 1)];
    t.el.style.left      = pos.x + 'px';
    t.el.style.top       = pos.y + 'px';
    const ratio          = 1 - i / TRAIL_COUNT;
    t.el.style.opacity   = (ratio * 0.35).toString();
    t.el.style.width     = (6 * ratio) + 'px';
    t.el.style.height    = (6 * ratio) + 'px';
    t.el.style.transform = 'translate(-50%,-50%)';
  });

  requestAnimationFrame(animateCursor);
}
animateCursor();

/* Hover state */
const hoverTargets = 'a, button, [role="button"], .feature-card, .version-card, .stat-item, .install-step';
document.addEventListener('mouseover', (e) => {
  if (e.target.closest(hoverTargets)) document.body.classList.add('cursor-hover');
});
document.addEventListener('mouseout', (e) => {
  if (e.target.closest(hoverTargets)) document.body.classList.remove('cursor-hover');
});

/* ─────────────────────────────────────────────
   CURSOR TOGGLE
───────────────────────────────────────────── */
const toggleBtn = document.getElementById('cursor-toggle');
toggleBtn.addEventListener('click', () => {
  cursorEnabled = !cursorEnabled;
  if (cursorEnabled) {
    toggleBtn.classList.add('active');
    document.body.classList.remove('cursor-off');
  } else {
    toggleBtn.classList.remove('active');
    document.body.classList.add('cursor-off');
    document.body.classList.remove('cursor-hover');
  }
});

/* ─────────────────────────────────────────────
   LIVE CLOCK
───────────────────────────────────────────── */
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function pad(n) { return String(n).padStart(2, '0'); }

function updateClock() {
  const now = new Date();
  const h   = pad(now.getHours());
  const m   = pad(now.getMinutes());
  const s   = pad(now.getSeconds());
  const d   = now.getDate();
  const mo  = MONTHS[now.getMonth()];
  const y   = now.getFullYear();
  const day = DAYS[now.getDay()];
  document.getElementById('clock-hm').textContent     = `${h}:${m}`;
  document.getElementById('clock-seconds').textContent = `:${s}`;
  document.getElementById('clock-date').textContent    = `${pad(d)} / ${mo} / ${y}`;
  document.getElementById('clock-day').textContent     = day;
}
updateClock();
setInterval(updateClock, 1000);

/* ─────────────────────────────────────────────
   ANIMATED STAT COUNTER (index only)
───────────────────────────────────────────── */
function animateCount(el, target, duration) {
  if (!el) return;
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
animateCount(document.getElementById('stat-days'), 42, 1800);

/* ─────────────────────────────────────────────
   MOCKUP STREAK PULSE (index only)
───────────────────────────────────────────── */
setInterval(() => {
  const el = document.getElementById('mockup-num');
  if (el) {
    el.style.transform = 'scale(1.1)';
    setTimeout(() => {
      el.style.transition = 'transform 0.3s ease';
      el.style.transform  = 'scale(1)';
    }, 150);
  }
}, 4000);

/* ─────────────────────────────────────────────
   MOBILE HAMBURGER
───────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const sidebar   = document.getElementById('sidebar');
hamburger.addEventListener('click', () => sidebar.classList.toggle('open'));
document.addEventListener('click', (e) => {
  if (!sidebar.contains(e.target) && e.target !== hamburger) {
    sidebar.classList.remove('open');
  }
});

/* ─────────────────────────────────────────────
   SCROLL-TRIGGERED ANIMATIONS
───────────────────────────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .timeline-entry, .install-step').forEach(el => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(24px)';
  el.style.transition = 'opacity 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.55s cubic-bezier(0.4,0,0.2,1)';
  observer.observe(el);
});

/* ─────────────────────────────────────────────
   BUTTON RIPPLE EFFECT
───────────────────────────────────────────── */
/* Inject keyframe */
const styleEl = document.createElement('style');
styleEl.textContent = `@keyframes rippleAnim { to { transform:scale(2.5); opacity:0; } }`;
document.head.appendChild(styleEl);

function addRipple(e) {
  const btn    = e.currentTarget;
  const ripple = document.createElement('span');
  const rect   = btn.getBoundingClientRect();
  const size   = Math.max(rect.width, rect.height);
  ripple.style.cssText = `
    position:absolute;
    width:${size}px; height:${size}px;
    left:${e.clientX - rect.left - size / 2}px;
    top:${e.clientY - rect.top - size / 2}px;
    border-radius:50%;
    background:rgba(255,255,255,0.15);
    transform:scale(0);
    animation:rippleAnim 0.6s ease-out forwards;
    pointer-events:none;
  `;
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
}

document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
  btn.addEventListener('click', addRipple);
});
