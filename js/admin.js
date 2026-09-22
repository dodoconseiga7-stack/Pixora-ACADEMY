document.addEventListener('DOMContentLoaded', () => {
    let data = getData();

    const msgSuccess = document.getElementById('msg-success');
    function showMsg(txt) {
        msgSuccess.textContent = txt || '✓ Modifications enregistrées !';
        msgSuccess.style.display = 'block';
        msgSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => msgSuccess.style.display = 'none', 3500);
    }

    // Assurer que data.domains existe
    const defaultDomains = [
        'Plomberie',
        'Typographie',
        'Fast-food',
        'Carte de visite',
        'Affiche publicitaire',
        'Étiquette',
        'Flyer',
        'Kakémono',
        'Logo',
        'Packaging',
        'Restaurant / Délice',
        'Fashion',
        'Market',
        'Boulangerie / Pâtisserie',
        'Électricité / Bâtiment',
        'Salon de coiffure',
        'Show-biz / Événements',
        'Autres'
    ];
    if (!data.domains || data.domains.length === 0) {
        data.domains = defaultDomains;
        saveData(data);
    }

    // ============================================================
    // 1. LOGO
    // ============================================================
    const logoPreview     = document.getElementById('logo-preview');
    const logoPlaceholder = document.getElementById('logo-placeholder');
    const btnRemoveLogo   = document.getElementById('btn-remove-logo');
    const logoFileInput   = document.getElementById('logo-file-input');

    function refreshLogoAdmin() {
        const d = getData();
        if (d.settings && d.settings.logoUrl) {
            logoPreview.src = d.settings.logoUrl;
            logoPreview.style.display = 'block';
            logoPlaceholder.style.display = 'none';
            btnRemoveLogo.style.display = 'inline-flex';
        } else {
            logoPreview.style.display = 'none';
            logoPlaceholder.style.display = 'block';
            btnRemoveLogo.style.display = 'none';
        }
    }
    refreshLogoAdmin();

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
            showMsg('✓ Logo importé et enregistré avec succès !');
        };
        reader.readAsDataURL(file);
    });

    btnRemoveLogo.addEventListener('click', () => {
        if (confirm('Supprimer le logo ? Le texte "PIXORA STUDIO" sera affiché à la place.')) {
            data = getData();
            if (!data.settings) data.settings = {};
            data.settings.logoUrl = '';
            saveData(data);
            refreshLogoAdmin();
            showMsg('✓ Logo supprimé.');
        }
    });

    // ============================================================
    // 2. GESTION DES DOMAINES
    // ============================================================
    const domainsTagList = document.getElementById('domains-tag-list');
    const cDomain = document.getElementById('c-domain');
    const editCDomain = document.getElementById('edit-c-domain');

    function renderDomains() {
        const d = getData();
        const domains = d.domains || [];

        domainsTagList.innerHTML = domains.map((dm, idx) => `
            <span class="tag-item">
                ${dm}
                <span class="tag-del" onclick="deleteDomain(${idx})" title="Supprimer ce domaine">&times;</span>
            </span>
        `).join('');

        cDomain.innerHTML = domains.map(dm => `<option value="${dm}">${dm}</option>`).join('');
        if (editCDomain) {
            editCDomain.innerHTML = domains.map(dm => `<option value="${dm}">${dm}</option>`).join('');
        }
    }

    window.deleteDomain = (index) => {
        const d = getData();
        const dm = d.domains[index];
        if (confirm(`Supprimer le domaine "${dm}" ?`)) {
            d.domains.splice(index, 1);
            saveData(d);
            renderDomains();
            showMsg(`✓ Domaine "${dm}" supprimé.`);
        }
    };

    document.getElementById('add-domain-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('new-domain-input');
        const val = input.value.trim();
        if (!val) return;
        const d = getData();
        if (!d.domains) d.domains = [];
        if (d.domains.includes(val)) {
            alert('Ce domaine existe déjà.');
            return;
        }
        d.domains.push(val);
        saveData(d);
        renderDomains();
        input.value = '';
        showMsg(`✓ Domaine "${val}" ajouté avec succès !`);
    });

    renderDomains();

    // ============================================================
    // 3. GESTION DES SERVICES & IMAGES DE COUVERTURE
    // ============================================================
    const serviceImgList = document.getElementById('service-images-list');
    const cService = document.getElementById('c-service');
    const editCService = document.getElementById('edit-c-service');

    function renderServices() {
        const d = getData();
        const services = d.services || [];

        cService.innerHTML = services.map(s => `<option value="${s}">${s}</option>`).join('');
        if (editCService) {
            editCService.innerHTML = services.map(s => `<option value="${s}">${s}</option>`).join('');
        }

        serviceImgList.innerHTML = services.map(s => {
            const imgUrl = d.serviceImages ? (d.serviceImages[s] || '') : '';
            const isDefaultSvc = ['Carte de visite', 'Flyer', 'Affiche publicitaire', 'Visuel publicitaire', 'Affiche / Kakémono', 'Étiquette', 'Logo', 'Autres'].includes(s);
            return `
                <div class="service-img-row">
                    <span class="service-img-name">${s}</span>
                    <img id="simg-thumb-${s.replace(/[^a-zA-Z0-9]/g,'_')}" src="${imgUrl}" class="service-img-thumb" style="${imgUrl ? 'display:block;' : 'display:none;'}" alt="${s}">
                    <label class="file-label" style="font-size:0.82rem; padding:6px 14px;" for="simg-file-${s.replace(/[^a-zA-Z0-9]/g,'_')}">
                        📁 Changer l'image
                        <input type="file" id="simg-file-${s.replace(/[^a-zA-Z0-9]/g,'_')}" data-service="${s}" accept="image/*" style="display:none;" class="simg-file-input">
                    </label>
                    ${imgUrl ? `<button type="button" class="simg-remove-btn" data-service="${s}" style="background:none; border:none; color:#ef4444; font-size:0.82rem; cursor:pointer; font-weight:600;">✕ Retirer l'image</button>` : ''}
                    ${!isDefaultSvc ? `<button type="button" class="btn-delete" onclick="deleteService('${s}')" style="margin-left:auto; padding:4px 10px; font-size:0.75rem;">Supprimer service</button>` : ''}
                </div>
            `;
        }).join('');

        document.querySelectorAll('.simg-file-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const svc = e.target.dataset.service;
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const fresh = getData();
                    if (!fresh.serviceImages) fresh.serviceImages = {};
                    fresh.serviceImages[svc] = ev.target.result;
                    saveData(fresh);
                    renderServices();
                    showMsg(`✓ Image du service "${svc}" modifiée et enregistrée !`);
                };
                reader.readAsDataURL(file);
            });
        });

        document.querySelectorAll('.simg-remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const svc = btn.dataset.service;
                const fresh = getData();
                if (fresh.serviceImages) fresh.serviceImages[svc] = '';
                saveData(fresh);
                renderServices();
                showMsg(`✓ Image du service "${svc}" retirée.`);
            });
        });

        renderPrices();
    }

    window.deleteService = (svcName) => {
        if (confirm(`Supprimer définitivement le service "${svcName}" ?`)) {
            const d = getData();
            d.services = d.services.filter(s => s !== svcName);
            if (d.serviceImages && d.serviceImages[svcName]) delete d.serviceImages[svcName];
            if (d.prices && d.prices[svcName]) delete d.prices[svcName];
            saveData(d);
            renderServices();
            showMsg(`✓ Service "${svcName}" supprimé.`);
        }
    };

    document.getElementById('add-service-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('new-service-input');
        const val = input.value.trim();
        if (!val) return;
        const d = getData();
        if (!d.services) d.services = [];
        if (d.services.includes(val)) {
            alert('Ce service existe déjà.');
            return;
        }
        d.services.push(val);
        if (!d.prices) d.prices = {};
        if (!d.prices[val]) d.prices[val] = { basic: 5000, standard: 7500, premium: 10000 };
        saveData(d);
        renderServices();
        input.value = '';
        showMsg(`✓ Service "${val}" ajouté avec succès !`);
    });

    renderServices();

    // ============================================================
    // 4. COMPARAISON MA CRÉATION VS IA (Section La Différence)
    // ============================================================
    const diffMineTitle = document.getElementById('diff-mine-title');
    const diffMineService = document.getElementById('diff-mine-service');
    const diffMineDesc = document.getElementById('diff-mine-desc');
    const diffMineFile = document.getElementById('diff-mine-file');
    const diffMinePreview = document.getElementById('diff-mine-preview');

    const diffAiTitle = document.getElementById('diff-ai-title');
    const diffAiService = document.getElementById('diff-ai-service');
    const diffAiDesc = document.getElementById('diff-ai-desc');
    const diffAiFile = document.getElementById('diff-ai-file');
    const diffAiPreview = document.getElementById('diff-ai-preview');

    let diffMineImg = '';
    let diffAiImg = '';

    function refreshDiffAdmin() {
        const d = getData();
        const myList = d.creations.filter(c => c.type === 'MY_CREATION');
        const aiList = d.creations.filter(c => c.type === 'AI_CREATION');

        const mine = (d.difference && d.difference.myCreation) || (myList[0] || {});
        const ai = (d.difference && d.difference.aiCreation) || (aiList[0] || {});

        diffMineTitle.value = mine.title || '';
        diffMineService.value = mine.service || '';
        diffMineDesc.value = mine.description || '';
        if (mine.image) {
            diffMineImg = mine.image;
            diffMinePreview.src = mine.image;
            diffMinePreview.style.display = 'block';
        } else {
            diffMinePreview.style.display = 'none';
        }

        diffAiTitle.value = ai.title || '';
        diffAiService.value = ai.service || '';
        diffAiDesc.value = ai.description || '';
        if (ai.image) {
            diffAiImg = ai.image;
            diffAiPreview.src = ai.image;
            diffAiPreview.style.display = 'block';
        } else {
            diffAiPreview.style.display = 'none';
        }
    }
    refreshDiffAdmin();

    diffMineFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            diffMineImg = ev.target.result;
            diffMinePreview.src = diffMineImg;
            diffMinePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    });

    diffAiFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            diffAiImg = ev.target.result;
            diffAiPreview.src = diffAiImg;
            diffAiPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('diff-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const d = getData();
        if (!d.difference) d.difference = {};

        d.difference.myCreation = {
            title: diffMineTitle.value.trim() || 'Ma Création',
            service: diffMineService.value.trim() || 'Création graphique',
            description: diffMineDesc.value.trim(),
            image: diffMineImg || (d.creations.find(c => c.type === 'MY_CREATION') || {}).image || ''
        };

        d.difference.aiCreation = {
            title: diffAiTitle.value.trim() || 'Création par IA',
            service: diffAiService.value.trim() || 'Génération automatique',
            description: diffAiDesc.value.trim(),
            image: diffAiImg || (d.creations.find(c => c.type === 'AI_CREATION') || {}).image || ''
        };

        saveData(d);
        showMsg('✓ Comparaison « Ma Création vs IA » enregistrée avec succès !');
    });

    document.getElementById('btn-reset-diff').addEventListener('click', () => {
        if (confirm('Réinitialiser la comparaison pour afficher automatiquement vos créations et la galerie IA ?')) {
            const d = getData();
            delete d.difference;
            saveData(d);
            diffMineImg = '';
            diffAiImg = '';
            refreshDiffAdmin();
            showMsg('✓ Comparaison réinitialisée (rotation automatique activée).');
        }
    });

    // ============================================================
    // 5. GESTION DU CATALOGUE / CRÉATIONS & VISUELS IA
    // ============================================================
    const cImgFile = document.getElementById('c-img-file');
    const cImgUrl  = document.getElementById('c-img-url');
    const cImgPreview = document.getElementById('c-img-preview');
    let pendingImgBase64 = '';
    let currentCategoryFilter = 'ALL';

    cImgFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 8 * 1024 * 1024) {
            alert('L\\'image dépasse la limite de 8 Mo.');
            e.target.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
            pendingImgBase64 = ev.target.result;
            cImgUrl.value = '';
            cImgPreview.src = pendingImgBase64;
            cImgPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    });

    cImgUrl.addEventListener('input', () => {
        if (cImgUrl.value) {
            pendingImgBase64 = '';
            cImgPreview.src = cImgUrl.value;
            cImgPreview.style.display = 'block';
        } else {
            cImgPreview.style.display = 'none';
        }
    });

    const creationsList = document.getElementById('creations-list');
    const creationsCount = document.getElementById('creations-count');

    function renderCreations() {
        const d = getData();
        let list = d.creations || [];

        if (currentCategoryFilter !== 'ALL') {
            list = list.filter(c => c.type === currentCategoryFilter);
        }

        creationsCount.textContent = list.length;

        if (list.length === 0) {
            creationsList.innerHTML = `<p style="color:var(--c-text-muted); text-align:center; padding:20px;">Aucune création dans cette catégorie.</p>`;
            return;
        }

        creationsList.innerHTML = list.map(c => {
            const priceTag = c.price ? `<span style="font-weight:700; color:#059669; font-size:0.85rem; margin-left:6px;">💰 ${Number(c.price).toLocaleString('fr-FR')} F CFA</span>` : '';
            return `
                <div class="item-row">
                    <div class="item-info">
                        <img src="${c.image}" alt="${c.title}" onerror="this.onerror=null; this.src='https://placehold.co/100x100?text=Image';">
                        <div class="item-meta">
                            <div style="display:flex; align-items:center; flex-wrap:wrap; gap:4px;">
                                <strong>${c.title}</strong>
                                <span class="badge-type ${c.type === 'AI_CREATION' ? 'badge-ai' : ''}">${c.type === 'MY_CREATION' ? 'Ma création' : 'IA'}</span>
                                ${priceTag}
                            </div>
                            <small style="display:block; margin-top:2px; color:#64748b;">${c.service} &bull; <span style="color:#0284c7; font-weight:600;">${c.domain}</span></small>
                            ${c.description ? `<small style="display:block; color:#94a3b8; font-style:italic;">${c.description}</small>` : ''}
                        </div>
                    </div>
                    <div style="display:flex; align-items:center;">
                        <button type="button" class="btn-edit" onclick="openEditModal('${c.id}')">Modifier</button>
                        <button type="button" class="btn-delete" onclick="deleteCreation('${c.id}')">Supprimer</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Gestion des onglets de filtrage du catalogue
    document.querySelectorAll('.filter-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategoryFilter = btn.dataset.cat;
            renderCreations();
        });
    });

    window.deleteCreation = (id) => {
        if (confirm('Supprimer cette création du catalogue ?')) {
            const d = getData();
            d.creations = d.creations.filter(c => c.id !== id);
            saveData(d);
            renderCreations();
            refreshDiffAdmin();
            showMsg('✓ Création supprimée du catalogue.');
        }
    };

    document.getElementById('creation-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const imgFinal = pendingImgBase64 || cImgUrl.value;
        if (!imgFinal) {
            alert('Veuillez choisir une image pour votre création.');
            return;
        }
        const d = getData();
        if (!d.creations) d.creations = [];
        const priceVal = document.getElementById('c-price').value.trim();

        d.creations.unshift({
            id: 'c_' + Date.now(),
            type: document.getElementById('c-type').value,
            title: document.getElementById('c-title').value.trim(),
            domain: cDomain.value,
            service: cService.value,
            price: priceVal ? parseInt(priceVal) : null,
            image: imgFinal,
            description: document.getElementById('c-desc').value.trim()
        });
        saveData(d);
        renderCreations();
        refreshDiffAdmin();
        e.target.reset();
        pendingImgBase64 = '';
        cImgPreview.style.display = 'none';
        showMsg('✓ Nouvelle création ajoutée au catalogue !');
    });

    renderCreations();

    // ============================================================
    // MODAL MODIFICATION CREATION
    // ============================================================
    const editModal = document.getElementById('edit-creation-modal');
    const editId = document.getElementById('edit-c-id');
    const editType = document.getElementById('edit-c-type');
    const editTitle = document.getElementById('edit-c-title');
    const editPrice = document.getElementById('edit-c-price');
    const editImgFile = document.getElementById('edit-c-img-file');
    const editImgPreview = document.getElementById('edit-c-img-preview');
    const editDesc = document.getElementById('edit-c-desc');
    let editPendingImg = '';

    window.openEditModal = (id) => {
        const d = getData();
        const c = d.creations.find(item => item.id === id);
        if (!c) return;

        editId.value = c.id;
        editType.value = c.type;
        editTitle.value = c.title;
        editPrice.value = c.price || '';
        editCDomain.value = c.domain || (d.domains && d.domains[0]) || '';
        editCService.value = c.service || (d.services && d.services[0]) || '';
        editDesc.value = c.description || '';
        editImgPreview.src = c.image;
        editPendingImg = c.image;

        editModal.classList.add('active');
    };

    document.getElementById('btn-cancel-edit').addEventListener('click', () => {
        editModal.classList.remove('active');
    });

    editImgFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            editPendingImg = ev.target.result;
            editImgPreview.src = editPendingImg;
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('edit-creation-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = editId.value;
        const d = getData();
        const idx = d.creations.findIndex(c => c.id === id);
        if (idx === -1) return;

        d.creations[idx].type = editType.value;
        d.creations[idx].title = editTitle.value.trim();
        d.creations[idx].domain = editCDomain.value;
        d.creations[idx].service = editCService.value;
        const pVal = editPrice.value.trim();
        d.creations[idx].price = pVal ? parseInt(pVal) : null;
        d.creations[idx].description = editDesc.value.trim();
        if (editPendingImg) {
            d.creations[idx].image = editPendingImg;
        }

        saveData(d);
        renderCreations();
        refreshDiffAdmin();
        editModal.classList.remove('active');
        showMsg('✓ Création modifiée avec succès !');
    });

    // ============================================================
    // 6. TARIFS
    // ============================================================
    const pricesList = document.getElementById('prices-list');

    function renderPrices() {
        const d = getData();
        pricesList.innerHTML = (d.services || []).map(s => {
            const p = (d.prices && d.prices[s]) ? d.prices[s] : { basic: 5000, standard: 7500, premium: 10000 };
            return `
                <div style="border:1px solid var(--c-border); padding:16px; border-radius:10px; background:var(--c-bg);">
                    <h4 style="margin-bottom:12px; font-size:0.95rem; color:var(--c-primary-dark); font-weight:600;">${s}</h4>
                    <div class="form-group" style="margin-bottom:8px;">
                        <label style="font-size:0.8rem; font-weight:500;">Basic (F CFA)</label>
                        <input type="number" class="form-control price-in" data-s="${s}" data-t="basic" value="${p.basic}" min="0" required>
                    </div>
                    <div class="form-group" style="margin-bottom:8px;">
                        <label style="font-size:0.8rem; font-weight:500;">Standard (F CFA)</label>
                        <input type="number" class="form-control price-in" data-s="${s}" data-t="standard" value="${p.standard}" min="0" required>
                    </div>
                    <div class="form-group" style="margin-bottom:0;">
                        <label style="font-size:0.8rem; font-weight:500;">Premium (F CFA)</label>
                        <input type="number" class="form-control price-in" data-s="${s}" data-t="premium" value="${p.premium}" min="0" required>
                    </div>
                </div>
            `;
        }).join('');
    }

    document.getElementById('prices-form').addEventListener('submit', (e) => {
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
        showMsg('✓ Grille des tarifs mise à jour avec succès !');
    });

    // ============================================================
    // 7. WHATSAPP
    // ============================================================
    const adminWaInput = document.getElementById('admin-wa');
    if (data.settings && data.settings.whatsappNumber) {
        adminWaInput.value = data.settings.whatsappNumber;
    }

    document.getElementById('settings-form').addEventListener('submit', (e) => {
        e.preventDefault();
        data = getData();
        if (!data.settings) data.settings = {};
        data.settings.whatsappNumber = adminWaInput.value.trim();
        saveData(data);
        showMsg('✓ Numéro WhatsApp mis à jour !');
    });
});
