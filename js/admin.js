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

    /**
     * Remplit un <select> avec des options, puis sélectionne la valeur choisie.
     * La sélection se fait après l'insertion dans le DOM pour garantir la cohérence.
     */
    function fillSelect(selectEl, items, selectedValue) {
        if (!selectEl) return;
        // Générer et insérer les options
        selectEl.innerHTML = items.map(item =>
            `<option value="${item}">${item}</option>`
        ).join('');
        // Sélectionner la valeur uniquement si elle existe dans la liste
        if (items.includes(selectedValue)) {
            selectEl.value = selectedValue;
        } else if (selectedValue && items.length > 0) {
            // La valeur n'existe plus — ajouter une option temporaire pour l'afficher
            const ghost = document.createElement('option');
            ghost.value = selectedValue;
            ghost.textContent = selectedValue + ' (valeur précédente)';
            ghost.style.color = '#ef4444';
            selectEl.insertBefore(ghost, selectEl.firstChild);
            selectEl.value = selectedValue;
        }
    }

    // Récupère les images d'une création (supporte image unique + tableau images[])
    function getImages(c) {
        if (c && c.images && Array.isArray(c.images) && c.images.length > 0) return [...c.images];
        if (c && c.image) return [c.image];
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

    // Lit et compresse une image pour le stockage fiable en base64
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
    const logoImportBtn   = document.getElementById('logo-import-btn');

    const adminSiteLogoNav = document.getElementById('admin-site-logo-nav');

    function renderAdminHeaderLogo() {
        const d = getData();
        if (adminSiteLogoNav) {
            if (d.settings && d.settings.logoUrl) {
                adminSiteLogoNav.innerHTML = `<img src="${d.settings.logoUrl}" alt="PIXORA STUDIO" class="admin-nav-logo">`;
            } else {
                adminSiteLogoNav.innerHTML = `<span class="logo-text">PIXORA STUDIO</span>`;
            }
        }
    }

    function refreshLogoAdmin() {
        const d = getData();
        if (d.settings && d.settings.logoUrl) {
            logoPreview.src = d.settings.logoUrl;
            logoPreview.style.display = 'block';
            logoCurrentBox.style.display = 'block';
            if (logoPlaceholder) logoPlaceholder.style.display = 'none';
            if (logoImportBtn)   logoImportBtn.style.display = 'none';
        } else {
            logoPreview.style.display = 'none';
            logoCurrentBox.style.display = 'none';
            if (logoPlaceholder) logoPlaceholder.style.display = 'block';
            if (logoImportBtn)   logoImportBtn.style.display = 'block';
        }
        renderAdminHeaderLogo();
    }
    refreshLogoAdmin();

    // Handler commun pour l'import logo (depuis le bouton "Remplacer" ou "Importer")
    function handleLogoFile(file) {
        if (!file) return;
        readFileAsBase64(file).then(b64 => {
            const d = getData();
            if (!d.settings) d.settings = {};
            d.settings.logoUrl = b64;
            saveData(d);
            refreshLogoAdmin();
            showMsg('✓ Logo importé et enregistré avec succès !');
        }).catch(err => showMsg('⚠️ ' + err.message, true));
    }

    if (logoFileInput) {
        logoFileInput.addEventListener('change', (e) => {
            handleLogoFile(e.target.files[0]);
            e.target.value = '';
        });
    }

    // Pont pour le bouton "Importer" quand aucun logo n'existe
    document.addEventListener('logo-file-picked', (e) => {
        if (e.detail && e.detail.file) handleLogoFile(e.detail.file);
    });

    // Fallback direct sur logo-file-input-empty si le CustomEvent ne passe pas
    const logoFileInputEmpty = document.getElementById('logo-file-input-empty');
    if (logoFileInputEmpty) {
        logoFileInputEmpty.addEventListener('change', (e) => {
            handleLogoFile(e.target.files[0]);
            e.target.value = '';
        });
    }

    if (btnRemoveLogo) {
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
    }

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
        const myList = (d.creations || []).filter(c => c.type === 'MY_CREATION');
        const aiList = (d.creations || []).filter(c => c.type === 'AI_CREATION');
        const mine = (d.difference && d.difference.myCreation) || (myList[0] || {});
        const ai   = (d.difference && d.difference.aiCreation) || (aiList[0] || {});

        if (diffMineTitle)   diffMineTitle.value   = mine.title || '';
        if (diffMineService) diffMineService.value = mine.service || '';
        if (diffMineDesc)    diffMineDesc.value    = mine.description || '';
        const mineImg = getImages(mine)[0] || '';
        if (mineImg) { diffMineImg = mineImg; diffMinePreview.src = mineImg; diffMinePreview.style.display = 'block'; }
        else if (diffMinePreview) { diffMinePreview.style.display = 'none'; }

        if (diffAiTitle)   diffAiTitle.value   = ai.title || '';
        if (diffAiService) diffAiService.value = ai.service || '';
        if (diffAiDesc)    diffAiDesc.value    = ai.description || '';
        const aiImg = getImages(ai)[0] || '';
        if (aiImg) { diffAiImg = aiImg; diffAiPreview.src = aiImg; diffAiPreview.style.display = 'block'; }
        else if (diffAiPreview) { diffAiPreview.style.display = 'none'; }
    }
    refreshDiffAdmin();

    if (diffMineFile) {
        diffMineFile.addEventListener('change', (e) => {
            const file = e.target.files[0]; if (!file) return;
            readFileAsBase64(file).then(b64 => {
                diffMineImg = b64;
                diffMinePreview.src = b64;
                diffMinePreview.style.display = 'block';
            }).catch(err => showMsg('⚠️ ' + err.message, true));
        });
    }
    if (diffAiFile) {
        diffAiFile.addEventListener('change', (e) => {
            const file = e.target.files[0]; if (!file) return;
            readFileAsBase64(file).then(b64 => {
                diffAiImg = b64;
                diffAiPreview.src = b64;
                diffAiPreview.style.display = 'block';
            }).catch(err => showMsg('⚠️ ' + err.message, true));
        });
    }

    const diffForm = document.getElementById('diff-form');
    if (diffForm) {
        diffForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const d = getData();
            if (!d.difference) d.difference = {};
            d.difference.myCreation = {
                title: diffMineTitle ? diffMineTitle.value.trim() || 'Ma Création' : 'Ma Création',
                service: diffMineService ? diffMineService.value.trim() || 'Création graphique' : 'Création graphique',
                description: diffMineDesc ? diffMineDesc.value.trim() : '',
                image: diffMineImg || getImages((d.creations || []).find(c => c.type === 'MY_CREATION') || {})[0] || ''
            };
            d.difference.aiCreation = {
                title: diffAiTitle ? diffAiTitle.value.trim() || 'Création par IA' : 'Création par IA',
                service: diffAiService ? diffAiService.value.trim() || 'Génération automatique' : 'Génération automatique',
                description: diffAiDesc ? diffAiDesc.value.trim() : '',
                image: diffAiImg || getImages((d.creations || []).find(c => c.type === 'AI_CREATION') || {})[0] || ''
            };
            saveData(d);
            showMsg('✓ Comparaison enregistrée avec succès !');
        });
    }

    const btnResetDiff = document.getElementById('btn-reset-diff');
    if (btnResetDiff) {
        btnResetDiff.addEventListener('click', () => {
            if (confirm('Réinitialiser la comparaison ?')) {
                const d = getData();
                delete d.difference;
                saveData(d);
                diffMineImg = ''; diffAiImg = '';
                refreshDiffAdmin();
                showMsg('✓ Comparaison réinitialisée.');
            }
        });
    }

    // ============================================================
    // 5. GESTION DU CATALOGUE — AJOUT (multi-images)
    // ============================================================
    let pendingImages = [];  // Tableau de base64 pour le formulaire d'ajout

    const cImgFile    = document.getElementById('c-img-file');
    const cImgUrl     = document.getElementById('c-img-url');
    const addImagesPreview = document.getElementById('add-images-preview');

    function renderAddImagesPreview() {
        if (!addImagesPreview) return;
        if (pendingImages.length === 0) {
            addImagesPreview.innerHTML = '<p style="color:#94a3b8;font-size:0.85rem;">Aucune image sélectionnée.</p>';
            return;
        }
        addImagesPreview.innerHTML = pendingImages.map((img, idx) => `
            <div style="position:relative;display:inline-block;margin:4px;">
                <img src="${img}" style="width:80px;height:80px;object-fit:cover;border-radius:8px;border:2px solid ${idx===0?'#3b82f6':'#e2e8f0'};" title="${idx===0?'Image principale':'Image '+( idx+1)}" onerror="this.src='https://placehold.co/80x80?text=Image'">
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

    if (cImgFile) {
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
    }

    if (cImgUrl) {
        cImgUrl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const url = cImgUrl.value.trim();
                if (url) {
                    pendingImages.push(url);
                    cImgUrl.value = '';
                    renderAddImagesPreview();
                }
            }
        });
        cImgUrl.addEventListener('change', () => {
            const url = cImgUrl.value.trim();
            if (url) {
                pendingImages.push(url);
                cImgUrl.value = '';
                renderAddImagesPreview();
            }
        });
    }

    const creationsList  = document.getElementById('creations-list');
    const creationsCount = document.getElementById('creations-count');
    let currentCategoryFilter = 'ALL';
    let currentAdminServiceFilter = 'ALL';

    // ============================================================
    // RENDU DU CATALOGUE (liste des créations existantes)
    // ============================================================
    function renderCreations() {
        const d = getData();
        let list = d.creations || [];

        // Filtre Type (Toutes / Mes Créations / IA)
        if (currentCategoryFilter !== 'ALL') {
            list = list.filter(c => c.type === currentCategoryFilter);
        }

        // Filtre Catégorie de service (Logos, Flyers, Cartes, Affiches, Visuels, Étiquettes...)
        if (currentAdminServiceFilter !== 'ALL') {
            const f = currentAdminServiceFilter.toLowerCase();
            list = list.filter(c => {
                const svc = (c.service || '').toLowerCase();
                const dom = (c.domain || '').toLowerCase();
                const tit = (c.title || '').toLowerCase();
                if (f === 'logo') return svc.includes('logo') || dom.includes('logo') || tit.includes('logo');
                if (f === 'flyer') return svc.includes('flyer') || dom.includes('flyer') || tit.includes('flyer');
                if (f.includes('carte')) return svc.includes('carte') || dom.includes('carte') || tit.includes('carte');
                if (f.includes('affiche')) return svc.includes('affiche') || svc.includes('kakemono') || svc.includes('kakémono') || dom.includes('affiche') || tit.includes('affiche');
                if (f.includes('visuel')) return svc.includes('visuel') || dom.includes('visuel') || tit.includes('visuel');
                if (f.includes('etiquette') || f.includes('étiquette')) return svc.includes('etiquette') || svc.includes('étiquette') || dom.includes('etiquette') || tit.includes('etiquette');
                return svc.includes(f) || dom.includes(f) || tit.includes(f);
            });
        }

        creationsCount.textContent = list.length;

        if (list.length === 0) {
            creationsList.innerHTML = `<p style="color:var(--c-text-muted);text-align:center;padding:36px;background:var(--c-surface-inner);border:1px dashed var(--c-border);border-radius:12px;">Aucune création trouvée dans cette sélection.</p>`;
            return;
        }

        creationsList.innerHTML = list.map(c => {
            const imgs = getImages(c);
            const mainImg = imgs[0] || '';
            const extraCount = imgs.length - 1;
            const priceTag = c.price
                ? `<span style="font-weight:700;color:#34d399;font-size:0.82rem;">💰 ${Number(c.price).toLocaleString('fr-FR')} F CFA</span>`
                : '';
            // Échapper l'id pour l'utiliser dans onclick
            const safeId = String(c.id).replace(/'/g, "\\'");
            return `
            <div class="item-row">
                <div class="item-info">
                    <!-- Image(s) -->
                    <div style="position:relative;flex-shrink:0;cursor:pointer;" onclick="previewFullscreen('${safeId}',0)" title="Voir l'image">
                        <img src="${mainImg || 'https://placehold.co/72x72?text=Image'}" alt="${c.title}"
                            style="width:72px;height:72px;object-fit:cover;border-radius:8px;border:2px solid ${imgs.length>1?'var(--c-primary)':'var(--c-border)'};"
                            onerror="this.src='https://placehold.co/72x72?text=Image'">
                        ${extraCount > 0 ? `<span style="position:absolute;bottom:2px;right:2px;background:rgba(0,0,0,0.8);color:white;font-size:0.65rem;font-weight:700;padding:1px 5px;border-radius:4px;">+${extraCount}</span>` : ''}
                    </div>
                    <!-- Infos -->
                    <div class="item-meta">
                        <div style="display:flex;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:4px;">
                            <strong style="font-size:0.95rem;color:var(--c-text);">${c.title}</strong>
                            <span class="badge-type ${c.type === 'AI_CREATION' ? 'badge-ai' : ''}">${c.type === 'MY_CREATION' ? 'Ma création' : 'IA'}</span>
                        </div>
                        <small style="display:block;color:var(--c-text-muted);margin-bottom:2px;">📂 <strong>${c.domain || '—'}</strong> &nbsp;|&nbsp; 🎨 ${c.service || '—'}</small>
                        ${priceTag ? `<div style="margin-bottom:2px;">${priceTag}</div>` : ''}
                        ${c.description ? `<small style="display:block;color:#94a3b8;font-style:italic;">${c.description}</small>` : ''}
                        ${imgs.length > 1 ? `<small style="display:block;color:#60a5fa;font-weight:600;margin-top:2px;">📸 ${imgs.length} images</small>` : ''}
                    </div>
                </div>
                <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;flex-wrap:wrap;">
                    <label class="btn btn-outline" style="font-size:0.8rem;padding:7px 12px;cursor:pointer;" title="Remplacer l'image directement">
                        🔄 Remplacer
                        <input type="file" accept="image/*" style="display:none;" onchange="quickReplaceCreationImage('${safeId}', this)">
                    </label>
                    <button type="button" class="btn-edit" onclick="openEditModal('${safeId}')">✏️ Modifier</button>
                    <button type="button" class="btn-delete" onclick="deleteCreation('${safeId}')">🗑 Supprimer</button>
                </div>
            </div>`;
        }).join('');
    }

    // Remplacement rapide direct de l'image d'une création
    window.quickReplaceCreationImage = (id, inputEl) => {
        const file = inputEl.files && inputEl.files[0];
        if (!file) return;
        compressAndReadFile(file).then(b64 => {
            const d = getData();
            const creation = (d.creations || []).find(c => String(c.id) === String(id));
            if (creation) {
                if (!creation.images) creation.images = [];
                creation.images[0] = b64;
                creation.image = b64;
                saveData(d);
                renderCreations();
                refreshDiffAdmin();
                showMsg(`✓ Image de "${creation.title}" remplacée et enregistrée ! Actualisez le site pour voir le changement.`);
            }
        }).catch(err => showMsg('⚠️ ' + err.message, true));
        inputEl.value = '';
    };

    // Filtres Type (Toutes / Mes Créations / IA)
    document.querySelectorAll('.filter-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategoryFilter = btn.dataset.cat;
            renderCreations();
        });
    });

    // Filtres Catégories de Services (Logos, Flyers, Cartes de visite, Affiches...)
    document.querySelectorAll('.admin-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.admin-cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentAdminServiceFilter = btn.dataset.serviceFilter;
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
    const creationForm = document.getElementById('creation-form');
    if (creationForm) {
        creationForm.addEventListener('submit', (e) => {
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
    }

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
    const editMainPreview = document.getElementById('edit-main-preview');
    const editMainPreviewNone = document.getElementById('edit-main-preview-none');

    let editImages = [];  // Tableau d'images en cours d'édition

    function updateEditMainPreview() {
        if (!editMainPreview) return;
        if (editImages.length > 0 && editImages[0]) {
            editMainPreview.src = editImages[0];
            editMainPreview.style.display = 'block';
            if (editMainPreviewNone) editMainPreviewNone.style.display = 'none';
        } else {
            editMainPreview.style.display = 'none';
            if (editMainPreviewNone) editMainPreviewNone.style.display = 'block';
        }
    }

    function renderEditGallery() {
        if (!editImgsGallery) return;
        if (editImages.length === 0) {
            editImgsGallery.innerHTML = '<p style="color:#94a3b8;font-size:0.85rem;padding:10px 0;">Aucune image. Ajoutez-en une ci-dessous.</p>';
            updateEditMainPreview();
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
                    updateEditMainPreview();
                } catch(err) { showMsg('⚠️ ' + err.message, true); }
            });
        });

        updateEditMainPreview();
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

    if (editAddImgFile) {
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
    }

    window.openEditModal = (id) => {
        const d = getData();
        const c = (d.creations || []).find(item => item.id === id);
        if (!c) {
            showMsg('⚠️ Création introuvable.', true);
            return;
        }

        // 1. Remplir les champs texte
        if (editId)    editId.value    = c.id;
        if (editType)  editType.value  = c.type || 'MY_CREATION';
        if (editTitle) editTitle.value = c.title || '';
        if (editPrice) editPrice.value = c.price || '';
        // textarea description
        if (editDesc)  editDesc.value  = c.description || '';

        // 2. Remplir les selects APRÈS avoir injecté les options
        const domains  = d.domains  || [];
        const services = d.services || [];
        fillSelect(editDomain,  domains,  c.domain  || '');
        fillSelect(editService, services, c.service || '');

        // 3. Charger les images
        editImages = getImages(c);
        renderEditGallery();

        // 4. Ouvrir la modal
        editModal.classList.add('active');
        // Scroll en haut de la modal
        const card = editModal.querySelector('.modal-edit-card');
        if (card) card.scrollTop = 0;
    };

    const btnCancelEdit = document.getElementById('btn-cancel-edit');
    if (btnCancelEdit) {
        btnCancelEdit.addEventListener('click', () => {
            editModal.classList.remove('active');
            editImages = [];
        });
    }

    if (editModal) {
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) {
                editModal.classList.remove('active');
                editImages = [];
            }
        });
    }

    const editCreationForm = document.getElementById('edit-creation-form');
    if (editCreationForm) {
        editCreationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id  = editId ? editId.value : '';
            const d   = getData();
            const idx = (d.creations || []).findIndex(c => c.id === id);
            if (idx === -1) {
                showMsg('⚠️ Création introuvable, impossible de modifier.', true);
                return;
            }

            d.creations[idx].type        = editType   ? editType.value  : d.creations[idx].type;
            d.creations[idx].title       = editTitle  ? editTitle.value.trim() : d.creations[idx].title;
            d.creations[idx].domain      = editDomain  ? editDomain.value  : d.creations[idx].domain;
            d.creations[idx].service     = editService ? editService.value : d.creations[idx].service;
            d.creations[idx].price       = editPrice && editPrice.value.trim() ? parseInt(editPrice.value.trim()) : null;
            d.creations[idx].description = editDesc   ? editDesc.value.trim() : d.creations[idx].description;
            setImages(d.creations[idx], editImages);

            saveData(d);
            renderCreations();
            refreshDiffAdmin();
            editModal.classList.remove('active');
            editImages = [];
            showMsg('✓ Création modifiée avec succès !');
        });
    }

    // ============================================================
    // OVERLAY PLEIN ÉCRAN (depuis la liste catalogue)
    // ============================================================
    window.previewFullscreen = (id, imgIdx) => {
        const d = getData();
        const c = (d.creations || []).find(item => item.id === id);
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

    // Fermer la lightbox avec Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (imgOverlay) imgOverlay.style.display = 'none';
            if (editModal && editModal.classList.contains('active')) {
                editModal.classList.remove('active');
                editImages = [];
            }
        }
    });

    // ============================================================
    // 6. TARIFS
    // ============================================================
    const pricesList = document.getElementById('prices-list');

    function renderPrices() {
        const d = getData();
        const services = d.services || [];
        if (!pricesList) return;
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

    const pricesForm = document.getElementById('prices-form');
    if (pricesForm) {
        pricesForm.addEventListener('submit', (e) => {
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
    }

    // ============================================================
    // 7. COORDONNÉES, TÉLÉPHONES & WHATSAPP
    // ============================================================
    const adminWaInput = document.getElementById('admin-wa');
    const adminPhoneInput = document.getElementById('admin-phone');
    const adminResaInput = document.getElementById('admin-reservation');
    const adminEmailInput = document.getElementById('admin-email');
    const adminAddrInput = document.getElementById('admin-address');

    function populateContacts() {
        const d = getData();
        const s = d.settings || {};
        if (adminWaInput) adminWaInput.value = s.whatsappNumber || '';
        if (adminPhoneInput) adminPhoneInput.value = s.phoneNumber || s.whatsappNumber || '';
        if (adminResaInput) adminResaInput.value = s.reservationNumber || s.whatsappNumber || '';
        if (adminEmailInput) adminEmailInput.value = s.email || '';
        if (adminAddrInput) adminAddrInput.value = s.address || '';
    }
    populateContacts();

    const contactsForm = document.getElementById('contacts-form');
    if (contactsForm) {
        contactsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const d = getData();
            if (!d.settings) d.settings = {};
            d.settings.whatsappNumber = adminWaInput ? adminWaInput.value.trim() : '';
            d.settings.phoneNumber = adminPhoneInput ? adminPhoneInput.value.trim() : d.settings.whatsappNumber;
            d.settings.reservationNumber = adminResaInput ? adminResaInput.value.trim() : d.settings.whatsappNumber;
            d.settings.email = adminEmailInput ? adminEmailInput.value.trim() : '';
            d.settings.address = adminAddrInput ? adminAddrInput.value.trim() : '';
            saveData(d);
            showMsg('✓ Coordonnées et numéros enregistrés avec succès !');
        });
    }

    // ============================================================
    // 8. TEXTES, TITRES & PRÉSENTATION DU SITE
    // ============================================================
    function populateTexts() {
        const d = getData();
        const t = (d.settings && d.settings.texts) || {};
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el && val) el.value = val;
        };
        setVal('text-hero-title', t.heroTitle);
        setVal('text-hero-subtitle', t.heroSubtitle);
        setVal('text-services-title', t.servicesTitle);
        setVal('text-btn-creations', t.btnCreations);
        setVal('text-btn-commander', t.btnCommander);
        setVal('text-diff-title', t.diffTitle);
        setVal('text-diff-subtitle', t.diffSubtitle);
        setVal('text-creations-title', t.creationsTitle);
        setVal('text-tarifs-title', t.tarifsTitle);
        setVal('text-contact-title', t.contactTitle);
        setVal('text-footer', t.footerText);
    }
    populateTexts();

    const textsForm = document.getElementById('texts-form');
    if (textsForm) {
        textsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const d = getData();
            if (!d.settings) d.settings = {};
            if (!d.settings.texts) d.settings.texts = {};
            const getVal = id => {
                const el = document.getElementById(id);
                return el ? el.value.trim() : '';
            };
            d.settings.texts.heroTitle = getVal('text-hero-title');
            d.settings.texts.heroSubtitle = getVal('text-hero-subtitle');
            d.settings.texts.servicesTitle = getVal('text-services-title');
            d.settings.texts.btnCreations = getVal('text-btn-creations');
            d.settings.texts.btnCommander = getVal('text-btn-commander');
            d.settings.texts.diffTitle = getVal('text-diff-title');
            d.settings.texts.diffSubtitle = getVal('text-diff-subtitle');
            d.settings.texts.creationsTitle = getVal('text-creations-title');
            d.settings.texts.tarifsTitle = getVal('text-tarifs-title');
            d.settings.texts.contactTitle = getVal('text-contact-title');
            d.settings.texts.footerText = getVal('text-footer');

            saveData(d);
            showMsg('✓ Textes et titres du site enregistrés !');
        });
    }

    // ============================================================
    // 9. GESTION DES COMMANDES & TABLEAU DE BORD
    // ============================================================
    const ordersListContainer = document.getElementById('orders-list-container');
    const orderSearchInput = document.getElementById('order-search-input');
    const orderStatusFilter = document.getElementById('order-status-filter');
    const orderServiceFilter = document.getElementById('order-service-filter');
    const orderDateFilter = document.getElementById('order-date-filter');
    const btnResetOrderFilters = document.getElementById('btn-reset-order-filters');
    const btnRefreshOrders = document.getElementById('btn-refresh-orders');

    // Fiche Client Modal
    const clientModal = document.getElementById('client-modal');
    const modalOrderContent = document.getElementById('modal-order-content');
    const modalOrderStatusBadge = document.getElementById('modal-order-status-badge');
    const modalSelectStatus = document.getElementById('modal-select-status');
    const btnSaveOrderStatus = document.getElementById('btn-save-order-status');
    const btnDeleteCurrentOrder = document.getElementById('btn-delete-current-order');
    const btnModalWaLink = document.getElementById('btn-modal-wa-link');
    const btnCloseClientModal = document.getElementById('btn-close-client-modal');

    let currentOpenOrderId = null;

    function populateOrderServiceFilter() {
        if (!orderServiceFilter) return;
        const d = getData();
        const services = d.services || [];
        orderServiceFilter.innerHTML = '<option value="ALL">Tous les services</option>' +
            services.map(s => `<option value="${s}">${s}</option>`).join('');
    }
    populateOrderServiceFilter();

    function renderOrdersDashboard() {
        if (!ordersListContainer) return;
        const orders = typeof window.getOrders === 'function' ? window.getOrders() : [];

        // 1. Calcul des indicateurs KPIs
        const total = orders.length;
        const newCount = orders.filter(o => o.status === 'Nouvelle').length;
        const pendingCount = orders.filter(o => o.status === 'En attente' || o.status === 'En cours').length;
        const doneCount = orders.filter(o => o.status === 'Terminée').length;

        const statTotal = document.getElementById('stat-total-orders');
        const statNew = document.getElementById('stat-new-orders');
        const statProg = document.getElementById('stat-progress-orders');
        const statDone = document.getElementById('stat-done-orders');
        if (statTotal) statTotal.textContent = total;
        if (statNew) statNew.textContent = newCount;
        if (statProg) statProg.textContent = pendingCount;
        if (statDone) statDone.textContent = doneCount;

        // 2. Filtres
        const searchVal = (orderSearchInput ? orderSearchInput.value : '').toLowerCase().trim();
        const statusVal = orderStatusFilter ? orderStatusFilter.value : 'ALL';
        const serviceVal = orderServiceFilter ? orderServiceFilter.value : 'ALL';
        const dateVal = orderDateFilter ? orderDateFilter.value : '';

        const filtered = orders.filter(o => {
            if (statusVal !== 'ALL' && o.status !== statusVal) return false;

            if (serviceVal !== 'ALL') {
                const hasService = (o.services || []).some(s => s.service === serviceVal);
                if (!hasService) return false;
            }

            if (dateVal) {
                const parts = dateVal.split('-');
                if (parts.length === 3) {
                    const formatted = `${parts[2]}/${parts[1]}/${parts[0]}`;
                    if (o.date && o.date !== formatted) return false;
                }
            }

            if (searchVal) {
                const clientName = `${o.client?.nom || ''} ${o.client?.prenom || ''}`.toLowerCase();
                const tel = (o.client?.telephone || '').toLowerCase();
                const svcList = (o.services || []).map(s => s.service).join(' ').toLowerCase();
                if (!clientName.includes(searchVal) && !tel.includes(searchVal) && !svcList.includes(searchVal)) {
                    return false;
                }
            }
            return true;
        });

        // 3. Affichage
        if (filtered.length === 0) {
            ordersListContainer.innerHTML = `
                <div style="text-align:center; padding:40px 20px; background:#f8fafc; border:1px dashed #cbd5e1; border-radius:10px; color:#64748b;">
                    <div style="font-size:2rem; margin-bottom:8px;">📦</div>
                    <p style="font-weight:600; margin:0;">Aucune commande trouvée.</p>
                    <p style="font-size:0.85rem; margin-top:4px;">Les commandes passées par vos clients s'affichent automatiquement ici.</p>
                </div>`;
            return;
        }

        ordersListContainer.innerHTML = filtered.map(o => {
            const clientName = `${o.client?.nom || ''} ${o.client?.prenom || ''}`.trim() || 'Client';
            const tel = o.client?.telephone || 'Non renseigné';
            const servicesStr = (o.services || []).map(s => `${s.service} (${s.formule || 'Basic'})`).join(', ') || 'Service graphique';
            const totalStr = (o.total || 0).toLocaleString('fr-FR') + ' F CFA';
            const statusClass = `badge-status-${(o.status || 'Nouvelle').toLowerCase().replace(/\s+/g, '-')}`;

            return `
                <div class="order-card-row" data-order-id="${o.id}">
                    <div class="order-meta-info">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                            <span class="order-client-name">${clientName}</span>
                            <span class="badge-status ${statusClass}">${o.status || 'Nouvelle'}</span>
                        </div>
                        <div class="order-client-sub">
                            <span>📞 ${tel}</span>
                            <span>📅 ${o.date || ''} à ${o.time || ''}</span>
                        </div>
                        <div class="order-services-preview">
                            🎨 ${servicesStr}
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span class="order-price-badge">${totalStr}</span>
                        <button type="button" class="btn btn-view" onclick="openClientOrderModal('${o.id}')">👁️ Fiche Client</button>
                        <button type="button" class="btn btn-delete" onclick="handleDeleteOrder('${o.id}')" title="Supprimer">✕</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    window.openClientOrderModal = function(orderId) {
        const orders = typeof window.getOrders === 'function' ? window.getOrders() : [];
        const o = orders.find(item => item.id === orderId);
        if (!o) return;
        currentOpenOrderId = orderId;

        const clientName = `${o.client?.nom || ''} ${o.client?.prenom || ''}`.trim() || 'Client inconnu';
        const tel = o.client?.telephone || '';
        const adresse = o.client?.adresse || 'Non renseignée';
        const domaine = o.projet?.domaine || 'Non renseigné';
        const logo = o.projet?.logoExistant || 'Non';
        const total = (o.total || 0).toLocaleString('fr-FR') + ' F CFA';

        if (modalOrderStatusBadge) {
            modalOrderStatusBadge.textContent = o.status || 'Nouvelle';
            modalOrderStatusBadge.className = `badge-status badge-status-${(o.status || 'Nouvelle').toLowerCase().replace(/\s+/g, '-')}`;
        }
        if (modalSelectStatus) modalSelectStatus.value = o.status || 'Nouvelle';

        if (btnModalWaLink) {
            const rawTel = tel.replace(/[^0-9]/g, '');
            if (rawTel) {
                const waText = encodeURIComponent(`Bonjour ${clientName}, je vous contacte concernant votre commande sur Pixora Studio (#${o.id}).`);
                btnModalWaLink.href = `https://wa.me/${rawTel}?text=${waText}`;
                btnModalWaLink.style.display = 'inline-block';
            } else {
                btnModalWaLink.style.display = 'none';
            }
        }

        const servicesRows = (o.services || []).map((s, idx) => `
            <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px dashed #e2e8f0; font-size:0.9rem;">
                <div><strong>${idx + 1}. ${s.service}</strong> <span style="color:#64748b;">(${s.formule || 'Basic'})</span></div>
                <div style="font-weight:700;">${(s.price || 0).toLocaleString('fr-FR')} F CFA</div>
            </div>
        `).join('');

        const historyRows = (o.history || []).map(h => `
            <li style="font-size:0.82rem; color:#475569; margin-bottom:4px;">
                <strong>${h.date || ''}</strong> : ${h.status || ''} ${h.note ? `— <em>${h.note}</em>` : ''}
            </li>
        `).join('');

        if (modalOrderContent) {
            modalOrderContent.innerHTML = `
                <div style="margin-bottom:16px;">
                    <span style="font-size:0.8rem; font-weight:700; color:#64748b; text-transform:uppercase;">Identifiant Commande</span>
                    <div style="font-family:monospace; font-weight:700; font-size:1.1rem; color:var(--c-primary-dark);">${o.id}</div>
                    <div style="font-size:0.85rem; color:#64748b;">Reçue le ${o.date || ''} à ${o.time || ''}</div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; background:#f8fafc; padding:14px; border-radius:10px; margin-bottom:16px; border:1px solid #e2e8f0;">
                    <div>
                        <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:#64748b;">Client</div>
                        <div style="font-weight:700; font-size:0.95rem; color:#1e293b;">${clientName}</div>
                        <div style="font-size:0.88rem; color:#3b82f6; font-weight:600;"><a href="tel:${tel}" style="color:inherit; text-decoration:none;">📞 ${tel}</a></div>
                        <div style="font-size:0.85rem; color:#475569;">📍 ${adresse}</div>
                    </div>
                    <div>
                        <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:#64748b;">Projet & Activité</div>
                        <div style="font-weight:600; font-size:0.9rem; color:#1e293b;">🏢 ${domaine}</div>
                        <div style="font-size:0.85rem; color:#475569;">Logo existant : <strong>${logo}</strong></div>
                    </div>
                </div>

                ${o.message ? `
                <div style="background:#eff6ff; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:4px; margin-bottom:16px;">
                    <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:#1e40af;">Message / Précisions du client</div>
                    <div style="font-size:0.9rem; color:#1e3a8a; white-space:pre-wrap; margin-top:4px;">${o.message}</div>
                </div>` : ''}

                <div style="margin-bottom:16px;">
                    <div style="font-size:0.78rem; font-weight:700; text-transform:uppercase; color:#64748b; margin-bottom:6px;">Services Commandés</div>
                    ${servicesRows}
                    <div style="display:flex; justify-content:space-between; margin-top:10px; padding-top:10px; border-top:2px solid var(--c-primary); font-size:1.1rem; font-weight:800;">
                        <span>TOTAL</span>
                        <span style="color:var(--c-primary);">${total}</span>
                    </div>
                </div>

                ${historyRows ? `
                <div style="margin-top:14px; border-top:1px solid #e2e8f0; padding-top:10px;">
                    <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:#64748b; margin-bottom:6px;">Historique du suivi</div>
                    <ul style="margin:0; padding-left:18px;">${historyRows}</ul>
                </div>` : ''}
            `;
        }

        if (clientModal) clientModal.classList.add('active');
    };

    if (btnCloseClientModal) {
        btnCloseClientModal.addEventListener('click', () => {
            if (clientModal) clientModal.classList.remove('active');
            currentOpenOrderId = null;
        });
    }

    if (clientModal) {
        clientModal.addEventListener('click', (e) => {
            if (e.target === clientModal) {
                clientModal.classList.remove('active');
                currentOpenOrderId = null;
            }
        });
    }

    if (btnSaveOrderStatus) {
        btnSaveOrderStatus.addEventListener('click', () => {
            if (!currentOpenOrderId || !modalSelectStatus) return;
            const newStatus = modalSelectStatus.value;
            if (typeof window.updateOrderStatus === 'function') {
                window.updateOrderStatus(currentOpenOrderId, newStatus);
                showMsg(`✓ Statut de la commande #${currentOpenOrderId} mis à jour : ${newStatus}`);
                openClientOrderModal(currentOpenOrderId);
                renderOrdersDashboard();
            }
        });
    }

    if (btnDeleteCurrentOrder) {
        btnDeleteCurrentOrder.addEventListener('click', () => {
            if (!currentOpenOrderId) return;
            if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement la commande #${currentOpenOrderId} ?`)) {
                if (typeof window.deleteOrder === 'function') {
                    window.deleteOrder(currentOpenOrderId);
                    if (clientModal) clientModal.classList.remove('active');
                    currentOpenOrderId = null;
                    renderOrdersDashboard();
                    showMsg('✓ Commande supprimée.');
                }
            }
        });
    }

    window.handleDeleteOrder = function(orderId) {
        if (confirm(`Supprimer la commande #${orderId} ?`)) {
            if (typeof window.deleteOrder === 'function') {
                window.deleteOrder(orderId);
                renderOrdersDashboard();
                showMsg('✓ Commande supprimée.');
            }
        }
    };

    if (orderSearchInput) orderSearchInput.addEventListener('input', renderOrdersDashboard);
    if (orderStatusFilter) orderStatusFilter.addEventListener('change', renderOrdersDashboard);
    if (orderServiceFilter) orderServiceFilter.addEventListener('change', renderOrdersDashboard);
    if (orderDateFilter) orderDateFilter.addEventListener('change', renderOrdersDashboard);
    if (btnResetOrderFilters) {
        btnResetOrderFilters.addEventListener('click', () => {
            if (orderSearchInput) orderSearchInput.value = '';
            if (orderStatusFilter) orderStatusFilter.value = 'ALL';
            if (orderServiceFilter) orderServiceFilter.value = 'ALL';
            if (orderDateFilter) orderDateFilter.value = '';
            renderOrdersDashboard();
        });
    }
    if (btnRefreshOrders) {
        btnRefreshOrders.addEventListener('click', () => {
            renderOrdersDashboard();
            showMsg('✓ Commandes actualisées.');
        });
    }

    document.addEventListener('pixora-order-created', () => {
        renderOrdersDashboard();
        showMsg('🔔 Nouvelle commande reçue !');
    });
    document.addEventListener('pixora-orders-updated', renderOrdersDashboard);

    // ============================================================
    // 10. ACCÈS DIRECT ADMINISTRATEUR (authentification supprimée)
    // ============================================================
    const mainWrap = document.getElementById('admin-main-wrap');
    if (mainWrap) mainWrap.style.display = 'block';


    // ============================================================
    // 11. FIREBASE SYNCHRONISATION CLOUD
    // ============================================================
    const fbForm = document.getElementById('firebase-config-form');
    const headerSyncStatus = document.getElementById('header-sync-status');
    const fbCardBadge = document.getElementById('firebase-card-badge');
    const btnDisconnectFb = document.getElementById('btn-disconnect-fb');

    function updateFirebaseUI() {
        if (!window.FirebaseSync) return;
        const config = window.FirebaseSync.getStoredConfig();
        const isReady = window.FirebaseSync.isReady();

        if (config) {
            const setIn = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };
            setIn('fb-apiKey', config.apiKey);
            setIn('fb-authDomain', config.authDomain);
            setIn('fb-projectId', config.projectId);
            setIn('fb-storageBucket', config.storageBucket);
        }

        if (isReady) {
            if (headerSyncStatus) {
                headerSyncStatus.className = 'sync-badge online';
                headerSyncStatus.textContent = '🟢 Cloud Connecté';
            }
            if (fbCardBadge) {
                fbCardBadge.className = 'sync-badge online';
                fbCardBadge.textContent = '🟢 Connecté au Cloud Firestore';
            }
        } else {
            if (headerSyncStatus) {
                headerSyncStatus.className = 'sync-badge offline';
                headerSyncStatus.textContent = '🟡 Mode Local';
            }
            if (fbCardBadge) {
                fbCardBadge.className = 'sync-badge offline';
                fbCardBadge.textContent = '🟡 Mode Local (Hors-ligne)';
            }
        }
    }
    updateFirebaseUI();

    if (fbForm) {
        fbForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const apiKey = document.getElementById('fb-apiKey').value.trim();
            const authDomain = document.getElementById('fb-authDomain').value.trim();
            const projectId = document.getElementById('fb-projectId').value.trim();
            const storageBucket = document.getElementById('fb-storageBucket').value.trim();

            if (!apiKey || !projectId) {
                showMsg('⚠️ Veuillez au moins renseigner apiKey et projectId.', true);
                return;
            }

            const config = { apiKey, authDomain, projectId, storageBucket };
            if (window.FirebaseSync) {
                window.FirebaseSync.setStoredConfig(config);
                updateFirebaseUI();
                showMsg('✓ Configuration Firebase enregistrée !');
            }
        });
    }

    if (btnDisconnectFb) {
        btnDisconnectFb.addEventListener('click', () => {
            if (confirm('Déconnecter Firebase et revenir en mode LocalStorage ?')) {
                if (window.FirebaseSync) {
                    window.FirebaseSync.setStoredConfig(null);
                    updateFirebaseUI();
                    showMsg('✓ Déconnecté de Firebase. Mode Local actif.');
                }
            }
        });
    }
});
