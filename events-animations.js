/* ============================================================
   KALEIDO PICTURES — EVENTS PAGE ANIMATIONS JS
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

  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('k-stagger--visible');
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const clipObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('k-clip-reveal--visible');
        clipObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });


  /* ── 5. HERO — RECTANGLE ENTRANCE ── */
  const heroRect = document.querySelector('.events-hero-rectangle');
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
    splitHeadingToWords(document.querySelector('.events-hero-heading'), 0.3);

    const btns = document.querySelector('.events-hero-buttons');
    if (btns) btns.classList.add('k-btn-visible');

    const para = document.querySelector('.events-hero-paragraph');
    if (para) para.classList.add('k-para-visible');
  }, 100);


  /* ── 7. HERO — PARALLAX ── */
  const heroRectEl = document.querySelector('.events-hero-rectangle');
  if (heroRectEl) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        heroRectEl.style.backgroundPositionY = (window.scrollY * 0.3) + 'px';
      }
    }, { passive: true });
  }


  /* ── 8. APPLY GENERAL REVEAL CLASSES ── */
  function applyRevealClasses() {

    // Clip reveal headings
    ['.never-miss-heading'].forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (!el.classList.contains('k-clip-reveal')) {
          const inner = document.createElement('span');
          inner.innerHTML = el.innerHTML;
          el.innerHTML = '';
          el.classList.add('k-clip-reveal');
          el.appendChild(inner);
          clipObserver.observe(el);
        }
      });
    });

    // Plain reveals
    document.querySelectorAll(
      '.events-left-paragraph, .never-miss-text, .want-partner-text'
    ).forEach(el => {
      el.classList.add('k-reveal');
      revealObserver.observe(el);
    });

    // Want to partner headings (staggered)
    const wpHeading = document.querySelector('.want-partner-heading');
    const wpSubheading = document.querySelector('.want-partner-subheading');
    if (wpHeading) {
      wpHeading.style.transitionDelay = '0s';
      revealObserver.observe(wpHeading);
    }
    if (wpSubheading) {
      wpSubheading.style.transitionDelay = '0.15s';
      revealObserver.observe(wpSubheading);
    }

    // Want to partner text + button
    document.querySelectorAll('.want-partner-text, .want-partner-btn').forEach((el, i) => {
      el.classList.add('k-reveal');
      el.style.transitionDelay = (0.3 + i * 0.1) + 's';
      revealObserver.observe(el);
    });

    // Social icons group
    const socialIcons = document.querySelector('.social-icons');
    if (socialIcons) {
      revealObserver.observe(socialIcons);
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


  /* ── 9. UP NEXT — "UP NEXT" HEADING UNDERLINE ── */
  const upNextHeading = document.querySelector('.events-left-heading');
  if (upNextHeading) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('heading-line-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(upNextHeading);
  }


  /* ── 10. UP NEXT — EVENT ITEMS STAGGER ENTRANCE ── */
  const eventItems = document.querySelectorAll('.event-item');
  if (eventItems.length) {
    const eventObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stagger each visible item
          const allItems = [...eventItems];
          const idx = allItems.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('k-event-visible');
          }, idx * 120);
          eventObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    eventItems.forEach(item => eventObs.observe(item));
  }


  /* ── 11. BEYOND THE SCREEN — HEADING UNDERLINE ── */
  const beyondHeading = document.querySelector('.beyond-heading');
  if (beyondHeading) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('heading-line-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(beyondHeading);
  }


  /* ── 12. BEYOND THE SCREEN — CARDS ENTRANCE ── */
  const beyondCards = document.querySelectorAll('.beyond-card');
  if (beyondCards.length) {
    const beyondSection = document.querySelector('.beyond-screen');
    const cardEntObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          beyondCards.forEach((card, i) => {
            setTimeout(() => {
              card.classList.add('k-card-visible');
              // Restore the transition after entrance so expansion still works
              card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)';
            }, i * 120);
          });
          cardEntObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    if (beyondSection) cardEntObs.observe(beyondSection);
  }


  /* ── 13. NEVER MISS — HEADING UNDERLINE ── */
  const neverMissHeading = document.querySelector('.never-miss-heading');
  if (neverMissHeading) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('heading-line-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(neverMissHeading);
  }


  /* ── 14. NEVER MISS — SOCIAL ICONS STAGGER ── */
  const socialIconEls = document.querySelectorAll('.social-icon');
  const socialContainer = document.querySelector('.social-icons');
  if (socialContainer && socialIconEls.length) {
    socialIconEls.forEach(icon => {
      icon.style.opacity = '0';
      icon.style.transform = 'translateY(30px) scale(0.8)';
    });

    const iconsObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          socialIconEls.forEach((icon, i) => {
            setTimeout(() => {
              icon.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
              icon.style.opacity = '1';
              icon.style.transform = '';
            }, i * 100);
          });
          iconsObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    iconsObs.observe(socialContainer);
  }




  /* ── 16. NEVER MISS — PARALLAX ── */
  const neverMiss = document.querySelector('.never-miss');
  if (neverMiss) {
    window.addEventListener('scroll', () => {
      const rect = neverMiss.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (window.innerHeight - rect.top) * 0.12;
        neverMiss.style.backgroundPositionY = offset + 'px';
      }
    }, { passive: true });
  }


  /* ── 17. MAGNETIC HOVER ON BUTTONS ── */
  document.querySelectorAll('.events-btn, .work-with-us, .want-partner-btn, .card-learn-btn').forEach(btn => {
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


  /* ── 18. SMOOTH ANCHOR SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ── 19. FOOTER LINKS HOVER NUDGE ── */
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