/* ============================================================
   KALEIDO PICTURES — ANIMATIONS.JS
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


  /* ── 4. INTERSECTION OBSERVER — REVEAL SYSTEM ── */
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


  /* ── 5. APPLY REVEAL CLASSES TO ELEMENTS ── */
  function applyRevealClasses() {
    /* Section headings — clip reveal */
    ['.story-heading', '.films-heading', '.reel-heading', '.gallery-title'].forEach(sel => {
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

    /* Story subheading */
    document.querySelectorAll('.story-subheading, .gallery-description, .banner-paragraph').forEach(el => {
      el.classList.add('k-reveal');
      revealObserver.observe(el);
    });

    /* Rectangle cards */
    const rectLeft = document.querySelector('.rectangle-left');
    const rectRight = document.querySelector('.rectangle-right');
    if (rectLeft) { rectLeft.classList.add('k-reveal', 'k-reveal--left'); revealObserver.observe(rectLeft); }
    if (rectRight) { rectRight.classList.add('k-reveal', 'k-reveal--right'); revealObserver.observe(rectRight); }

    /* Film cards stagger */
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
      sliderContainer.classList.add('k-stagger');
      staggerObserver.observe(sliderContainer);
    }

    /* Filter buttons */
    const filterBtns = document.querySelector('.filter-buttons');
    if (filterBtns) {
      filterBtns.classList.add('k-stagger');
      staggerObserver.observe(filterBtns);
    }

    /* Studio reel container */
    const reelContainer = document.querySelector('.reel-container');
    if (reelContainer) {
      reelContainer.classList.add('k-reveal', 'k-reveal--scale');
      revealObserver.observe(reelContainer);
    }

    /* Orange banner content */
    const bannerContent = document.querySelector('.orange-banner-content');
    if (bannerContent) {
      bannerContent.classList.add('k-reveal');
      revealObserver.observe(bannerContent);
    }

    /* Footer columns */
    document.querySelectorAll('.footer-col').forEach(el => {
      el.classList.add('k-reveal');
      revealObserver.observe(el);
    });

    /* Service items */
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach((item, i) => {
      item.style.transitionDelay = (i * 0.08) + 's';
      item.classList.add('k-reveal');
      revealObserver.observe(item);
    });
  }

  applyRevealClasses();


  /* ── 6. STORY HEADING UNDERLINE ── */
  const storyHeading = document.querySelector('.story-heading');
  if (storyHeading) {
    const headingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('heading-line-visible');
          headingObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    headingObserver.observe(storyHeading);
  }


  /* ── 7. HERO PARALLAX ── */
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        hero.style.backgroundPositionY = (window.scrollY * 0.35) + 'px';
      }
    }, { passive: true });
  }


  /* ── 8. HERO TEXT CHAR SPLIT (presents + KALEIDO PICTURES) ── */
  function splitTextToChars(el, baseDelay = 0) {
    if (!el || el.dataset.split) return;
    el.dataset.split = 'true';
    const text = el.textContent;
    el.textContent = '';
    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'hero-char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.animationDelay = (baseDelay + i * 0.04) + 's';
      el.appendChild(span);
    });
  }

  /* Slightly delay to let page paint */
  setTimeout(() => {
    const presents = document.querySelector('.presents');
    splitTextToChars(presents, 0.6);
  }, 100);


  /* ── 9. SERVICE BANNER SMOOTH CONTENT SWAP ── */
  const orangeBanner = document.querySelector('.orange-banner-full');
  const origServiceHandler = window.__origServiceClick;

  if (orangeBanner) {
    const originalServiceItems = document.querySelectorAll('.service-item');
    const tagEl  = orangeBanner.querySelector('.banner-service-tag');
    const headEl = orangeBanner.querySelector('.banner-headline');
    const paraEl = orangeBanner.querySelector('.banner-paragraph');

    const serviceContent = {
      'story-development': {
        tag: 'STORY DEVELOPMENT',
        headline: 'SHAPING STORIES<br>THAT CAPTIVATE',
        paragraph: 'Every remarkable film begins with a story. At Kaleido Pictures, we take your ideas from spark to script, carefully shaping narratives that inspire, engage, and resonate. From brainstorming concepts and developing characters to storyboarding scenes and refining arcs, we lay the foundation for cinematic experiences that captivate audiences and leave a lasting impression. Your vision becomes our blueprint — a story crafted with creativity, precision, and emotion.'
      },
      'direction': {
        tag: 'DIRECTION & CINEMATOGRAPHY',
        headline: 'VISUAL STORYTELLING<br>THAT MOVES',
        paragraph: 'Our directors and cinematographers bring scripts to life through powerful visual language. We focus on composition, lighting, camera movement, and emotional beats to create stunning imagery that serves the story. Every frame is carefully crafted to evoke emotion, build tension, and immerse audiences in your world. From intimate close-ups to sweeping landscapes, we capture the essence of your narrative with cinematic excellence.'
      },
      'producing': {
        tag: 'PRODUCING & FILMING',
        headline: 'BRINGING VISIONS<br>TO REALITY',
        paragraph: 'Production is where planning meets execution. Our producing team manages budgets, schedules, locations, casting, and crew coordination to ensure smooth, efficient shoots. We handle the logistics so you can focus on creativity. From pre-production to the final day of filming, we ensure every detail aligns with your vision while maintaining professional standards and creative integrity.'
      },
      'post-production': {
        tag: 'POST-PRODUCTION & EDITING',
        headline: 'CRAFTING THE<br>FINAL MASTERPIECE',
        paragraph: 'The magic happens in post-production. Our editors, colorists, and sound designers transform raw footage into a polished, cohesive film. We handle editing, visual effects, color grading, sound design, and mixing to create a seamless viewing experience. Every cut, transition, and effect is meticulously refined until your story shines with clarity, emotion, and impact.'
      }
    };

    /* Enhance the existing click handler with animation */
    originalServiceItems.forEach(item => {
      item.addEventListener('click', () => {
        const key = item.getAttribute('data-service');
        const content = serviceContent[key];
        if (!content) return;

        /* Fade out */
        [tagEl, headEl, paraEl].forEach(el => {
          if (el) { el.style.opacity = '0'; el.style.transform = 'translateY(8px)'; el.style.transition = 'opacity 0.25s ease, transform 0.25s ease'; }
        });

        setTimeout(() => {
          if (tagEl) tagEl.textContent = content.tag;
          if (headEl) headEl.innerHTML = content.headline;
          if (paraEl) paraEl.textContent = content.paragraph;

          /* Fade in */
          [tagEl, headEl, paraEl].forEach((el, i) => {
            if (el) {
              setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
              }, i * 60);
            }
          });
        }, 260);
      });
    });
  }


  /* ── 10. PLAY ICON ON STUDIO REEL ── */
  const mainReel = document.querySelector('.main-reel');
  if (mainReel) {
    const playIcon = document.createElement('div');
    playIcon.className = 'reel-play-icon';
    mainReel.appendChild(playIcon);
  }


  /* ── 11. MAGNETIC HOVER ON SCROLL BUTTONS ── */
  document.querySelectorAll('.scroll-btn, .movement-btn, .work-with-us').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });


  /* ── 12. NUMBER COUNTER ANIMATION (stat in film card) ── */
  function animateCounter(el, target, duration = 1800) {
    let start = null;
    const startVal = 0;
    const isFloat = target % 1 !== 0;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (target - startVal) * eased;
      el.textContent = isFloat ? current.toFixed(1) : Math.round(current).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* Observe the card stats element */
  const cardStats = document.querySelector('.card-stats');
  if (cardStats) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          /* Animate "170,000 Supporters • 225M views" */
          cardStats.innerHTML = '';
          const span1 = document.createElement('span');
          span1.textContent = '0';
          const sep = document.createTextNode(' Supporters • ');
          const span2 = document.createElement('span');
          span2.textContent = '0';
          const end = document.createTextNode('M views');
          cardStats.appendChild(span1);
          cardStats.appendChild(sep);
          cardStats.appendChild(span2);
          cardStats.appendChild(end);
          animateCounter(span1, 170000, 1800);
          animateCounter(span2, 225, 1600);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statsObserver.observe(cardStats);
  }


  /* ── 13. HERO WORDS STAGGER ENTRANCE ── */
  const heroCorners = document.querySelectorAll('.top-left, .top-right, .bottom-left, .bottom-right');
  heroCorners.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    el.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = '';
    }, 300 + i * 150);
  });

  const heroCenter = document.querySelector('.kaleido-main');
  if (heroCenter) {
    heroCenter.style.opacity = '0';
    heroCenter.style.transform = 'scale(0.92)';
    heroCenter.style.transition = 'opacity 0.9s ease, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
    setTimeout(() => {
      heroCenter.style.opacity = '1';
      heroCenter.style.transform = 'scale(1)';
    }, 100);
  }

  const heroPara = document.querySelector('.bottom-paragraph');
  if (heroPara) {
    heroPara.style.opacity = '0';
    heroPara.style.transform = 'translateY(15px)';
    heroPara.style.transition = 'opacity 0.7s ease 0.8s, transform 0.7s ease 0.8s';
    setTimeout(() => {
      heroPara.style.opacity = '1';
      heroPara.style.transform = 'none';
    }, 900);
  }


  /* ── 14. MOVEMENT SECTION DESCRIPTION TYPEWRITER ── */
  /* The existing JS handles the slides — we just add a subtle entrance */
  const origChangeSlide = window.changeSlide;


  /* ── 15. CARD 3D TILT ON MOUSE MOVE ── */
  document.querySelectorAll('.film-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-10px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ── 16. FOOTER LOGO REVEAL ── */
  const footerLogo = document.querySelector('.footer-logo-img');
  if (footerLogo) {
    footerLogo.classList.add('k-reveal');
    revealObserver.observe(footerLogo);
  }


  /* ── 17. SMOOTH ANCHOR/SECTION TRANSITIONS ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();