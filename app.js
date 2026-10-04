// ---- App shell: router + renderers ----
const app = document.getElementById('app');
const siteNav = document.getElementById('siteNav');
const navLinks = document.querySelectorAll('.primary-nav a[data-route]');
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');

/* ---------------- Nav state ---------------- */
window.addEventListener('scroll', () => {
  siteNav.classList.toggle('scrolled', window.scrollY > 10);
});

navToggle?.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  primaryNav.classList.toggle('open');
});
primaryNav?.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    navToggle.classList.remove('open');
    primaryNav.classList.remove('open');
  }
});

function setActiveNav(route) {
  navLinks.forEach(a => a.classList.toggle('active', a.dataset.route === route));
}

/* ---------------- Reveal-on-scroll ---------------- */
let revealObserver;
function initReveal() {
  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

/* ---------------- Router ---------------- */
function router() {
  const hash = window.location.hash || '#/';

  if (hash === '#about') {
    if (!document.getElementById('about')) {
      renderHome(() => scrollToAbout());
      setActiveNav('about');
    } else {
      scrollToAbout();
      setActiveNav('about');
    }
    return;
  }

  window.scrollTo({ top: 0, behavior: 'instant' in document.documentElement.style ? 'instant' : 'auto' });

  if (hash === '#/' || hash === '') {
    renderHome();
    setActiveNav(null);
  } else if (hash === '#/work') {
    renderWork('all');
    setActiveNav('work');
  } else if (hash.startsWith('#/work/')) {
    const cat = hash.replace('#/work/', '');
    if (CATEGORIES[cat]) {
      renderProject(cat);
      setActiveNav('work');
    } else {
      renderWork('all');
      setActiveNav('work');
    }
  } else if (hash === '#/films') {
    renderFilms();
    setActiveNav('films');
  } else if (hash === '#/contact') {
    renderContact();
    setActiveNav('contact');
  } else {
    renderHome();
    setActiveNav(null);
  }
}

function scrollToAbout() {
  const el = document.getElementById('about');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

window.addEventListener('hashchange', router);

/* ---------------- HOME ---------------- */
let heroTimer, heroIndex = 0, heroPaused = false;

function renderHome(afterRender) {
  app.innerHTML = `
    <section class="hero" id="heroSlider">
      ${HERO_SLIDES.map((s, i) => `
        <div class="hero-slide ${i === 0 ? 'active' : ''}" data-i="${i}">
          <img src="${s.img}" alt="${s.label}" style="object-position:${s.focus || 'center'};" />
        </div>
      `).join('')}
      <div class="hero-meta">
        <span class="label" id="heroLabel">${HERO_SLIDES[0].label}</span>
        <span class="label" id="heroCount">01 / ${String(HERO_SLIDES.length).padStart(2,'0')}</span>
      </div>
      <div class="hero-arrows">
        <button class="hero-arrow" id="heroPrev" aria-label="Previous slide">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 5l-7 7 7 7"/></svg>
        </button>
        <button class="hero-arrow" id="heroNext" aria-label="Next slide">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
      <div class="hero-progress"><div class="hero-progress-bar" id="heroProgress"></div></div>
    </section>

    <section class="intro reveal">
      <h1>Sanu Thompson</h1>
      <p class="role">Photographer · Filmmaker · Visual Storyteller</p>
      <p class="tagline">People, places and brands — images and films for the moments that deserve to be remembered.</p>
    </section>

    <section class="selected">
      <div class="selected-head reveal">
        <div>
          <span class="label">Selected Work</span>
          <h2 class="big">A few favourite stories.</h2>
        </div>
        <a href="#/work" class="view-all">View All Work →</a>
      </div>
      <div class="selected-grid">
        ${SELECTED_WORK.map(item => {
          const c = CATEGORIES[item.cat];
          return `
          <a href="#/work/${item.cat}" class="sg-item ${item.tileClass} reveal">
            <img src="${item.img}" alt="${c.label}" loading="lazy" />
            <div class="sg-overlay">
              <span class="sg-cat">${c.label}</span>
              <span class="sg-title">${c.title}</span>
              <span class="sg-link">View Project →</span>
            </div>
          </a>`;
        }).join('')}
      </div>
    </section>

    <section class="about" id="about">
      <div class="about-grid">
        <img class="reveal" src="assets/about-portrait.jpg" alt="Sanu Thompson" loading="lazy" />
        <div class="about-copy reveal">
          <span class="label">About</span>
          <h2 class="heading">A photographer who pays attention.</h2>
          <p>For over a decade, Sanu has photographed and filmed weddings, families, brands and everyday life, building a body of work that spans genres because people's stories don't fit into one category.</p>
          <p>His approach is rooted in observation, connection and storytelling, creating images and films that feel natural, honest and memorable.</p>
          <a href="#/work" class="about-more">More About Sanu →</a>
          <div class="about-facts">
            <div><span class="label">Studio</span><p>Chennai, India</p></div>
            <div><span class="label">Services</span><p>Photography · Films · Visual Content</p></div>
            <div><span class="label">Available</span><p>India · Worldwide</p></div>
          </div>
        </div>
      </div>
    </section>
  `;
  renderFooter();
  initReveal();
  initHero();
  if (afterRender) setTimeout(afterRender, 50);
}

function initHero() {
  clearInterval(heroTimer);
  heroIndex = 0;
  const slides = document.querySelectorAll('.hero-slide');
  const label = document.getElementById('heroLabel');
  const count = document.getElementById('heroCount');
  const progress = document.getElementById('heroProgress');
  const slider = document.getElementById('heroSlider');
  const DURATION = 5500;
  let start = Date.now();

  function show(i) {
    slides.forEach(s => s.classList.remove('active'));
    slides[i].classList.add('active');
    label.textContent = HERO_SLIDES[i].label;
    count.textContent = `${String(i + 1).padStart(2, '0')} / ${String(HERO_SLIDES.length).padStart(2, '0')}`;
    heroIndex = i;
    start = Date.now();
  }
  function next() { show((heroIndex + 1) % HERO_SLIDES.length); }
  function prev() { show((heroIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length); }

  function tick() {
    if (!heroPaused) {
      const elapsed = Date.now() - start;
      progress.style.width = Math.min(100, (elapsed / DURATION) * 100) + '%';
      if (elapsed >= DURATION) next();
    }
  }
  heroTimer = setInterval(tick, 60);

  document.getElementById('heroNext').addEventListener('click', next);
  document.getElementById('heroPrev').addEventListener('click', prev);
  slider.addEventListener('mouseenter', () => heroPaused = true);
  slider.addEventListener('mouseleave', () => heroPaused = false);

  // touch swipe
  let touchX = null;
  slider.addEventListener('touchstart', e => touchX = e.touches[0].clientX, { passive: true });
  slider.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    touchX = null;
  }, { passive: true });
}

/* ---------------- WORK (filterable grid) ---------------- */
function renderWork(activeFilter) {
  const allImages = [];
  CATEGORY_ORDER.forEach(key => {
    const c = CATEGORIES[key];
    c.images_sm.forEach((img, i) => {
      allImages.push({ cat: key, label: c.label, img, full: c.images_full[i] });
    });
  });

  function grid(filter) {
    const items = filter === 'all' ? allImages : allImages.filter(x => x.cat === filter);
    return items.map(it => `
      <div class="masonry-item reveal in" data-cat="${it.cat}" data-full="${it.full}">
        <img src="${it.img}" alt="${it.label}" loading="lazy" />
        <div class="mi-overlay"><span>${it.label}</span></div>
      </div>
    `).join('');
  }

  app.innerHTML = `
    <div class="page-head reveal">
      <span class="label">Work</span>
      <h1>Selected photographs</h1>
      <p>Across people, places, brands and everyday life — the full range of Sanu's commissioned and personal work.</p>
    </div>
    <div class="filters">
      <button class="filter-btn ${activeFilter==='all'?'active':''}" data-filter="all">All</button>
      ${CATEGORY_ORDER.map(key => `
        <button class="filter-btn ${activeFilter===key?'active':''}" data-filter="${key}">${CATEGORIES[key].label}</button>
      `).join('')}
    </div>
    <div class="masonry" id="masonryGrid">
      ${grid(activeFilter)}
    </div>
  `;
  renderFooter();
  initReveal();

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('masonryGrid').innerHTML = grid(btn.dataset.filter);
      bindMasonryClicks();
    });
  });
  bindMasonryClicks();

  function bindMasonryClicks() {
    document.querySelectorAll('.masonry-item').forEach(item => {
      item.addEventListener('click', () => {
        const cat = item.dataset.cat;
        const c = CATEGORIES[cat];
        const idx = c.images_full.indexOf(item.dataset.full);
        openLightbox(c.images_full, idx, c.label);
      });
    });
  }
}

