document.addEventListener('DOMContentLoaded', () => {
    let data = getData();

    // ============================================================
    // MESSAGES DE RETOUR
    // ============================================================
    const msgSuccess = document.getElementById('msg-success');
    function showMsg(txt, isError) {
        msgSuccess.textContent = txt || '✓ Modifications enregistrées !';
        msgSuccess.style.background  = isError ? '#fee2e2' : '#d4edda';
        msgSuccess.style.color       = isError ? '#991b1b' : '#155724';
        msgSuccess.style.borderColor = isError ? '#fca5a5' : '#c3e6cb';
        msgSuccess.style.display = 'block';
        msgSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => { msgSuccess.style.display = 'none'; }, 3500);
    }

    // ============================================================
    // DONNÉES PAR DÉFAUT
    // ============================================================
    const defaultDomains = [
        'Plomberie','Typographie','Fast-food','Carte de visite',
        'Affiche publicitaire','Étiquette','Flyer','Kakémono',
        'Logo','Packaging','Restaurant / Délice','Fashion',
        'Market','Boulangerie / Pâtisserie','Électricité / Bâtiment',
        'Salon de coiffure','Show-biz / Événements','Autres'
    ];
    if (!data.domains || data.domains.length === 0) {
        data.domains = defaultDomains;
        saveData(data);
    }

    // ============================================================
    // UTILITAIRES
    // ============================================================
    function fillSelect(selectEl, items, selectedValue) {
        if (!selectEl) return;
        selectEl.innerHTML = items.map(item =>
            `<option value="${item}" ${item === selectedValue ? 'selected' : ''}>${item}</option>`
        ).join('');
    }

    // Récupère les images d'une création (supporte image unique + tableau images[])
    function getImages(c) {
        if (c.images && Array.isArray(c.images) && c.images.length > 0) return [...c.images];
        if (c.image) return [c.image];
        return [];
    }

    // Sauvegarde les images dans une création (maintient rétrocompatibilité avec app.js)
    function setImages(creation, imagesArray) {
        creation.images = imagesArray;
        creation.image  = imagesArray[0] || '';  // app.js utilise c.image
    }

    // Lit un fichier image et retourne une Promise<base64>
    function readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            if (file.size > 8 * 1024 * 1024) {
                reject(new Error('Image trop grande (max 8 Mo).'));
                return;
            }
            const reader = new FileReader();
            reader.onload = ev => resolve(ev.target.result);
            reader.onerror = () => reject(new Error('Erreur de lecture du fichier.'));
            reader.readAsDataURL(file);
        });
    }

    // Lit et compresse une image pour le stockage fiable en base64 (évite la saturation de quota localStorage)
    function compressAndReadFile(file, maxWidth = 1200, maxHeight = 1200, quality = 0.85) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('Aucun fichier sélectionné.'));
                return;
            }
            if (file.type === 'image/svg+xml') {
                const reader = new FileReader();
                reader.onload = ev => resolve(ev.target.result);
                reader.onerror = () => reject(new Error('Erreur de lecture du fichier SVG.'));
                reader.readAsDataURL(file);
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    let w = img.width;
                    let h = img.height;
                    if (w > maxWidth || h > maxHeight) {
                        if (w > h) {
                            h = Math.round((h * maxWidth) / w);
                            w = maxWidth;
                        } else {
                            w = Math.round((w * maxHeight) / h);
                            h = maxHeight;
                        }
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, w, h);
                    const isPng = file.type === 'image/png';
                    let outputFormat = isPng ? 'image/png' : 'image/jpeg';
                    let b64 = canvas.toDataURL(outputFormat, quality);
                    if (isPng && b64.length > 500000) {
                        b64 = canvas.toDataURL('image/jpeg', 0.88);
                    }
                    resolve(b64);
                };
                img.onerror = () => resolve(e.target.result);
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('Erreur de lecture du fichier image.'));
            reader.readAsDataURL(file);
        });
    }

    // ============================================================
    // 1. LOGO
    // ============================================================
    const logoPreview     = document.getElementById('logo-preview');
    const logoPlaceholder = document.getElementById('logo-placeholder');
    const btnRemoveLogo   = document.getElementById('btn-remove-logo');
    const logoFileInput   = document.getElementById('logo-file-input');
    const logoCurrentBox  = document.getElementById('logo-current-box');

    function refreshLogoAdmin() {
        const d = getData();
        if (d.settings && d.settings.logoUrl) {
            logoPreview.src = d.settings.logoUrl;
            logoPreview.style.display = 'block';
            logoCurrentBox.style.display = 'flex';
            logoPlaceholder.style.display = 'none';
            btnRemoveLogo.style.display = 'inline-flex';
        } else {
            logoPreview.style.display = 'none';
            logoCurrentBox.style.display = 'none';
            logoPlaceholder.style.display = 'block';
            btnRemoveLogo.style.display = 'none';
        }
    }
    refreshLogoAdmin();

    logoFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        readFileAsBase64(file).then(b64 => {
            const d = getData();
            if (!d.settings) d.settings = {};
            d.settings.logoUrl = b64;
            saveData(d);
            refreshLogoAdmin();
            showMsg('✓ Logo importé et enregistré avec succès !');
        }).catch(err => showMsg('⚠️ ' + err.message, true));
    });

    btnRemoveLogo.addEventListener('click', () => {
        if (confirm('Supprimer le logo ? Le texte "PIXORA STUDIO" s\'affichera à la place.')) {
            const d = getData();
            if (!d.settings) d.settings = {};
            d.settings.logoUrl = '';
            saveData(d);
            refreshLogoAdmin();
            showMsg('✓ Logo supprimé.');
        }
    });

    // ============================================================
    // 2. GESTION DES DOMAINES
    // ============================================================
    const domainsTagList = document.getElementById('domains-tag-list');

    function refreshAllDomainSelects() {
        const d = getData();
        const domains = d.domains || [];
        document.querySelectorAll('.select-domain').forEach(sel => {
            const current = sel.value;
            sel.innerHTML = domains.map(dm => `<option value="${dm}">${dm}</option>`).join('');
            if (domains.includes(current)) sel.value = current;
        });
    }

    function renderDomains() {
        const d = getData();
        const domains = d.domains || [];
        domainsTagList.innerHTML = domains.length === 0
            ? '<p style="color:var(--c-text-muted);font-size:0.9rem;">Aucun domaine défini.</p>'
            : domains.map((dm, idx) => `
                <span class="tag-item">
                    ${dm}
                    <span class="tag-del" onclick="deleteDomain(${idx})" title="Supprimer">&times;</span>
                </span>`).join('');
        refreshAllDomainSelects();
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
        if (d.domains.includes(val)) { alert('Ce domaine existe déjà.'); return; }
        d.domains.push(val);
        saveData(d);
        renderDomains();
        input.value = '';
        showMsg(`✓ Domaine "${val}" ajouté !`);
    });

    renderDomains();

    // ============================================================
    // 3. GESTION DES SERVICES & IMAGES DE COUVERTURE
    // ============================================================
    const serviceImgList      = document.getElementById('service-images-list');
    const svcSelect           = document.getElementById('svc-select');
    const svcCurrentBox       = document.getElementById('svc-current-box');
    const svcCurrentPreview   = document.getElementById('svc-current-preview');
    const svcCurrentName      = document.getElementById('svc-current-name');
    const svcPlaceholderBox   = document.getElementById('svc-placeholder-box');
    const svcFileReplace      = document.getElementById('svc-file-replace');
    const svcFileEmpty        = document.getElementById('svc-file-empty');
    const svcBtnRemove        = document.getElementById('svc-btn-remove');
    const svcPendingBox       = document.getElementById('svc-pending-box');
    const svcPendingPreview   = document.getElementById('svc-pending-preview');
    const svcBtnSavePending   = document.getElementById('svc-btn-save-pending');
    const svcBtnCancelPending = document.getElementById('svc-btn-cancel-pending');

    let currentSelectedService = '';
    let pendingServiceImage = null;

    function refreshAllServiceSelects() {
        const d = getData();
        const services = d.services || [];
        document.querySelectorAll('.select-service').forEach(sel => {
            const current = sel.value;
            sel.innerHTML = services.map(s => `<option value="${s}">${s}</option>`).join('');
            if (services.includes(current)) sel.value = current;
        });

        if (svcSelect) {
            const prev = currentSelectedService || svcSelect.value;
            svcSelect.innerHTML = services.map(s => `<option value="${s}">${s}</option>`).join('');
            if (services.includes(prev)) {
                svcSelect.value = prev;
            } else if (services.length > 0) {
                svcSelect.value = services[0];
            }
            currentSelectedService = svcSelect.value;
        }
    }

    function updateServiceEditor(serviceName) {
        if (!serviceName) return;
        currentSelectedService = serviceName;
        if (svcSelect && svcSelect.value !== serviceName) {
            svcSelect.value = serviceName;
        }

        const d = getData();
        const imgUrl = (d.serviceImages && d.serviceImages[serviceName]) ? d.serviceImages[serviceName] : '';

        // Réinitialiser la zone pending lors d'un changement de service
        pendingServiceImage = null;
        if (svcPendingBox) svcPendingBox.style.display = 'none';
        if (svcPendingPreview) svcPendingPreview.src = '';

        if (imgUrl) {
            if (svcCurrentPreview) {
                svcCurrentPreview.src = imgUrl;
                svcCurrentPreview.style.display = 'block';
            }
            if (svcCurrentName) svcCurrentName.textContent = serviceName;
            if (svcCurrentBox) svcCurrentBox.style.display = 'flex';
            if (svcPlaceholderBox) svcPlaceholderBox.style.display = 'none';
        } else {
            if (svcCurrentPreview) {
                svcCurrentPreview.src = '';
                svcCurrentPreview.style.display = 'none';
            }
            if (svcCurrentBox) svcCurrentBox.style.display = 'none';
            if (svcPlaceholderBox) svcPlaceholderBox.style.display = 'block';
        }
    }

    function handleServiceImageFile(file, targetService) {
        const svc = targetService || currentSelectedService;
        if (!svc) {
            showMsg('⚠️ Veuillez d\'abord sélectionner un service.', true);
            return;
        }
        compressAndReadFile(file).then(b64 => {
            updateServiceEditor(svc);
            pendingServiceImage = b64;
            if (svcPendingPreview) {
                svcPendingPreview.src = b64;
                svcPendingPreview.style.display = 'block';
            }
            if (svcPendingBox) {
                svcPendingBox.style.display = 'flex';
                svcPendingBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            showMsg(`📸 Nouvelle image importée pour "${svc}" ! Vérifiez l'aperçu ci-dessous puis cliquez sur "Enregistrer".`);
        }).catch(err => showMsg('⚠️ ' + err.message, true));
    }

    if (svcSelect) {
        svcSelect.addEventListener('change', () => {
            updateServiceEditor(svcSelect.value);
            renderServiceOverviewList();
        });
    }

    if (svcFileReplace) {
        svcFileReplace.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) handleServiceImageFile(file, currentSelectedService);
            e.target.value = '';
        });
    }

    if (svcFileEmpty) {
        svcFileEmpty.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) handleServiceImageFile(file, currentSelectedService);
            e.target.value = '';
        });
    }

    if (svcBtnSavePending) {
        svcBtnSavePending.addEventListener('click', () => {
            if (!pendingServiceImage || !currentSelectedService) {
                showMsg('⚠️ Aucune nouvelle image à enregistrer.', true);
                return;
            }
            const d = getData();
            if (!d.serviceImages) d.serviceImages = {};
            d.serviceImages[currentSelectedService] = pendingServiceImage;
            saveData(d);

            const savedSvc = currentSelectedService;
            pendingServiceImage = null;
            if (svcPendingBox) svcPendingBox.style.display = 'none';

            updateServiceEditor(savedSvc);
            renderServiceOverviewList();
            showMsg(`✓ Image du service "${savedSvc}" enregistrée et conservée avec succès !`);
        });
    }

    if (svcBtnCancelPending) {
        svcBtnCancelPending.addEventListener('click', () => {
            pendingServiceImage = null;
            if (svcPendingBox) svcPendingBox.style.display = 'none';
            if (svcPendingPreview) svcPendingPreview.src = '';
            showMsg('Remplacement de l\'image annulé.');
        });
    }

    if (svcBtnRemove) {
        svcBtnRemove.addEventListener('click', () => {
            if (!currentSelectedService) return;
            if (confirm(`Retirer l'image personnalisée du service "${currentSelectedService}" ?`)) {
                const d = getData();
                if (d.serviceImages) d.serviceImages[currentSelectedService] = '';
                saveData(d);
                pendingServiceImage = null;
                if (svcPendingBox) svcPendingBox.style.display = 'none';
                updateServiceEditor(currentSelectedService);
                renderServiceOverviewList();
                showMsg(`✓ Image du service "${currentSelectedService}" retirée.`);
            }
        });
    }

    function renderServiceOverviewList() {
        const d = getData();
        const services = d.services || [];
        if (!serviceImgList) return;

        serviceImgList.innerHTML = services.map(s => {
            const imgUrl  = d.serviceImages ? (d.serviceImages[s] || '') : '';
            const safeId  = s.replace(/[^a-zA-Z0-9]/g, '_');
            const isDefault = ['Carte de visite','Flyer','Affiche publicitaire','Visuel publicitaire','Affiche / Kakémono','Étiquette','Logo','Autres'].includes(s);
            const isCurrent = s === currentSelectedService;
            const escapedName = s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            return `
            <div class="service-img-row" style="${isCurrent ? 'border-color:var(--c-primary);background:#f0f7ff;' : ''}">
                <span class="service-img-name">${s} ${isCurrent ? '<small style="color:var(--c-primary);font-weight:700;">(sélectionné)</small>' : ''}</span>
                ${imgUrl
                    ? `<img src="${imgUrl}" class="service-img-thumb" alt="${s}" title="Cliquer pour sélectionner ce service" onclick="selectServiceForEdit('${escapedName}')">`
                    : `<span style="font-size:0.78rem;color:#94a3b8;min-width:64px;display:inline-block;">Aucune image</span>`}
                
                <button type="button" class="btn btn-outline" onclick="selectServiceForEdit('${escapedName}')" style="font-size:0.82rem;padding:6px 14px;border-color:var(--c-primary);color:var(--c-primary);">
                    📌 Sélectionner
                </button>

                <label class="file-label" style="font-size:0.82rem;padding:6px 14px;" for="simg-file-${safeId}">
                    ${imgUrl ? '🔄 Remplacer' : '📁 Ajouter'}
                    <input type="file" id="simg-file-${safeId}" data-service="${s}" accept="image/*" style="display:none;" class="simg-file-input">
                </label>

                ${imgUrl ? `<button type="button" class="simg-remove-btn" data-service="${s}" style="background:none;border:none;color:#ef4444;font-size:0.82rem;cursor:pointer;font-weight:600;">✕ Retirer</button>` : ''}
                ${!isDefault ? `<button type="button" class="btn-delete" onclick="deleteService('${escapedName}')" style="margin-left:auto;padding:4px 10px;font-size:0.75rem;">Supprimer</button>` : ''}
            </div>`;
        }).join('');

        document.querySelectorAll('.simg-file-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const svc = e.target.dataset.service;
                const file = e.target.files[0];
                if (!file) return;
                handleServiceImageFile(file, svc);
                e.target.value = '';
            });
        });

        document.querySelectorAll('.simg-remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const svc = btn.dataset.service;
                if (confirm(`Retirer l'image du service "${svc}" ?`)) {
                    const fresh = getData();
                    if (fresh.serviceImages) fresh.serviceImages[svc] = '';
                    saveData(fresh);
                    if (svc === currentSelectedService) {
                        updateServiceEditor(svc);
                    }
                    renderServiceOverviewList();
                    showMsg(`✓ Image du service "${svc}" retirée.`);
                }
            });
        });
    }

    window.selectServiceForEdit = (serviceName) => {
        updateServiceEditor(serviceName);
        renderServiceOverviewList();
        const editor = document.querySelector('.service-editor-box');
        if (editor) editor.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    function renderServices() {
        refreshAllServiceSelects();
        if (currentSelectedService) {
            updateServiceEditor(currentSelectedService);
        } else {
            const d = getData();
            if (d.services && d.services.length > 0) {
                updateServiceEditor(d.services[0]);
            }
        }
        renderServiceOverviewList();
        renderPrices();
    }

    window.deleteService = (svcName) => {
        if (confirm(`Supprimer définitivement le service "${svcName}" ?`)) {
            const d = getData();
            d.services = d.services.filter(s => s !== svcName);
            if (d.serviceImages && d.serviceImages[svcName]) delete d.serviceImages[svcName];
            if (d.prices && d.prices[svcName]) delete d.prices[svcName];
            saveData(d);
            if (currentSelectedService === svcName) {
                currentSelectedService = d.services[0] || '';
            }
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
        if (d.services.includes(val)) { alert('Ce service existe déjà.'); return; }
        d.services.push(val);
        if (!d.prices) d.prices = {};
        if (!d.prices[val]) d.prices[val] = { basic: 5000, standard: 7500, premium: 10000 };
        saveData(d);
        currentSelectedService = val;
        renderServices();
        input.value = '';
        showMsg(`✓ Service "${val}" ajouté !`);
    });

    renderServices();

    // ============================================================
    // 4. COMPARAISON MA CRÉATION VS IA
    // ============================================================
    const diffMineTitle   = document.getElementById('diff-mine-title');
    const diffMineService = document.getElementById('diff-mine-service');
    const diffMineDesc    = document.getElementById('diff-mine-desc');
    const diffMineFile    = document.getElementById('diff-mine-file');
    const diffMinePreview = document.getElementById('diff-mine-preview');
    const diffAiTitle     = document.getElementById('diff-ai-title');
    const diffAiService   = document.getElementById('diff-ai-service');
    const diffAiDesc      = document.getElementById('diff-ai-desc');
    const diffAiFile      = document.getElementById('diff-ai-file');
    const diffAiPreview   = document.getElementById('diff-ai-preview');

    let diffMineImg = '';
    let diffAiImg   = '';

    function refreshDiffAdmin() {
        const d = getData();
        const myList = d.creations.filter(c => c.type === 'MY_CREATION');
        const aiList = d.creations.filter(c => c.type === 'AI_CREATION');
        const mine = (d.difference && d.difference.myCreation) || (myList[0] || {});
        const ai   = (d.difference && d.difference.aiCreation) || (aiList[0] || {});

        diffMineTitle.value   = mine.title || '';
        diffMineService.value = mine.service || '';
        diffMineDesc.value    = mine.description || '';
        const mineImg = getImages(mine)[0] || '';
        if (mineImg) { diffMineImg = mineImg; diffMinePreview.src = mineImg; diffMinePreview.style.display = 'block'; }
        else { diffMinePreview.style.display = 'none'; }

        diffAiTitle.value   = ai.title || '';
        diffAiService.value = ai.service || '';
        diffAiDesc.value    = ai.description || '';
        const aiImg = getImages(ai)[0] || '';
        if (aiImg) { diffAiImg = aiImg; diffAiPreview.src = aiImg; diffAiPreview.style.display = 'block'; }
        else { diffAiPreview.style.display = 'none'; }
    }
    refreshDiffAdmin();

    diffMineFile.addEventListener('change', (e) => {
        const file = e.target.files[0]; if (!file) return;
        readFileAsBase64(file).then(b64 => { diffMineImg = b64; diffMinePreview.src = b64; diffMinePreview.style.display = 'block'; }).catch(err => showMsg('⚠️ ' + err.message, true));
    });
    diffAiFile.addEventListener('change', (e) => {
        const file = e.target.files[0]; if (!file) return;
        readFileAsBase64(file).then(b64 => { diffAiImg = b64; diffAiPreview.src = b64; diffAiPreview.style.display = 'block'; }).catch(err => showMsg('⚠️ ' + err.message, true));
    });

    document.getElementById('diff-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const d = getData();
        if (!d.difference) d.difference = {};
        d.difference.myCreation = {
            title: diffMineTitle.value.trim() || 'Ma Création',
            service: diffMineService.value.trim() || 'Création graphique',
            description: diffMineDesc.value.trim(),
            image: diffMineImg || getImages(d.creations.find(c => c.type === 'MY_CREATION') || {})[0] || ''
        };
        d.difference.aiCreation = {
            title: diffAiTitle.value.trim() || 'Création par IA',
            service: diffAiService.value.trim() || 'Génération automatique',
            description: diffAiDesc.value.trim(),
            image: diffAiImg || getImages(d.creations.find(c => c.type === 'AI_CREATION') || {})[0] || ''
        };
        saveData(d);
        showMsg('✓ Comparaison enregistrée avec succès !');
    });

    document.getElementById('btn-reset-diff').addEventListener('click', () => {
        if (confirm('Réinitialiser la comparaison ?')) {
            const d = getData();
            delete d.difference;
            saveData(d);
            diffMineImg = ''; diffAiImg = '';
            refreshDiffAdmin();
            showMsg('✓ Comparaison réinitialisée.');
        }
    });

    // ============================================================
    // 5. GESTION DU CATALOGUE — AJOUT (multi-images)
    // ============================================================
    let pendingImages = [];  // Tableau de base64 pour le formulaire d'ajout

    const cImgFile    = document.getElementById('c-img-file');
    const cImgUrl     = document.getElementById('c-img-url');
    const addImagesPreview = document.getElementById('add-images-preview');

    function renderAddImagesPreview() {
        if (pendingImages.length === 0) {
            addImagesPreview.innerHTML = '<p style="color:#94a3b8;font-size:0.85rem;">Aucune image sélectionnée.</p>';
            return;
        }
        addImagesPreview.innerHTML = pendingImages.map((img, idx) => `
            <div style="position:relative;display:inline-block;margin:4px;">
                <img src="${img}" style="width:80px;height:80px;object-fit:cover;border-radius:8px;border:2px solid ${idx===0?'#3b82f6':'#e2e8f0'};" title="${idx===0?'Image principale':'Image '+( idx+1)}">
                ${idx===0 ? '<span style="position:absolute;bottom:2px;left:2px;background:#3b82f6;color:white;font-size:0.62rem;font-weight:700;padding:1px 5px;border-radius:3px;">PRINCIPALE</span>' : ''}
                <button type="button" onclick="removeAddImage(${idx})"
                    style="position:absolute;top:-6px;right:-6px;background:#ef4444;color:white;border:none;border-radius:50%;width:22px;height:22px;cursor:pointer;font-size:0.75rem;font-weight:bold;display:flex;align-items:center;justify-content:center;">✕</button>
            </div>
        `).join('');
    }

    window.removeAddImage = (idx) => {
        pendingImages.splice(idx, 1);
        renderAddImagesPreview();
    };

    cImgFile.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        for (const file of files) {
            try {
                const b64 = await readFileAsBase64(file);
                pendingImages.push(b64);
            } catch(err) {
                showMsg('⚠️ ' + err.message, true);
            }
        }
        e.target.value = '';
        renderAddImagesPreview();
    });

    cImgUrl.addEventListener('change', () => {
        const url = cImgUrl.value.trim();
        if (url) {
            pendingImages.push(url);
            cImgUrl.value = '';
            renderAddImagesPreview();
        }
    });

    const creationsList  = document.getElementById('creations-list');
    const creationsCount = document.getElementById('creations-count');
    let currentCategoryFilter = 'ALL';

    // ============================================================
    // RENDU DU CATALOGUE (liste des créations existantes)
    // ============================================================
    function renderCreations() {
        const d = getData();
        let list = d.creations || [];
        if (currentCategoryFilter !== 'ALL') {
            list = list.filter(c => c.type === currentCategoryFilter);
        }
        creationsCount.textContent = list.length;

        if (list.length === 0) {
            creationsList.innerHTML = `<p style="color:var(--c-text-muted);text-align:center;padding:30px;">Aucune création dans cette catégorie.</p>`;
            return;
        }

        creationsList.innerHTML = list.map(c => {
            const imgs = getImages(c);
            const mainImg = imgs[0] || '';
            const extraCount = imgs.length - 1;
            const priceTag = c.price
                ? `<span style="font-weight:700;color:#059669;font-size:0.82rem;">💰 ${Number(c.price).toLocaleString('fr-FR')} F CFA</span>`
                : '';
            return `
            <div class="item-row">
                <div class="item-info">
                    <!-- Image(s) -->
                    <div style="position:relative;flex-shrink:0;cursor:pointer;" onclick="previewFullscreen('${c.id}',0)" title="Voir l'image">
                        <img src="${mainImg || 'https://placehold.co/72x72?text=Image'}" alt="${c.title}"
                            style="width:72px;height:72px;object-fit:cover;border-radius:8px;border:2px solid ${imgs.length>1?'#3b82f6':'var(--c-border)'};"
                            onerror="this.src='https://placehold.co/72x72?text=Image'">
                        ${extraCount > 0 ? `<span style="position:absolute;bottom:2px;right:2px;background:rgba(0,0,0,0.7);color:white;font-size:0.65rem;font-weight:700;padding:1px 5px;border-radius:4px;">+${extraCount}</span>` : ''}
                    </div>
                    <!-- Infos -->
                    <div class="item-meta">
                        <div style="display:flex;align-items:center;flex-wrap:wrap;gap:4px;margin-bottom:4px;">
                            <strong style="font-size:0.95rem;">${c.title}</strong>
                            <span class="badge-type ${c.type === 'AI_CREATION' ? 'badge-ai' : ''}">${c.type === 'MY_CREATION' ? 'Ma création' : 'IA'}</span>
                        </div>
                        <small style="display:block;color:#475569;margin-bottom:2px;">📂 <strong>${c.domain || '—'}</strong> &nbsp;|&nbsp; 🎨 ${c.service || '—'}</small>
                        ${priceTag ? `<div style="margin-bottom:2px;">${priceTag}</div>` : ''}
                        ${c.description ? `<small style="display:block;color:#94a3b8;font-style:italic;">${c.description}</small>` : ''}
                        ${imgs.length > 1 ? `<small style="display:block;color:#3b82f6;font-weight:600;margin-top:2px;">📸 ${imgs.length} images</small>` : ''}
                    </div>
                </div>
                <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
                    <button type="button" class="btn-edit" onclick="openEditModal('${c.id}')">✏️ Modifier</button>
                    <button type="button" class="btn-delete" onclick="deleteCreation('${c.id}')">🗑 Supprimer</button>
                </div>
            </div>`;
        }).join('');
    }

    // Filtres
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
            showMsg('✓ Création supprimée.');
        }
    };

    // Soumettre le formulaire d'ajout
    document.getElementById('creation-form').addEventListener('submit', (e) => {
        e.preventDefault();
        if (pendingImages.length === 0) {
            alert('Veuillez choisir au moins une image pour votre création.');
            return;
        }
        const d = getData();
        if (!d.creations) d.creations = [];
        const priceVal = document.getElementById('c-price').value.trim();

        const newCreation = {
            id: 'c_' + Date.now(),
            type: document.getElementById('c-type').value,
            title: document.getElementById('c-title').value.trim(),
            domain: document.getElementById('c-domain').value,
            service: document.getElementById('c-service').value,
            price: priceVal ? parseInt(priceVal) : null,
            description: document.getElementById('c-desc').value.trim()
        };
        setImages(newCreation, pendingImages);

        d.creations.unshift(newCreation);
        saveData(d);
        renderCreations();
        refreshDiffAdmin();
        e.target.reset();
        pendingImages = [];
        renderAddImagesPreview();
        showMsg('✓ Nouvelle création ajoutée au catalogue !');
    });

    renderCreations();
    renderAddImagesPreview();

    // ============================================================
    // MODAL MODIFICATION CREATION — MULTI-IMAGES
    // ============================================================
    const editModal   = document.getElementById('edit-creation-modal');
    const editId      = document.getElementById('edit-c-id');
    const editType    = document.getElementById('edit-c-type');
    const editTitle   = document.getElementById('edit-c-title');
    const editPrice   = document.getElementById('edit-c-price');
    const editDomain  = document.getElementById('edit-c-domain');
    const editService = document.getElementById('edit-c-service');
    const editDesc    = document.getElementById('edit-c-desc');
    const editImgsGallery = document.getElementById('edit-images-gallery');
    const editAddImgFile  = document.getElementById('edit-add-img-file');

    let editImages = [];  // Tableau d'images en cours d'édition

    function renderEditGallery() {
        if (editImages.length === 0) {
            editImgsGallery.innerHTML = '<p style="color:#94a3b8;font-size:0.85rem;padding:10px 0;">Aucune image. Ajoutez-en une ci-dessous.</p>';
            return;
        }
        editImgsGallery.innerHTML = editImages.map((img, idx) => `
            <div style="position:relative;display:inline-block;margin:4px;">
                <img src="${img}"
                    style="width:90px;height:90px;object-fit:cover;border-radius:8px;cursor:pointer;border:${idx===0?'3px solid #3b82f6':'2px solid #e2e8f0'};"
                    onclick="previewEditImage(${idx})"
                    title="Cliquer pour agrandir"
                    onerror="this.src='https://placehold.co/90x90?text=Image'">
                ${idx === 0 ? '<span style="position:absolute;bottom:2px;left:2px;background:#3b82f6;color:white;font-size:0.6rem;font-weight:700;padding:1px 5px;border-radius:3px;">PRINCIPALE</span>' : ''}
                <div style="position:absolute;top:-6px;right:-6px;display:flex;gap:2px;">
                    <label title="Remplacer cette image" for="replace-img-${idx}"
                        style="background:#f59e0b;color:white;border:none;border-radius:50%;width:22px;height:22px;cursor:pointer;font-size:0.6rem;font-weight:bold;display:flex;align-items:center;justify-content:center;">
                        🔄
                        <input type="file" id="replace-img-${idx}" accept="image/*" data-idx="${idx}" style="display:none;" class="replace-img-input">
                    </label>
                    <button type="button" onclick="removeEditImage(${idx})"
                        style="background:#ef4444;color:white;border:none;border-radius:50%;width:22px;height:22px;cursor:pointer;font-size:0.75rem;font-weight:bold;display:flex;align-items:center;justify-content:center;">✕</button>
                </div>
            </div>
        `).join('');

        // Attacher les handlers de remplacement
        editImgsGallery.querySelectorAll('.replace-img-input').forEach(input => {
            input.addEventListener('change', async (e) => {
                const idx = parseInt(e.target.dataset.idx);
                const file = e.target.files[0]; if (!file) return;
                try {
                    const b64 = await readFileAsBase64(file);
                    editImages[idx] = b64;
                    renderEditGallery();
                } catch(err) { showMsg('⚠️ ' + err.message, true); }
            });
        });
    }

    window.removeEditImage = (idx) => {
        if (editImages.length <= 1) {
            if (!confirm('Supprimer la seule image de cette création ?')) return;
        }
        editImages.splice(idx, 1);
        renderEditGallery();
    };

    window.previewEditImage = (idx) => {
        const overlay = document.getElementById('img-fullscreen-overlay');
        document.getElementById('img-fullscreen-img').src = editImages[idx];
        document.getElementById('img-fullscreen-title').textContent = `Image ${idx + 1} / ${editImages.length}`;
        overlay.style.display = 'flex';
    };

    editAddImgFile.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        for (const file of files) {
            try {
                const b64 = await readFileAsBase64(file);
                editImages.push(b64);
            } catch(err) { showMsg('⚠️ ' + err.message, true); }
        }
        e.target.value = '';
        renderEditGallery();
    });

    window.openEditModal = (id) => {
        const d = getData();
        const c = d.creations.find(item => item.id === id);
        if (!c) return;

        editId.value    = c.id;
        editType.value  = c.type;
        editTitle.value = c.title;
        editPrice.value = c.price || '';
        editDesc.value  = c.description || '';

        fillSelect(editDomain, d.domains || [], c.domain || '');
        fillSelect(editService, d.services || [], c.service || '');

        editImages = getImages(c);
        renderEditGallery();

        editModal.classList.add('active');
        editModal.scrollTop = 0;
    };

    document.getElementById('btn-cancel-edit').addEventListener('click', () => {
        editModal.classList.remove('active');
        editImages = [];
    });

    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) { editModal.classList.remove('active'); editImages = []; }
    });

    document.getElementById('edit-creation-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const id  = editId.value;
        const d   = getData();
        const idx = d.creations.findIndex(c => c.id === id);
        if (idx === -1) return;

        d.creations[idx].type        = editType.value;
        d.creations[idx].title       = editTitle.value.trim();
        d.creations[idx].domain      = editDomain ? editDomain.value : d.creations[idx].domain;
        d.creations[idx].service     = editService ? editService.value : d.creations[idx].service;
        d.creations[idx].price       = editPrice.value.trim() ? parseInt(editPrice.value.trim()) : null;
        d.creations[idx].description = editDesc.value.trim();
        setImages(d.creations[idx], editImages);

        saveData(d);
        renderCreations();
        refreshDiffAdmin();
        editModal.classList.remove('active');
        editImages = [];
        showMsg('✓ Création modifiée avec succès !');
    });

    // ============================================================
    // OVERLAY PLEIN ÉCRAN (depuis la liste catalogue)
    // ============================================================
    window.previewFullscreen = (id, imgIdx) => {
        const d = getData();
        const c = d.creations.find(item => item.id === id);
        if (!c) return;
        const imgs = getImages(c);
        if (!imgs[imgIdx]) return;
        const overlay = document.getElementById('img-fullscreen-overlay');
        document.getElementById('img-fullscreen-img').src = imgs[imgIdx];
        document.getElementById('img-fullscreen-title').textContent = `${c.title}${imgs.length > 1 ? ' — Image ' + (imgIdx + 1) + '/' + imgs.length : ''}`;
        overlay.style.display = 'flex';
    };

    const imgOverlay = document.getElementById('img-fullscreen-overlay');
    if (imgOverlay) {
        imgOverlay.addEventListener('click', (e) => {
            if (e.target === imgOverlay || e.target.id === 'img-fullscreen-close') {
                imgOverlay.style.display = 'none';
            }
        });
    }

    // ============================================================
    // 6. TARIFS
    // ============================================================
    const pricesList = document.getElementById('prices-list');

    function renderPrices() {
        const d = getData();
        const services = d.services || [];
        if (services.length === 0) {
            pricesList.innerHTML = '<p style="color:var(--c-text-muted);font-size:0.9rem;">Aucun service défini.</p>';
            return;
        }
        pricesList.innerHTML = services.map(s => {
            const p = (d.prices && d.prices[s]) ? d.prices[s] : { basic: 5000, standard: 7500, premium: 10000 };
            return `
            <div style="border:1px solid var(--c-border);padding:16px;border-radius:10px;background:var(--c-bg);">
                <h4 style="margin-bottom:12px;font-size:0.95rem;color:var(--c-primary-dark);font-weight:600;">${s}</h4>
                <div class="form-group" style="margin-bottom:8px;">
                    <label style="font-size:0.8rem;font-weight:500;">Basic (F CFA)</label>
                    <input type="number" class="form-control price-in" data-s="${s}" data-t="basic" value="${p.basic}" min="0" required>
                </div>
                <div class="form-group" style="margin-bottom:8px;">
                    <label style="font-size:0.8rem;font-weight:500;">Standard (F CFA)</label>
                    <input type="number" class="form-control price-in" data-s="${s}" data-t="standard" value="${p.standard}" min="0" required>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <label style="font-size:0.8rem;font-weight:500;">Premium (F CFA)</label>
                    <input type="number" class="form-control price-in" data-s="${s}" data-t="premium" value="${p.premium}" min="0" required>
                </div>
            </div>`;
        }).join('');
    }

    document.getElementById('prices-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const d = getData();
        if (!d.prices) d.prices = {};
        document.querySelectorAll('.price-in').forEach(input => {
            const svc = input.dataset.s; const tier = input.dataset.t;
            if (!d.prices[svc]) d.prices[svc] = {};
            d.prices[svc][tier] = parseInt(input.value) || 0;
        });
        saveData(d);
        showMsg('✓ Grille des tarifs mise à jour !');
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
        const d = getData();
        if (!d.settings) d.settings = {};
        d.settings.whatsappNumber = adminWaInput.value.trim();
        saveData(d);
        showMsg('✓ Numéro WhatsApp mis à jour !');
    });
});
