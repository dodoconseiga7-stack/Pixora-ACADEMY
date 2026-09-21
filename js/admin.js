document.addEventListener('DOMContentLoaded', () => {
    let data = getData();

    const msgSuccess = document.getElementById('msg-success');
    function showMsg(txt) {
        msgSuccess.textContent = txt || '✓ Modifications enregistrées !';
        msgSuccess.style.display = 'block';
        msgSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => msgSuccess.style.display = 'none', 3500);
    }

    // ============================================================
    // 1. GESTION DU LOGO (import fichier local → Base64)
    // ============================================================
    const logoPreview     = document.getElementById('logo-preview');
    const logoPlaceholder = document.getElementById('logo-placeholder');
    const btnRemoveLogo   = document.getElementById('btn-remove-logo');
    const logoFileInput   = document.getElementById('logo-file-input');

    function refreshLogoAdmin() {
        const d = getData();
        if (d.settings.logoUrl) {
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
            data.settings.logoUrl = ev.target.result; // Base64
            saveData(data);
            refreshLogoAdmin();
            showMsg('✓ Logo importé et enregistré !');
        };
        reader.readAsDataURL(file);
    });

    btnRemoveLogo.addEventListener('click', () => {
        if (confirm('Supprimer le logo ? Le nom textuel sera affiché à la place.')) {
            data = getData();
            data.settings.logoUrl = '';
            saveData(data);
            refreshLogoAdmin();
            showMsg('✓ Logo supprimé.');
        }
    });

    // ============================================================
    // 2. NUMÉRO WHATSAPP
    // ============================================================
    document.getElementById('admin-wa').value = data.settings.whatsappNumber;

    document.getElementById('settings-form').addEventListener('submit', (e) => {
        e.preventDefault();
        data = getData();
        data.settings.whatsappNumber = document.getElementById('admin-wa').value;
        saveData(data);
        showMsg('✓ Numéro WhatsApp mis à jour !');
    });

    // ============================================================
    // 3. IMAGES DES CARTES DE SERVICES
    // ============================================================
    const serviceImgList = document.getElementById('service-images-list');

    function buildServiceImageRows() {
        const d = getData();
        serviceImgList.innerHTML = d.services.filter(s => s !== 'Autres').map(s => {
            const imgUrl = d.serviceImages ? (d.serviceImages[s] || '') : '';
            return `
                <div class="service-img-row">
                    <span class="service-img-name">${s}</span>
                    <img id="simg-thumb-${s.replace(/\s+/g,'_')}" src="${imgUrl}" class="service-img-thumb" style="${imgUrl ? 'display:block;' : 'display:none;'}" alt="${s}">
                    <label class="file-label" style="font-size:0.82rem; padding:7px 14px;" for="simg-file-${s.replace(/\s+/g,'_')}">
                        📁 Choisir
                        <input type="file" id="simg-file-${s.replace(/\s+/g,'_')}" data-service="${s}" accept="image/*" style="display:none;" class="simg-file-input">
                    </label>
                    ${imgUrl ? `<button type="button" class="btn-delete simg-remove-btn" data-service="${s}" style="background:none; border:none; color:#e53935; font-size:0.85rem; cursor:pointer; font-weight:600;">✕ Retirer</button>` : ''}
                </div>
            `;
        }).join('');

        // Events pour les fichiers
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
                    showMsg(`✓ Image "${svc}" mise à jour !`);
                };
                reader.readAsDataURL(file);
            });
        });

        // Événements bouton retirer
        document.querySelectorAll('.simg-remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const svc = btn.dataset.service;
                const d = getData();
                if (d.serviceImages) d.serviceImages[svc] = '';
                saveData(d);
                buildServiceImageRows();
            });
        });
    }
    buildServiceImageRows();

    // Bouton enregistrer (déclenche un message de confirmation)
    document.getElementById('btn-save-service-images').addEventListener('click', () => {
        showMsg('✓ Images des services enregistrées !');
    });

    // ============================================================
    // 4. GESTION DES CRÉATIONS
    // ============================================================
    const cDomain = document.getElementById('c-domain');
    const cService = document.getElementById('c-service');
    const cImgFile = document.getElementById('c-img-file');
    const cImgUrl  = document.getElementById('c-img-url');
    const cImgPreview = document.getElementById('c-img-preview');
    let pendingImgBase64 = '';

    data.domains.forEach(d => { cDomain.innerHTML += `<option value="${d}">${d}</option>`; });
    data.services.forEach(s => { cService.innerHTML += `<option value="${s}">${s}</option>`; });

    // Prévisualisation image depuis fichier
    cImgFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Vérification de la taille du fichier (Max 5 Mo)
        if (file.size > 5 * 1024 * 1024) {
            alert('L\\'image est trop lourde. Veuillez choisir une image de moins de 5 Mo.');
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

    // Prévisualisation depuis URL
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
    function renderCreations() {
        const d = getData();
        if (d.creations.length === 0) {
            creationsList.innerHTML = `<p style="color:var(--c-text-muted);">Aucune création enregistrée.</p>`;
            return;
        }
        creationsList.innerHTML = d.creations.map(c => `
            <div class="item-row">
                <div class="item-info">
                    <img src="${c.image}" alt="${c.title}">
                    <div class="item-meta">
                        <strong>${c.title}</strong>
                        <span class="badge-type ${c.type === 'AI_CREATION' ? 'badge-ai' : ''}">${c.type === 'MY_CREATION' ? 'Ma création' : 'IA'}</span>
                        <small>${c.service} — ${c.domain}</small>
                    </div>
                </div>
                <button class="btn-delete" onclick="deleteCreation('${c.id}')">Supprimer</button>
            </div>
        `).join('');
    }

    window.deleteCreation = (id) => {
        if (confirm('Supprimer cette création ?')) {
            const d = getData();
            d.creations = d.creations.filter(c => c.id !== id);
            saveData(d);
            renderCreations();
        }
    };
    renderCreations();

    document.getElementById('creation-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const imgFinal = pendingImgBase64 || cImgUrl.value;
        if (!imgFinal) {
            alert('Veuillez choisir une image (depuis votre ordinateur ou coller un lien URL).');
            return;
        }
        const d = getData();
        d.creations.unshift({
            id: 'c_' + Date.now(),
            type: document.getElementById('c-type').value,
            title: document.getElementById('c-title').value,
            domain: cDomain.value,
            service: cService.value,
            image: imgFinal,
            description: document.getElementById('c-desc').value
        });
        saveData(d);
        renderCreations();
        e.target.reset();
        pendingImgBase64 = '';
        cImgPreview.style.display = 'none';
        showMsg('✓ Création ajoutée au catalogue !');
    });

    // ============================================================
    // 5. TARIFS
    // ============================================================
    const pricesList = document.getElementById('prices-list');
    pricesList.innerHTML = data.services.map(s => {
        const p = data.prices[s] || { basic: 0, standard: 0, premium: 0 };
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

    document.getElementById('prices-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const d = getData();
        document.querySelectorAll('.price-in').forEach(input => {
            const svc = input.dataset.s;
            const tier = input.dataset.t;
            if (!d.prices[svc]) d.prices[svc] = {};
            d.prices[svc][tier] = parseInt(input.value);
        });
        saveData(d);
        showMsg('✓ Tarifs mis à jour !');
    });
});
