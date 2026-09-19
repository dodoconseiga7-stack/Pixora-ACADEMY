/**
 * PIXORA STUDIO — Contrôleur Principal de l'Application
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialisation du lecteur Showreel Vidéo
  const showreel = new PixoraShowreelPlayer("showreel-canvas", "showreel-player-container");

  // 2. Rendu de la grille des 18 services
  const servicesGrid = document.getElementById("services-grid");
  const filterButtons = document.querySelectorAll(".filter-btn");
  let activeFilter = "all";

  function renderServices(filter = "all") {
    if (!servicesGrid) return;
    servicesGrid.innerHTML = "";

    const services = window.PIXORA_DATA.services || [];
    const filtered = filter === "all" 
      ? services 
      : services.filter(s => s.category === filter);

    filtered.forEach((service, idx) => {
      const card = document.createElement("div");
      card.className = "service-card";
      card.setAttribute("data-category", service.category);
      card.setAttribute("data-aos", "fade-up");
      card.style.animationDelay = `${idx * 0.05}s`;

      card.innerHTML = `
        <div class="service-card-media" onclick="openProductModal('${service.id}')">
          <img src="${service.image}" alt="${service.title}" loading="lazy" class="service-img" />
          <div class="service-media-overlay">
            <span class="zoom-pill">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              Examiner le Mockup HD
            </span>
          </div>
          <span class="service-category-badge">${service.categoryLabel}</span>
          ${service.badge ? `<span class="service-quality-badge">${service.badge}</span>` : ""}
        </div>
        <div class="service-card-body">
          <h3 class="service-card-title">${service.title}</h3>
          <p class="service-card-desc">${service.shortDesc}</p>
          
          <div class="service-tags">
            ${service.tags.map(t => `<span class="service-tag">${t}</span>`).join("")}
          </div>

          <div class="service-card-footer">
            <button class="btn-details" onclick="openProductModal('${service.id}')">
              Fiche Technique
            </button>
            <a href="https://wa.me/${window.PIXORA_DATA.whatsappNumber}?text=${encodeURIComponent(service.whatsappMessage)}" target="_blank" rel="noopener noreferrer" class="btn-order-wa">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
              Commander
            </a>
          </div>
        </div>
      `;

      servicesGrid.appendChild(card);
    });
  }

  // Filtrage par catégories
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.getAttribute("data-filter");
      renderServices(activeFilter);
    });
  });

  renderServices("all");

  // 3. Modal Produit & Fiche Technique
  const modal = document.getElementById("product-modal");
  const modalContent = document.getElementById("modal-body");
  const modalClose = document.getElementById("modal-close");

  window.openProductModal = function(serviceId) {
    const service = window.PIXORA_DATA.services.find(s => s.id === serviceId);
    if (!service || !modal) return;

    modalContent.innerHTML = `
      <div class="modal-grid">
        <div class="modal-media-wrapper">
          <img src="${service.image}" alt="${service.title}" class="modal-large-img" />
          <div class="modal-caption">Mockup 3D Haute Résolution — Réalisation Pixora Studio</div>
        </div>
        <div class="modal-info-wrapper">
          <div class="modal-header-top">
            <span class="modal-category-tag">${service.categoryLabel}</span>
            <span class="modal-badge">${service.badge}</span>
          </div>
          <h2 class="modal-title">${service.title}</h2>
          <p class="modal-desc">${service.fullDesc}</p>

          <div class="modal-specs-box">
            <h4 class="specs-box-title">Spécifications Techniques & Finitions</h4>
            <div class="specs-row">
              <span class="spec-label">Formats standards :</span>
              <span class="spec-value">${service.specs.formats}</span>
            </div>
            <div class="specs-row">
              <span class="spec-label">Supports & Papiers :</span>
              <span class="spec-value">${service.specs.papier}</span>
            </div>
            <div class="specs-row">
              <span class="spec-label">Finitions disponibles :</span>
              <span class="spec-value">${service.specs.finitions}</span>
            </div>
            <div class="specs-row">
              <span class="spec-label">Délais de fabrication :</span>
              <span class="spec-value">${service.specs.delai}</span>
            </div>
          </div>

          <div class="modal-cta-box">
            <a href="https://wa.me/${window.PIXORA_DATA.whatsappNumber}?text=${encodeURIComponent(service.whatsappMessage)}" target="_blank" rel="noopener noreferrer" class="btn-primary-wa">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
              Demander un Devis WhatsApp Immédiat
            </a>
            <button class="btn-jump-showreel" onclick="jumpToShowreelProduct('${service.id}')">
              Voir dans le Showreel Vidéo ▶
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  window.closeProductModal = function() {
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  if (modalClose) {
    modalClose.addEventListener("click", window.closeProductModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) window.closeProductModal();
    });
  }

  window.jumpToShowreelProduct = function(serviceId) {
    window.closeProductModal();
    const showreelSection = document.getElementById("showreel-section");
    if (showreelSection) {
      showreelSection.scrollIntoView({ behavior: "smooth" });
    }
    const idx = window.PIXORA_DATA.showreel.findIndex(p => p.serviceId === serviceId);
    if (idx !== -1 && showreel) {
      const targetTime = showreel.introDuration + (idx * showreel.productDuration) + 0.1;
      showreel.seekTo(targetTime);
      if (!showreel.isPlaying) showreel.play();
    }
  };

  // 4. Formulaire Devis Instantané WhatsApp
  const quoteForm = document.getElementById("quote-form");
  const quoteProductSelect = document.getElementById("quote-product");

  if (quoteProductSelect) {
    window.PIXORA_DATA.services.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s.title;
      opt.textContent = `${s.title} (${s.categoryLabel})`;
      quoteProductSelect.appendChild(opt);
    });
  }

  if (quoteForm) {
    quoteForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const product = document.getElementById("quote-product").value;
      const quantity = document.getElementById("quote-quantity").value;
      const details = document.getElementById("quote-details").value;
      const name = document.getElementById("quote-name").value;

      const message = `Bonjour Pixora Studio,\n\nJe m'appelle *${name}* et je souhaite obtenir un devis pour :\n- *Produit* : ${product}\n- *Quantité estimée* : ${quantity}\n- *Détails / Finitions souhaitées* : ${details || "Standard"}\n\nMerci de m'indiquer vos tarifs et délais.`;

      const waUrl = `https://wa.me/${window.PIXORA_DATA.whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, "_blank");
    });
  }

  // 5. Navigation & Navbar Scroll Effect
  const navbar = document.getElementById("main-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Mobile Menu
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      mobileToggle.classList.toggle("open");
    });

    navMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        mobileToggle.classList.remove("open");
      });
    });
  }
});
