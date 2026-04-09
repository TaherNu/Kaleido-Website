/* ============================================================
   KALEIDO PICTURES — WORK PAGE ANIMATIONS JS
   Add this <script> as the LAST tag before </body>,
   after your existing <script> block.
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. SCROLL PROGRESS BAR ── */
  const progressBar = document.createElement('div');
  progressBar.id = 'k-progress';
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = ((scrolled / total) * 100).toFixed(1) + '%';
  }, { passive: true });


  /* ── 2. CURSOR GLOW ── */
  const cursorGlow = document.createElement('div');
  cursorGlow.id = 'k-cursor-glow';
  document.body.appendChild(cursorGlow);

  let glowX = 0, glowY = 0, raf;
  document.addEventListener('mousemove', (e) => {
    glowX = e.clientX;
    glowY = e.clientY;
    if (!raf) {
      raf = requestAnimationFrame(() => {
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top  = glowY + 'px';
        raf = null;
      });
    }
  });


  /* ── 3. NAVBAR COMPACT ON SCROLL ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('nav--compact', window.scrollY > 80);
    }, { passive: true });
  }


  /* ── 4. INTERSECTION OBSERVER INSTANCES ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('k-reveal--visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  const clipObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('k-clip-reveal--visible');
        clipObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });


  /* ── 5. HERO — RECTANGLE ENTRANCE ── */
  const workRect = document.querySelector('.work-rectangle');
  if (workRect) {
    workRect.style.opacity = '0';
    workRect.style.transform = 'scale(0.96) translateY(30px)';
    setTimeout(() => {
      workRect.style.transition = 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
      workRect.style.opacity = '1';
      workRect.style.transform = 'scale(1) translateY(0)';
    }, 80);
  }


  /* ── 6. HERO — HEADING WORD SPLIT ── */
  function splitHeadingToWords(el, baseDelay = 0.3) {
    if (!el || el.dataset.split) return;
    el.dataset.split = 'true';
    const rawHTML = el.innerHTML;
    const lines = rawHTML.split(/<br\s*\/?>/i);
    el.innerHTML = '';
    lines.forEach((line, lineIdx) => {
      const words = line.trim().split(/\s+/);
      words.forEach((word, wordIdx) => {
        const span = document.createElement('span');
        span.className = 'hero-word';
        span.textContent = word;
        const delay = baseDelay + (lineIdx * words.length + wordIdx) * 0.12;
        span.style.animationDelay = delay + 's';
        el.appendChild(span);
        if (wordIdx < words.length - 1) el.appendChild(document.createTextNode('\u00A0'));
      });
      if (lineIdx < lines.length - 1) el.appendChild(document.createElement('br'));
    });
  }

  setTimeout(() => {
    splitHeadingToWords(document.querySelector('.work-title'), 0.3);

    const desc = document.querySelector('.work-description');
    if (desc) desc.classList.add('k-para-visible');
  }, 100);


  /* ── 7. HERO PARALLAX ── */
  if (workRect) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        workRect.style.backgroundPositionY = (window.scrollY * 0.3) + 'px';
      }
    }, { passive: true });
  }


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


  /* ── 11. FEATURED FILMS — HEADING UNDERLINE ── */
  const filmsHeading = document.querySelector('.films-heading');
  if (filmsHeading) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('heading-line-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(filmsHeading);
  }


  /* ── 12. FILM CARDS — 3D TILT ── */
  document.querySelectorAll('.film-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-10px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ── 13. STORIES THAT STAY — HEADING UNDERLINE + CONTENT REVEAL ── */
  const storiesHeading = document.querySelector('.stories-stay-heading');
  if (storiesHeading) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('heading-line-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(storiesHeading);
  }

  const storiesContent = document.querySelector('.stories-stay-content');
  if (storiesContent) {
    revealObserver.observe(storiesContent);
  }

  /* ── 14. STORIES THAT STAY — PARALLAX ── */
  const storiesStay = document.querySelector('.stories-stay');
  if (storiesStay) {
    window.addEventListener('scroll', () => {
      const rect = storiesStay.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (window.innerHeight - rect.top) * 0.12;
        storiesStay.style.backgroundPositionY = offset + 'px';
      }
    }, { passive: true });
  }


  /* ── 15. SLIDING RECTANGLE — ENTRANCE ── */
  const slidingRect = document.querySelector('.sliding-rectangle');
  if (slidingRect) {
    slidingRect.style.opacity = '0';
    slidingRect.style.transform = 'scale(0.95) translateY(40px)';

    const rectObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          slidingRect.style.transition = 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
          slidingRect.style.opacity = '1';
          slidingRect.style.transform = 'scale(1) translateY(0)';
          rectObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    rectObs.observe(slidingRect);
  }


  /* ── 16. SLIDING RECTANGLE — CONTENT ANIMATION ON SLIDE CHANGE ── */
  // MutationObserver to re-trigger slide content animation on change
  const slidingSection = document.querySelector('.sliding-rectangle-section');
  if (slidingSection) {
    const slideChangeObs = new MutationObserver(() => {
      const activeContent = document.querySelector('.sliding-content.active');
      if (activeContent) {
        activeContent.style.animation = 'none';
        void activeContent.offsetWidth; // reflow
        activeContent.style.animation = '';
      }
    });
    slideChangeObs.observe(slidingSection, { subtree: true, attributeFilter: ['class'] });
  }


  /* ── 17. WORK GALLERY PARALLAX ── */
  const workGallery = document.querySelector('.work-gallery');
  if (workGallery) {
    window.addEventListener('scroll', () => {
      const rect = workGallery.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (window.innerHeight - rect.top) * 0.12;
        workGallery.style.backgroundPositionY = offset + 'px';
      }
    }, { passive: true });
  }


  /* ── 18. FEATURED FILMS PARALLAX ── */
  const featuredFilms = document.querySelector('.featured-films');
  if (featuredFilms) {
    window.addEventListener('scroll', () => {
      const rect = featuredFilms.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (window.innerHeight - rect.top) * 0.1;
        featuredFilms.style.backgroundPositionY = offset + 'px';
      }
    }, { passive: true });
  }


  /* ── 19. MAGNETIC HOVER ON BUTTONS ── */
  document.querySelectorAll('.work-with-us, .gallery-card-btn, .join-btn, .slide-btn, .movement-btn, .scroll-btn, .nav-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });


  /* ── 20. APPLY GENERAL REVEAL CLASSES ── */
  function applyRevealClasses() {
    document.querySelectorAll('.footer-col').forEach(el => {
      el.classList.add('k-reveal');
      revealObserver.observe(el);
    });

    const footerLogo = document.querySelector('.footer-logo-img');
    if (footerLogo) {
      footerLogo.classList.add('k-reveal');
      revealObserver.observe(footerLogo);
    }

    const storiesParag = document.querySelector('.stories-stay-paragraph');
    if (storiesParag) {
      storiesParag.classList.add('k-reveal');
      revealObserver.observe(storiesParag);
    }
  }

  applyRevealClasses();


  /* ── 21. SMOOTH ANCHOR SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ── 22. FOOTER LINKS HOVER NUDGE ── */
  document.querySelectorAll('.footer-links a').forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.paddingLeft = '6px';
      link.style.color = '#FF8F35';
    });
    link.addEventListener('mouseleave', () => {
      link.style.paddingLeft = '';
      link.style.color = '';
    });
  });

})();