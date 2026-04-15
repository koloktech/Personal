document.getElementById('year').textContent = new Date().getFullYear();

// Typewriter — rotating role/task phrases
(() => {
  const el = document.getElementById('twText');
  if (!el) return;
  const phrases = [
    'agentic AI systems',
    'RAG pipelines over messy data',
    'LLM-powered workflow automation',
    'offline, privacy-first AI',
    'SCADA × AI integrations',
    'production ML for engineering ops'
  ];
  let p = 0, c = 0, deleting = false;
  const tick = () => {
    const word = phrases[p];
    el.textContent = word.slice(0, c);
    if (!deleting && c < word.length) { c++; setTimeout(tick, 55); }
    else if (deleting && c > 0)       { c--; setTimeout(tick, 25); }
    else {
      if (!deleting) { deleting = true; setTimeout(tick, 1600); }
      else { deleting = false; p = (p + 1) % phrases.length; setTimeout(tick, 250); }
    }
  };
  tick();
})();

// Hero neural-network canvas — nodes + connecting lines + subtle packets
(() => {
  const canvas = document.getElementById('heroNet');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, nodes = [], packets = [];

  const resize = () => {
    const dpr = window.devicePixelRatio || 1;
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const init = () => {
    resize();
    const count = Math.min(70, Math.floor((w * h) / 16000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.6
    }));
  };

  const spawnPacket = () => {
    if (nodes.length < 2) return;
    const a = nodes[Math.floor(Math.random() * nodes.length)];
    const b = nodes[Math.floor(Math.random() * nodes.length)];
    if (a === b) return;
    packets.push({ a, b, t: 0, speed: 0.006 + Math.random() * 0.01 });
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    const maxDist = 140;

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;

      for (let j = i + 1; j < nodes.length; j++) {
        const m = nodes[j];
        const dx = n.x - m.x, dy = n.y - m.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < maxDist) {
          const alpha = (1 - d / maxDist) * 0.35;
          ctx.strokeStyle = `rgba(124, 243, 196, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
        }
      }

      ctx.fillStyle = 'rgba(124, 243, 196, 0.85)';
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
    }

    packets = packets.filter(p => {
      p.t += p.speed;
      if (p.t >= 1) return false;
      const x = p.a.x + (p.b.x - p.a.x) * p.t;
      const y = p.a.y + (p.b.y - p.a.y) * p.t;
      ctx.fillStyle = 'rgba(110, 168, 255, 0.95)';
      ctx.shadowColor = 'rgba(110, 168, 255, 0.8)';
      ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      return true;
    });

    requestAnimationFrame(draw);
  };

  init();
  draw();
  setInterval(spawnPacket, 420);
  window.addEventListener('resize', init);
})();

document.querySelectorAll('.logo-item img').forEach(img => {
  img.addEventListener('error', () => {
    const label = img.nextElementSibling?.textContent?.trim() || '';
    const badge = document.createElement('span');
    badge.className = 'logo-text';
    badge.textContent = label.split(/[\s/]/)[0].slice(0, 5).toUpperCase() || '◆';
    img.replaceWith(badge);
  });
});

const root = document.documentElement;
const toggle = document.getElementById('themeToggle');
const stored = localStorage.getItem('theme');
if (stored) root.setAttribute('data-theme', stored);

toggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  root.setAttribute('data-theme', current);
  localStorage.setItem('theme', current);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.project-card');
filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    cards.forEach(card => {
      const cats = card.dataset.cat || '';
      card.classList.toggle('hidden', f !== 'all' && !cats.split(' ').includes(f));
    });
  });
});

document.querySelectorAll('.project-card, .pillar, .timeline li, .skill-col').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
