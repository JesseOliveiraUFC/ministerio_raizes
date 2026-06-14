/* ═══════════════════════════════════════════════════
   RAÍZES - MINISTÉRIO DE LOUVOR  |  main.js
═══════════════════════════════════════════════════ */

/* ── Navigation ── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateParallax();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  mobileOverlay.style.display = mobileMenu.classList.contains('open') ? 'block' : 'none';
});

mobileOverlay.addEventListener('click', closeMobileMenu);
document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', closeMobileMenu));

function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  mobileOverlay.style.display = 'none';
}

/* ── Parallax ── */
function updateParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
  }
}

/* ── Scroll Reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(el => {
  revealObserver.observe(el);
});


/* ── Audio Players ── */
let currentAudio = null;

document.querySelectorAll('.trib-card').forEach(card => {
  const audio = card.querySelector('audio');
  const playBtn = card.querySelector('.audio-play-btn');
  const progressFill = card.querySelector('.audio-progress-fill');
  const progressWrap = card.querySelector('.audio-progress-wrap');
  const timeDisplay = card.querySelector('.audio-time');
  const player = card.querySelector('.audio-player');

  if (!audio || !playBtn) return;

  function formatTime(s) {
    if (isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  function stopAllOthers() {
    document.querySelectorAll('.trib-card').forEach(c => {
      if (c !== card) {
        const a = c.querySelector('audio');
        const btn = c.querySelector('.audio-play-btn');
        const p = c.querySelector('.audio-player');
        const pf = c.querySelector('.audio-progress-fill');
        if (a && !a.paused) {
          a.pause();
          if (btn) btn.innerHTML = '<i class="fas fa-play"></i>';
          if (p) p.classList.remove('playing');
          if (pf) pf.style.width = '0%';
        }
      }
    });
  }

  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      stopAllOthers();
      audio.play().catch(() => {});
      playBtn.innerHTML = '<i class="fas fa-pause"></i>';
      player.classList.add('playing');
    } else {
      audio.pause();
      playBtn.innerHTML = '<i class="fas fa-play"></i>';
      player.classList.remove('playing');
    }
  });

  audio.addEventListener('timeupdate', () => {
    if (audio.duration && !isNaN(audio.duration)) {
      const pct = (audio.currentTime / audio.duration) * 100;
      if (progressFill) progressFill.style.width = `${pct}%`;
      if (timeDisplay) timeDisplay.textContent = formatTime(audio.currentTime);
    }
  });

  audio.addEventListener('ended', () => {
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    player.classList.remove('playing');
    if (progressFill) progressFill.style.width = '0%';
    if (timeDisplay) timeDisplay.textContent = '0:00';
  });

  if (progressWrap) {
    progressWrap.addEventListener('click', (e) => {
      if (!audio.duration) return;
      const rect = progressWrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      audio.currentTime = (x / rect.width) * audio.duration;
    });
  }
});

/* ── Animated Counters ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  let step = 0;

  const timer = setInterval(() => {
    step++;
    const progress = step / steps;
    const ease = 1 - Math.pow(1 - progress, 3);
    current = target * ease;
    el.textContent = Math.floor(current) + suffix;
    if (step >= steps) {
      el.textContent = target + suffix;
      clearInterval(timer);
    }
  }, duration / steps);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ── Waveform bar heights ── */
const barHeights = [40, 75, 55, 90, 45, 68, 82, 50, 70, 38, 88, 52, 72, 44, 80, 60, 42, 76];
document.querySelectorAll('.waveform-bars').forEach(wf => {
  const bars = wf.querySelectorAll('.waveform-bar');
  bars.forEach((bar, i) => {
    bar.style.height = `${barHeights[i % barHeights.length]}%`;
  });
});

/* ── Hero Particles ── */
function createParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;

  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      background: ${Math.random() > .5 ? 'var(--gold)' : 'var(--gold-light)'};
      animation-duration: ${Math.random() * 18 + 12}s;
      animation-delay: ${Math.random() * 12}s;
      opacity: 0;
    `;
    container.appendChild(p);
  }
}

createParticles();

/* ── Smooth scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      closeMobileMenu();
    }
  });
});

/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--gold-light)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => activeObserver.observe(s));