/* ---------------- PROJECT / STORY PAGE ---------------- */
function renderProject(key) {
  const c = CATEGORIES[key];
  const idx = CATEGORY_ORDER.indexOf(key);
  const prevKey = CATEGORY_ORDER[(idx - 1 + CATEGORY_ORDER.length) % CATEGORY_ORDER.length];
  const nextKey = CATEGORY_ORDER[(idx + 1) % CATEGORY_ORDER.length];
  const imgs = c.images_full;

  // Build an editorial sequence: first image as big hero, rest in a varied 2-col grid
  const [heroImg, ...rest] = imgs;

  app.innerHTML = `
    <div class="project-head reveal">
      <span class="label">${c.label}</span>
      <h1>${c.title}</h1>
      <p class="project-meta">${c.location}</p>
      <p class="project-desc">${c.description}</p>
    </div>
    <div class="project-hero reveal">
      <img src="${heroImg}" alt="${c.title}" data-idx="0" loading="lazy" />
    </div>
    <div class="project-sequence">
      ${rest.map((img, i) => `
        <div class="ps-item ${i % 5 === 0 ? 'wide' : ''} reveal">
          <img src="${img}" alt="${c.title}" data-idx="${i + 1}" loading="lazy" />
        </div>
      `).join('')}
    </div>
    <div class="project-nav reveal">
      <a href="#/work/${prevKey}">← ${CATEGORIES[prevKey].label}<br><span style="font-size:9px;opacity:.6;">Previous Project</span></a>
      <a href="#/work/${nextKey}" class="next">${CATEGORIES[nextKey].label} →<br><span style="font-size:9px;opacity:.6;">Next Project</span></a>
    </div>
  `;
  renderFooter();
  initReveal();

  app.querySelectorAll('img[data-idx]').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      openLightbox(imgs, parseInt(img.dataset.idx, 10), c.label);
    });
  });
}

