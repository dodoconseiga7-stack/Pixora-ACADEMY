document.addEventListener('DOMContentLoaded', () => {
    let data = getData();

    const msgSuccess = document.getElementById('msg-success');
    function showMsg(txt) {
        if (!msgSuccess) return;
        msgSuccess.textContent = txt || '✓ Modifications enregistrées !';
        msgSuccess.style.display = 'block';
        msgSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => msgSuccess.style.display = 'none', 3500);
    }

    // ============================================================
    // DYNAMIQUEMENT REMPLIR LES DROPDOWNS (DOMAINES & SERVICES)
    // ============================================================
    function populateDropdowns() {
        const cDomain = document.getElementById('c-domain');
        const cService = document.getElementById('c-service');
        const creationFilter = document.getElementById('admin-creation-filter');

        const domains = data.domains || [
            'Plombier', 'Restaurant / Délice', 'Fashion', 'Market', 'Fast-food',
            'Boulangerie / Pâtisserie', 'Électricité / Bâtiment', 'Salon de coiffure', 'Show-biz / Événements', 'Autres'
        ];
        const services = data.services || [
            'Carte de visite', 'Flyer', 'Affiche publicitaire', 'Visuel publicitaire',
            'Affiche / Kakémono', 'Étiquette', 'Logo', 'Autres'
        ];

        if (cDomain) {
            cDomain.innerHTML = domains.map(d => `<option value="${d}">${d}</option>`).join('');
        }
        if (cService) {
            cService.innerHTML = services.map(s => `<option value="${s}">${s}</option>`).join('');
        }
        if (creationFilter) {
            let filterHtml = `<option value="ALL">Tous les domaines</option>`;
            domains.forEach(d => {
                filterHtml += `<option value="${d}">${d}</option>`;
            });
            creationFilter.innerHTML = filterHtml;
        }
    }
    populateDropdowns();

    // ============================================================
    // 0. CARNET DE COMMANDES CLIENTS
    // ============================================================
    const ordersList = document.getElementById('orders-list');
    const btnRefreshOrders = document.getElementById('btn-refresh-orders');

    function renderOrdersList() {
        if (!ordersList) return;
        const d = getData();
        const orders = d.orders || [];

        if (orders.length === 0) {
            ordersList.innerHTML = `<p style="color:var(--c-text-muted); text-align:center; padding:20px 0;">Aucune demande de commande enregistrée pour le moment.</p>`;
            return;
        }

        ordersList.innerHTML = orders.map(o => {
            const dateStr = o.created_at ? new Date(o.created_at).toLocaleString('fr-FR') : 'Date non précisée';
            const isNew = o.status === 'new';

            let servicesHtml = '';
            if (Array.isArray(o.services)) {
                servicesHtml = o.services.map(s => `• ${s.service} (Formule : ${s.formule}) — ${s.price ? s.price.toLocaleString('fr-FR') + ' F' : ''}`).join('<br>');
            }

            const cleanPhone = (o.tel || '').replace(/[^0-9]/g, '');
            const waMsg = `Bonjour ${o.prenom || ''}, nous avons bien reçu votre demande concernant le domaine ${o.domaine || ''}.`;
            const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMsg)}`;

            return `
                <div style="background:white; border:1.5px solid ${isNew ? '#2563eb' : 'var(--c-border)'}; border-radius:10px; padding:18px; margin-bottom:14px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--c-border); padding-bottom:8px; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
                        <div>
                            <strong>${o.nom || ''} ${o.prenom || ''}</strong>
                            <small style="color:var(--c-text-muted); margin-left:10px;">📅 ${dateStr}</small>
                        </div>
                        <span style="background:${isNew ? '#dbeafe' : '#dcfce7'}; color:${isNew ? '#1e40af' : '#166534'}; padding:3px 10px; border-radius:12px; font-size:0.78rem; font-weight:700;">
                            ${isNew ? '⚡ NOUVELLE DEMANDE' : '✓ TRAITÉE'}
                        </span>
                    </div>
                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:10px; margin-bottom:12px; font-size:0.9rem;">
                        <div><strong>📞 Téléphone :</strong> ${o.tel || 'N/A'}</div>
                        <div><strong>📍 Adresse :</strong> ${o.adresse || 'N/A'}</div>
                        <div><strong>🏢 Domaine :</strong> ${o.domaine || 'N/A'}</div>
                        <div><strong>🏷️ Logo existant :</strong> ${o.logo || 'Non'}</div>
                    </div>
                    <div style="background:var(--c-bg); padding:10px 14px; border-radius:8px; margin-bottom:12px; font-size:0.88rem;">
                        <strong>🎨 Services commandés :</strong><br>
                        ${servicesHtml || 'Non spécifié'}
                        <div style="font-weight:700; margin-top:6px; font-size:0.95rem; color:var(--c-primary-dark);">
                            TOTAL : ${o.total ? o.total.toLocaleString('fr-FR') + ' F CFA' : 'Sur devis'}
                        </div>
                    </div>
                    <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
                        <a href="${waUrl}" target="_blank" class="btn" style="background:#25D366; color:white; font-size:0.82rem; padding:6px 14px; text-decoration:none;">💬 Contacter WhatsApp</a>
                        <button class="btn btn-outline" style="font-size:0.82rem; padding:6px 14px;" onclick="toggleOrderStatus('${o.id}')">
                            ${isNew ? 'Marquer comme traitée' : 'Remettre en nouvelle'}
                        </button>
                        <button class="btn-delete" style="font-size:0.82rem; padding:6px 14px;" onclick="removeOrder('${o.id}')">Supprimer</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    window.toggleOrderStatus = (id) => {
        const d = getData();
        if (d.orders) {
            const idx = d.orders.findIndex(o => o.id === id);
            if (idx !== -1) {
                d.orders[idx].status = d.orders[idx].status === 'new' ? 'done' : 'new';
                saveData(d);
                renderOrdersList();
                showMsg('✓ Statut de la commande mis à jour !');
            }
        }
    };

    window.removeOrder = (id) => {
        if (confirm('Supprimer cette commande ?')) {
            const d = getData();
            if (d.orders) {
                d.orders = d.orders.filter(o => o.id !== id);
                saveData(d);
                renderOrdersList();
                showMsg('✓ Commande supprimée.');
            }
        }
    };

    if (btnRefreshOrders) btnRefreshOrders.addEventListener('click', renderOrdersList);
    renderOrdersList();

    // ============================================================
    // 1. GESTION DU LOGO
    // ============================================================
    const logoPreview     = document.getElementById('logo-preview');
    const logoPlaceholder = document.getElementById('logo-placeholder');
    const btnRemoveLogo   = document.getElementById('btn-remove-logo');
    const logoFileInput   = document.getElementById('logo-file-input');

    function refreshLogoAdmin() {
        const d = getData();
        if (d.settings && d.settings.logoUrl) {
            if (logoPreview) { logoPreview.src = d.settings.logoUrl; logoPreview.style.display = 'block'; }
            if (logoPlaceholder) logoPlaceholder.style.display = 'none';
            if (btnRemoveLogo) btnRemoveLogo.style.display = 'inline-flex';
        } else {
            if (logoPreview) logoPreview.style.display = 'none';
            if (logoPlaceholder) logoPlaceholder.style.display = 'block';
            if (btnRemoveLogo) btnRemoveLogo.style.display = 'none';
        }
    }
    refreshLogoAdmin();

    if (logoFileInput) {
        logoFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                data = getData();
                if (!data.settings) data.settings = {};
                data.settings.logoUrl = ev.target.result;
                saveData(data);
                refreshLogoAdmin();
                showMsg('✓ Logo importé et enregistré !');
            };
            reader.readAsDataURL(file);
        });
    }

    if (btnRemoveLogo) {
        btnRemoveLogo.addEventListener('click', () => {
            if (confirm('Supprimer le logo ? Le nom textuel sera affiché à la place.')) {
                data = getData();
                if (!data.settings) data.settings = {};
                data.settings.logoUrl = '';
                saveData(data);
                refreshLogoAdmin();
                showMsg('✓ Logo supprimé.');
            }
        });
    }

    // ============================================================
    // 2. NUMÉRO WHATSAPP
    // ============================================================
    const adminWaInput = document.getElementById('admin-wa');
    if (adminWaInput) adminWaInput.value = data.settings ? data.settings.whatsappNumber : '+226 03 24 95 48';

    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            data = getData();
            if (!data.settings) data.settings = {};
            data.settings.whatsappNumber = adminWaInput.value;
            saveData(data);
            showMsg('✓ Numéro WhatsApp mis à jour !');
        });
    }

    // ============================================================
    // 3. GESTION DES DOMAINES / CATÉGORIES
    // ============================================================
    const domainsList = document.getElementById('domains-list');
    const addDomainForm = document.getElementById('add-domain-form');

    function renderDomainsList() {
        if (!domainsList) return;
        const d = getData();
        domainsList.innerHTML = (d.domains || []).map((dom, idx) => `
            <div class="item-row">
                <span style="font-weight:600;">📁 ${dom}</span>
                <div style="display:flex; gap:8px;">
                    <button type="button" class="btn btn-outline" style="font-size:0.8rem; padding:4px 10px;" onclick="renameDomain(${idx})">✏️ Renommer</button>
                    <button type="button" class="btn-delete" style="font-size:0.8rem; padding:4px 10px;" onclick="removeDomain(${idx})">Supprimer</button>
                </div>
            </div>
        `).join('');
    }

    if (addDomainForm) {
        addDomainForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('new-domain-input');
            const val = input.value.trim();
            if (!val) return;
            data = getData();
            if (!data.domains) data.domains = [];
            if (data.domains.includes(val)) {
                alert('Ce domaine existe déjà.');
                return;
            }
            data.domains.push(val);
            saveData(data);
            input.value = '';
            populateDropdowns();
            renderDomainsList();
            showMsg(`✓ Domaine "${val}" ajouté avec succès !`);
        });
    }

    window.renameDomain = (idx) => {
        data = getData();
        const oldName = data.domains[idx];
        const newName = prompt('Nouveau nom du domaine :', oldName);
        if (newName && newName.trim() !== '' && newName !== oldName) {
            data.domains[idx] = newName.trim();
            (data.creations || []).forEach(c => {
                if (c.domain === oldName) c.domain = newName.trim();
            });
            saveData(data);
            populateDropdowns();
            renderDomainsList();
            renderCreations();
            showMsg('✓ Domaine renommé !');
        }
    };

    window.removeDomain = (idx) => {
        data = getData();
        const name = data.domains[idx];
        if (confirm(`Supprimer le domaine "${name}" ?`)) {
            data.domains.splice(idx, 1);
            saveData(data);
            populateDropdowns();
            renderDomainsList();
            showMsg('✓ Domaine supprimé.');
        }
    };
    renderDomainsList();

    // ============================================================
    // 4. IMAGES DES CARTES DE SERVICES (MODIFIER L'IMAGE D'UN SERVICE)
    // ============================================================
    const serviceImgList = document.getElementById('service-images-list');

    function buildServiceImageRows() {
        if (!serviceImgList) return;
        const d = getData();
        serviceImgList.innerHTML = (d.services || []).filter(s => s !== 'Autres').map(s => {
            const imgUrl = (d.serviceImages && d.serviceImages[s]) ? d.serviceImages[s] : '';
            const safeKey = s.replace(/[^a-zA-Z0-9]/g, '_');
            return `
                <div class="service-img-row">
                    <span class="service-img-name">${s}</span>
                    <img id="simg-thumb-${safeKey}" src="${imgUrl}" class="service-img-thumb" style="${imgUrl ? 'display:block;' : 'display:none;'}" alt="${s}">
                    <label class="file-label" style="font-size:0.82rem; padding:7px 14px;" for="simg-file-${safeKey}">
                        📁 Modifier l'image
                        <input type="file" id="simg-file-${safeKey}" data-service="${s}" accept="image/*" style="display:none;" class="simg-file-input">
                    </label>
                    ${imgUrl ? `<button type="button" class="btn-delete simg-remove-btn" data-service="${s}" style="background:none; border:none; color:#e53935; font-size:0.85rem; cursor:pointer; font-weight:600;">✕ Retirer</button>` : ''}
                </div>
            `;
        }).join('');

        // Événements pour le changement d'image d'un service
        document.querySelectorAll('.simg-file-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const svc = e.target.dataset.service;
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const d = getData();
                    if (!d.serviceImages) d.serviceImages = {};
                    d.serviceImages[svc] = ev.target.result;
                    saveData(d);
                    buildServiceImageRows();
                    showMsg(`✓ Image du service "${svc}" mise à jour et appliquée sur la vitrine client !`);
                };
                reader.readAsDataURL(file);
            });
        });

        // Événements pour retirer l'image d'un service
        document.querySelectorAll('.simg-remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const svc = btn.dataset.service;
                const d = getData();
                if (d.serviceImages) d.serviceImages[svc] = '';
                saveData(d);
                buildServiceImageRows();
                showMsg(`✓ Image du service "${svc}" retirée.`);
            });
        });
    }
    buildServiceImageRows();

    const btnSaveServiceImages = document.getElementById('btn-save-service-images');
    if (btnSaveServiceImages) {
        btnSaveServiceImages.addEventListener('click', () => {
            showMsg('✓ Images des services enregistrées !');
        });
    }

    // ============================================================
    // 5. GESTION DES CRÉATIONS DU CATALOGUE
    // ============================================================
    const cDomain = document.getElementById('c-domain');
    const cService = document.getElementById('c-service');
    const cImgFile = document.getElementById('c-img-file');
    const cImgUrl  = document.getElementById('c-img-url');
    const cImgPreview = document.getElementById('c-img-preview');
    const adminCreationFilter = document.getElementById('admin-creation-filter');
    let pendingImgBase64 = '';

    if (cImgFile) {
        cImgFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > 8 * 1024 * 1024) {
                alert('L\'image est trop lourde. Veuillez choisir une image de moins de 8 Mo.');
                e.target.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (ev) => {
                pendingImgBase64 = ev.target.result;
                if (cImgUrl) cImgUrl.value = '';
                if (cImgPreview) {
                    cImgPreview.src = pendingImgBase64;
                    cImgPreview.style.display = 'block';
                }
            };
            reader.readAsDataURL(file);
        });
    }

    if (cImgUrl) {
        cImgUrl.addEventListener('input', () => {
            if (cImgUrl.value) {
                pendingImgBase64 = '';
                if (cImgPreview) {
                    cImgPreview.src = cImgUrl.value;
                    cImgPreview.style.display = 'block';
                }
            } else if (cImgPreview) {
                cImgPreview.style.display = 'none';
            }
        });
    }

    const creationsList = document.getElementById('creations-list');
    function renderCreations(filterDomain = 'ALL') {
        if (!creationsList) return;
        const d = getData();
        const list = (d.creations || []).filter(c => filterDomain === 'ALL' || c.domain === filterDomain);

        if (list.length === 0) {
            creationsList.innerHTML = `<p style="color:var(--c-text-muted); text-align:center; padding:20px 0;">Aucune création enregistrée dans ce domaine.</p>`;
            return;
        }

        creationsList.innerHTML = list.map(c => `
            <div class="item-row">
                <div class="item-info">
                    <img src="${c.image}" alt="${c.title}" onerror="this.onerror=null; this.src='https://placehold.co/100x100?text=Pixora';">
                    <div class="item-meta">
                        <strong>${c.title}</strong>
                        <span class="badge-type ${c.type === 'AI_CREATION' ? 'badge-ai' : ''}">${c.type === 'MY_CREATION' ? 'Ma création' : 'IA'}</span>
                        <small>${c.service || ''} — 📁 ${c.domain || 'Sans domaine'}</small>
                    </div>
                </div>
                <button class="btn-delete" onclick="deleteCreation('${c.id}')">Supprimer</button>
            </div>
        `).join('');
    }

    if (adminCreationFilter) {
        adminCreationFilter.addEventListener('change', (e) => {
            renderCreations(e.target.value);
        });
    }

    window.deleteCreation = (id) => {
        if (confirm('Supprimer cette création du catalogue ?')) {
            const d = getData();
            d.creations = d.creations.filter(c => c.id !== id);
            saveData(d);
            renderCreations(adminCreationFilter ? adminCreationFilter.value : 'ALL');
            showMsg('✓ Création supprimée.');
        }
    };
    renderCreations();

    const creationForm = document.getElementById('creation-form');
    if (creationForm) {
        creationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const imgFinal = pendingImgBase64 || (cImgUrl ? cImgUrl.value : '');
            if (!imgFinal) {
                alert('Veuillez choisir une image (depuis votre ordinateur ou coller un lien URL).');
                return;
            }
            const d = getData();
            if (!d.creations) d.creations = [];
            d.creations.unshift({
                id: 'c_' + Date.now(),
                type: document.getElementById('c-type').value,
                title: document.getElementById('c-title').value,
                domain: cDomain.value,
                service: cService.value,
                image: imgFinal,
                description: document.getElementById('c-desc') ? document.getElementById('c-desc').value : ''
            });
            saveData(d);
            renderCreations(adminCreationFilter ? adminCreationFilter.value : 'ALL');
            creationForm.reset();
            pendingImgBase64 = '';
            if (cImgPreview) cImgPreview.style.display = 'none';
            showMsg('✓ Création ajoutée au catalogue avec succès !');
        });
    }

    // ============================================================
    // 6. TARIFS
    // ============================================================
    const pricesList = document.getElementById('prices-list');
    if (pricesList) {
        pricesList.innerHTML = data.services.map(s => {
            const p = (data.prices && data.prices[s]) ? data.prices[s] : { basic: 0, standard: 0, premium: 0 };
            return `
                <div style="border:1px solid var(--c-border); padding:18px; border-radius:10px; background:var(--c-bg);">
                    <h4 style="margin-bottom:14px; font-size:0.95rem; color:var(--c-primary-dark);">${s}</h4>
                    <div class="form-group" style="margin-bottom:10px;">
                        <label style="font-size:0.82rem;">Basic (F CFA)</label>
                        <input type="number" class="form-control price-in" data-s="${s}" data-t="basic" value="${p.basic}" min="0" required>
                    </div>
                    <div class="form-group" style="margin-bottom:10px;">
                        <label style="font-size:0.82rem;">Standard (F CFA)</label>
                        <input type="number" class="form-control price-in" data-s="${s}" data-t="standard" value="${p.standard}" min="0" required>
                    </div>
                    <div class="form-group" style="margin-bottom:0;">
                        <label style="font-size:0.82rem;">Premium (F CFA)</label>
                        <input type="number" class="form-control price-in" data-s="${s}" data-t="premium" value="${p.premium}" min="0" required>
                    </div>
                </div>
            `;
        }).join('');
    }

    const pricesForm = document.getElementById('prices-form');
    if (pricesForm) {
        pricesForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const d = getData();
            if (!d.prices) d.prices = {};
            document.querySelectorAll('.price-in').forEach(input => {
                const svc = input.dataset.s;
                const tier = input.dataset.t;
                if (!d.prices[svc]) d.prices[svc] = {};
                d.prices[svc][tier] = parseInt(input.value) || 0;
            });
            saveData(d);
            showMsg('✓ Tarifs mis à jour !');
        });
    }
});
