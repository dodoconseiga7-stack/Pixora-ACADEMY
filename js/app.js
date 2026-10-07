document.addEventListener('DOMContentLoaded', () => {
    const data = getData();

    // ============================================================
    // 1. LOGO — Grand affichage dans le hero + logo nav
    // ============================================================
    const heroLogoZone = document.getElementById('hero-logo-zone');
    const siteLogoNav = document.getElementById('site-logo-nav');

    function renderLogo() {
        const d = getData(); // reload latest data
        const logoSrc = (d.settings && d.settings.logoUrl && !d.settings.logoUrl.startsWith('data:image/svg')) 
            ? d.settings.logoUrl 
            : 'assets/images/logo.png';

        if (siteLogoNav) {
            siteLogoNav.innerHTML = `<img src="${logoSrc}" alt="PIXORA ACADEMY" class="site-main-logo">`;
        }
        const siteLogoTopbar = document.getElementById('site-logo-topbar');
        if (siteLogoTopbar) {
            siteLogoTopbar.innerHTML = `<img src="${logoSrc}" alt="PIXORA ACADEMY" class="topbar-main-logo">`;
        }
    }
    renderLogo();

    // ============================================================
    // 1.5 GRAND CADRE VIDÉO HERO
    // (Autoplay loop, contrôle mute/unmute persistant, gestion de la visibilité)
    // ============================================================
    const heroVideoPlayer = document.getElementById('hero-video-player');
    const heroVideoSoundBtn = document.getElementById('hero-video-sound-btn');
    const heroVideoWatermarkMask = document.getElementById('hero-video-watermark-mask');
    const soundMutedIcon = document.getElementById('sound-icon-muted');
    const soundUnmutedIcon = document.getElementById('sound-icon-unmuted');

    // ─── Choix audio persistant de l'utilisateur ─────────────────
    // null      : aucun choix, comportement par défaut du navigateur
    // 'muted'   : l'utilisateur a coupé le son → JAMAIS réactivé automatiquement
    // 'unmuted' : l'utilisateur a réactivé le son → conservé pendant la session
    let userAudioChoice = (function () {
        try { return sessionStorage.getItem('pixora_hero_video_audio_choice') || null; }
        catch (e) { return null; }
    })();

    function setUserAudioChoice(choice) {
        userAudioChoice = choice;
        try {
            if (choice) { sessionStorage.setItem('pixora_hero_video_audio_choice', choice); }
            else { sessionStorage.removeItem('pixora_hero_video_audio_choice'); }
        } catch (e) {}
    }

    // La section hero est en haut de page → optimiste au chargement
    let isVideoInViewport = true;
    let autoUnmuteCleanup = null;

    function cleanupAutoUnmute() {
        if (typeof autoUnmuteCleanup === 'function') {
            autoUnmuteCleanup();
            autoUnmuteCleanup = null;
        }
    }


    function updateSoundUI(isMuted) {
        if (soundMutedIcon) soundMutedIcon.style.display = isMuted ? 'inline' : 'none';
        if (soundUnmutedIcon) soundUnmutedIcon.style.display = isMuted ? 'none' : 'inline';
    }

    function applyVideoPlayerAttributes() {
        if (!heroVideoPlayer) return;
        const isMuted = (userAudioChoice === 'muted');
        heroVideoPlayer.muted = isMuted;
        heroVideoPlayer.volume = 1;
        heroVideoPlayer.loop = true;
        heroVideoPlayer.playsInline = true;
        heroVideoPlayer.disablePictureInPicture = true;
        heroVideoPlayer.removeAttribute('controls');
        if (isMuted) {
            heroVideoPlayer.setAttribute('muted', '');
        } else {
            heroVideoPlayer.removeAttribute('muted');
        }
        heroVideoPlayer.setAttribute('playsinline', '');
        heroVideoPlayer.setAttribute('webkit-playsinline', '');
        heroVideoPlayer.setAttribute('loop', '');
        heroVideoPlayer.setAttribute('autoplay', '');
        heroVideoPlayer.setAttribute('controlslist', 'nodownload nofullscreen noremoteplayback');
        updateSoundUI(isMuted);
    }


    function triggerAutoplay() {
        if (!heroVideoPlayer || !heroVideoPlayer.src) return;

        // ── Respecter le choix explicite de l'utilisateur ──
        // Si l'utilisateur a coupé le son → lancer muet, ne jamais réactiver
        if (userAudioChoice === 'muted') {
            heroVideoPlayer.muted = true;
            updateSoundUI(true);
            heroVideoPlayer.play().catch(() => {});
            return;
        }

        // Si l'utilisateur a réactivé le son → lancer avec son
        if (userAudioChoice === 'unmuted') {
            heroVideoPlayer.muted = false;
            heroVideoPlayer.volume = 1;
            updateSoundUI(false);
            heroVideoPlayer.play().catch(() => {});
            return;
        }

        // ── Comportement par défaut (aucun choix de l'utilisateur) ──
        // Son activé si le navigateur le permet
        heroVideoPlayer.muted = false;
        heroVideoPlayer.volume = 1;
        updateSoundUI(false);

        const p = heroVideoPlayer.play();
        if (p && typeof p.catch === 'function') {
            p.catch(() => {
                // Navigateur bloque l'autoplay avec son → démarrer muet
                heroVideoPlayer.muted = true;
                heroVideoPlayer.play().catch(() => {});
                updateSoundUI(true);

                // Réactiver au premier clic/touche UNIQUEMENT (pas au scroll)
                if (userAudioChoice === null) {
                    const unmuteOnInteraction = () => {
                        cleanupAutoUnmute();
                        // Ne réactiver que si l'utilisateur n'a pas encore fait de choix
                        // ET que la vidéo est visible à l'écran
                        if (userAudioChoice === null && isVideoInViewport) {
                            heroVideoPlayer.muted = false;
                            heroVideoPlayer.volume = 1;
                            updateSoundUI(false);
                            heroVideoPlayer.play().catch(() => {});
                        }
                    };
                    window.addEventListener('click', unmuteOnInteraction, { once: true });
                    window.addEventListener('touchstart', unmuteOnInteraction, { once: true });
                    window.addEventListener('keydown', unmuteOnInteraction, { once: true });
                    autoUnmuteCleanup = () => {
                        window.removeEventListener('click', unmuteOnInteraction);
                        window.removeEventListener('touchstart', unmuteOnInteraction);
                        window.removeEventListener('keydown', unmuteOnInteraction);
                    };
                }
            });
        }
    }

    function renderHeroVideo() {
        if (!heroVideoPlayer) return;
        applyVideoPlayerAttributes();

        if (window.PixoraVideo && typeof window.PixoraVideo.getVideoUrl === 'function') {
            window.PixoraVideo.getVideoUrl().then(url => {
                if (url) {
                    if (heroVideoPlayer.src !== url) {
                        heroVideoPlayer.src = url;
                        heroVideoPlayer.load();
                    }
                    heroVideoPlayer.style.display = 'block';
                    if (heroVideoSoundBtn) heroVideoSoundBtn.style.display = 'flex';
                    if (heroVideoWatermarkMask) heroVideoWatermarkMask.style.display = 'block';
                    triggerAutoplay();
                } else {
                    heroVideoPlayer.pause();
                    heroVideoPlayer.removeAttribute('src');
                    heroVideoPlayer.style.display = 'none';
                    if (heroVideoSoundBtn) heroVideoSoundBtn.style.display = 'none';
                    if (heroVideoWatermarkMask) heroVideoWatermarkMask.style.display = 'none';
                }
            }).catch(err => {
                console.warn('[Vitrine] Erreur chargement vidéo:', err);
                heroVideoPlayer.style.display = 'none';
                if (heroVideoSoundBtn) heroVideoSoundBtn.style.display = 'none';
                if (heroVideoWatermarkMask) heroVideoWatermarkMask.style.display = 'none';
            });
        } else {
            const d = (typeof getData === 'function') ? getData() : {};
            const heroVid = (d.settings && (d.settings.heroVideo || d.settings.heroVideoUrl)) || null;
            const videoUrl = typeof heroVid === 'string' ? heroVid : (heroVid && heroVid.url);
            if (videoUrl && !videoUrl.startsWith('indexeddb:')) {
                if (heroVideoPlayer.src !== videoUrl) {
                    heroVideoPlayer.src = videoUrl;
                    heroVideoPlayer.load();
                }
                heroVideoPlayer.style.display = 'block';
                if (heroVideoSoundBtn) heroVideoSoundBtn.style.display = 'flex';
                if (heroVideoWatermarkMask) heroVideoWatermarkMask.style.display = 'block';
                triggerAutoplay();
            } else {
                heroVideoPlayer.pause();
                heroVideoPlayer.removeAttribute('src');
                heroVideoPlayer.style.display = 'none';
                if (heroVideoSoundBtn) heroVideoSoundBtn.style.display = 'none';
                if (heroVideoWatermarkMask) heroVideoWatermarkMask.style.display = 'none';
            }
        }
    }

    // Gestion du contrôle du son (mute / unmute manuel de l'utilisateur)
    if (heroVideoSoundBtn && heroVideoPlayer) {
        heroVideoSoundBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Annuler tout listener de déblocage automatique
            cleanupAutoUnmute();

            if (heroVideoPlayer.muted) {
                // L'utilisateur réactive volontairement le son 🔊
                setUserAudioChoice('unmuted');
                heroVideoPlayer.muted = false;
                heroVideoPlayer.volume = 1;
                updateSoundUI(false);
                if (isVideoInViewport) {
                    heroVideoPlayer.play().catch(() => {});
                }
            } else {
                // L'utilisateur coupe volontairement le son 🔇
                setUserAudioChoice('muted');
                heroVideoPlayer.muted = true;
                updateSoundUI(true);
            }
        });
    }

    if (heroVideoPlayer) {
        // Boucle continue sans interruption
        heroVideoPlayer.addEventListener('ended', () => {
            heroVideoPlayer.currentTime = 0;
            // Préserver le choix mute avant de relancer
            if (userAudioChoice === 'muted') {
                heroVideoPlayer.muted = true;
            }
            heroVideoPlayer.play().catch(() => {});
        });

        // Empêcher la mise en pause involontaire
        heroVideoPlayer.addEventListener('pause', () => {
            if (heroVideoPlayer.src && heroVideoPlayer.style.display !== 'none') {
                setTimeout(() => {
                    if (heroVideoPlayer.paused && isVideoInViewport) {
                        heroVideoPlayer.play().catch(() => {});
                    }
                }, 40);
            }
        });

        // Autoplay dès que les métadonnées ou le flux sont prêts
        heroVideoPlayer.addEventListener('canplay', () => triggerAutoplay());
        heroVideoPlayer.addEventListener('loadeddata', () => triggerAutoplay());

        // ── IntersectionObserver : gestion de la visibilité ──
        const heroSection = document.getElementById('accueil') || document.getElementById('hero-video-zone');
        if ('IntersectionObserver' in window && heroSection) {
            const visibilityObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!heroVideoPlayer || !heroVideoPlayer.src || heroVideoPlayer.style.display === 'none') return;

                    if (entry.isIntersecting) {
                        // La vidéo est dans sa section visible
                        isVideoInViewport = true;

                        // Restaurer strictement le dernier état audio choisi par l'utilisateur
                        if (userAudioChoice === 'muted') {
                            heroVideoPlayer.muted = true;
                            updateSoundUI(true);
                        } else if (userAudioChoice === 'unmuted') {
                            heroVideoPlayer.muted = false;
                            heroVideoPlayer.volume = 1;
                            updateSoundUI(false);
                        }
                        // userAudioChoice === null : triggerAutoplay s'en charge

                        if (heroVideoPlayer.paused) {
                            heroVideoPlayer.play().catch(() => {});
                        }
                    } else {
                        // La vidéo quitte la zone visible (au scroll) → couper son et pause
                        if (window.scrollY > 120) {
                            isVideoInViewport = false;
                            cleanupAutoUnmute();
                            // Couper l'audio sans modifier userAudioChoice
                            heroVideoPlayer.muted = true;
                            heroVideoPlayer.pause();
                        }
                    }
                });
            }, { threshold: [0, 0.15] });

            visibilityObserver.observe(heroSection);
        }

        // Gestion du changement d'onglet
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                heroVideoPlayer.muted = true;
                heroVideoPlayer.pause();
            } else if (isVideoInViewport && heroVideoPlayer.src && heroVideoPlayer.style.display !== 'none') {
                if (userAudioChoice === 'muted') {
                    heroVideoPlayer.muted = true;
                    updateSoundUI(true);
                } else if (userAudioChoice === 'unmuted') {
                    heroVideoPlayer.muted = false;
                    updateSoundUI(false);
                }
                heroVideoPlayer.play().catch(() => {});
            }
        });
    }

    renderHeroVideo();
    document.addEventListener('pixora-video-updated', renderHeroVideo);


    // ============================================================
    // 2. TEXTES DYNAMIQUES & CONTACTS
    // ============================================================
    function renderTexts() {
        const d = getData();
        const texts = (d.settings && d.settings.texts) || {};

        const elHeroTitle = document.getElementById('hero-title');
        if (elHeroTitle && texts.heroTitle) elHeroTitle.textContent = texts.heroTitle;

        const elHeroSub = document.getElementById('hero-subtitle');
        if (elHeroSub && texts.heroSubtitle) elHeroSub.textContent = texts.heroSubtitle;

        const elSvcTitle = document.getElementById('section-services-title');
        if (elSvcTitle && texts.servicesTitle) elSvcTitle.textContent = texts.servicesTitle;

        const elBtnCreations = document.getElementById('btn-hero-creations');
        if (elBtnCreations && texts.btnCreations) elBtnCreations.textContent = texts.btnCreations;

        const elBtnCommander = document.getElementById('btn-hero-commander');
        if (elBtnCommander && texts.btnCommander) elBtnCommander.textContent = texts.btnCommander;

        const elDiffTitle = document.getElementById('diff-title');
        if (elDiffTitle && texts.diffTitle) elDiffTitle.textContent = texts.diffTitle;

        const elDiffSub = document.getElementById('diff-subtitle');
        if (elDiffSub && texts.diffSubtitle) elDiffSub.textContent = texts.diffSubtitle;

        const elCreationsTitle = document.getElementById('creations-title');
        if (elCreationsTitle && texts.creationsTitle) elCreationsTitle.textContent = texts.creationsTitle;

        const elTarifsTitle = document.getElementById('tarifs-title');
        if (elTarifsTitle && texts.tarifsTitle) elTarifsTitle.textContent = texts.tarifsTitle;

        const elTarifsSub = document.getElementById('tarifs-subtitle');
        if (elTarifsSub && texts.tarifsSubtitle) elTarifsSub.textContent = texts.tarifsSubtitle;

        const elContactTitle = document.getElementById('contact-title');
        if (elContactTitle && texts.contactTitle) elContactTitle.textContent = texts.contactTitle;

        const elFooterText = document.getElementById('footer-text');
        if (elFooterText && texts.footerText) elFooterText.textContent = texts.footerText;

        const waNum = (d.settings && d.settings.whatsappNumber) ? d.settings.whatsappNumber : '+226 03 24 95 48';
        const displayWa = document.getElementById('display-wa-number');
        if (displayWa) displayWa.textContent = waNum;
        const cleanWa = waNum.replace(/[^0-9]/g, '');
        const waBtn = document.getElementById('wa-contact-btn');
        if (waBtn) waBtn.href = `https://wa.me/${cleanWa}`;
    }
    renderTexts();

    // ============================================================
    function renderDiff() {
        const freshData = getData();
        const myList = freshData.creations.filter(c => c.type === 'MY_CREATION');
        const aiList = freshData.creations.filter(c => c.type === 'AI_CREATION');

        const myEl = document.getElementById('my-creation-content');
        const aiEl = document.getElementById('ai-creation-content');

        // ── 1. RASSEMBLER LES CRÉATIONS IA ──
        let allAiList = (aiList && aiList.length > 0) ? [...aiList] : [];
        if (freshData.difference && freshData.difference.aiCreation && freshData.difference.aiCreation.image) {
            const featImg = freshData.difference.aiCreation.image;
            const alreadyExists = allAiList.some(item => (item.image === featImg || (item.images && item.images.includes(featImg))));
            if (!alreadyExists) {
                allAiList.unshift({
                    id: 'ai_featured',
                    type: 'AI_CREATION',
                    title: freshData.difference.aiCreation.title || 'Création par IA',
                    service: freshData.difference.aiCreation.service || 'Génération IA',
                    domain: freshData.difference.aiCreation.domain || 'Artificiel',
                    image: featImg,
                    description: freshData.difference.aiCreation.description || ''
                });
            }
        }

        // ── 2. SÉLECTION ÉQUILIBRÉE POUR MA CRÉATION ──
        const diffSelected = (freshData.difference && Array.isArray(freshData.difference.selectedMyCreations))
            ? freshData.difference.selectedMyCreations
            : [];

        let displayedMyList;
        if (diffSelected.length > 0) {
            // Utiliser les créations explicitement cochées dans l'administration
            displayedMyList = diffSelected
                .map(id => myList.find(c => c.id === id))
                .filter(Boolean);
        } else {
            // Pas de sélection manuelle : appariement intelligent 1-pour-1 avec les créations IA
            // Pour chaque création IA, associer en miroir la création Pixora du même service/domaine
            const matchedIds = new Set();
            const pairedList = [];

            allAiList.forEach(aiItem => {
                const aiService = (aiItem.service || '').toLowerCase().trim();
                const aiDomain = (aiItem.domain || '').toLowerCase().trim();
                const match = myList.find(c =>
                    !matchedIds.has(c.id) && (
                        (aiService && (c.service || '').toLowerCase().trim() === aiService) ||
                        (aiDomain && (c.domain || '').toLowerCase().trim() === aiDomain)
                    )
                );
                if (match) {
                    matchedIds.add(match.id);
                    pairedList.push(match);
                }
            });

            // Compléter si nécessaire pour avoir un nombre de cartes équilibré (ex: 4 vs 4)
            const targetCount = allAiList.length > 0 ? allAiList.length : 4;
            myList.forEach(c => {
                if (pairedList.length < targetCount && !matchedIds.has(c.id)) {
                    matchedIds.add(c.id);
                    pairedList.push(c);
                }
            });

            displayedMyList = pairedList.length > 0 ? pairedList : myList.slice(0, targetCount);
        }

        // ── 3. RENDU « MA CRÉATION » (Format Paysage) ──
        if (myEl) {
            if (displayedMyList.length > 0) {
                const myGalleryHtml = displayedMyList.map(item => {
                    const imgSrc = (item.images && item.images[0]) ? item.images[0] : (item.image || '');
                    const escapedTitle = (item.title || 'Création Pixora').replace(/"/g, '&quot;');
                    const escapedDesc = (item.description || '').replace(/"/g, '&quot;');
                    const escapedMeta = (item.service || 'Artisanat Pro').replace(/"/g, '&quot;');
                    return `
                    <div class="diff-gallery-item my-gallery-item"
                         data-fullimg="${imgSrc}"
                         data-title="${escapedTitle}"
                         data-desc="${escapedDesc}"
                         data-meta="${escapedMeta}"
                         title="${escapedTitle} — Cliquer pour agrandir">
                        <div class="diff-gallery-img-wrap my-gallery-img-wrap">
                            <img src="${imgSrc}" alt="${escapedTitle}" loading="lazy"
                                 onerror="this.onerror=null; this.src='https://placehold.co/400x250?text=Création';">
                            <div class="diff-zoom-hint">🔍 Agrandir</div>
                        </div>
                        <div class="diff-gallery-info my-gallery-info">
                            <div class="diff-gallery-text">
                                <span class="diff-gallery-title">${item.title || 'Création Pixora'}</span>
                                ${item.service ? `<span class="diff-gallery-service">${escapedMeta}</span>` : ''}
                            </div>
                            <span class="diff-gallery-badge my-badge">✦ PRO</span>
                        </div>
                    </div>`;
                }).join('');
                myEl.onclick = null;
                myEl.innerHTML = `<div class="my-gallery-grid">${myGalleryHtml}</div>`;

                myEl.querySelectorAll('.my-gallery-item').forEach(el => {
                    el.addEventListener('click', () => openLightbox(
                        el.dataset.fullimg,
                        el.dataset.title,
                        el.dataset.desc,
                        'Ma Création • ' + el.dataset.meta
                    ));
                });
            } else {
                myEl.onclick = null;
                myEl.innerHTML = `<div class="diff-placeholder"><span>Ajoutez vos créations depuis l'administration.</span></div>`;
            }
        }

        // ── 4. RENDU « CRÉATION PAR IA » (Format Paysage) ──
        if (aiEl) {
            if (allAiList.length > 0) {
                const aiGalleryHtml = allAiList.map(item => {
                    const imgSrc = (item.images && item.images[0]) ? item.images[0] : (item.image || '');
                    const escapedTitle = (item.title || 'Création par IA').replace(/"/g, '&quot;');
                    const escapedDesc = (item.description || '').replace(/"/g, '&quot;');
                    const escapedMeta = (item.service || 'Génération IA').replace(/"/g, '&quot;');
                    return `
                    <div class="diff-gallery-item ai-gallery-item"
                         data-fullimg="${imgSrc}"
                         data-title="${escapedTitle}"
                         data-desc="${escapedDesc}"
                         data-meta="${escapedMeta}"
                         title="${escapedTitle} — Cliquer pour agrandir">
                        <div class="diff-gallery-img-wrap ai-gallery-img-wrap">
                            <img src="${imgSrc}" alt="${escapedTitle}" loading="lazy"
                                 onerror="this.onerror=null; this.src='https://placehold.co/400x250?text=Image+IA';">
                            <div class="diff-zoom-hint">🔍 Agrandir</div>
                        </div>
                        <div class="diff-gallery-info ai-gallery-info">
                            <div class="diff-gallery-text">
                                <span class="diff-gallery-title">${item.title || 'Création IA'}</span>
                                ${item.service ? `<span class="diff-gallery-service">${escapedMeta}</span>` : ''}
                            </div>
                            <span class="diff-gallery-badge ai-badge">🤖 IA</span>
                        </div>
                    </div>`;
                }).join('');
                aiEl.onclick = null;
                aiEl.innerHTML = `<div class="ai-gallery-grid">${aiGalleryHtml}</div>`;

                aiEl.querySelectorAll('.ai-gallery-item').forEach(el => {
                    el.addEventListener('click', () => openLightbox(
                        el.dataset.fullimg,
                        el.dataset.title,
                        el.dataset.desc,
                        'Création IA • ' + el.dataset.meta
                    ));
                });
            } else {
                aiEl.onclick = null;
                aiEl.innerHTML = `<div class="diff-placeholder"><span>Chargement des exemples IA...</span></div>`;
            }
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
        const displayServices = freshData.services.filter(s => {
            if (s === 'Autres') return false;
            if (freshData.servicesMeta && freshData.servicesMeta[s] && freshData.servicesMeta[s].hidden) {
                return false;
            }
            return true;
        });

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
                        <a href="#commander" class="btn btn-order-service" data-service="${s}">Commander</a>
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

        // Clic sur "Commander" pré-remplit le service dans le formulaire de commande
        serviceCardsGrid.querySelectorAll('.btn-order-service').forEach(btn => {
            btn.addEventListener('click', () => {
                const svcName = btn.dataset.service;
                const firstSelect = document.querySelector('.service-row .input-service');
                if (firstSelect && svcName) {
                    firstSelect.value = svcName;
                    calcTotal();
                }
            });
        });
    }
    renderServiceCards();

    // ============================================================
    // 5. MES CRÉATIONS (Portfolio + Filtres Catégories Réels)
    // ============================================================
    const domainFilters = document.getElementById('domain-filters');
    const creationsGrid = document.getElementById('creations-grid');
    let currentActiveFilter = 'ALL';

    // Catégories directes demandées par le client pour la bannière et le catalogue
    const PRIMARY_CATEGORIES = [
        { label: 'Tous', filter: 'ALL' },
        { label: '🎨 Logos', filter: 'Logo' },
        { label: '📄 Flyers', filter: 'Flyer' },
        { label: '🪪 Cartes de visite', filter: 'Carte de visite' },
        { label: '🖼️ Affiches', filter: 'Affiche' },
        { label: '📸 Visuels pub', filter: 'Visuel publicitaire' },
        { label: '🏷️ Étiquettes', filter: 'Étiquette' }
    ];

    function matchesPortfolioFilter(c, filter) {
        if (!filter || filter === 'ALL') return true;
        const f = filter.toLowerCase().trim();
        const svc = (c.service || '').toLowerCase().trim();
        const dom = (c.domain || '').toLowerCase().trim();
        const tit = (c.title || '').toLowerCase().trim();

        if (f === 'logo' || f === 'logos') {
            return svc.includes('logo') || dom.includes('logo') || tit.includes('logo');
        }
        if (f === 'flyer' || f === 'flyers') {
            return svc.includes('flyer') || dom.includes('flyer') || tit.includes('flyer');
        }
        if (f.includes('carte')) {
            return svc.includes('carte') || dom.includes('carte') || tit.includes('carte');
        }
        if (f.includes('affiche') || f.includes('kakemono') || f.includes('kakémono')) {
            return svc.includes('affiche') || svc.includes('kakemono') || svc.includes('kakémono') || dom.includes('affiche') || dom.includes('kakemono') || tit.includes('affiche');
        }
        if (f.includes('visuel')) {
            return svc.includes('visuel') || dom.includes('visuel') || tit.includes('visuel');
        }
        if (f.includes('etiquette') || f.includes('étiquette')) {
            return svc.includes('etiquette') || svc.includes('étiquette') || dom.includes('etiquette') || dom.includes('étiquette') || tit.includes('etiquette');
        }
        return svc === f || dom === f || svc.includes(f) || dom.includes(f) || tit.includes(f);
    }

    function buildFilters() {
        if (!domainFilters) return;
        const freshData = getData();
        let html = '';

        // Catégories principales
        PRIMARY_CATEGORIES.forEach(cat => {
            const isActive = cat.filter === currentActiveFilter ? 'active' : '';
            html += `<button type="button" class="filter-btn ${isActive}" data-filter="${cat.filter}">${cat.label}</button>`;
        });

        // Domaines additionnels existants
        if (freshData.domains && freshData.domains.length > 0) {
            freshData.domains.forEach(d => {
                // Ne pas dupliquer si déjà présent
                const isDup = PRIMARY_CATEGORIES.some(cat => cat.filter.toLowerCase() === d.toLowerCase() || cat.label.toLowerCase().includes(d.toLowerCase()));
                if (!isDup && d !== 'Autres') {
                    const isActive = d === currentActiveFilter ? 'active' : '';
                    html += `<button type="button" class="filter-btn ${isActive}" data-filter="${d}">${d}</button>`;
                }
            });
        }

        domainFilters.innerHTML = html;
    }

    function renderPortfolio(filter = 'ALL') {
        currentActiveFilter = filter;
        const freshData = getData();
        const list = (freshData.creations || []).filter(c =>
            c.type === 'MY_CREATION' && matchesPortfolioFilter(c, filter)
        );

        if (list.length === 0) {
            creationsGrid.innerHTML = `
                <div style="grid-column:1/-1; text-align:center; color:var(--c-text-muted); padding: 50px 20px; background:rgba(18,26,58,0.5); border:1px dashed var(--c-border); border-radius:12px;">
                    <p style="font-size:1.1rem; font-weight:600; margin-bottom:8px; color:var(--c-white);">Aucune création trouvée pour cette catégorie.</p>
                    <p style="font-size:0.9rem;">Ajoutez vos créations depuis l'espace administration pour les voir apparaître ici.</p>
                </div>`;
            return;
        }

        creationsGrid.innerHTML = list.map(c => {
            const priceHtml = c.price ? `<span style="font-weight:700; color:var(--c-primary); font-size:0.88rem; margin-left:8px;">${Number(c.price).toLocaleString('fr-FR')} F CFA</span>` : '';
            return `
                <div class="creation-item" data-img="${c.image}" data-title="${c.title}" data-desc="${c.description || ''}" data-service="${c.service || ''}" data-domain="${c.domain || ''}" data-price="${c.price || ''}" style="cursor:zoom-in;" title="Cliquer pour voir en grand">
                    <img src="${c.image}" alt="${c.title}" onerror="this.onerror=null; this.src='https://placehold.co/400x300?text=Image';">
                    <div class="creation-info">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                            <h4 style="margin:0;">${c.title}</h4>
                            ${priceHtml}
                        </div>
                        <p style="margin-bottom:8px;">${c.description || ''}</p>
                        <span class="creation-tag">${c.service || 'Création'}</span>
                        ${c.domain ? `<span class="creation-tag" style="background:rgba(23,105,255,0.15); color:#82b1ff; margin-left:4px;">${c.domain}</span>` : ''}
                    </div>
                </div>
            `;
        }).join('');

        creationsGrid.querySelectorAll('.creation-item').forEach(el => {
            el.addEventListener('click', () => {
                const meta = `${el.dataset.service}${el.dataset.domain ? ' • ' + el.dataset.domain : ''}` + (el.dataset.price ? ` • ${Number(el.dataset.price).toLocaleString('fr-FR')} F CFA` : '');
                openLightbox(el.dataset.img, el.dataset.title, el.dataset.desc, meta);
            });
        });
    }

    function activatePortfolioFilter(filterValue) {
        currentActiveFilter = filterValue;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            if (btn.dataset.filter === filterValue) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        renderPortfolio(filterValue);
    }

    buildFilters();
    renderPortfolio('ALL');

    if (domainFilters) {
        domainFilters.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (btn) {
                const filterVal = btn.dataset.filter;
                activatePortfolioFilter(filterVal);
            }
        });
    }

    // ============================================================
    // 5.5 LIEN DES BOUTONS DE LA GRANDE BANNIÈRE DU HERO
    // ============================================================
    function setupHeroBannerButtons() {
        const bannerBtns = document.querySelectorAll('.ad-service-pill[data-category]');
        bannerBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const cat = btn.dataset.category;

                // Animation visuelle de sélection sur le bouton de la bannière
                bannerBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Défilement fluide vers la section Mes Créations
                const creationsSection = document.getElementById('creations');
                if (creationsSection) {
                    const headerOffset = 90;
                    const elementPosition = creationsSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }

                // Filtrer instantanément le catalogue
                activatePortfolioFilter(cat);
            });
        });
    }
    setupHeroBannerButtons();

    // ============================================================
    // 6. TARIFS
    // ============================================================
    const pricesGrid = document.getElementById('prices-grid');
    function renderPrices() {
        if (!pricesGrid) return;
        const freshData = getData();
        pricesGrid.innerHTML = (freshData.services || []).map(s => {
            const p = (freshData.prices && freshData.prices[s]) || { basic: 0, standard: 0, premium: 0 };
            return `
                <div class="price-card">
                    <h3>${s}</h3>
                    <div class="price-tier"><span class="tier-name">BASIC</span><span class="tier-price">${(p.basic || 0).toLocaleString('fr-FR')} F</span></div>
                    <div class="price-tier"><span class="tier-name">STANDARD</span><span class="tier-price">${(p.standard || 0).toLocaleString('fr-FR')} F</span></div>
                    <div class="price-tier"><span class="tier-name">PREMIUM</span><span class="tier-price">${(p.premium || 0).toLocaleString('fr-FR')} F</span></div>
                </div>
            `;
        }).join('');
    }
    renderPrices();

    // ============================================================
    // 7. FORMULAIRE DE COMMANDE
    // ============================================================
    const orderDomaine = document.getElementById('order-domaine');
    data.domains.forEach(d => { orderDomaine.innerHTML += `<option value="${d}">${d}</option>`; });

    const servicesList = document.getElementById('services-list');
    const orderTotalEl = document.getElementById('order-total-amount');

    function getServiceOptionsHtml() {
        const freshData = getData();
        return freshData.services.filter(s => {
            if (freshData.servicesMeta && freshData.servicesMeta[s] && freshData.servicesMeta[s].hidden) {
                return false;
            }
            return true;
        }).map(s => `<option value="${s}">${s}</option>`).join('');
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
        const rightTotalEl = document.getElementById('right-col-total');
        if (rightTotalEl) rightTotalEl.textContent = `${total.toLocaleString('fr-FR')} F CFA`;
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
        const msgEl    = document.getElementById('order-message');
        const userMsg  = msgEl ? msgEl.value.trim() : '';

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
            ${userMsg ? `
            <div class="recap-section">
                <h4>Précisions / Message</h4>
                <p style="white-space:pre-wrap; color:#334155;">${userMsg}</p>
            </div>` : ''}
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
        const msgEl   = document.getElementById('order-message');
        const userMsg = msgEl ? msgEl.value.trim() : '';

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
        const orderedServices = [];
        document.querySelectorAll('.service-row').forEach(row => {
            const s = row.querySelector('.input-service').value;
            const f = row.querySelector('.input-formule').value;
            const fTitle = f.charAt(0).toUpperCase() + f.slice(1);
            const price = freshData.prices[s] ? freshData.prices[s][f] : 0;
            const emoji = numMap[idx] || `${idx + 1}.`;
            msg += `${emoji} ${s}\nFormule : ${fTitle}\nPrix : ${price.toLocaleString('fr-FR')} F CFA\n\n`;
            total += price;
            idx++;
            orderedServices.push({ service: s, formule: fTitle, price: price });
        });

        if (userMsg) {
            msg += `📝 MESSAGE / PRÉCISIONS\n${userMsg}\n\n`;
        }

        msg += `💰 TOTAL\n${total.toLocaleString('fr-FR')} F CFA

📞 MODE DE CONTACT
WhatsApp

━━━━━━━━━━━━━━━━━━
Commande envoyée depuis Pixora Studio
━━━━━━━━━━━━━━━━━━`;

        // 💾 ENREGISTRER LA COMMANDE DANS LE SYSTÈME ADMINISTRATEUR
        if (typeof window.addOrder === 'function') {
            window.addOrder({
                client: { nom, prenom, telephone: tel, adresse },
                projet: { domaine, logoExistant: logo },
                services: orderedServices,
                total: total,
                message: userMsg
            });
        }

        const phone = freshData.settings.whatsappNumber.replace(/[^0-9]/g, '');
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
        modal.classList.remove('active');
    });

    // Synchronisation en direct si Firebase ou LocalStorage se met à jour
    function refreshAll() {
        renderLogo();
        renderTexts();
        renderHeroVideo();
        renderDiff();
        renderServiceCards();
        renderPrices();
        buildFilters();
        renderPortfolio(currentActiveFilter || 'ALL');
    }

    window.addEventListener('storage', refreshAll);
    document.addEventListener('pixora-data-updated', refreshAll);
    if (window.FirebaseSync && typeof window.FirebaseSync.onDataChange === 'function') {
        window.FirebaseSync.onDataChange(refreshAll);
    }
});
