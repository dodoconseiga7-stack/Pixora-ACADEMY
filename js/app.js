/**
 * PIXORA ACADEMY — Main Application Logic
 * Handles UI interactions, Pinterest grid rendering, and Form submission.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Data Initialization ---
  const data = window.PIXORA_DATA;
  if (!data) {
    console.error("Erreur : Les données PIXORA_DATA sont introuvables.");
    return;
  }

  const { config, programs } = data;

  // --- 2. DOM Elements ---
  const header = document.getElementById('main-header');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  const programsGrid = document.getElementById('programs-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  const programSelect = document.getElementById('reg-program');
  const registerForm = document.getElementById('register-form');
  const formSuccess = document.getElementById('form-success');
  
  const modalBackdrop = document.getElementById('program-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body');

  // --- 3. Header & Navigation ---
  // Sticky Header on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    revealElements();
  });

  // Mobile Menu Toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });
  }

  // Close mobile menu on link click & handle active state
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Remove active from all
      navLinks.forEach(l => l.classList.remove('active'));
      // Add active to clicked
      e.target.classList.add('active');
      
      // Close mobile menu
      if (navMenu.classList.contains('open')) {
        mobileToggle.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // --- 4. Render Programs Grid (Pinterest Style) ---
  function renderPrograms(filter = 'all') {
    if (!programsGrid) return;
    
    programsGrid.innerHTML = '';
    
    const filteredPrograms = filter === 'all' 
      ? programs 
      : programs.filter(p => p.category === filter);
      
    filteredPrograms.forEach((program, index) => {
      // Création de la carte Pinterest
      const item = document.createElement('div');
      item.className = 'pinterest-item';
      
      // Ajout d'une hauteur aléatoire pour accentuer l'effet masonry (Optionnel)
      // On utilise l'image fournie, la hauteur naturelle fera l'affaire.
      
      item.innerHTML = `
        <div class="pinterest-item-media">
          <img src="${program.image}" alt="${program.title}" loading="lazy" />
          <div class="pinterest-item-overlay">
            <span class="pinterest-overlay-badge">Découvrir le programme</span>
          </div>
        </div>
        <div class="pinterest-item-body">
          <div class="pinterest-item-category">${program.categoryLabel}</div>
          <h3 class="pinterest-item-title">${program.title}</h3>
          <p class="pinterest-item-desc">${program.shortDesc}</p>
          <div class="pinterest-item-footer">
            <div class="pinterest-item-meta">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              ${program.specs.delai}
            </div>
            <div class="pinterest-item-level">${program.level}</div>
          </div>
        </div>
      `;
      
      // Click event for modal
      item.addEventListener('click', () => openModal(program));
      
      programsGrid.appendChild(item);
    });
  }

  // Init programs
  renderPrograms();

  // Filter functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      // Render filtered grid
      const filter = e.target.getAttribute('data-filter');
      renderPrograms(filter);
    });
  });

  // --- 5. Populate Form Select ---
  if (programSelect && programs) {
    programs.forEach(p => {
      const option = document.createElement('option');
      option.value = p.id;
      option.textContent = p.title;
      programSelect.appendChild(option);
    });
  }

  // --- 6. Form Submission (WhatsApp Redirection) ---
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get values
      const prenom = document.getElementById('reg-firstname').value;
      const nom = document.getElementById('reg-lastname').value;
      const email = document.getElementById('reg-email').value;
      const phone = document.getElementById('reg-phone').value;
      const programId = document.getElementById('reg-program').value;
      const level = document.getElementById('reg-level').value;
      const motivation = document.getElementById('reg-motivation').value;
      
      // Find program name
      const program = programs.find(p => p.id === programId);
      const programName = program ? program.title : "Non spécifié";
      
      // Format WhatsApp Message
      const message = `*NOUVELLE INSCRIPTION - PIXORA ACADEMY*%0A%0A` +
        `*Candidat:* ${prenom} ${nom}%0A` +
        `*Email:* ${email}%0A` +
        `*Téléphone:* ${phone}%0A` +
        `*Niveau:* ${level}%0A%0A` +
        `*Programme demandé:*%0A${programName}%0A%0A` +
        `*Motivation:*%0A${motivation ? motivation : "Non précisée"}`;
        
      // Show success message
      registerForm.style.display = 'none';
      formSuccess.classList.add('show');
      
      // Redirect to WhatsApp after 2 seconds
      setTimeout(() => {
        window.open(`https://wa.me/${config.whatsappNumber}?text=${message}`, '_blank');
      }, 2000);
    });
  }

  // --- 7. Modal Functionality ---
  function openModal(program) {
    if (!modalBackdrop || !modalBody) return;
    
    document.body.style.overflow = 'hidden';
    
    // Generate Tags HTML
    const tagsHtml = program.tags.map(tag => 
      `<span style="display:inline-block; padding:4px 10px; background:var(--primary-50); color:var(--primary); font-size:12px; font-weight:600; border-radius:var(--radius-full); margin-right:8px; margin-bottom:8px;">${tag}</span>`
    ).join('');
    
    modalBody.innerHTML = `
      <div style="margin-bottom: 24px;">
        <span style="font-size:12px; font-weight:700; color:var(--primary); text-transform:uppercase; letter-spacing:0.5px;">${program.categoryLabel}</span>
        <h2 style="font-family:var(--font-display); font-size:28px; font-weight:800; color:var(--gray-900); margin:8px 0 16px; line-height:1.2;">${program.title}</h2>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          <span style="display:inline-flex; align-items:center; gap:6px; font-size:13px; font-weight:600; color:var(--gray-600);"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${program.specs.delai}</span>
          <span style="display:inline-flex; align-items:center; gap:6px; font-size:13px; font-weight:600; color:var(--gray-600);"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> ${program.level}</span>
        </div>
      </div>
      
      <img src="${program.image}" alt="${program.title}" style="width:100%; border-radius:var(--radius-lg); margin-bottom:24px; box-shadow:var(--shadow-sm);" />
      
      <h3 style="font-family:var(--font-display); font-size:18px; font-weight:800; color:var(--gray-900); margin-bottom:12px;">Description du programme</h3>
      <p style="font-size:15px; color:var(--gray-600); line-height:1.7; margin-bottom:24px;">${program.fullDesc}</p>
      
      <div style="background:var(--gray-50); border:1px solid var(--gray-100); border-radius:var(--radius-md); padding:20px; margin-bottom:24px;">
        <h4 style="font-size:14px; font-weight:700; color:var(--gray-900); margin-bottom:12px;">Au programme :</h4>
        <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px;">
          <li style="display:flex; gap:10px; font-size:14px; color:var(--gray-600);"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2" style="flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg> Création de maquettes (${program.specs.formats})</li>
          <li style="display:flex; gap:10px; font-size:14px; color:var(--gray-600);"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2" style="flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg> Choix des supports : ${program.specs.papier}</li>
          <li style="display:flex; gap:10px; font-size:14px; color:var(--gray-600);"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2" style="flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg> Préparation : ${program.specs.finitions}</li>
        </ul>
      </div>
      
      <div style="margin-bottom: 24px;">
        ${tagsHtml}
      </div>
      
      <div style="display:flex; gap:16px;">
        <a href="#inscription" onclick="closeModalAndSelect('${program.id}')" style="flex:1; text-align:center; padding:14px 20px; background:var(--grad-primary); color:#fff; font-weight:700; border-radius:var(--radius-full); box-shadow:var(--shadow-blue);">S'inscrire à ce programme</a>
      </div>
    `;
    
    modalBackdrop.classList.add('active');
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalClose && modalBackdrop) {
    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }
  
  // Expose to window for inline onclick in modal
  window.closeModalAndSelect = function(programId) {
    closeModal();
    const select = document.getElementById('reg-program');
    if (select) {
      select.value = programId;
    }
  };

  // --- 8. Scroll Reveal Animations ---
  const revealElements = () => {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    const elementVisible = 100;

    reveals.forEach(reveal => {
      const elementTop = reveal.getBoundingClientRect().top;
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('revealed');
      }
    });
  };

  // Initial trigger
  setTimeout(revealElements, 100);
});
