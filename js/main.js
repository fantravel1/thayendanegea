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

    // Historical places
    const places = [
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
        name: 'Fort Johnson / Johnson Hall',
        period: '1740s\u20131770s',
        desc: 'Sir William Johnson\'s estate, where the young Thayendanegea entered the world of colonial diplomacy. Johnson\'s relationship with Molly Brant (Thayendanegea\'s sister) was pivotal.',
        category: 'diplomacy',
      },
      {
        lat: 41.63,
        lng: -72.25,
        name: 'Moor\'s Charity School',
        period: '1761\u20131763',
        desc: 'Eleazar Wheelock\'s school in Lebanon, Connecticut, where Thayendanegea received formal English education, studying Latin, English literature, and Christianity.',
        category: 'origins',
      },
      {
        lat: 42.98,
        lng: -74.84,
        name: 'Fort Stanwix',
        period: '1768 Treaty / 1777 Siege',
        desc: 'Site of the 1768 Treaty of Fort Stanwix, which defined boundaries between colonial and Indigenous lands. Later besieged during the Revolutionary War.',
        category: 'diplomacy',
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
        name: 'Newtown (Sullivan-Clinton Campaign)',
        period: 'August 1779',
        desc: 'Site of the Battle of Newtown, where Thayendanegea\'s forces confronted the Sullivan-Clinton campaign \u2014 a devastating scorched-earth invasion of Haudenosaunee homeland.',
        category: 'conflict',
      },
      {
        lat: 44.23,
        lng: -76.48,
        name: 'Fort Haldimand (Carleton Island)',
        period: '1778\u20131783',
        desc: 'British military post where Haudenosaunee loyalist refugees gathered during the war. A staging point for campaigns and a place of displacement.',
        category: 'conflict',
      },
      {
        lat: 43.26,
        lng: -79.07,
        name: 'Fort Niagara',
        period: '1759\u20131780s',
        desc: 'Major British post and refugee center. Thousands of displaced Haudenosaunee people sheltered here during and after the Revolutionary War, enduring harsh conditions.',
        category: 'diplomacy',
      },
      {
        lat: 43.07,
        lng: -80.32,
        name: 'Six Nations of the Grand River',
        period: '1784 — Haldimand Tract',
        desc: 'The land grant along the Grand River, secured through the Haldimand Proclamation. Thayendanegea led the resettlement of Haudenosaunee people here. Today it remains the world\'s largest First Nations reserve.',
        category: 'settlement',
      },
      {
        lat: 43.33,
        lng: -79.80,
        name: 'Burlington Bay (Brant House)',
        period: '1800\u20131807',
        desc: 'Thayendanegea\'s final residence at Burlington Bay (present-day Burlington, Ontario). He spent his last years here and passed away on November 24, 1807.',
        category: 'settlement',
      },
      {
        lat: 43.14,
        lng: -80.27,
        name: 'Brantford, Ontario',
        period: '19th Century — Present',
        desc: 'Named in honor of Thayendanegea. Home to His Majesty\'s Chapel of the Mohawks (1785), the oldest Protestant church in Ontario, and the Woodland Cultural Centre.',
        category: 'legacy',
      },
      {
        lat: 51.508,
        lng: -0.076,
        name: 'London, England',
        period: '1775\u20131776 & 1786',
        desc: 'Thayendanegea visited London twice. He met King George III, sat for George Romney\'s famous portrait, was received by James Boswell, and advocated tirelessly for Haudenosaunee land rights.',
        category: 'diplomacy',
      },
      {
        lat: 34.0,
        lng: -81.03,
        name: 'Southern Campaigns',
        period: '1760s',
        desc: 'As a young warrior, Thayendanegea fought alongside the British during the Seven Years\' War, including southern campaigns that shaped his early military experience.',
        category: 'conflict',
      },
      {
        lat: 42.10,
        lng: -75.80,
        name: 'Oquaga (Onaquaga)',
        period: '1770s',
        desc: 'A multi-tribal Haudenosaunee community on the Susquehanna River. Thayendanegea helped establish a church and school here and used it as a base during the early Revolutionary War period.',
        category: 'origins',
      },
      {
        lat: 43.17,
        lng: -80.26,
        name: 'Woodland Cultural Centre',
        period: 'Present Day',
        desc: 'Located in Brantford, this centre preserves and promotes the culture and heritage of First Nations peoples. A vital living connection to Haudenosaunee traditions.',
        category: 'legacy',
      },
      {
        lat: 43.04,
        lng: -76.14,
        name: 'Onondaga (Grand Council)',
        period: 'Pre-contact \u2014 Present',
        desc: 'The seat of the Haudenosaunee Grand Council and keeper of the Central Fire. All major political decisions of the Confederacy were deliberated here, including the fateful split during the Revolution.',
        category: 'origins',
      },
      {
        lat: 40.71,
        lng: -74.01,
        name: 'New York City',
        period: '1775\u20131776',
        desc: 'Thayendanegea sailed from New York for London in November 1775 with Guy Johnson. He returned the following year, transformed by his diplomatic experiences with the Crown.',
        category: 'diplomacy',
      },
      {
        lat: 42.88,
        lng: -78.88,
        name: 'Buffalo Creek',
        period: '1780s\u20131800s',
        desc: 'After the Revolution, Buffalo Creek became a major Seneca settlement and council site. Thayendanegea attended councils here negotiating land issues and inter-nation politics.',
        category: 'settlement',
      },
      {
        lat: 44.75,
        lng: -75.50,
        name: 'Oswegatchie',
        period: '1780s',
        desc: 'British-allied settlement on the upper St. Lawrence River. Part of the loyalist corridor where displaced Haudenosaunee and their allies resettled after the Revolution.',
        category: 'settlement',
      },
    ];

    // Category colors
    const categoryColors = {
      origins: '#4A7C2E',
      diplomacy: '#5B8FA8',
      conflict: '#8B3A2A',
      settlement: '#C4883A',
      legacy: '#6B5B8A',
    };

    // Store markers by category for filtering
    const markersByCategory = {};
    const allMarkers = [];
    const markersByCoords = {};

    // Add markers
    places.forEach(function (place) {
      const color = categoryColors[place.category] || '#C4883A';
      const icon = L.divIcon({
        className: 'atlas-marker',
        html:
          '<svg width="28" height="38" viewBox="0 0 28 38"><path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 24 14 24s14-13.5 14-24C28 6.3 21.7 0 14 0z" fill="' +
          color +
          '" stroke="rgba(0,0,0,0.25)" stroke-width="1"/><circle cx="14" cy="13" r="5" fill="#FAF8F3" opacity="0.9"/></svg>',
        iconSize: [28, 38],
        iconAnchor: [14, 38],
        popupAnchor: [0, -38],
      });

      const marker = L.marker([place.lat, place.lng], { icon: icon })
        .addTo(map)
        .bindPopup(
          '<div class="atlas-popup">' +
            '<div class="atlas-popup__category" style="background:' + color + ';">' + place.category.charAt(0).toUpperCase() + place.category.slice(1) + '</div>' +
            '<h3>' + place.name + '</h3>' +
            '<p class="popup-period">' + place.period + '</p>' +
            '<p>' + place.desc + '</p>' +
          '</div>'
        );

      // Store reference
      if (!markersByCategory[place.category]) {
        markersByCategory[place.category] = [];
      }
      markersByCategory[place.category].push(marker);
      allMarkers.push(marker);

      // Store by coords for sidebar lookup
      const coordKey = place.lat.toFixed(2) + ',' + place.lng.toFixed(2);
      markersByCoords[coordKey] = marker;
    });

    // Journey route paths
    const journeyPaths = [
      {
        name: 'Youth & Education (1743\u20131763)',
        color: '#4A7C2E',
        coords: [
          [42.95, -74.18], // Canajoharie
          [42.82, -73.94], // Fort Johnson
          [41.63, -72.25], // Moor's Charity School
        ],
      },
      {
        name: 'First London Journey (1775\u20131776)',
        color: '#5B8FA8',
        dashArray: '8, 6',
        coords: [
          [42.95, -74.18], // Mohawk Valley
          [40.71, -74.01], // New York City
          [51.508, -0.076], // London
        ],
      },
      {
        name: 'Revolutionary War (1777\u20131783)',
        color: '#8B3A2A',
        coords: [
          [42.10, -75.80], // Oquaga
          [42.98, -74.84], // Fort Stanwix
          [42.68, -74.97], // Cherry Valley
          [42.15, -77.09], // Newtown
          [44.23, -76.48], // Fort Haldimand
          [43.26, -79.07], // Fort Niagara
        ],
      },
      {
        name: 'Grand River Settlement (1784\u20131807)',
        color: '#C4883A',
        coords: [
          [43.26, -79.07], // Fort Niagara
          [43.07, -80.32], // Six Nations
          [43.33, -79.80], // Burlington Bay
        ],
      },
    ];

    const journeyLayers = [];
    journeyPaths.forEach(function (journey) {
      const polyline = L.polyline(journey.coords, {
        color: journey.color,
        weight: 3,
        opacity: 0.7,
        dashArray: journey.dashArray || null,
        smoothFactor: 1.5,
      }).addTo(map);
      polyline.bindTooltip(journey.name, { sticky: true, className: 'journey-tooltip' });
      journeyLayers.push(polyline);
    });

    // Category filter buttons — actually show/hide markers
    let activeCategory = 'all';
    document.querySelectorAll('.atlas-controls button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const category = btn.getAttribute('data-category');
        activeCategory = category;

        // Update button states
        document.querySelectorAll('.atlas-controls button').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');

        // Show/hide markers
        allMarkers.forEach(function (marker) {
          map.removeLayer(marker);
        });

        if (category === 'all') {
          allMarkers.forEach(function (marker) {
            marker.addTo(map);
          });
          journeyLayers.forEach(function (layer) { layer.addTo(map); });
        } else {
          if (markersByCategory[category]) {
            markersByCategory[category].forEach(function (marker) {
              marker.addTo(map);
            });
          }
          journeyLayers.forEach(function (layer) { map.removeLayer(layer); });
        }

        // Filter sidebar place cards
        document.querySelectorAll('.place-card').forEach(function (card) {
          const cardCategory = card.getAttribute('data-category');
          if (category === 'all' || cardCategory === category) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            requestAnimationFrame(function () {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Sidebar place card clicks — fly to location and open popup
    document.querySelectorAll('.place-card').forEach(function (card) {
      card.addEventListener('click', function () {
        const lat = parseFloat(card.getAttribute('data-lat'));
        const lng = parseFloat(card.getAttribute('data-lng'));
        if (isNaN(lat) || isNaN(lng)) return;

        // Remove active from all cards
        document.querySelectorAll('.place-card').forEach(function (c) {
          c.classList.remove('place-card--active');
        });
        card.classList.add('place-card--active');

        // Fly to location
        map.flyTo([lat, lng], 10, { duration: 1.5 });

        // Find and open corresponding marker popup
        const coordKey = lat.toFixed(2) + ',' + lng.toFixed(2);
        const marker = markersByCoords[coordKey];
        if (marker) {
          setTimeout(function () {
            marker.openPopup();
          }, 1600);
        }
      });
    });

    // Journey path toggle
    const journeyToggle = document.getElementById('toggle-journeys');
    let journeysVisible = true;
    if (journeyToggle) {
      journeyToggle.addEventListener('click', function () {
        journeysVisible = !journeysVisible;
        journeyToggle.classList.toggle('active', journeysVisible);
        if (activeCategory !== 'all') return;
        journeyLayers.forEach(function (layer) {
          if (journeysVisible) {
            layer.addTo(map);
          } else {
            map.removeLayer(layer);
          }
        });
      });
    }
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
