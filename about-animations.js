/* ============================================================
   KALEIDO PICTURES — ABOUT-ANIMATIONS.JS
   Add <script src="about-animations.js"></script>
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


  /* ── 3. NAVBAR COMPACT ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('nav--compact', window.scrollY > 80);
    }, { passive: true });
  }


  /* ── 4. LOGO SWAP (about page has no .hero, so always swap after 80px) ── */
  window.addEventListener('scroll', () => {
    document.body.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });


  /* ── 5. HERO ENTRANCE ── */
  const heroHeading = document.querySelector('.about-hero-heading');
  const heroBtns    = document.querySelector('.about-hero-buttons');
  const heroPara    = document.querySelector('.about-hero-paragraph');

  setTimeout(() => {
    if (heroHeading) heroHeading.classList.add('hero-in');
  }, 150);
  setTimeout(() => {
    if (heroBtns) heroBtns.classList.add('hero-in');
  }, 500);
  setTimeout(() => {
    if (heroPara) heroPara.classList.add('hero-in');
  }, 800);


  /* ── 6. REUSABLE INTERSECTION OBSERVER FACTORY ── */
  function makeObserver(callback, options = {}) {
    return new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target);
          entry.target._obs && entry.target._obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, ...options });
  }


  /* ── 7. WHO ARE WE SECTION ── */
  const whoLeft  = document.querySelector('.who-left');
  const whoImage = document.querySelector('.who-image');
  const whoObs   = makeObserver(el => {
    whoLeft  && whoLeft.classList.add('who-in');
    whoImage && whoImage.classList.add('who-in');
  }, { threshold: 0.2 });
  if (whoLeft) { whoLeft._obs = whoObs; whoObs.observe(whoLeft); }


  /* ── 8. OUR VISION SECTION ── */
  const visionImg   = document.querySelector('.vision-image');
  const visionRight = document.querySelector('.vision-right');
  const visObs = makeObserver(el => {
    visionImg   && visionImg.classList.add('vision-in');
    visionRight && visionRight.classList.add('vision-in');
  }, { threshold: 0.2 });
  if (visionImg) { visionImg._obs = visObs; visObs.observe(visionImg); }


  /* ── 9. PARALLAX ON WHO + VISION IMAGES ── */
  const parallaxImages = [
    { el: document.querySelector('.who-image'),    speed: 0.06 },
    { el: document.querySelector('.vision-image'), speed: 0.06 },
  ];
  window.addEventListener('scroll', () => {
    parallaxImages.forEach(({ el, speed }) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.backgroundPositionY = `calc(50% + ${(center * speed).toFixed(1)}px)`;
    });
  }, { passive: true });



  /* ── 8. WORK GALLERY — HEADING UNDERLINE ── */
  const galleryTitle = document.querySelector('.gallery-main-title');
  if (galleryTitle) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('heading-line-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    obs.observe(galleryTitle);
  }


