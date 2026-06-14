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

/* ── Lyrics Modal ── */
const lyrics = {
  tributo: {
    title: 'Tributo',
    comp: 'Composição: Jessé Oliveira',
    sections: [
      { label: 'Estrofe 1', lines: [
        'Ao Deus que abriu o mar vermelho',
        'Aos pés enxutos fez seu povo passar',
        'Fez as águas do Nilo tornarem em sangue',
        'E no meio das pedras fez água brotar.'
      ]},
      { label: 'Pré-Refrão', lines: [
        'Visitou o seu povo com a coluna de fogo',
        'Alimentou Israel com o Maná',
        'Humilhou, destruiu todos seus inimigos',
        'Derrotou a Faraó, nas águas fez se afogar'
      ]},
      { label: 'Refrão', lines: [
        'A Ele seja a Glória',
        'A Ele seja o Louvor',
        'A Ele a majestade e o Poder',
        'Meu Tributo ao Rei dos reis.'
      ]},
      { label: 'Estrofe 2', lines: [
        'Ao Deus que livrou Daniel dos leões',
        'A seus três amigos chegou pra salvar',
        'Na fornalha ardente passeou com eles',
        'Ele é o Leão da Tribo de Judá'
      ]},
      { label: 'Pré-Refrão', lines: [
        'Derrubou as muralhas de Jericó',
        'Sete dias ao seu povo Ele fez marchar',
        'Com buzinas, tambores e trombetas',
        'Todo o povo adorou quando as muralhas derrubou'
      ]},
      { label: 'Refrão', lines: [
        'A Ele seja a Glória',
        'A Ele seja o Louvor',
        'A Ele a majestade e o Poder',
        'Meu Tributo ao Rei dos reis.'
      ]}
    ]
  },
  filho: {
    title: 'Filho de Deus',
    comp: 'Composição: Jessé Oliveira',
    sections: [
      { label: 'Estrofe', lines: [
        'Jesus, Teu Nome é Santo',
        'Teu Nome é Glorioso',
        'Rei da Glória, Rei dos reis',
        'Tu és SENHOR',
        '',
        'Deixou o Seu Trono de Glória',
        'Pra mudar a minha história',
        'Numa cruz sofreu, num madeiro',
        'Morreu em meu lugar'
      ]},
      { label: 'Pré-Refrão', lines: [
        'Exaltado sobre os povos',
        'Tu és digno de Glória',
        'Nos prostramos, declaramos',
        'Tu és Santo, Santo, Santo',
        'Santo é o SENHOR'
      ]},
      { label: 'Refrão', lines: [
        'Jesus Cristo, Tu és o Filho de Deus',
        'Meu amado, onde encontro salvação.'
      ]}
    ]
  },
  clamo: {
    title: 'Eu Clamo',
    comp: 'Composição: Jessé Oliveira',
    sections: [
      { label: 'Estrofe 1', lines: [
        'Quando os meus pés não tocam o chão',
        'E a minha vida vai na contramão',
        'Quando eu não vejo mais solução',
        'Eu clamo, eu clamo, eu clamo por ele'
      ]},
      { label: 'Estrofe 2', lines: [
        'Quando eu não tenho mais pra onde ir',
        'E a minha luta parece sem fim',
        'E quando as trevas lutam contra mim',
        'Eu clamo, eu clamo, eu clamo por ele'
      ]},
      { label: 'Pré-Refrão', lines: [
        'Ele é a fonte eterna de amor',
        'Ele é a âncora, o meu farol',
        'Sol da justiça que me conquistou',
        'Eu não temerei, o Seu Nome eu clamarei'
      ]},
      { label: 'Refrão', lines: [
        'Eu clamo por Cristo Jesus',
        'Eu chamo pelo Deus da luz',
        'Salvador, Redentor, Dono de tudo em mim',
        'Me salvou, derramou seu sangue carmesim'
      ]},
      { label: 'Ponte', lines: [
        'Envia os anjos pra me ajudar',
        'Enviou o Seu Filho pra morrer em meu lugar',
        'Faz céus e terra vir ao meu favor',
        'Faz da morte a vida, faz tudo porque me amou',
        'Faz tudo porque me amou.'
      ]}
    ]
  },
  vinde: {
    title: 'Vinde a Mim',
    comp: 'Composição: Jessé Oliveira',
    sections: [
      { label: 'Estrofe 1', lines: [
        'Esta é uma canção',
        'para aqueles que têm sede e fome',
        'Que estão sem direção',
        'e não têm nenhum lugar pra onde ir'
      ]},
      { label: 'Estrofe 2', lines: [
        'Preste muita atenção',
        'existe alguém que te ama e te quer bem',
        'Ele quer te dar a mão',
        'e te mostrar que é possível ser feliz'
      ]},
      { label: 'Refrão', lines: [
        'Vinde a mim vós que estais cansados',
        'Vinde a mim todos oprimidos',
        'Vinde a mim pois vos darei descanso',
        'Sou teu escudo, Sou o teu abrigo',
        'Eu sou o pão para quem tem fome',
        'Eu sou a água para quem tem sede',
        'Eu sou o Caminho, a Verdade e a Vida',
        'Eu Sou o que Sou, Eu Sou Jesus'
      ]},
      { label: 'Estrofe 3', lines: [
        'Se você pensa que acabou',
        'Eu te digo que é só o início',
        'De uma vida cheia de amor',
        'De esperança e alegria sem fim',
        '',
        'O teu preço Ele pagou',
        'Ele é o Perfeito Sacrifício',
        'Teu pecado perdoou',
        'Ele te diz: Filho venha até mim.'
      ]},
      { label: 'Ponte', lines: [
        'Não temas pois Eu Sou contigo',
        'Sou teu escudo, Sou o Teu abrigo',
        'Eu Sou aquele que nunca te abandonou',
        'Eu vim aqui para mudar tua sorte',
        'Eu vim aqui pra te livrar da morte',
        'Eu sou o que sou, Eu sou JESUS.'
      ]}
    ]
  },
  cantai: {
    title: 'Cantai',
    comp: 'Composição: Jessé Oliveira',
    sections: [
      { label: 'Estrofe', lines: [
        'Abram-se, oh, portais eternos',
        'Porque o Rei da Glória vem',
        'Porque o Rei da Glória vem',
        '',
        'Entrai em Seus átrios com brados de Louvor',
        'Ele é o Sol da Justiça, Jesus Cristo é o SENHOR.',
        'Purificai vossas vestes para entrar diante do REI',
        'Pois com ELE nas nuvens para a Glória subirei'
      ]},
      { label: 'Refrão', lines: [
        'Cantai um novo cântico ao Rei dos reis, Jesus',
        'Louvai Seu Santo Nome, Sua morte ali na cruz',
        'Buscai pois é chegado o Reino do meu Salvador',
        'Clamai pois lá na Glória com Jesus morar eu vou'
      ]}
    ]
  },
  subir: {
    title: 'Eu Vou Subir',
    comp: 'Composição: Jessé Oliveira',
    sections: [
      { label: 'Estrofe', lines: [
        'Ele vem saltando sobre os montes',
        'Os Seus olhos são chamas de fogo',
        'Ele vem vestido de Glória',
        'Vem buscar, resgatar o seu povo'
      ]},
      { label: 'Pré-Refrão', lines: [
        'Em Sua coxa estava escrito',
        'Rei dos reis, Senhor dos Senhores',
        'Ele é o Sol da Justiça',
        'Exaltado em meio aos louvores'
      ]},
      { label: 'Refrão', lines: [
        'Eu vou Subir, nas nuvens eu vou subir',
        'Verei o meu amado num corpo glorificado',
        'Para a Glória eu vou subir',
        '',
        'Eu vou subir, nas nuvens eu vou subir',
        'Na mansão celestial, ruas de ouro e cristal',
        'Para a Glória eu vou subir',
        '',
        'Porque tudo é por Ele e tudo é para Ele',
        'Com Jesus eu vou subir'
      ]}
    ]
  }
};

function buildLetraHTML(song) {
  return song.sections.map(sec => {
    const lines = sec.lines.map(l =>
      `<span class="letra-line">${l || '&nbsp;'}</span>`
    ).join('');
    return `<span class="letra-section">${sec.label}</span>${lines}`;
  }).join('');
}

const letraModal  = document.getElementById('letraModal');
const letraOverlay = document.getElementById('letraOverlay');
const letraClose  = document.getElementById('letraClose');
const letraTitulo = document.getElementById('letraTitulo');
const letraComp   = document.getElementById('letraComp');
const letraConteudo = document.getElementById('letraConteudo');

function openLetra(key) {
  const song = lyrics[key];
  if (!song) return;
  letraTitulo.textContent = song.title;
  letraComp.textContent = song.comp;
  letraConteudo.innerHTML = buildLetraHTML(song);
  letraConteudo.scrollTop = 0;
  letraModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLetra() {
  letraModal.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.btn-letra').forEach(btn => {
  btn.addEventListener('click', () => openLetra(btn.dataset.song));
});

letraOverlay.addEventListener('click', closeLetra);
letraClose.addEventListener('click', closeLetra);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLetra(); });
