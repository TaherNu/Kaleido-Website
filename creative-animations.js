/* ============================================================
   KALEIDO PICTURES — CREATIVE PAGE ANIMATIONS JS
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


  /* ── 5. HERO — CREATIVE TITLE WORD SPLIT ── */
  function splitTitleToWords(el, baseDelay = 0.2) {
    if (!el || el.dataset.split) return;
    el.dataset.split = 'true';

    // Handle <br> tags by splitting on them first
    const rawHTML = el.innerHTML;
    const lines = rawHTML.split(/<br\s*\/?>/i);

    el.innerHTML = '';
    lines.forEach((line, lineIdx) => {
      const words = line.trim().split(/\s+/);
      words.forEach((word, wordIdx) => {
        const span = document.createElement('span');
        span.className = 'creative-word';
        span.textContent = word;
        const delay = baseDelay + (lineIdx * words.length + wordIdx) * 0.12;
        span.style.animationDelay = delay + 's';
        el.appendChild(span);
        if (wordIdx < words.length - 1) {
          el.appendChild(document.createTextNode('\u00A0'));
        }
      });
      if (lineIdx < lines.length - 1) {
        el.appendChild(document.createElement('br'));
      }
    });
  }

  setTimeout(() => {
    const creativeTitle = document.querySelector('.creative-title');
    splitTitleToWords(creativeTitle, 0.3);

    // Buttons and description fade in after title
    const btns = document.querySelector('.creative-buttons');
    if (btns) btns.classList.add('k-btn-visible');

    const desc = document.querySelector('.creative-description');
    if (desc) desc.classList.add('k-desc-visible');
  }, 100);


  /* ── 6. CREATIVE RECTANGLE ENTRANCE ── */
  const creativeRect = document.querySelector('.creative-rectangle');
  if (creativeRect) {
    creativeRect.style.opacity = '0';
    creativeRect.style.transform = 'scale(0.96) translateY(30px)';
    creativeRect.style.transition = 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
    setTimeout(() => {
      creativeRect.style.opacity = '1';
      creativeRect.style.transform = 'scale(1) translateY(0)';
    }, 80);
  }


  /* ── 7. APPLY REVEAL CLASSES TO PAGE ELEMENTS ── */
  function applyRevealClasses() {

    // Heading clip reveals
    ['.portfolio-heading', '.why-heading', '.ready-heading-white', '.ready-heading-yellow', '.frame-main-title'].forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (!el.classList.contains('k-clip-reveal') && !el.classList.contains('k-reveal')) {
          const inner = document.createElement('span');
          inner.innerHTML = el.innerHTML;
          el.innerHTML = '';
          el.classList.add('k-clip-reveal');
          el.appendChild(inner);
          clipObserver.observe(el);
        }
      });
    });

    // Subheadings and badges — plain reveal
    document.querySelectorAll(
      '.portfolio-subheading, .portfolio-badge, .ready-subheading, .portfolio-content'
    ).forEach(el => {
      el.classList.add('k-reveal');
      revealObserver.observe(el);
    });

    // Portfolio button
    const portfolioBtn = document.querySelector('.portfolio-btn');
    if (portfolioBtn) {
      portfolioBtn.classList.add('k-reveal');
      revealObserver.observe(portfolioBtn);
    }

    // Why rectangles — staggered
    const whyRects = document.querySelector('.why-rectangles');
    if (whyRects) {
      whyRects.classList.add('k-stagger');
      staggerObserver.observe(whyRects);
    }

    // Footer columns
    document.querySelectorAll('.footer-col').forEach(el => {
      el.classList.add('k-reveal');
      revealObserver.observe(el);
    });

    // Footer logo
    const footerLogo = document.querySelector('.footer-logo-img');
    if (footerLogo) {
      footerLogo.classList.add('k-reveal');
      revealObserver.observe(footerLogo);
    }

    // Ready section heading lines
    document.querySelectorAll('.ready-heading-white, .ready-heading-yellow').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.15) + 's';
      el.classList.add('k-reveal');
      revealObserver.observe(el);
    });

    // Frames slider container
    const framesSlider = document.querySelector('.frames-slider-container');
    if (framesSlider) {
      framesSlider.classList.add('k-reveal', 'k-reveal--scale');
      revealObserver.observe(framesSlider);
    }

    // Portfolio slider
    const portfolioSlider = document.querySelector('.portfolio-slider');
    if (portfolioSlider) {
      portfolioSlider.classList.add('k-reveal');
      revealObserver.observe(portfolioSlider);
    }
  }

  applyRevealClasses();


  /* ── 8. PORTFOLIO HEADING UNDERLINE ── */
  const portfolioHeading = document.querySelector('.portfolio-heading');
  if (portfolioHeading) {
    const headObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('heading-line-visible');
          headObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    headObserver.observe(portfolioHeading);
  }

  /* ── 9. WHY HEADING UNDERLINE ── */
  const whyHeading = document.querySelector('.why-heading');
  if (whyHeading) {
    const whyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('heading-line-visible');
          whyObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    whyObserver.observe(whyHeading);
  }


  /* ── 10. FRAMES SLIDER — SLIDE CONTENT ANIMATION ── */
  // Intercept slide changes to re-trigger animations on the active slide
  const originalChangeFn = window.changeFrameSlide;
  const originalDots = document.querySelectorAll('.frames-dot');
  const originalPrev = document.querySelector('.frames-prev');
  const originalNext = document.querySelector('.frames-next');

  function triggerSlideContentAnim() {
    const activeSlide = document.querySelector('.frame-slide.active');
    if (!activeSlide) return;
    const title = activeSlide.querySelector('.frame-main-title, .frame-title');
    const text = activeSlide.querySelector('.frame-text');
    if (title) {
      title.style.animation = 'none';
      // Force reflow
      void title.offsetWidth;
      title.style.animation = '';
    }
    if (text) {
      text.style.animation = 'none';
      void text.offsetWidth;
      text.style.animation = '';
    }
  }

  // Observe slide changes via MutationObserver on the slider container
  const framesContainer = document.querySelector('.frames-slider-container');
  if (framesContainer) {
    const slideObserver = new MutationObserver(() => {
      triggerSlideContentAnim();
    });
    slideObserver.observe(framesContainer, {
      subtree: true,
      attributeFilter: ['class']
    });
  }


  /* ── 11. MAGNETIC HOVER ON BUTTONS ── */
  document.querySelectorAll('.creative-btn, .work-with-us, .ready-btn, .portfolio-btn, .frames-nav-btn').forEach(btn => {
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


  /* ── 12. PORTFOLIO CARD 3D TILT ── */
  document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `scale(1.04) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ── 13. SMOOTH ANCHOR SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ── 14. CREATIVE RECTANGLE PARALLAX ON SCROLL ── */
  const creativePage = document.querySelector('.creative-rectangle');
  if (creativePage) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        creativePage.style.backgroundPositionY = (window.scrollY * 0.3) + 'px';
      }
    }, { passive: true });
  }


  /* ── 15. WHY RECTANGLES ENTRANCE STAGGER ── */
  const whyRectEls = document.querySelectorAll('.why-rect');
  const whySection = document.querySelector('.why-kaleido');

  if (whySection && whyRectEls.length) {
    whyRectEls.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = el.style.transform + ' translateY(50px)';
    });

    const whySectionObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          whyRectEls.forEach((el, i) => {
            setTimeout(() => {
              el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
              el.style.opacity = '1';
              // Restore original rotations, just remove the translateY
              const baseTransforms = ['rotate(10.6deg)', 'rotate(-2.66deg)', 'rotate(7.61deg)'];
              el.style.transform = baseTransforms[i] || '';
            }, i * 150);
          });
          whySectionObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    whySectionObs.observe(whySection);
  }




  /* ── 17. FOOTER LINKS HOVER NUDGE ── */
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