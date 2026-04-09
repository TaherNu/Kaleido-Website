/* ============================================================
   KALEIDO PICTURES — CONTACT-ANIMATIONS.JS
   Add <script src="contact-animations.js"></script>
   as the LAST tag before </body>, after your existing <script>
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. SCROLL PROGRESS BAR ── */
  const bar = document.createElement('div');
  bar.id = 'k-progress';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    bar.style.width = (pct * 100).toFixed(1) + '%';
  }, { passive: true });


  /* ── 2. CURSOR GLOW ── */
  const glow = document.createElement('div');
  glow.id = 'k-cursor-glow';
  document.body.appendChild(glow);
  let gx = 0, gy = 0, glowRaf;
  document.addEventListener('mousemove', e => {
    gx = e.clientX; gy = e.clientY;
    if (!glowRaf) glowRaf = requestAnimationFrame(() => {
      glow.style.left = gx + 'px';
      glow.style.top  = gy + 'px';
      glowRaf = null;
    });
  });


  /* ── 3. NAVBAR COMPACT + LOGO SWAP ── */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('nav--compact', window.scrollY > 80);
    document.body.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });


  /* ── 4. REUSABLE OBSERVER ── */
  function observe(el, callback, options = {}) {
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { callback(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12, ...options });
    obs.observe(el);
  }


  /* ── 5. HERO — contact rectangle ── */
  const contactRect = document.querySelector('.contact-rectangle');
  const contactTitle = document.querySelector('.contact-title');
  const contactDesc  = document.querySelector('.contact-description');

  // Trigger on load (it's in viewport immediately)
  setTimeout(() => {
    if (contactRect)  contactRect.classList.add('rect-in');
    setTimeout(() => { if (contactTitle) contactTitle.classList.add('title-in'); }, 300);
    setTimeout(() => { if (contactDesc)  contactDesc.classList.add('desc-in');   }, 700);
  }, 200);


  /* ── 6. FORM HEADING — wrap text in span for clip reveal ── */
  const formHeading = document.querySelector('.form-heading');
  if (formHeading && !formHeading.dataset.wrapped) {
    formHeading.dataset.wrapped = 'true';
    const inner = document.createElement('span');
    inner.innerHTML = formHeading.innerHTML;
    formHeading.innerHTML = '';
    formHeading.appendChild(inner);
  }


  /* ── 7. GET IN TOUCH SECTION ── */
  const orangeRect = document.querySelector('.orange-rectangle');
  observe(orangeRect, el => {
    el.classList.add('orange-in');

    // Stagger the 3 contact cards
    const cards = document.querySelectorAll('.contact-card');
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add('card-in'), 400 + i * 130);
    });
  }, { threshold: 0.1 });


  /* ── 8. CONTACT CARDS — 3D tilt + magnetic ── */
  document.querySelectorAll('.contact-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `translateY(-8px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });


  /* ── 9. AVAILABILITY SECTION ── */
  const availSquare = document.querySelector('.availability-square');
  const availPara   = document.querySelector('.availability-paragraph');

  // Wrap "24–48 hours" in highlight span
  if (availPara && !availPara.dataset.wrapped) {
    availPara.dataset.wrapped = 'true';
    availPara.innerHTML = availPara.innerHTML.replace(
      '24–48 hours',
      '<span class="avail-highlight">24–48 hours</span>'
    );
  }

  observe(availSquare, el => {
    el.classList.add('avail-in');
    setTimeout(() => {
      if (availPara) availPara.classList.add('avail-text-in');
    }, 200);
  }, { threshold: 0.15 });

  /* Parallax on availability square */
  window.addEventListener('scroll', () => {
    if (!availSquare) return;
    const rect = availSquare.getBoundingClientRect();
    const center = rect.top + rect.height / 2 - window.innerHeight / 2;
    availSquare.style.backgroundPositionY = `calc(50% + ${(center * 0.05).toFixed(1)}px)`;
  }, { passive: true });


  /* ── 10. MAGNETIC BUTTONS ── */
  document.querySelectorAll('.card-btn, .movement-btn, .work-with-us').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top  - r.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });


  /* ── 11. CONTACT TITLE LETTER SPLIT ── */
  function splitLetters(el, baseDelay = 0) {
    if (!el || el.dataset.split) return;
    el.dataset.split = 'true';
    // Handle <br> tags
    const html = el.innerHTML;
    const lines = html.split(/<br\s*\/?>/i);
    el.innerHTML = '';
    lines.forEach((line, lineIdx) => {
      const text = line.replace(/<[^>]+>/g, ''); // strip any inner tags
      [...text].forEach((ch, i) => {
        const s = document.createElement('span');
        const delay = baseDelay + (lineIdx * text.length * 0.025) + i * 0.025;
        s.style.cssText = `
          display: inline-block;
          opacity: 0;
          transform: translateY(50%) skewX(-3deg);
          transition: opacity 0.5s ease ${delay}s,
                      transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}s;
        `;
        s.textContent = ch === ' ' ? '\u00A0' : ch;
        el.appendChild(s);
      });
      if (lineIdx < lines.length - 1) el.appendChild(document.createElement('br'));
    });
  }

  splitLetters(contactTitle, 0.3);

  // Trigger letter animation once title-in fires
  const titleObserver = new MutationObserver(() => {
    if (contactTitle && contactTitle.classList.contains('title-in')) {
      contactTitle.querySelectorAll('span').forEach(s => {
        s.style.opacity = '1';
        s.style.transform = 'translateY(0) skewX(0deg)';
      });
      titleObserver.disconnect();
    }
  });
  if (contactTitle) titleObserver.observe(contactTitle, { attributes: true, attributeFilter: ['class'] });


  /* ── 12. FOOTER COLUMNS STAGGER ── */
  document.querySelectorAll('.footer-col').forEach((col, i) => {
    col.style.transitionDelay = (i * 0.1) + 's';
    observe(col, el => el.classList.add('footer-col-in'), { threshold: 0.2 });
  });

  const footerLogo = document.querySelector('.footer-logo-img');
  if (footerLogo) {
    footerLogo.classList.add('k-reveal');
    observe(footerLogo, el => el.classList.add('k-reveal--visible'));
  }


  /* ── 13. FORM DESCRIPTION FADE ── */
  const formDesc = document.querySelector('.form-description');
  if (formDesc) {
    formDesc.classList.add('k-reveal');
    observe(formDesc, el => el.classList.add('k-reveal--visible'));
  }


  /* ── 14. CONTACT RECTANGLE HOVER PARALLAX ── */
  if (contactRect) {
    contactRect.addEventListener('mousemove', e => {
      const r = contactRect.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      contactRect.style.backgroundPosition = `calc(50% + ${x * 15}px) calc(50% + ${y * 10}px)`;
    });
    contactRect.addEventListener('mouseleave', () => {
      contactRect.style.backgroundPosition = 'center';
    });
  }

})();