/* ============================================================
   KALEIDO PICTURES — SERVICES PAGE ANIMATIONS JS
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
  const heroRect = document.querySelector('.services-hero-rectangle');
  if (heroRect) {
    heroRect.style.opacity = '0';
    heroRect.style.transform = 'scale(0.96) translateY(30px)';
    setTimeout(() => {
      heroRect.style.transition = 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
      heroRect.style.opacity = '1';
      heroRect.style.transform = 'scale(1) translateY(0)';
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
    splitHeadingToWords(document.querySelector('.services-hero-heading'), 0.3);

    const btns = document.querySelector('.services-hero-buttons');
    if (btns) btns.classList.add('k-btn-visible');

    const para = document.querySelector('.services-hero-paragraph');
    if (para) para.classList.add('k-para-visible');
  }, 100);


  /* ── 7. HERO PARALLAX ── */
  const heroRectEl = document.querySelector('.services-hero-rectangle');
  if (heroRectEl) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        heroRectEl.style.backgroundPositionY = (window.scrollY * 0.3) + 'px';
      }
    }, { passive: true });
  }


  /* ── 8. WE / DO — ENTRANCE ── */
  const weText = document.querySelector('.we-text');
  const doText = document.querySelector('.do-text');
  const weDo = document.querySelector('.services-we-do');

  if (weDo) {
    const weDoObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (weText) revealObserver.observe(weText);
          if (doText) revealObserver.observe(doText);
          weDoObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    weDoObs.observe(weDo);
  }


  /* ── 9. SERVICE CARDS ENTRANCE ── */
  const serviceCards = document.querySelectorAll('.service-card');
  const serviceCardsSection = document.querySelector('.services-we-do-cards');

  if (serviceCardsSection && serviceCards.length) {
    const cardObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          serviceCards.forEach((card, i) => {
            setTimeout(() => {
              card.classList.add('k-card-visible');
              // Allow transition override so expansion still works
              card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)';
            }, i * 120);
          });
          cardObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    cardObs.observe(serviceCardsSection);
  }


  /* ── 10. PROCESS HEADING UNDERLINE ── */
  const processHeading = document.querySelector('.process-heading');
  if (processHeading) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('heading-line-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(processHeading);
  }


  /* ── 11. PROCESS SQUARES STAGGER ENTRANCE ── */
  const processSquares = document.querySelectorAll('.process-square');
  const processSection = document.querySelector('.our-process');

  if (processSection && processSquares.length) {
    const squareObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          processSquares.forEach((sq, i) => {
            setTimeout(() => {
              sq.classList.add('k-square-visible');
            }, i * 90);
          });
          squareObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    squareObs.observe(processSection);
  }


  /* ── 12. WORK GALLERY HEADING UNDERLINE ── */
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


  /* ── 13. GALLERY CARDS 3D TILT ── */
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


  /* ── 14. WHY KALEIDO HEADING UNDERLINE ── */
  const whyHeading = document.querySelector('.why-kaleido-heading');
  if (whyHeading) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('heading-line-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(whyHeading);
  }


  /* ── 15. WHY KALEIDO CARDS ENTRANCE ── */
  const whyCards = document.querySelectorAll('.why-card');
  const whySection = document.querySelector('.why-kaleido-section');

  // Original rotations to restore after entrance
  const whyRotations = ['rotate(3.36deg)', 'rotate(-2.66deg)', 'rotate(7.61deg)', 'rotate(-3.16deg)'];

  if (whySection && whyCards.length) {
    const whyObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          whyCards.forEach((card, i) => {
            setTimeout(() => {
              card.classList.add('k-card-visible');
              // Restore original rotation
              card.style.transform = whyRotations[i] || '';
            }, i * 130);
          });
          whyObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    whyObs.observe(whySection);
  }


  /* ── 16. APPLY GENERAL REVEAL CLASSES ── */
  function applyRevealClasses() {
    // Gallery description
    const galleryDesc = document.querySelector('.gallery-main-description');
    if (galleryDesc) {
      galleryDesc.classList.add('k-reveal', 'k-reveal--right');
      revealObserver.observe(galleryDesc);
    }

    // Footer columns
    document.querySelectorAll('.footer-col').forEach(el => {
      el.classList.add('k-reveal');
      revealObserver.observe(el);
    });

    const footerLogo = document.querySelector('.footer-logo-img');
    if (footerLogo) {
      footerLogo.classList.add('k-reveal');
      revealObserver.observe(footerLogo);
    }
  }

  applyRevealClasses();


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


  /* ── 18. WHY KALEIDO SECTION PARALLAX ── */
  const whySection2 = document.querySelector('.why-kaleido-section');
  if (whySection2) {
    window.addEventListener('scroll', () => {
      const rect = whySection2.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (window.innerHeight - rect.top) * 0.12;
        whySection2.style.backgroundPositionY = offset + 'px';
      }
    }, { passive: true });
  }


  /* ── 19. MAGNETIC HOVER ON BUTTONS ── */
  document.querySelectorAll('.services-btn, .work-with-us, .card-explore-btn, .gallery-card-btn, .movement-btn').forEach(btn => {
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


  /* ── 20. SMOOTH ANCHOR SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ── 21. FOOTER LINKS HOVER NUDGE ── */
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