/* ── 9. WORK GALLERY — DESCRIPTION REVEAL ── */
const galleryDesc = document.querySelector('.gallery-main-description');
if (galleryDesc) {
  galleryDesc.classList.add('k-reveal', 'k-reveal--right');
  // Create the observer first
  const revealObserver = makeObserver(el => el.classList.add('k-reveal--visible'));
  revealObserver.observe(galleryDesc);
}


  /* ── 10. GALLERY CARDS — 3D TILT ── */
  document.querySelectorAll('.gallery-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-10px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── 11. OUR APPROACH - orange banner + stagger cards ── */
  const approachOrange = document.querySelector('.approach-orange');
  if (approachOrange) {
    const aoObs = makeObserver(el => el.classList.add('approach-in'));
    aoObs.observe(approachOrange);
  }

  /* Add step numbers to approach cards */
  document.querySelectorAll('.approach-card').forEach((card, i) => {
    const box = card.querySelector('.card-white-box');
    if (box) box.setAttribute('data-step', String(i + 1).padStart(2, '0'));
  });

  const approachCards = document.querySelector('.approach-cards');
  if (approachCards) {
    approachCards.classList.add('k-stagger');
    const acObs = makeObserver(() => approachCards.classList.add('k-stagger--visible'));
    acObs.observe(approachCards);
  }

  /* Magnetic hover on approach cards */
  document.querySelectorAll('.approach-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `translateY(-8px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });


  /* ── 12. WHY DOES IT MATTER ── */
  const mattersSection = document.querySelector('.why-matters');
  const mattersH       = document.querySelector('.matters-heading');
  const mattersP       = document.querySelector('.matters-paragraph');
  if (mattersSection) {
    const mObs = makeObserver(el => {
      mattersH && mattersH.classList.add('matters-in');
      mattersP && mattersP.classList.add('matters-in');
      mattersSection.classList.add('line-drawn');
    }, { threshold: 0.2 });
    mObs.observe(mattersSection);
  }


  /* ── 13. STORIES CRAFTED ── */
  const craftedH = document.querySelector('.crafted-heading');
  const craftedP = document.querySelector('.crafted-paragraph');
  if (craftedH) {
    const crObs = makeObserver(() => {
      craftedH.classList.add('crafted-in');
      craftedP && craftedP.classList.add('crafted-in');
    });
    crObs.observe(craftedH);
  }


  
  /* ── 14. ECHOES OF SILENCE ── */
  const echoesRect = document.querySelector('.echoes-rectangle');
  const echoesH    = document.querySelector('.echoes-heading');
  const echoesP    = document.querySelector('.echoes-paragraph');
  const echoesBtn  = document.querySelector('.echoes-btn');
  if (echoesRect) {
    const eObs = makeObserver(() => {
      echoesRect.classList.add('echoes-in');
      setTimeout(() => {
        echoesH   && echoesH.classList.add('echoes-text-in');
        echoesP   && echoesP.classList.add('echoes-text-in');
        echoesBtn && echoesBtn.classList.add('echoes-text-in');
      }, 300);
    }, { threshold: 0.1 });
    eObs.observe(echoesRect);
  }




  /* ── 16. FOOTER COLUMNS STAGGER ── */
  document.querySelectorAll('.footer-col').forEach((col, i) => {
    col.style.transitionDelay = (i * 0.1) + 's';
    const fObs = makeObserver(el => el.classList.add('footer-col-in'));
    fObs.observe(col);
  });

  const footerLogo = document.querySelector('.footer-logo-img');
  if (footerLogo) {
    footerLogo.classList.add('k-reveal');
    const flObs = makeObserver(el => el.classList.add('k-reveal--visible'));
    flObs.observe(footerLogo);
  }


  /* ── 17. MAGNETIC BUTTONS ── */
  document.querySelectorAll('.about-btn, .movement-btn, .work-with-us, .echoes-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top  - r.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });


  /* ── 18. WHO ARE WE HEADING — letter split ── */
  function splitLetters(el, baseDelay = 0) {
    if (!el || el.dataset.split) return;
    el.dataset.split = 'true';
    const text = el.textContent;
    el.textContent = '';
    el.style.overflow = 'hidden';
    [...text].forEach((ch, i) => {
      const s = document.createElement('span');
      s.style.cssText = `display:inline-block; opacity:0; transform:translateY(60%) skewX(-4deg);
        transition: opacity 0.5s ease ${baseDelay + i * 0.03}s, 
                    transform 0.5s cubic-bezier(0.16,1,0.3,1) ${baseDelay + i * 0.03}s`;
      s.textContent = ch === ' ' ? '\u00A0' : ch;
      s._isLetter = true;
      el.appendChild(s);
    });
  }

  /* Observe headings and trigger letter animation when visible */
  ['.who-heading', '.vision-heading'].forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;
    splitLetters(el, 0.1);
    const hObs = makeObserver(() => {
      el.querySelectorAll('span').forEach(s => {
        s.style.opacity = '1';
        s.style.transform = 'translateY(0) skewX(0deg)';
      });
    }, { threshold: 0.3 });
    hObs.observe(el);
  });


  /* ── 19. APPROACH HEADING clip reveal ── */
  const approachH = document.querySelector('.approach-heading');
  if (approachH) {
    const inner = document.createElement('span');
    inner.textContent = approachH.textContent;
    approachH.textContent = '';
    approachH.classList.add('k-clip-reveal');
    approachH.appendChild(inner);
    const ahObs = makeObserver(el => el.classList.add('k-clip-reveal--visible'), { threshold: 0.3 });
    ahObs.observe(approachH);
  }

  /* ── 20. WHO ARE WE paragraph fade ── */
  const whoP = document.querySelector('.who-paragraph');
  if (whoP) {
    whoP.classList.add('k-reveal');
    const wpObs = makeObserver(el => el.classList.add('k-reveal--visible'));
    wpObs.observe(whoP);
  }

  const visionP = document.querySelector('.vision-paragraph');
  if (visionP) {
    visionP.classList.add('k-reveal');
    const vpObs = makeObserver(el => el.classList.add('k-reveal--visible'));
    vpObs.observe(visionP);
  }

})();