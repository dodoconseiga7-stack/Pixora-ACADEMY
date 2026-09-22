document.addEventListener('DOMContentLoaded', () => {
    const data = getData();

    // ============================================================
    // 1. LOGO — Grand affichage dans le hero + logo nav
    // ============================================================
    const heroLogoZone = document.getElementById('hero-logo-zone');
    const siteLogoNav = document.getElementById('site-logo-nav');

    function renderLogo() {
        const d = getData(); // reload latest data
        if (d.settings.logoUrl) {
            // Hero : grande image
            heroLogoZone.innerHTML = `<img src="${d.settings.logoUrl}" alt="PIXORA STUDIO Logo">`;
            // Nav : petite image
            siteLogoNav.innerHTML = `<img src="${d.settings.logoUrl}" alt="PIXORA STUDIO">`;
        } else {
            // Hero : texte stylisé
            heroLogoZone.innerHTML = `
                <div class="hero-logo-placeholder">PIXORA STUDIO</div>
                <div class="hero-logo-sub">Studio de création graphique</div>
            `;
            // Nav : texte
            siteLogoNav.innerHTML = `<span class="logo-text">PIXORA STUDIO</span>`;
        }
    }
    renderLogo();

    // ============================================================
    // 2. WHATSAPP
    // ============================================================
    document.getElementById('display-wa-number').textContent = data.settings.whatsappNumber;
    const waNum = data.settings.whatsappNumber.replace(/[^0-9]/g, '');
    document.getElementById('wa-contact-btn').href = `https://wa.me/${waNum}`;

    // ============================================================
    // 3. LA DIFFÉRENCE
    // ============================================================
    function renderDiff() {
        const freshData = getData();
        const myList = freshData.creations.filter(c => c.type === 'MY_CREATION');
        const aiList = freshData.creations.filter(c => c.type === 'AI_CREATION');

        const myEl = document.getElementById('my-creation-content');
        const aiEl = document.getElementById('ai-creation-content');

        if (myList.length > 0) {
            const r = myList[Math.floor(Math.random() * myList.length)];
            myEl.innerHTML = `
                <img src="${r.image}" alt="${r.title}" onerror="this.onerror=null; this.src='https://placehold.co/400x300?text=Image+Indisponible';">
                <h4>${r.title}</h4>
                <p>${r.service} — ${r.domain}</p>
            `;
            myEl.style.cursor = 'pointer';
            myEl.onclick = () => openLightbox(r.image, r.title, r.description || '');
        } else {
            myEl.innerHTML = `<div class="diff-placeholder"><span>Ajoutez vos créations depuis l'administration.</span></div>`;
        }

        if (aiList.length > 0) {
            // Affichage de la galerie IA (grille)
            const galleryHtml = aiList.map(item => `
                <div class="ai-gallery-item" data-fullimg="${item.image}" data-title="${item.title}" data-desc="${item.description || ''}">
                    <img src="${item.image}" alt="${item.title}" onerror="this.onerror=null; this.src='https://placehold.co/400x300?text=Image+Indisponible';">
                    <div class="ai-gallery-info">
                        <h4>${item.title}</h4>
                        <div class="ai-badge">IA</div>
                    </div>
                </div>
            `).join('');
            aiEl.innerHTML = `<div class="ai-gallery-grid">${galleryHtml}</div>`;
            
            // Attacher événements lightbox aux nouveaux items
            aiEl.querySelectorAll('.ai-gallery-item').forEach(el => {
                el.style.cursor = 'pointer';
                el.addEventListener('click', () => openLightbox(el.dataset.fullimg, el.dataset.title, el.dataset.desc));
            });
        } else {
            aiEl.innerHTML = `<div class="diff-placeholder"><span>Chargement des exemples IA...</span></div>`;
        }
    }
    renderDiff();

    // ============================================================
    // 3.5 LIGHTBOX
    // ============================================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    function openLightbox(src, title = '', desc = '') {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        
        let caption = lightbox.querySelector('.lightbox-caption');
        if (!caption) {
            caption = document.createElement('div');
            caption.className = 'lightbox-caption';
            caption.style.cssText = 'color:white; text-align:center; margin-top:14px; font-weight:600; font-size:1.1rem;';
            const contentBox = lightbox.querySelector('.lightbox-content');
            if (contentBox) contentBox.appendChild(caption);
        }
        caption.innerHTML = title ? `<div>${title}</div><small style="font-weight:400; opacity:0.8; font-size:0.9rem;">${desc}</small>` : '';
        
        lightbox.classList.add('active');
    }
    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        if (lightboxImg) lightboxImg.src = '';
    }
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) closeLightbox();
    });


    // ============================================================
    // 4. NOS SERVICES (cartes visuelles)
    // ============================================================
    const serviceCardsGrid = document.getElementById('service-cards-grid');

    function renderServiceCards() {
        const freshData = getData();
        // Exclure "Autres" des cartes visuelles
        const displayServices = freshData.services.filter(s => s !== 'Autres');

        serviceCardsGrid.innerHTML = displayServices.map(s => {
            const price = freshData.prices[s] ? freshData.prices[s].basic : 0;
            const imgUrl = freshData.serviceImages ? freshData.serviceImages[s] : '';
            const icon = (typeof SERVICE_ICONS !== 'undefined' && SERVICE_ICONS[s]) ? SERVICE_ICONS[s] : '🎨';

            const imageHtml = imgUrl
                ? `<img src="${imgUrl}" alt="${s}" class="service-card-img">`
                : `<div class="service-card-img-placeholder">${icon}</div>`;

            return `
                <a href="#commander" class="service-visual-card">
                    ${imageHtml}
                    <div class="service-card-body">
                        <div class="service-card-name">${s}</div>
                        <div class="service-card-price">À partir de ${price.toLocaleString('fr-FR')} F CFA</div>
                    </div>
                </a>
            `;
        }).join('');
    }
    renderServiceCards();

    // ============================================================
    // 5. MES CRÉATIONS (Portfolio)
    // ============================================================
    const domainFilters = document.getElementById('domain-filters');
    const creationsGrid = document.getElementById('creations-grid');

    function buildFilters() {
        const freshData = getData();
        domainFilters.innerHTML = `<button class="filter-btn active" data-domain="ALL">Tous</button>`;
        freshData.domains.forEach(d => {
            domainFilters.innerHTML += `<button class="filter-btn" data-domain="${d}">${d}</button>`;
        });
    }

    function renderPortfolio(domain = 'ALL') {
        const freshData = getData();
        const list = freshData.creations.filter(c =>
            c.type === 'MY_CREATION' && (domain === 'ALL' || c.domain === domain)
        );
        if (list.length === 0) {
            creationsGrid.innerHTML = `
                <p style="grid-column:1/-1; text-align:center; color:var(--c-text-muted); padding: 40px 0;">
                    Aucune création dans ce domaine pour l'instant.
                </p>`;
            return;
        }
        creationsGrid.innerHTML = list.map(c => `
            <div class="creation-item" data-fullimg="${c.image}" data-title="${c.title}" data-desc="${c.description || ''}">
                <img src="${c.image}" alt="${c.title}">
                <div class="creation-info">
                    <h4>${c.title}</h4>
                    <p>${c.description || ''}</p>
                    <span class="creation-tag">${c.service}</span>
                </div>
            </div>
        `).join('');

        // Clic sur création -> Ouvrir en grand dans la Lightbox
        creationsGrid.querySelectorAll('.creation-item').forEach(el => {
            el.style.cursor = 'pointer';
            el.addEventListener('click', () => {
                openLightbox(el.dataset.fullimg, el.dataset.title, el.dataset.desc);
            });
        });
    }

    buildFilters();
    renderPortfolio();

    domainFilters.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderPortfolio(e.target.dataset.domain);
        }
    });

    // ============================================================
    // 6. TARIFS
    // ============================================================
    const pricesGrid = document.getElementById('prices-grid');
    pricesGrid.innerHTML = data.services.map(s => {
        const p = data.prices[s] || { basic: 0, standard: 0, premium: 0 };
        return `
            <div class="price-card">
                <h3>${s}</h3>
                <div class="price-tier"><span class="tier-name">BASIC</span><span class="tier-price">${p.basic.toLocaleString('fr-FR')} F</span></div>
                <div class="price-tier"><span class="tier-name">STANDARD</span><span class="tier-price">${p.standard.toLocaleString('fr-FR')} F</span></div>
                <div class="price-tier"><span class="tier-name">PREMIUM</span><span class="tier-price">${p.premium.toLocaleString('fr-FR')} F</span></div>
            </div>
        `;
    }).join('');

    // ============================================================
    // 7. FORMULAIRE DE COMMANDE
    // ============================================================
    const orderDomaine = document.getElementById('order-domaine');
    data.domains.forEach(d => { orderDomaine.innerHTML += `<option value="${d}">${d}</option>`; });

    const servicesList = document.getElementById('services-list');
    const orderTotalEl = document.getElementById('order-total-amount');

    function getServiceOptionsHtml() {
        return getData().services.map(s => `<option value="${s}">${s}</option>`).join('');
    }
    document.querySelector('.input-service').innerHTML = getServiceOptionsHtml();

    function calcTotal() {
        const freshData = getData();
        let total = 0;
        document.querySelectorAll('.service-row').forEach(row => {
            const s = row.querySelector('.input-service').value;
            const f = row.querySelector('.input-formule').value;
            if (s && f && freshData.prices[s]) total += freshData.prices[s][f] || 0;
        });
        orderTotalEl.textContent = `${total.toLocaleString('fr-FR')} F CFA`;
        return total;
    }

    document.getElementById('btn-add-service').addEventListener('click', () => {
        const row = document.createElement('div');
        row.className = 'service-row';
        row.innerHTML = `
            <select class="form-control input-service" required>${getServiceOptionsHtml()}</select>
            <select class="form-control input-formule" required>
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
            </select>
            <button type="button" class="btn-remove-service" aria-label="Supprimer">✕</button>
        `;
        servicesList.appendChild(row);
        row.querySelector('.btn-remove-service').addEventListener('click', () => { row.remove(); calcTotal(); });
        row.querySelectorAll('select').forEach(el => el.addEventListener('change', calcTotal));
        calcTotal();
    });
    document.querySelectorAll('.input-service, .input-formule').forEach(el => el.addEventListener('change', calcTotal));

    // ============================================================
    // 8. MODAL RÉCAPITULATIF & WHATSAPP
    // ============================================================
    const modal = document.getElementById('recap-modal');
    const recapContent = document.getElementById('recap-content');

    document.getElementById('order-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const nom      = document.getElementById('order-nom').value;
        const prenom   = document.getElementById('order-prenom').value;
        const tel      = document.getElementById('order-tel').value;
        const adresse  = document.getElementById('order-adresse').value;
        const domaine  = document.getElementById('order-domaine').value;
        const logo     = document.getElementById('order-logo').value;

        const freshData = getData();
        let orderedServices = [];
        let servicesHtml = '';
        let idx = 1;
        document.querySelectorAll('.service-row').forEach(row => {
            const s = row.querySelector('.input-service').value;
            const f = row.querySelector('.input-formule').value;
            const fTitle = f.charAt(0).toUpperCase() + f.slice(1);
            const price = freshData.prices[s] ? freshData.prices[s][f] : 0;
            orderedServices.push({ service: s, formule: f, price: price });

            servicesHtml += `
                <div class="recap-row">
                    <div><strong>${idx}. ${s}</strong><br><small style="color:var(--c-text-muted)">Formule : ${fTitle}</small></div>
                    <strong>${price.toLocaleString('fr-FR')} F</strong>
                </div>`;
            idx++;
        });

        const total = calcTotal();

        // Enregistrement dans les commandes admin
        const orderPayload = {
            id: 'ord_' + Date.now(),
            nom, prenom, tel, adresse, domaine, logo,
            services: orderedServices,
            total,
            status: 'new',
            created_at: new Date().toISOString()
        };
        if (!freshData.orders) freshData.orders = [];
        freshData.orders.unshift(orderPayload);
        saveData(freshData);

        recapContent.innerHTML = `
            <div class="recap-section">
                <h4>Informations du client</h4>
                <p><strong>Nom :</strong> ${nom} ${prenom}</p>
                <p><strong>Téléphone :</strong> ${tel}</p>
                <p><strong>Adresse :</strong> ${adresse}</p>
            </div>
            <div class="recap-section">
                <h4>Projet</h4>
                <p><strong>Domaine :</strong> ${domaine}</p>
                <p><strong>Logo existant :</strong> ${logo}</p>
            </div>
            <div class="recap-section">
                <h4>Services commandés</h4>
                ${servicesHtml}
            </div>
            <div style="font-size:1.15rem; font-weight:700; border-top:2px solid var(--c-primary); padding-top:12px; display:flex; justify-content:space-between;">
                <span>TOTAL</span><span>${total.toLocaleString('fr-FR')} F CFA</span>
            </div>`;

        modal.classList.add('active');
    });

    document.getElementById('btn-edit-order').addEventListener('click', () => modal.classList.remove('active'));

    document.getElementById('btn-confirm-wa').addEventListener('click', () => {
        const freshData = getData();
        const nom     = document.getElementById('order-nom').value;
        const prenom  = document.getElementById('order-prenom').value;
        const tel     = document.getElementById('order-tel').value;
        const adresse = document.getElementById('order-adresse').value;
        const domaine = document.getElementById('order-domaine').value;
        const logo    = document.getElementById('order-logo').value;

        const numMap = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];

        let msg = `━━━━━━━━━━━━━━━━━━
🎨 NOUVELLE COMMANDE
PIXORA STUDIO
━━━━━━━━━━━━━━━━━━

👤 INFORMATIONS DU CLIENT
Nom : ${nom}
Prénom : ${prenom}
Téléphone : ${tel}
Adresse / Quartier : ${adresse}

🏢 DOMAINE
${domaine}

🏷️ LOGO EXISTANT
${logo}

🎨 SERVICES COMMANDÉS\n\n`;

        let total = 0;
        let idx = 0;
        document.querySelectorAll('.service-row').forEach(row => {
            const s = row.querySelector('.input-service').value;
            const f = row.querySelector('.input-formule').value;
            const fTitle = f.charAt(0).toUpperCase() + f.slice(1);
            const price = freshData.prices[s] ? freshData.prices[s][f] : 0;
            const emoji = numMap[idx] || `${idx + 1}.`;
            msg += `${emoji} ${s}\nFormule : ${fTitle}\nPrix : ${price.toLocaleString('fr-FR')} F CFA\n\n`;
            total += price;
            idx++;
        });

        msg += `💰 TOTAL\n${total.toLocaleString('fr-FR')} F CFA

📞 MODE DE CONTACT
WhatsApp

━━━━━━━━━━━━━━━━━━
Commande envoyée depuis Pixora Studio
━━━━━━━━━━━━━━━━━━`;

        const phone = freshData.settings.whatsappNumber.replace(/[^0-9]/g, '');
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
        modal.classList.remove('active');
    });
});
