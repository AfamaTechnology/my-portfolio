(function() {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  headerToggleBtn.addEventListener('click', headerToggle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  // Preloader removed — spinner element was removed from the HTML to avoid blocking visuals.

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Hero image rotator - cycles through images in the `ayoub/` folder
   */
  const heroImg = document.getElementById('hero-img');
  if (heroImg) {
    const heroImages = [
      'ayoub/35.jpg',
      'ayoub/41.jpg',
      'ayoub/43.jpg',
      'ayoub/38.jpg',
      'ayoub/22.jpg',
      'ayoub/18.jpg',
      'ayoub/background.jpg'
    ];
    let heroIndex = 0;
    // Avoid preloading every hero image on initial load (saves bandwidth on first paint).
    const preload = (src) => {
      const img = new Image();
      img.src = src;
    };

    // Start from current src if it matches the list
    const currentSrc = heroImg.getAttribute('src');
    const foundIndex = heroImages.indexOf(currentSrc);
    if (foundIndex >= 0) heroIndex = foundIndex;

    // Preload just the next image
    preload(heroImages[(heroIndex + 1) % heroImages.length]);

    // Cycle images every 5 seconds with a short fade
    setInterval(() => {
      heroImg.classList.add('fade-out');
      setTimeout(() => {
        heroIndex = (heroIndex + 1) % heroImages.length;
        heroImg.src = heroImages[heroIndex];
        heroImg.classList.remove('fade-out');

        // Preload the next image after switching
        preload(heroImages[(heroIndex + 1) % heroImages.length]);
      }, 900);
    }, 5000);
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * PDF previews (desktop/tablet): independent viewers with Prev/Next.
   */
  (function initPdfPreviews() {
    const previewEls = document.querySelectorAll('[data-pdf-preview][data-pdf-url]');
    if (!previewEls.length) return;

    const isFileProtocol = window.location && window.location.protocol === 'file:';

    if (typeof pdfjsLib === 'undefined') {
      previewEls.forEach((viewerEl) => {
        const statusEl = viewerEl.querySelector('[data-pdf-status]');
        const prevBtn = viewerEl.querySelector('[data-pdf-prev]');
        const nextBtn = viewerEl.querySelector('[data-pdf-next]');
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;
        if (statusEl) statusEl.textContent = 'Preview unavailable (PDF viewer did not load). Use the Open button above.';
      });
      return;
    }

    try {
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }
    } catch (e) {
      // If worker configuration fails, pdf.js will still try its defaults.
    }

    const debounce = (fn, wait) => {
      let t = null;
      return (...args) => {
        if (t) window.clearTimeout(t);
        t = window.setTimeout(() => fn(...args), wait);
      };
    };

    previewEls.forEach((viewerEl) => {
      const url = viewerEl.getAttribute('data-pdf-url');
      const canvasWrap = viewerEl.querySelector('[data-pdf-canvas-wrap]');
      const canvas = viewerEl.querySelector('[data-pdf-canvas]');
      const prevBtn = viewerEl.querySelector('[data-pdf-prev]');
      const nextBtn = viewerEl.querySelector('[data-pdf-next]');
      const pageNumEl = viewerEl.querySelector('[data-pdf-page-num]');
      const pageCountEl = viewerEl.querySelector('[data-pdf-page-count]');
      const statusEl = viewerEl.querySelector('[data-pdf-status]');

      if (!url || !canvasWrap || !canvas || !prevBtn || !nextBtn || !pageNumEl || !pageCountEl) return;

      let pdfDoc = null;
      let pageNum = 1;
      let renderTask = null;
      let loadTimedOut = false;
      let started = false;
      let loadingTask = null;

      const setStatus = (text) => {
        if (!statusEl) return;
        statusEl.textContent = text;
      };

      const updateUi = () => {
        pageNumEl.textContent = String(pageNum);
        pageCountEl.textContent = pdfDoc ? String(pdfDoc.numPages) : '–';
        prevBtn.disabled = !pdfDoc || pageNum <= 1;
        nextBtn.disabled = !pdfDoc || pageNum >= pdfDoc.numPages;
      };

      const renderPage = async (num) => {
        if (!pdfDoc) return;

        if (renderTask) {
          try {
            renderTask.cancel();
          } catch (e) {
            // ignore
          }
        }

        setStatus('Loading page…');
        updateUi();

        const page = await pdfDoc.getPage(num);

        // Performance: cap target render width so big screens don't render huge canvases.
        const wrapWidth = canvasWrap.clientWidth || viewerEl.clientWidth || 800;
        const targetWidth = Math.min(wrapWidth, 920);
        const unscaledViewport = page.getViewport({ scale: 1 });
        const scale = targetWidth / unscaledViewport.width;
        // Performance: cap DPR so high-density screens don't render extremely large bitmaps.
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const viewport = page.getViewport({ scale });
        const viewportDpr = page.getViewport({ scale: scale * dpr });

        const ctx = canvas.getContext('2d');
        canvas.width = Math.floor(viewportDpr.width);
        canvas.height = Math.floor(viewportDpr.height);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        renderTask = page.render({
          canvasContext: ctx,
          viewport: viewportDpr
        });

        try {
          await renderTask.promise;
          setStatus('');
        } catch (err) {
          if (err && err.name === 'RenderingCancelledException') return;
          setStatus('Preview failed to load. Use the Open button above.');
        } finally {
          renderTask = null;
          updateUi();
        }
      };

      prevBtn.addEventListener('click', () => {
        if (!pdfDoc || pageNum <= 1) return;
        pageNum -= 1;
        renderPage(pageNum);
      });

      nextBtn.addEventListener('click', () => {
        if (!pdfDoc || pageNum >= pdfDoc.numPages) return;
        pageNum += 1;
        renderPage(pageNum);
      });

      const onResize = debounce(() => {
        if (!pdfDoc) return;
        renderPage(pageNum);
      }, 150);
      window.addEventListener('resize', onResize);

      const loadPdf = ({ disableWorker }) => {
        if (loadingTask) {
          try { loadingTask.destroy(); } catch (e) { /* ignore */ }
          loadingTask = null;
        }
        loadingTask = pdfjsLib.getDocument({ url, disableWorker });
        return loadingTask.promise;
      };

      const startLoad = () => {
        if (started) return;
        started = true;

        // Load PDF
        if (isFileProtocol) {
          setStatus('Preview can’t load when opened as a file. Open this site via a local server (e.g., VS Code Live Server) then refresh, or use the Open button above.');
          prevBtn.disabled = true;
          nextBtn.disabled = true;
          pageNumEl.textContent = '1';
          pageCountEl.textContent = '–';
          return;
        }

        setStatus('Loading preview…');
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        pageNumEl.textContent = '1';
        pageCountEl.textContent = '–';

        // Try faster worker mode first; if it stalls, fallback to no-worker mode.
        const fallbackTimer = window.setTimeout(() => {
          if (pdfDoc) return;
          setStatus('Still loading… switching to compatibility mode.');
          loadPdf({ disableWorker: true })
            .then((doc) => {
              pdfDoc = doc;
              pageNum = 1;
              updateUi();
              return renderPage(pageNum);
            })
            .catch((err) => {
              const details = err && (err.message || err.name) ? ` (${err.message || err.name})` : '';
              setStatus(`Preview failed to load${details}. Use the Open button above.`);
              pdfDoc = null;
              updateUi();
            });
        }, 6000);

        // Safety net: if loading hangs completely, show a helpful message.
        window.setTimeout(() => {
          if (pdfDoc) return;
          loadTimedOut = true;
          setStatus('Preview is taking too long to load. Use the Open button above.');
        }, 15000);

        loadPdf({ disableWorker: false })
          .then((doc) => {
            if (loadTimedOut) return;
            window.clearTimeout(fallbackTimer);
            pdfDoc = doc;
            pageNum = 1;
            updateUi();
            return renderPage(pageNum);
          })
          .catch((err) => {
            if (loadTimedOut) return;
            window.clearTimeout(fallbackTimer);
            const details = err && (err.message || err.name) ? ` (${err.message || err.name})` : '';
            setStatus(`Preview failed to load${details}. Use the Open button above.`);
            pdfDoc = null;
            updateUi();
          });
      };

      // Performance: only start loading when the preview is near the viewport.
      if (typeof IntersectionObserver !== 'undefined') {
        setStatus('Preview will load when visible…');
        const io = new IntersectionObserver((entries) => {
          const entry = entries[0];
          if (!entry || !entry.isIntersecting) return;
          io.disconnect();
          startLoad();
        }, { root: null, threshold: 0.15, rootMargin: '200px 0px' });
        io.observe(viewerEl);
      } else {
        startLoad();
      }
    });
  })();

  /**
   * CV preview modal handler
   */
  (function() {
    const previewButtons = document.querySelectorAll('.preview-cv');
    const modalEl = document.getElementById('cvPreviewModal');
    let bsModal = null;
    if (modalEl && typeof bootstrap !== 'undefined') {
      bsModal = new bootstrap.Modal(modalEl);
      const iframe = document.getElementById('cv-preview-frame');
      const downloadBtn = document.getElementById('cv-download-btn');

      previewButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();

          const src = btn.getAttribute('data-src') || btn.getAttribute('href');
          if (iframe && src) iframe.src = src;

          if (downloadBtn && src) {
            downloadBtn.href = src;
            downloadBtn.setAttribute('download', '');
          }
          bsModal.show();
        });
      });

      modalEl.addEventListener('hidden.bs.modal', () => {
        if (iframe) iframe.src = '';
        if (downloadBtn) downloadBtn.href = '#';
      });
    }
  })();

})();