/* ---------------- FILMS ---------------- */
function renderFilms() {
  const featured = FILMS.find(f => f.featured);
  const rest = FILMS.filter(f => !f.featured);

  app.innerHTML = `
    <div class="page-head reveal">
      <span class="label">Films</span>
      <h1>Motion work</h1>
      <p>Wedding, brand and product films — the same eye for story, in motion.</p>
    </div>
    <div class="film-featured reveal">
      <div class="film-card" data-key="${featured.key}">
        <img src="${featured.thumb}" alt="${featured.title}" loading="lazy" />
        <div class="film-play">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <div class="film-info">
          <span class="label">${featured.kind}</span>
          <h3>${featured.title}</h3>
        </div>
      </div>
    </div>
    <div class="film-list">
      ${rest.map(f => `
        <div class="film-card reveal" data-key="${f.key}">
          <img src="${f.thumb}" alt="${f.title}" loading="lazy" />
          <div class="film-play">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
          </div>
          <div class="film-info">
            <span class="label">${f.kind}</span>
            <h3>${f.title}</h3>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  renderFooter();
  initReveal();

  document.querySelectorAll('.film-card').forEach(card => {
    card.addEventListener('click', () => {
      const f = FILMS.find(x => x.key === card.dataset.key);
      openLightbox([f.thumb], 0, f.title);
    });
  });
}

