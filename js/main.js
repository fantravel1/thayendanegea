/* ============================================================
   THAYENDANEGEA.COM — MAIN JAVASCRIPT
   Scroll Animations | Mobile Menu | Timeline | Tabs | Atlas
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     MOBILE NAVIGATION
     ---------------------------------------------------------- */
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileOverlay = document.querySelector('.mobile-overlay');

  function openMobileMenu() {
    if (!navToggle || !mobileMenu) return;
    navToggle.classList.add('active');
    mobileMenu.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!navToggle || !mobileMenu) return;
    navToggle.classList.remove('active');
    mobileMenu.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      if (mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close mobile menu on link click
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileMenu();
  });

  /* ----------------------------------------------------------
     HEADER SCROLL EFFECT
     ---------------------------------------------------------- */
  const header = document.querySelector('.site-header');
  let lastScrollY = 0;

  function handleHeaderScroll() {
    const scrollY = window.scrollY;
    if (!header) return;

    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ----------------------------------------------------------
     SCROLL REVEAL ANIMATIONS
     ---------------------------------------------------------- */
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children'
  );

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Unobserve after revealing (one-time animation)
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ----------------------------------------------------------
     TABS
     ---------------------------------------------------------- */
  document.querySelectorAll('.tabs').forEach(function (tabGroup) {
    const buttons = tabGroup.querySelectorAll('.tab-btn');
    const panelContainer = tabGroup.nextElementSibling;
    if (!panelContainer) return;
    const panels = panelContainer.parentElement.querySelectorAll('.tab-panel');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const target = btn.getAttribute('data-tab');

        // Deactivate all
        buttons.forEach(function (b) { b.classList.remove('active'); });
        panels.forEach(function (p) { p.classList.remove('active'); });

        // Activate target
        btn.classList.add('active');
        const targetPanel = document.getElementById(target);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });
  });

  /* ----------------------------------------------------------
     FILTER BUTTONS
     ---------------------------------------------------------- */
  document.querySelectorAll('.filter-bar').forEach(function (filterBar) {
    const buttons = filterBar.querySelectorAll('.filter-btn');
    const containerId = filterBar.getAttribute('data-target');
    const container = containerId ? document.getElementById(containerId) : null;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const filter = btn.getAttribute('data-filter');

        // Update active state
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        // Filter items
        if (container) {
          const items = container.children;
          Array.from(items).forEach(function (item) {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
              item.style.display = '';
              // Re-trigger animation
              item.style.opacity = '0';
              item.style.transform = 'translateY(15px)';
              requestAnimationFrame(function () {
                item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
              });
            } else {
              item.style.display = 'none';
            }
          });
        }
      });
    });
  });

  /* ----------------------------------------------------------
     TIMELINE FILTER (by era)
     ---------------------------------------------------------- */
  const timelineFilters = document.querySelectorAll('.timeline-filter-btn');
  if (timelineFilters.length > 0) {
    timelineFilters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const era = btn.getAttribute('data-era');
        const items = document.querySelectorAll('.timeline__item');

        timelineFilters.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        items.forEach(function (item) {
          if (era === 'all' || item.getAttribute('data-era') === era) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ----------------------------------------------------------
     SMOOTH SCROLL FOR ANCHOR LINKS
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 70;
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth',
        });
      }
    });
  });

  /* ----------------------------------------------------------
     ACTIVE NAV HIGHLIGHTING
     ---------------------------------------------------------- */
  function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }
  setActiveNav();

  /* ----------------------------------------------------------
     LAZY LOADING IMAGES (native + fallback)
     ---------------------------------------------------------- */
  // Add loading="lazy" to images that don't have it
  document.querySelectorAll('img:not([loading])').forEach(function (img) {
    img.setAttribute('loading', 'lazy');
  });

  /* ----------------------------------------------------------
     PARALLAX HERO (subtle)
     ---------------------------------------------------------- */
  const heroSection = document.querySelector('.hero');
  const heroBg = document.querySelector('.hero__bg img');

  if (heroSection && heroBg) {
    window.addEventListener(
      'scroll',
      function () {
        const scrollY = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        if (scrollY < heroHeight) {
          const parallaxY = scrollY * 0.3;
          heroBg.style.transform = 'translateY(' + parallaxY + 'px) scale(1.1)';
        }
      },
      { passive: true }
    );
  }

  /* ----------------------------------------------------------
     COUNTER ANIMATION (Stats)
     ---------------------------------------------------------- */
  function animateCounters() {
    const counters = document.querySelectorAll('.stat__number[data-count]');
    if (counters.length === 0) return;

    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'), 10);
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.round(eased * target);
              el.textContent = current.toLocaleString() + suffix;

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              }
            }

            requestAnimationFrame(updateCounter);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }
  animateCounters();

  /* ----------------------------------------------------------
     ATLAS MAP INITIALIZATION (if Leaflet is loaded)
     ---------------------------------------------------------- */
  function initAtlasMap() {
    const mapEl = document.getElementById('atlas-map');
    if (!mapEl || typeof L === 'undefined') return;

    // Create map centered on Haudenosaunee territory
    const map = L.map('atlas-map', {
      scrollWheelZoom: false,
    }).setView([43.5, -76.5], 7);

    // Stamen Watercolor tiles for historical feel (via Stadia Maps)
    L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg', {
      attribution:
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under ODbL.',
      maxZoom: 16,
    }).addTo(map);

    // Overlay labels
    L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.png', {
      attribution: '',
      maxZoom: 16,
      opacity: 0.6,
    }).addTo(map);

    // Custom marker icon
    var ochreIcon = L.divIcon({
      className: 'atlas-marker',
      html: '<svg width="24" height="32" viewBox="0 0 24 32"><path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z" fill="#C4883A" stroke="#8B6914" stroke-width="1"/><circle cx="12" cy="11" r="4" fill="#FAF8F3"/></svg>',
      iconSize: [24, 32],
      iconAnchor: [12, 32],
      popupAnchor: [0, -32],
    });

    // Historical places
    var places = [
      {
        lat: 42.95,
        lng: -74.18,
        name: 'Canajoharie (Upper Mohawk Castle)',
        period: 'c. 1743 — Birthplace Region',
        desc: 'The upper Mohawk community along the Mohawk River where Thayendanegea spent his early years. A center of Mohawk cultural and political life.',
        category: 'origins',
      },
      {
        lat: 42.82,
        lng: -73.94,
        name: "Fort Johnson / Johnson Hall",
        period: '1740s–1770s',
        desc: "Sir William Johnson's estate, where the young Thayendanegea entered the world of colonial diplomacy. Johnson's relationship with Molly Brant (Thayendanegea's sister) was pivotal.",
        category: 'diplomacy',
      },
      {
        lat: 42.45,
        lng: -76.50,
        name: "Moor's Charity School / Dartmouth",
        period: '1761–1763',
        desc: "Eleazar Wheelock's school in Lebanon, Connecticut, where Thayendanegea received formal English education, studying Latin, English literature, and Christianity.",
        category: 'origins',
      },
      {
        lat: 42.98,
        lng: -74.84,
        name: 'Fort Stanwix',
        period: '1768 Treaty / 1777 Siege',
        desc: 'Site of the 1768 Treaty of Fort Stanwix, which defined boundaries between colonial and Indigenous lands. Later besieged during the Revolutionary War.',
        category: 'conflict',
      },
      {
        lat: 42.68,
        lng: -74.97,
        name: 'Cherry Valley',
        period: 'November 1778',
        desc: 'The Cherry Valley engagement, a controversial episode of the border war. Historical accounts vary significantly between Indigenous and colonial perspectives.',
        category: 'conflict',
      },
      {
        lat: 42.15,
        lng: -77.09,
        name: "Newtown (Sullivan-Clinton Campaign)",
        period: 'August 1779',
        desc: "Site of the Battle of Newtown, where Thayendanegea's forces confronted the Sullivan-Clinton campaign — a devastating scorched-earth invasion of Haudenosaunee homeland.",
        category: 'conflict',
      },
      {
        lat: 44.23,
        lng: -76.48,
        name: 'Fort Haldimand (Carleton Island)',
        period: '1778–1783',
        desc: 'British military post where Haudenosaunee loyalist refugees gathered during the war. A staging point for campaigns and a place of displacement.',
        category: 'conflict',
      },
      {
        lat: 43.05,
        lng: -79.85,
        name: 'Fort Niagara',
        period: '1759–1780s',
        desc: 'Major British post and refugee center. Thousands of displaced Haudenosaunee people sheltered here during and after the Revolutionary War, enduring harsh conditions.',
        category: 'diplomacy',
      },
      {
        lat: 43.07,
        lng: -80.32,
        name: 'Six Nations of the Grand River',
        period: '1784 — Haldimand Tract',
        desc: "The land grant along the Grand River, secured through the Haldimand Proclamation. Thayendanegea led the resettlement of Haudenosaunee people here. Today it remains the world's largest First Nations reserve.",
        category: 'settlement',
      },
      {
        lat: 43.25,
        lng: -79.87,
        name: 'Burlington Bay (Brant House)',
        period: '1800–1807',
        desc: "Thayendanegea's final residence at Burlington Bay (present-day Burlington, Ontario). He spent his last years here and passed away on November 24, 1807.",
        category: 'settlement',
      },
      {
        lat: 43.25,
        lng: -80.25,
        name: 'Brantford, Ontario',
        period: '19th Century — Present',
        desc: "Named in honor of Thayendanegea. Home to His Majesty's Chapel of the Mohawks (1785), the oldest Protestant church in Ontario, and the Woodland Cultural Centre.",
        category: 'legacy',
      },
      {
        lat: 51.508,
        lng: -0.076,
        name: 'London, England',
        period: '1775–1776 & 1786',
        desc: "Thayendanegea visited London twice. He met King George III, sat for George Romney's famous portrait, was received by James Boswell, and advocated tirelessly for Haudenosaunee land rights.",
        category: 'diplomacy',
      },
      {
        lat: 34.0,
        lng: -81.03,
        name: 'Southern Campaigns',
        period: '1760s',
        desc: "As a young warrior, Thayendanegea fought alongside the British during the Seven Years' War, including southern campaigns that shaped his early military experience.",
        category: 'conflict',
      },
      {
        lat: 42.44,
        lng: -76.50,
        name: 'Oquaga (Onaquaga)',
        period: '1770s',
        desc: 'A multi-tribal Haudenosaunee community on the Susquehanna River. Thayendanegea helped establish a church and school here and used it as a base during the early Revolutionary War period.',
        category: 'origins',
      },
      {
        lat: 43.38,
        lng: -80.42,
        name: 'Woodland Cultural Centre',
        period: 'Present Day',
        desc: 'Located in Brantford, this centre preserves and promotes the culture and heritage of First Nations peoples. A vital living connection to Haudenosaunee traditions.',
        category: 'legacy',
      },
    ];

    // Category colors
    var categoryColors = {
      origins: '#4A7C2E',
      diplomacy: '#5B8FA8',
      conflict: '#8B3A2A',
      settlement: '#C4883A',
      legacy: '#6B5B8A',
    };

    // Add markers
    places.forEach(function (place) {
      var color = categoryColors[place.category] || '#C4883A';
      var icon = L.divIcon({
        className: 'atlas-marker',
        html:
          '<svg width="24" height="32" viewBox="0 0 24 32"><path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z" fill="' +
          color +
          '" stroke="rgba(0,0,0,0.2)" stroke-width="1"/><circle cx="12" cy="11" r="4" fill="#FAF8F3"/></svg>',
        iconSize: [24, 32],
        iconAnchor: [12, 32],
        popupAnchor: [0, -32],
      });

      L.marker([place.lat, place.lng], { icon: icon })
        .addTo(map)
        .bindPopup(
          '<h3>' +
            place.name +
            '</h3>' +
            '<p class="popup-period">' +
            place.period +
            '</p>' +
            '<p>' +
            place.desc +
            '</p>'
        );
    });

    // Map layer toggle buttons
    document.querySelectorAll('.atlas-controls button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var category = btn.getAttribute('data-category');
        document.querySelectorAll('.atlas-controls button').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');

        // This would filter markers in a more complex implementation
        // For now, just visual feedback
      });
    });

    // Sidebar place card clicks
    document.querySelectorAll('.place-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var lat = parseFloat(card.getAttribute('data-lat'));
        var lng = parseFloat(card.getAttribute('data-lng'));
        if (!isNaN(lat) && !isNaN(lng)) {
          map.flyTo([lat, lng], 10, { duration: 1.5 });
        }
      });
    });
  }

  // Initialize map when DOM is ready
  if (document.getElementById('atlas-map')) {
    if (typeof L !== 'undefined') {
      initAtlasMap();
    } else {
      // Wait for Leaflet to load
      window.addEventListener('load', initAtlasMap);
    }
  }

  /* ----------------------------------------------------------
     BACK TO TOP BUTTON
     ---------------------------------------------------------- */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener(
      'scroll',
      function () {
        if (window.scrollY > 600) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
      },
      { passive: true }
    );

    backToTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------------
     BIOGRAPHY CHAPTER NAV (sticky sidebar highlights)
     ---------------------------------------------------------- */
  const chapterSections = document.querySelectorAll('.chapter[id]');
  const chapterNavLinks = document.querySelectorAll('.chapter-nav a');

  if (chapterSections.length > 0 && chapterNavLinks.length > 0) {
    const chapterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            chapterNavLinks.forEach(function (link) {
              link.classList.remove('active');
              if (link.getAttribute('href') === '#' + id) {
                link.classList.add('active');
              }
            });
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '-100px 0px -60% 0px',
      }
    );

    chapterSections.forEach(function (section) {
      chapterObserver.observe(section);
    });
  }

  /* ----------------------------------------------------------
     PRINT-FRIENDLY: Add URL after links when printing
     ---------------------------------------------------------- */
  // This is handled by CSS @media print

  /* ----------------------------------------------------------
     PERFORMANCE: Debounce scroll handlers
     ---------------------------------------------------------- */
  // All scroll listeners use { passive: true } for performance

})();
