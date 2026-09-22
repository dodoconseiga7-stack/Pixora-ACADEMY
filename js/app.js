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
            // Hero : grande image avec zoom
            heroLogoZone.innerHTML = `<img src="${d.settings.logoUrl}" alt="PIXORA STUDIO Logo" style="cursor:zoom-in;" title="Cliquer pour voir le logo en grand">`;
            const heroImg = heroLogoZone.querySelector('img');
            if (heroImg) {
                heroImg.addEventListener('click', () => openLightbox(d.settings.logoUrl, 'Logo Pixora Studio'));
            }
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
    // 3. LA DIFFÉRENCE (Comparaison Ma Création vs IA)
    // ============================================================
    function renderDiff() {
        const freshData = getData();
        const myList = freshData.creations.filter(c => c.type === 'MY_CREATION');
        const aiList = freshData.creations.filter(c => c.type === 'AI_CREATION');

        const myEl = document.getElementById('my-creation-content');
        const aiEl = document.getElementById('ai-creation-content');

        // Ma création : soit configurée explicitement, soit première/aléatoire
        let featuredMine = (freshData.difference && freshData.difference.myCreation && freshData.difference.myCreation.image)
            ? freshData.difference.myCreation
            : (myList.length > 0 ? myList[0] : null);

        if (featuredMine) {
            myEl.innerHTML = `
                <div style="cursor:zoom-in;" title="Cliquer pour voir en grand">
                    <img src="${featuredMine.image}" alt="${featuredMine.title}" onerror="this.onerror=null; this.src='https://placehold.co/400x300?text=Image';">
                    <h4>${featuredMine.title}</h4>
                    <p>${featuredMine.service || 'Création graphique'} — ${featuredMine.domain || 'Pixora Studio'}</p>
                    ${featuredMine.description ? `<small style="display:block; color:var(--c-text-muted); margin-top:4px;">${featuredMine.description}</small>` : ''}
                </div>
            `;
            myEl.onclick = () => openLightbox(featuredMine.image, featuredMine.title, featuredMine.description || '', 'Ma Création • ' + (featuredMine.service || ''));
        } else {
            myEl.innerHTML = `<div class="diff-placeholder"><span>Ajoutez vos créations depuis l'administration.</span></div>`;
        }

        // Création IA : soit configurée explicitement, soit liste galerie IA
        let featuredAi = (freshData.difference && freshData.difference.aiCreation && freshData.difference.aiCreation.image)
            ? freshData.difference.aiCreation
            : null;

        if (featuredAi) {
            aiEl.innerHTML = `
                <div style="cursor:zoom-in;" title="Cliquer pour voir en grand">
                    <img src="${featuredAi.image}" alt="${featuredAi.title}" onerror="this.onerror=null; this.src='https://placehold.co/400x300?text=Image+IA';">
                    <div class="ai-badge">IA</div>
                    <h4>${featuredAi.title}</h4>
                    <p>${featuredAi.service || 'Génération IA'} — ${featuredAi.domain || 'Artificiel'}</p>
                    ${featuredAi.description ? `<small style="display:block; color:var(--c-text-muted); margin-top:4px;">${featuredAi.description}</small>` : ''}
                </div>
            `;
            aiEl.onclick = () => openLightbox(featuredAi.image, featuredAi.title, featuredAi.description || '', 'Création générée par IA');
        } else if (aiList.length > 0) {
            // Affichage de la galerie IA (grille)
            const galleryHtml = aiList.map(item => `
                <div class="ai-gallery-item" data-fullimg="${item.image}" data-title="${item.title}" data-desc="${item.description || ''}" data-meta="${item.service || ''}">
                    <img src="${item.image}" alt="${item.title}" onerror="this.onerror=null; this.src='https://placehold.co/400x300?text=Image+IA';">
                    <div class="ai-gallery-info">
                        <h4>${item.title}</h4>
                        <div class="ai-badge">IA</div>
                    </div>
                </div>
            `).join('');
            aiEl.innerHTML = `<div class="ai-gallery-grid">${galleryHtml}</div>`;
            
            aiEl.querySelectorAll('.ai-gallery-item').forEach(el => {
                el.addEventListener('click', () => openLightbox(el.dataset.fullimg, el.dataset.title, el.dataset.desc, 'Création IA • ' + el.dataset.meta));
            });
        } else {
            aiEl.innerHTML = `<div class="diff-placeholder"><span>Chargement des exemples IA...</span></div>`;
        }
    }
    renderDiff();

    // ============================================================
    // 3.5 LIGHTBOX CONSULTATION PLEIN ÉCRAN
    // ============================================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxCaption = document.getElementById('lightbox-caption');

    function openLightbox(src, title = '', desc = '', meta = '') {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightboxImg.alt = title;

        let captionHtml = '';
        if (title) captionHtml += `<div style="font-size:1.15rem; font-weight:700; margin-bottom:4px;">${title}</div>`;
        if (meta) captionHtml += `<div style="font-size:0.9rem; opacity:0.85; margin-bottom:4px;">${meta}</div>`;
        if (desc) captionHtml += `<div style="font-size:0.85rem; opacity:0.75; font-weight:normal;">${desc}</div>`;

        if (lightboxCaption) {
            lightboxCaption.innerHTML = captionHtml;
            lightboxCaption.style.display = captionHtml ? 'block' : 'none';
        }

        lightbox.classList.add('active');
    }
    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        if (lightboxImg) lightboxImg.src = '';
    }
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === lightboxClose) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // ============================================================
    // 4. NOS SERVICES (cartes visuelles avec consultation en grand)
    // ============================================================
    const serviceCardsGrid = document.getElementById('service-cards-grid');

    function renderServiceCards() {
        const freshData = getData();
        const displayServices = freshData.services.filter(s => s !== 'Autres');

        serviceCardsGrid.innerHTML = displayServices.map(s => {
            const price = freshData.prices[s] ? freshData.prices[s].basic : 0;
            const imgUrl = freshData.serviceImages ? freshData.serviceImages[s] : '';
            const icon = (typeof SERVICE_ICONS !== 'undefined' && SERVICE_ICONS[s]) ? SERVICE_ICONS[s] : '🎨';

            const imageHtml = imgUrl
                ? `<div class="service-img-wrap" style="position:relative; overflow:hidden;">
                     <img src="${imgUrl}" alt="${s}" class="service-card-img" style="cursor:zoom-in;" title="Cliquer pour voir l'image en grand" data-zoom-img="${imgUrl}" data-zoom-title="${s}">
                   </div>`
                : `<div class="service-card-img-placeholder">${icon}</div>`;

            return `
                <div class="service-visual-card">
                    ${imageHtml}
                    <div class="service-card-body">
                        <div class="service-card-name">${s}</div>
                        <div class="service-card-price">À partir de ${price.toLocaleString('fr-FR')} F CFA</div>
                        <a href="#commander" class="btn btn-outline" style="width:100%; margin-top:12px; font-size:0.85rem; padding:8px 12px; text-align:center; display:block;">Commander</a>
                    </div>
                </div>
            `;
        }).join('');

        // Clic sur l'image du service pour zoomer
        serviceCardsGrid.querySelectorAll('[data-zoom-img]').forEach(imgEl => {
            imgEl.addEventListener('click', (e) => {
                e.stopPropagation();
                const svcName = imgEl.dataset.zoomTitle;
                const p = freshData.prices[svcName] ? freshData.prices[svcName].basic : 0;
                openLightbox(imgEl.dataset.zoomImg, svcName, `Tarif à partir de ${p.toLocaleString('fr-FR')} F CFA`, 'Service Pixora Studio');
            });
        });
    }
    renderServiceCards();

    // ============================================================
    // 5. MES CRÉATIONS (Portfolio + Prix + Informations)
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
        creationsGrid.innerHTML = list.map(c => {
            const priceHtml = c.price ? `<span style="font-weight:700; color:var(--c-primary); font-size:0.88rem; margin-left:8px;">${Number(c.price).toLocaleString('fr-FR')} F CFA</span>` : '';
            return `
                <div class="creation-item" data-img="${c.image}" data-title="${c.title}" data-desc="${c.description || ''}" data-service="${c.service}" data-domain="${c.domain}" data-price="${c.price || ''}" style="cursor:zoom-in;" title="Cliquer pour voir en grand">
                    <img src="${c.image}" alt="${c.title}" onerror="this.onerror=null; this.src='https://placehold.co/400x300?text=Image';">
                    <div class="creation-info">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                            <h4 style="margin:0;">${c.title}</h4>
                            ${priceHtml}
                        </div>
                        <p style="margin-bottom:8px;">${c.description || ''}</p>
                        <span class="creation-tag">${c.service}</span>
                        <span class="creation-tag" style="background:#f1f5f9; color:#475569; margin-left:4px;">${c.domain}</span>
                    </div>
                </div>
            `;
        }).join('');

        creationsGrid.querySelectorAll('.creation-item').forEach(el => {
            el.addEventListener('click', () => {
                const meta = `${el.dataset.service} • ${el.dataset.domain}` + (el.dataset.price ? ` • ${Number(el.dataset.price).toLocaleString('fr-FR')} F CFA` : '');
                openLightbox(el.dataset.img, el.dataset.title, el.dataset.desc, meta);
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
        let servicesHtml = '';
        let idx = 1;
        document.querySelectorAll('.service-row').forEach(row => {
            const s = row.querySelector('.input-service').value;
            const f = row.querySelector('.input-formule').value;
            const fTitle = f.charAt(0).toUpperCase() + f.slice(1);
            const price = freshData.prices[s] ? freshData.prices[s][f] : 0;
            servicesHtml += `
                <div class="recap-row">
                    <div><strong>${idx}. ${s}</strong><br><small style="color:var(--c-text-muted)">Formule : ${fTitle}</small></div>
                    <strong>${price.toLocaleString('fr-FR')} F</strong>
                </div>`;
            idx++;
        });

        const total = calcTotal();

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