/* ---------------- CONTACT ---------------- */
function renderContact() {
  app.innerHTML = `
    <div class="contact-wrap">
      <div class="contact-copy reveal">
        <span class="label">Contact</span>
        <h1>Let's work together.</h1>
        <p class="lead">Have a story, project or moment you'd like documented?</p>

        <form class="contact-form" id="contactForm">
          <div class="f-row">
            <label>Name</label>
            <input type="text" required />
          </div>
          <div class="f-row">
            <label>Email</label>
            <input type="email" required />
          </div>
          <div class="f-row">
            <label>Project Type</label>
            <select>
              <option>Wedding</option>
              <option>Portrait</option>
              <option>Family</option>
              <option>Commercial</option>
              <option>Food / Product</option>
              <option>Interior</option>
              <option>Film</option>
              <option>Other</option>
            </select>
          </div>
          <div class="f-row">
            <label>Message</label>
            <textarea rows="4"></textarea>
          </div>
          <button type="submit" class="submit-btn">Send Enquiry →</button>
          <p class="form-confirm" id="formConfirm">Thank you — your enquiry has been noted. Sanu will get back to you shortly.</p>
        </form>
      </div>
      <div class="contact-side reveal">
        <div class="block">
          <span class="label">Studio</span>
          <p>Chennai, India<br/>Available worldwide</p>
        </div>
        <div class="block">
          <span class="label">Email</span>
          <p>alphaandomega1708@gmail.com</p>
        </div>
        <div class="block">
          <span class="label">Phone</span>
          <p>+91 99627 51782</p>
        </div>
        <div class="block">
          <span class="label">Instagram</span>
          <p>@sanujoethompson</p>
        </div>
      </div>
    </div>
  `;
  renderFooter();
  initReveal();

  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('formConfirm').style.display = 'block';
    e.target.querySelector('.submit-btn').style.opacity = '.5';
    e.target.querySelector('.submit-btn').disabled = true;
  });
}

/* ---------------- FOOTER ---------------- */
function renderFooter() {
  const year = new Date().getFullYear();
  const footer = document.createElement('footer');
  footer.innerHTML = `
    <div class="footer-grid">
      <div class="footer-col">
        <span class="wordmark">Sanu Thompson</span>
        <span>Photography</span>
        <span>Films</span>
        <span>Visual Stories</span>
      </div>
      <div class="footer-col">
        <h4>Site</h4>
        <a href="#about">About</a>
        <a href="#/work">Work</a>
        <a href="#/films">Films</a>
        <a href="#/contact">Contact</a>
      </div>
      <div class="footer-col">
        <h4>Connect</h4>
        <a href="https://www.instagram.com/sanujoethompson/" target="_blank" rel="noopener">Instagram</a>
        <a href="mailto:alphaandomega1708@gmail.com">Email</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>Chennai, India · Available worldwide</span>
      <span>© ${year} Sanu Thompson</span>
    </div>
  `;
  app.appendChild(footer);
}

/* ---------------- LIGHTBOX ---------------- */
let lbImages = [], lbIndex = 0, lbCategory = '';
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCaption = document.getElementById('lbCaption');

function openLightbox(images, index, caption) {
  lbImages = images; lbIndex = index; lbCategory = caption || '';
  updateLightbox();
  lightbox.classList.add('open');
}
function updateLightbox() {
  lbImg.src = lbImages[lbIndex];
  lbCaption.textContent = `${lbCategory ? lbCategory + ' — ' : ''}${lbIndex + 1} / ${lbImages.length}`;
}
document.getElementById('lbClose').addEventListener('click', () => lightbox.classList.remove('open'));
document.getElementById('lbNext').addEventListener('click', () => { lbIndex = (lbIndex + 1) % lbImages.length; updateLightbox(); });
document.getElementById('lbPrev').addEventListener('click', () => { lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length; updateLightbox(); });
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') lightbox.classList.remove('open');
  if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % lbImages.length; updateLightbox(); }
  if (e.key === 'ArrowLeft') { lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length; updateLightbox(); }
});

/* ---------------- Init ---------------- */
router();
