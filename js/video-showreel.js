/**
 * PIXORA STUDIO — Moteur Vidéo Showreel Cinématique (HTML5 Canvas & Motion Graphics)
 * Présentation dynamique, fluide et 100% synchronisée des 16 produits phares du studio.
 */

class PixoraShowreelPlayer {
  constructor(canvasId, containerId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.container = document.getElementById(containerId);

    this.products = window.PIXORA_DATA.showreel || [];
    this.images = [];
    this.loadedImagesCount = 0;

    // Timing
    this.introDuration = 3.5; // secondes
    this.productDuration = 3.5; // secondes par produit
    this.outroDuration = 4.0; // secondes
    this.totalDuration = this.introDuration + (this.products.length * this.productDuration) + this.outroDuration;

    this.currentTime = 0;
    this.isPlaying = false;
    this.isMuted = true;
    this.animationFrameId = null;
    this.lastTimestamp = null;

    // Web Audio Synthesizer pour ambiance sonore studio chic
    this.audioCtx = null;
    this.audioGain = null;

    // Particles pour effets cinématiques
    this.particles = [];
    this.initParticles();

    // Canvas resolution standard 16:9 Full HD
    this.renderWidth = 1920;
    this.renderHeight = 1080;
    this.canvas.width = this.renderWidth;
    this.canvas.height = this.renderHeight;

    this.preloadImages();
    this.initControls();
    this.renderFrame(0);
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < 60; i++) {
      this.particles.push({
        x: Math.random() * this.renderWidth,
        y: Math.random() * this.renderHeight,
        radius: Math.random() * 2.5 + 0.8,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        color: Math.random() > 0.5 ? "rgba(0, 229, 255, 0.4)" : "rgba(229, 192, 123, 0.4)"
      });
    }
  }

  preloadImages() {
    this.products.forEach((prod, index) => {
      const img = new Image();
      if (window.location.protocol !== "file:") {
        img.crossOrigin = "anonymous";
      }
      img.src = prod.image;
      img.onload = () => {
        this.loadedImagesCount++;
        if (this.currentTime === 0) this.renderFrame(0);
      };
      this.images[index] = img;
    });
  }

  initControls() {
    this.playBtn = document.getElementById("video-play-btn");
    this.scrubBar = document.getElementById("video-progress-bar");
    this.scrubFill = document.getElementById("video-progress-fill");
    this.timeDisplay = document.getElementById("video-time-display");
    this.muteBtn = document.getElementById("video-mute-btn");
    this.fullscreenBtn = document.getElementById("video-fullscreen-btn");
    this.chaptersContainer = document.getElementById("video-chapters-list");
    this.downloadBtn = document.getElementById("video-download-btn");

    if (this.playBtn) {
      this.playBtn.addEventListener("click", () => this.togglePlay());
    }

    if (this.canvas) {
      this.canvas.addEventListener("click", () => this.togglePlay());
    }

    if (this.scrubBar) {
      this.scrubBar.addEventListener("click", (e) => {
        const rect = this.scrubBar.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.seekTo(ratio * this.totalDuration);
      });
    }

    if (this.muteBtn) {
      this.muteBtn.addEventListener("click", () => this.toggleAudio());
    }

    if (this.fullscreenBtn) {
      this.fullscreenBtn.addEventListener("click", () => this.toggleFullscreen());
    }

    if (this.downloadBtn) {
      this.downloadBtn.addEventListener("click", () => this.recordAndDownloadVideo());
    }

    this.renderChapters();
  }

  renderChapters() {
    if (!this.chaptersContainer) return;
    this.chaptersContainer.innerHTML = "";

    // Intro chapter
    const introPill = document.createElement("button");
    introPill.className = "chapter-pill active";
    introPill.textContent = "Intro";
    introPill.addEventListener("click", () => this.seekTo(0));
    this.chaptersContainer.appendChild(introPill);

    // Product chapters
    this.products.forEach((p, idx) => {
      const btn = document.createElement("button");
      btn.className = "chapter-pill";
      btn.textContent = `${idx + 1}. ${p.category.split(" / ")[0]}`;
      btn.title = p.title;
      btn.addEventListener("click", () => {
        const targetTime = this.introDuration + (idx * this.productDuration) + 0.1;
        this.seekTo(targetTime);
        if (!this.isPlaying) this.play();
      });
      this.chaptersContainer.appendChild(btn);
    });

    // Outro chapter
    const outroPill = document.createElement("button");
    outroPill.className = "chapter-pill";
    outroPill.textContent = "Contact & Devis";
    outroPill.addEventListener("click", () => {
      this.seekTo(this.totalDuration - this.outroDuration + 0.1);
    });
    this.chaptersContainer.appendChild(outroPill);
  }

  updateActiveChapter() {
    if (!this.chaptersContainer) return;
    const pills = this.chaptersContainer.querySelectorAll(".chapter-pill");
    pills.forEach(p => p.classList.remove("active"));

    if (this.currentTime < this.introDuration) {
      if (pills[0]) pills[0].classList.add("active");
    } else if (this.currentTime >= this.totalDuration - this.outroDuration) {
      if (pills[pills.length - 1]) pills[pills.length - 1].classList.add("active");
    } else {
      const productIndex = Math.floor((this.currentTime - this.introDuration) / this.productDuration);
      if (pills[productIndex + 1]) {
        pills[productIndex + 1].classList.add("active");
        pills[productIndex + 1].scrollIntoView({ behavior: "smooth", inline: "nearest" });
      }
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (this.currentTime >= this.totalDuration) {
      this.currentTime = 0;
    }
    this.isPlaying = true;
    this.lastTimestamp = performance.now();
    if (this.playBtn) {
      this.playBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`;
    }
    if (!this.isMuted) this.startAudio();
    this.tick();
  }

  pause() {
    this.isPlaying = false;
    if (this.playBtn) {
      this.playBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
    }
    this.stopAudio();
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  seekTo(time) {
    this.currentTime = Math.max(0, Math.min(this.totalDuration, time));
    this.renderFrame(this.currentTime);
    this.updateProgressUI();
    this.updateActiveChapter();
  }

  tick() {
    if (!this.isPlaying) return;
    const now = performance.now();
    const dt = (now - this.lastTimestamp) / 1000;
    this.lastTimestamp = now;

    this.currentTime += dt;
    if (this.currentTime >= this.totalDuration) {
      this.currentTime = this.totalDuration;
      this.pause();
    }

    this.renderFrame(this.currentTime);
    this.updateProgressUI();
    this.updateActiveChapter();

    this.animationFrameId = requestAnimationFrame(() => this.tick());
  }

  updateProgressUI() {
    const ratio = (this.currentTime / this.totalDuration) * 100;
    if (this.scrubFill) {
      this.scrubFill.style.width = `${ratio}%`;
    }
    if (this.timeDisplay) {
      const curM = Math.floor(this.currentTime / 60);
      const curS = Math.floor(this.currentTime % 60).toString().padStart(2, "0");
      const totM = Math.floor(this.totalDuration / 60);
      const totS = Math.floor(this.totalDuration % 60).toString().padStart(2, "0");
      this.timeDisplay.textContent = `${curM}:${curS} / ${totM}:${totS}`;
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      if (this.container.requestFullscreen) {
        this.container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  toggleAudio() {
    this.isMuted = !this.isMuted;
    if (this.muteBtn) {
      this.muteBtn.innerHTML = this.isMuted
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/></svg>`
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
    }
    if (this.isPlaying) {
      if (this.isMuted) {
        this.stopAudio();
      } else {
        this.startAudio();
      }
    }
  }

  startAudio() {
    try {
      if (!this.audioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }
      this.audioGain = this.audioCtx.createGain();
      this.audioGain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);

      // Création d'un doux accord ambient pad lounge
      const freqs = [130.81, 196.00, 261.63, 329.63, 392.00]; // C3, G3, C4, E4, G4
      this.oscillators = freqs.map((f, i) => {
        const osc = this.audioCtx.createOscillator();
        const pan = this.audioCtx.createStereoPanner ? this.audioCtx.createStereoPanner() : null;
        osc.type = i % 2 === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(f, this.audioCtx.currentTime);
        if (pan) {
          pan.pan.setValueAtTime((i - 2) * 0.4, this.audioCtx.currentTime);
          osc.connect(pan);
          pan.connect(this.audioGain);
        } else {
          osc.connect(this.audioGain);
        }
        osc.start();
        return osc;
      });
      this.audioGain.connect(this.audioCtx.destination);
    } catch (e) {
      console.warn("Audio synthesis error", e);
    }
  }

  stopAudio() {
    if (this.oscillators) {
      this.oscillators.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch (e) {}
      });
      this.oscillators = null;
    }
  }

  /* ===============================================================
   * MOTEUR DE RENDU DU SHOWREEL
   * =============================================================== */
  renderFrame(t) {
    const ctx = this.ctx;
    const w = this.renderWidth;
    const h = this.renderHeight;

    // Fond noir profond studio
    ctx.fillStyle = "#07090E";
    ctx.fillRect(0, 0, w, h);

    // Dessin des particules lumineuses animées
    this.renderParticles(ctx, t);

    if (t < this.introDuration) {
      // 1. SEQUENCE INTRODUCTION
      this.renderIntro(ctx, t, w, h);
    } else if (t >= this.totalDuration - this.outroDuration) {
      // 3. SEQUENCE OUTRO & CALL TO ACTION
      const outroProgress = (t - (this.totalDuration - this.outroDuration)) / this.outroDuration;
      this.renderOutro(ctx, outroProgress, w, h);
    } else {
      // 2. SEQUENCE DES 16 PRODUITS
      const productTimeline = t - this.introDuration;
      const productIndex = Math.floor(productTimeline / this.productDuration);
      const productTime = productTimeline % this.productDuration;
      const productProgress = productTime / this.productDuration;

      if (productIndex >= 0 && productIndex < this.products.length) {
        this.renderProductSlide(ctx, productIndex, productProgress, w, h);
      }
    }

    // Letterbox cinématique (bandes noires légères haut/bas)
    ctx.fillStyle = "#040508";
    ctx.fillRect(0, 0, w, 40);
    ctx.fillRect(0, h - 40, w, 40);

    // Filigrane Studio discret en haut à droite
    ctx.font = "600 22px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.textAlign = "right";
    ctx.fillText("PIXORA STUDIO • SHOWREEL OFFICIEL", w - 60, 75);

    // Logo miniature en haut à gauche
    this.renderMiniLogo(ctx, 60, 70);
  }

  renderParticles(ctx, t) {
    this.particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x = this.renderWidth;
      if (p.x > this.renderWidth) p.x = 0;
      if (p.y < 0) p.y = this.renderHeight;
      if (p.y > this.renderHeight) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
  }

  renderMiniLogo(ctx, x, y) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + 10, y - 6, 12, 0, Math.PI * 2);
    const grad = ctx.createLinearGradient(x - 2, y - 18, x + 22, y + 6);
    grad.addColorStop(0, "#00E5FF");
    grad.addColorStop(1, "#E5C07B");
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.font = "800 24px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "left";
    ctx.fillText("PIXORA", x + 30, y);
    ctx.font = "500 14px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#00E5FF";
    ctx.fillText("STUDIO", x + 135, y);
    ctx.restore();
  }

  renderIntro(ctx, t, w, h) {
    const p = t / this.introDuration; // 0 -> 1

    // Halo lumineux central
    const radialGrad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, 700);
    radialGrad.addColorStop(0, "rgba(0, 229, 255, 0.18)");
    radialGrad.addColorStop(0.5, "rgba(229, 192, 123, 0.08)");
    radialGrad.addColorStop(1, "rgba(7, 9, 14, 0)");
    ctx.fillStyle = radialGrad;
    ctx.fillRect(0, 0, w, h);

    // Titre d'intro cinématique
    const titleScale = 0.9 + Math.min(0.1, p * 0.1);
    ctx.save();
    ctx.translate(w / 2, h / 2 - 40);
    ctx.scale(titleScale, titleScale);

    // Badge haut
    ctx.font = "700 22px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#00E5FF";
    ctx.fillText("— STUDIO DE COMMUNICATION VISUELLE & IMPRESSION HAUT DE GAMME —", 0, -110);

    // Grand Titre Pixora Studio
    ctx.font = "900 120px 'Plus Jakarta Sans', sans-serif";
    const textGrad = ctx.createLinearGradient(-300, 0, 300, 0);
    textGrad.addColorStop(0, "#FFFFFF");
    textGrad.addColorStop(0.5, "#E5C07B");
    textGrad.addColorStop(1, "#00E5FF");
    ctx.fillStyle = textGrad;
    ctx.shadowColor = "rgba(0, 229, 255, 0.4)";
    ctx.shadowBlur = 40;
    ctx.fillText("PIXORA STUDIO", 0, 10);
    ctx.shadowBlur = 0;

    // Slogan percutant
    ctx.font = "400 36px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#CBD5E1";
    ctx.fillText("Sublimez votre image. Donnez vie à vos ambitions.", 0, 85);

    // 3 piliers
    ctx.font = "600 24px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#94A3B8";
    ctx.fillText("DESIGN SUR-MESURE  •  IMPRESSION HD  •  SIGNALÉTIQUE D'EXCEPTION", 0, 150);

    ctx.restore();
  }

  renderProductSlide(ctx, index, progress, w, h) {
    const prod = this.products[index];
    const img = this.images[index];

    // Transition fluide fondu au début et fin du slide
    let alpha = 1;
    if (progress < 0.15) {
      alpha = progress / 0.15;
    } else if (progress > 0.85) {
      alpha = (1 - progress) / 0.15;
    }

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

    // Ken Burns effect sur l'image de mockup (zoom lent de 1.0 -> 1.08)
    const zoom = 1.0 + (progress * 0.08);

    // 1. Division de l'écran en mode split moderne :
    // Côté gauche (45%) : Typographie, Titre, Catégorie, Badges et Spécifications
    // Côté droit (55%) : Mockup HD en immersion réelle avec ombre portée luxueuse

    // Halo lumineux d'ambiance sous le produit
    const glowGrad = ctx.createRadialGradient(w * 0.72, h * 0.52, 100, w * 0.72, h * 0.52, 600);
    glowGrad.addColorStop(0, "rgba(0, 229, 255, 0.15)");
    glowGrad.addColorStop(0.7, "rgba(229, 192, 123, 0.06)");
    glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, w, h);

    // DESSIN DU MOCKUP PRODUIT (À DROITE)
    if (img && img.complete && img.naturalWidth > 0) {
      const cardW = w * 0.52;
      const cardH = h * 0.75;
      const cardX = w * 0.44;
      const cardY = h * 0.14;

      ctx.save();
      // Ombre portée luxueuse
      ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
      ctx.shadowBlur = 60;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 25;

      // Coins arrondis pour le cadre du mockup
      this.drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 24);
      ctx.fillStyle = "#0F1420";
      ctx.fill();
      ctx.shadowBlur = 0;

      // Découpe clipping
      ctx.clip();

      // Dessin de l'image avec zoom Ken Burns
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const cardRatio = cardW / cardH;
      let drawW, drawH, drawX, drawY;

      if (imgRatio > cardRatio) {
        drawH = cardH * zoom;
        drawW = drawH * imgRatio;
      } else {
        drawW = cardW * zoom;
        drawH = drawW / imgRatio;
      }
      drawX = cardX + (cardW - drawW) / 2;
      drawY = cardY + (cardH - drawH) / 2;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      // Finition reflet verre subtil
      const glassGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
      glassGrad.addColorStop(0, "rgba(255, 255, 255, 0.1)");
      glassGrad.addColorStop(0.3, "rgba(255, 255, 255, 0)");
      glassGrad.addColorStop(1, "rgba(0, 0, 0, 0.4)");
      ctx.fillStyle = glassGrad;
      ctx.fillRect(cardX, cardY, cardW, cardH);

      ctx.restore();

      // Bordure néon délicate
      ctx.save();
      this.drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 24);
      ctx.strokeStyle = "rgba(0, 229, 255, 0.35)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    // DESSIN DU CONTENU TEXTE & SPÉCIFICATIONS (À GAUCHE)
    const leftX = w * 0.08;
    const baseY = h * 0.28;

    // Numéro d'ordre et catégorie
    ctx.font = "800 20px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#00E5FF";
    ctx.textAlign = "left";
    const num = (index + 1).toString().padStart(2, "0");
    ctx.fillText(`COLLECTION PIXORA • N° ${num} / 16`, leftX, baseY - 40);

    // Badge catégorie
    ctx.save();
    const catText = prod.category;
    ctx.font = "700 16px 'Plus Jakarta Sans', sans-serif";
    const badgeW = ctx.measureText(catText).width + 36;
    const badgeH = 34;
    this.drawRoundedRect(ctx, leftX, baseY - 20, badgeW, badgeH, 17);
    ctx.fillStyle = "rgba(229, 192, 123, 0.15)";
    ctx.fill();
    ctx.strokeStyle = "#E5C07B";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#E5C07B";
    ctx.fillText(catText, leftX + 18, baseY + 3);
    ctx.restore();

    // Grand Titre du Produit
    ctx.font = "900 62px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.shadowBlur = 20;

    // Découpage du titre sur 2 lignes si nécessaire
    const words = prod.title.split(" ");
    let line1 = "";
    let line2 = "";
    words.forEach(word => {
      if ((line1 + " " + word).length < 24 && line2 === "") {
        line1 += (line1 ? " " : "") + word;
      } else {
        line2 += (line2 ? " " : "") + word;
      }
    });

    ctx.fillText(line1, leftX, baseY + 80);
    if (line2) {
      ctx.fillText(line2, leftX, baseY + 150);
    }
    ctx.shadowBlur = 0;

    // Sous-titre valorisant
    const subY = line2 ? baseY + 210 : baseY + 140;
    ctx.font = "500 28px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#94A3B8";
    ctx.fillText(prod.subtitle, leftX, subY);

    // Caractéristiques clés du produit
    const featY = subY + 60;
    if (prod.features) {
      prod.features.forEach((feat, fIdx) => {
        const itemY = featY + (fIdx * 45);

        // Puce dorée lumineuse
        ctx.beginPath();
        ctx.arc(leftX + 12, itemY - 8, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#00E5FF";
        ctx.shadowColor = "#00E5FF";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.font = "600 22px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#E2E8F0";
        ctx.fillText(feat, leftX + 32, itemY);
      });
    }

    // Badge spécial de qualité
    const pillY = featY + (prod.features.length * 45) + 30;
    ctx.save();
    ctx.font = "800 18px 'Plus Jakarta Sans', sans-serif";
    const qualityText = `★ ${prod.badge.toUpperCase()} — STUDIO PREMIUM`;
    const qualityW = ctx.measureText(qualityText).width + 40;
    this.drawRoundedRect(ctx, leftX, pillY, qualityW, 46, 23);
    const pillGrad = ctx.createLinearGradient(leftX, pillY, leftX + qualityW, pillY);
    pillGrad.addColorStop(0, "rgba(0, 229, 255, 0.2)");
    pillGrad.addColorStop(1, "rgba(229, 192, 123, 0.2)");
    ctx.fillStyle = pillGrad;
    ctx.fill();
    ctx.strokeStyle = "#00E5FF";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(qualityText, leftX + 20, pillY + 29);
    ctx.restore();

    ctx.restore();
  }

  renderOutro(ctx, p, w, h) {
    // Halo lumineux gold
    const radialGrad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, 700);
    radialGrad.addColorStop(0, "rgba(229, 192, 123, 0.2)");
    radialGrad.addColorStop(0.5, "rgba(0, 229, 255, 0.08)");
    radialGrad.addColorStop(1, "rgba(7, 9, 14, 0)");
    ctx.fillStyle = radialGrad;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(w / 2, h / 2 - 30);
    ctx.textAlign = "center";

    // Accroche
    ctx.font = "800 24px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#00E5FF";
    ctx.fillText("DE LA CONCEPTION GRAPHIQUE À L'IMPRESSION FINALE", 0, -100);

    // Titre impactant
    ctx.font = "900 86px 'Plus Jakarta Sans', sans-serif";
    const textGrad = ctx.createLinearGradient(-300, 0, 300, 0);
    textGrad.addColorStop(0, "#FFFFFF");
    textGrad.addColorStop(0.5, "#E5C07B");
    textGrad.addColorStop(1, "#00E5FF");
    ctx.fillStyle = textGrad;
    ctx.fillText("DONNEZ VIE À VOTRE PROJET", 0, 0);

    // Sous-titre
    ctx.font = "500 32px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#CBD5E1";
    ctx.fillText("Découvrez l'ensemble de nos 18 catégories de services ci-dessous.", 0, 75);

    // Bouton d'appel à l'action
    const btnW = 460;
    const btnH = 70;
    this.drawRoundedRect(ctx, -btnW / 2, 120, btnW, btnH, 35);
    const btnGrad = ctx.createLinearGradient(-btnW / 2, 120, btnW / 2, 120 + btnH);
    btnGrad.addColorStop(0, "#00E5FF");
    btnGrad.addColorStop(1, "#3B82F6");
    ctx.fillStyle = btnGrad;
    ctx.fill();

    ctx.font = "800 24px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#07090E";
    ctx.fillText("COMMANDER VIA WHATSAPP →", 0, 163);

    ctx.restore();
  }

  drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  /* ===============================================================
   * EXPORT & TELECHARGEMENT DE LA VIDEO (.WEBM)
   * =============================================================== */
  async recordAndDownloadVideo() {
    if (!window.MediaRecorder) {
      alert("Votre navigateur ne supporte pas l'enregistrement direct de vidéo.");
      return;
    }

    if (this.downloadBtn) {
      this.downloadBtn.disabled = true;
      this.downloadBtn.textContent = "Génération de la vidéo en cours...";
    }

    const stream = this.canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm; codecs=vp9" });
    const chunks = [];

    recorder.ondataavailable = e => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pixora-studio-showreel.webm";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      if (this.downloadBtn) {
        this.downloadBtn.disabled = false;
        this.downloadBtn.textContent = "Télécharger la Vidéo (.webm)";
      }
    };

    this.seekTo(0);
    recorder.start();
    this.play();

    // Attendre la fin du showreel
    const checkEnd = setInterval(() => {
      if (!this.isPlaying || this.currentTime >= this.totalDuration) {
        clearInterval(checkEnd);
        recorder.stop();
      }
    }, 500);
  }
}

window.PixoraShowreelPlayer = PixoraShowreelPlayer;
