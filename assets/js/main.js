/**
 * ROYAL INDIAN ENGAGEMENT INVITATION - MASTER JAVASCRIPT
 * SINGLE PAGE ROYAL CARD ARCHITECTURE
 * 
 * Flow:
 * 1. Landing Screen: 3D Royal Closed Envelope with Golden Wax Seal
 * 2. On Open: Flap opens in 3D, wax seal dissolves, card emerges
 * 3. The Grand Single-Page Card reveals:
 *    - Signature Banana Leaves enter dynamically from Left & Right
 *    - Leaves settle -> Decorated Royal Elephant reveals in center with Howdah & Couple
 *    - Baroque Frame, White Roses, Ganesha, Marathi Typography & Rings shimmer
 * 4. Ambient Web Audio API Indian Shehnai / Tanpura Drone music
 * 5. Floating Gold Dust particles & Falling Rose Petals
 */

(function () {
  'use strict';

  // State
  const state = {
    isEnvelopeOpened: false,
    isMusicPlaying: false,
    audioContext: null,
    audioNodes: null
  };

  // DOM Elements
  const bgMusic = document.getElementById('bgMusic') || new Audio('assets/music/song-engagement.mp3');
  const envelopeScreen = document.getElementById('envelopeScreen');
  const singleCardScreen = document.getElementById('singleCardScreen');
  const waxSeal = document.getElementById('waxSeal');
  const openInviteBtn = document.getElementById('openInviteBtn');
  const envelopeFlap = document.getElementById('envelopeFlap');
  const peekCard = document.getElementById('peekCard');
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const envelopeTopText = document.getElementById('envelopeTopText');
  const envelopeAction = document.getElementById('envelopeAction');
  const musicBtn = document.getElementById('musicBtn');
  const audioControl = document.getElementById('audioControl');
  const musicLabel = document.getElementById('musicLabel');
  const replayEnvelopeBtn = document.getElementById('replayEnvelopeBtn');
  const particlesCanvas = document.getElementById('particles-canvas');
  const petalsOverlay = document.getElementById('petalsOverlay');

  // ==========================================================================
  // 1. PARTICLES CANVAS (Golden Floating Ambient Sparkles)
  // ==========================================================================
  let pCtx, pWidth, pHeight;
  const particles = [];
  const PARTICLE_COUNT = 40;

  function initParticles() {
    if (!particlesCanvas) return;
    pCtx = particlesCanvas.getContext('2d');
    resizeParticlesCanvas();
    window.addEventListener('resize', resizeParticlesCanvas);

    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * pWidth,
        y: Math.random() * pHeight,
        radius: Math.random() * 2.2 + 0.6,
        alpha: Math.random() * 0.7 + 0.3,
        alphaSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        speedY: -(Math.random() * 0.45 + 0.2),
        speedX: (Math.random() - 0.5) * 0.3,
        goldColor: Math.random() > 0.4 ? '#fde047' : '#ffd700'
      });
    }

    animateParticles();
  }

  function resizeParticlesCanvas() {
    pWidth = particlesCanvas.width = window.innerWidth;
    pHeight = particlesCanvas.height = window.innerHeight;
  }

  function animateParticles() {
    pCtx.clearRect(0, 0, pWidth, pHeight);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y += p.speedY;
      p.x += p.speedX;
      p.alpha += p.alphaSpeed;

      if (p.alpha <= 0.2 || p.alpha >= 0.95) {
        p.alphaSpeed = -p.alphaSpeed;
      }

      if (p.y < -10) {
        p.y = pHeight + 10;
        p.x = Math.random() * pWidth;
      }

      pCtx.save();
      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      pCtx.fillStyle = p.goldColor;
      pCtx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
      pCtx.shadowBlur = 6;
      pCtx.shadowColor = '#d4af37';
      pCtx.fill();
      pCtx.restore();
    }

    requestAnimationFrame(animateParticles);
  }

  // ==========================================================================
  // 2. ROYAL WEDDING AUDIO ENGINE (assets/music/song-engagement.mp3)
  // Plays automatically on open / first user interaction, with toggle controls
  // ==========================================================================
  if (bgMusic) {
    bgMusic.loop = true;
  }

  function startRoyalMusic() {
    if (!bgMusic) return;
    bgMusic.play().then(() => {
      state.isMusicPlaying = true;
      audioControl.classList.remove('muted');
      if (musicLabel) musicLabel.textContent = 'संगीत चालू';
    }).catch((err) => {
      // If browser policy blocks autoplay with sound, wait for first user touch
      console.log('Autoplay deferred until user interaction:', err);
      state.isMusicPlaying = false;
      audioControl.classList.add('muted');
      if (musicLabel) musicLabel.textContent = 'संगीत बंद';
    });
  }

  function toggleRoyalMusic() {
    if (!bgMusic) return;
    if (state.isMusicPlaying) {
      bgMusic.pause();
      state.isMusicPlaying = false;
      audioControl.classList.add('muted');
      if (musicLabel) musicLabel.textContent = 'संगीत बंद';
    } else {
      startRoyalMusic();
    }
  }

  // Try autoplaying immediately when the file is opened
  function attemptAutoplay() {
    startRoyalMusic();

    // Also add one-time interaction listeners so if browser blocks unprompted autoplay,
    // it starts immediately on the very first touch, click, scroll or keypress!
    const unlockAudio = () => {
      if (!state.isMusicPlaying) {
        startRoyalMusic();
      }
      ['click', 'touchstart', 'pointerdown', 'keydown', 'scroll'].forEach(evt => {
        window.removeEventListener(evt, unlockAudio);
      });
    };

    ['click', 'touchstart', 'pointerdown', 'keydown', 'scroll'].forEach(evt => {
      window.addEventListener(evt, unlockAudio, { once: true, passive: true });
    });
  }

  // ==========================================================================
  // 3. STEP 1: ROYAL ENVELOPE OPENING ANIMATION SEQUENCE
  // ==========================================================================
  function openRoyalEnvelope() {
    if (state.isEnvelopeOpened) return;
    state.isEnvelopeOpened = true;

    // Start background wedding shehnai
    startRoyalMusic();

    const openTl = gsap.timeline({
      onComplete: () => {
        revealSingleRoyalCard();
      }
    });

    // 1. Wax Seal cracks & dissolves with gold burst
    openTl.to(waxSeal, {
      scale: 1.25,
      filter: 'drop-shadow(0 0 25px #ffd700)',
      duration: 0.35,
      ease: 'power2.out'
    })
    .to(waxSeal, {
      scale: 0,
      opacity: 0,
      duration: 0.45,
      ease: 'back.in(1.7)'
    }, '+=0.05');

    // 2. Envelope 3D flap unfolds
    openTl.to(envelopeFlap, {
      rotateX: 180,
      duration: 1.1,
      ease: 'power2.inOut'
    }, '-=0.2');

    // 3. Peek card slides up
    openTl.to(peekCard, {
      y: -150,
      scale: 1.05,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.45)',
      duration: 0.9,
      ease: 'power2.out'
    }, '-=0.4');

    // 4. Envelope screen dissolves
    openTl.to(envelopeScreen, {
      scale: 1.12,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.in',
      onComplete: () => {
        envelopeScreen.style.display = 'none';
      }
    }, '+=0.15');
  }

  // ==========================================================================
  // 4. STEP 2: SINGLE-PAGE ROYAL CARD REVEAL & SIGNATURE ANIMATIONS
  // Banana Leaves swoop in from Left & Right, Settle, then Elephant Reveals!
  // ==========================================================================
  function revealSingleRoyalCard() {
    singleCardScreen.style.display = 'flex';
    singleCardScreen.classList.add('visible');

    const card = document.getElementById('masterRoyalCard');
    const leafLeft = document.getElementById('leafGroupLeft');
    const leafRight = document.getElementById('leafGroupRight');
    const elephantRigBox = document.getElementById('elephantRigBox');
    const ganeshSection = document.getElementById('cardGanesh');
    const coupleSection = document.getElementById('cardCouple');
    const headline = document.getElementById('cardHeadline');
    const dateBadge = document.getElementById('cardDateBadge');
    const venue = document.getElementById('cardVenue');
    const inviter = document.getElementById('cardInviter');
    const bells = document.querySelectorAll('.bell-item');
    const roses = document.querySelectorAll('.floral-cluster');

    // Initial states
    gsap.set(card, { scale: 0.9, opacity: 0, y: 30 });
    gsap.set(leafLeft, { x: '-135%', rotation: -30, opacity: 0.2 });
    gsap.set(leafRight, { x: '135%', rotation: 30, opacity: 0.2 });
    gsap.set(elephantRigBox, { scale: 0.65, opacity: 0, filter: 'blur(10px)' });
    gsap.set([ganeshSection, coupleSection, headline, dateBadge, venue, inviter], { opacity: 0, y: 15 });

    const cardTl = gsap.timeline({
      onComplete: () => {
        initFallingPetals();
      }
    });

    // 1. Master card zooms in with regal grace
    cardTl.to(card, {
      scale: 1,
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: 'power2.out'
    });

    // 2. Corner white roses bloom
    cardTl.from(roses, {
      scale: 0,
      opacity: 0,
      rotation: (i) => (i % 2 === 0 ? -20 : 20),
      duration: 0.7,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    }, '-=0.4');

    // 3. Hanging temple bells drop down
    cardTl.from(bells, {
      y: -25,
      opacity: 0,
      stagger: 0.06,
      duration: 0.55,
      ease: 'bounce.out'
    }, '-=0.3');

    // 4. SIGNATURE BANANA LEAVES ANIMATION (Enters from Left & Right)
    cardTl.to(leafLeft, {
      x: '0%',
      rotation: 0,
      opacity: 1,
      duration: 1.3,
      ease: 'power3.out'
    }, '-=0.2');

    cardTl.to(leafRight, {
      x: '0%',
      rotation: 0,
      opacity: 1,
      duration: 1.3,
      ease: 'power3.out'
    }, '-=1.2');

    // Leaves organic settle bounce
    cardTl.to([leafLeft, leafRight], {
      rotation: (i) => (i === 0 ? 2 : -2),
      duration: 0.35,
      yoyo: true,
      repeat: 1,
      ease: 'sine.inOut'
    });

    // 5. ONCE BANANA LEAVES FINISH SETTLING -> REVEAL ROYAL ELEPHANT IN CENTER!
    cardTl.to(elephantRigBox, {
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.1,
      ease: 'back.out(1.4)'
    }, '+=0.1');

    // 6. Lotus flowers bloom in bottom corners
    cardTl.from('.lotus-corner', {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.8)'
    }, '-=0.4');

    // 7. Staggered reveal for Ganesha, Couple Names & Ceremony Details
    cardTl.to(ganeshSection, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');
    cardTl.to(coupleSection, { opacity: 1, y: 0, duration: 0.65, ease: 'back.out(1.2)' }, '-=0.3');
    cardTl.to(headline, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');
    cardTl.to(dateBadge, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');
    cardTl.to(venue, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');
    cardTl.to(inviter, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');
  }

  // ==========================================================================
  // 5. FALLING ROSE PETALS OVERLAY
  // ==========================================================================
  function initFallingPetals() {
    if (!petalsOverlay) return;
    petalsOverlay.innerHTML = '';

    const PETAL_COUNT = 18;
    for (let i = 0; i < PETAL_COUNT; i++) {
      const petal = document.createElement('div');
      petal.className = 'falling-petal';
      petal.style.cssText = `
        position: absolute;
        top: -30px;
        left: ${Math.random() * 100}%;
        width: ${Math.random() * 12 + 10}px;
        height: ${Math.random() * 16 + 14}px;
        background: radial-gradient(circle at 35% 35%, #fff1f2, #f43f5e, #be123c);
        border-radius: 50% 0 50% 50%;
        opacity: ${Math.random() * 0.7 + 0.3};
        transform: rotate(${Math.random() * 360}deg);
        pointer-events: none;
      `;
      petalsOverlay.appendChild(petal);

      gsap.to(petal, {
        y: '980px',
        x: `+=${(Math.random() - 0.5) * 160}px`,
        rotation: `+=${Math.random() * 720 - 360}deg`,
        duration: Math.random() * 4 + 4,
        delay: Math.random() * 3,
        repeat: -1,
        ease: 'none'
      });
    }
  }

  // ==========================================================================
  // 6. REPLAY FUNCTIONALITY
  // Resets state and smoothly folds back into the closed Royal Envelope
  // ==========================================================================
  function replayEnvelope() {
    state.isEnvelopeOpened = false;

    // Reset map container if open
    const mapContainer = document.getElementById('mapIframeContainer');
    const toggleMapBtn = document.getElementById('toggleMapBtn');
    if (mapContainer) mapContainer.style.display = 'none';
    if (toggleMapBtn) {
      toggleMapBtn.classList.remove('active');
      const btnSpan = toggleMapBtn.querySelector('.btn-text') || toggleMapBtn.querySelector('span');
      if (btnSpan) btnSpan.textContent = '📍 गुगल मॅपवर दिशा पहा (View on Map)';
      toggleMapBtn.setAttribute('aria-expanded', 'false');
    }

    const replayTl = gsap.timeline();

    // Fade out card
    replayTl.to(singleCardScreen, {
      opacity: 0,
      scale: 0.94,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        singleCardScreen.style.display = 'none';
        singleCardScreen.classList.remove('visible');
        if (petalsOverlay) petalsOverlay.innerHTML = '';
      }
    });

    // Reset envelope elements
    replayTl.set(envelopeFlap, { rotateX: 0 });
    replayTl.set(peekCard, { y: 0, scale: 1 });
    replayTl.set(waxSeal, { scale: 1, opacity: 1, filter: 'none' });
    replayTl.set(envelopeScreen, { scale: 1, opacity: 0 });

    // Show envelope screen
    replayTl.call(() => {
      envelopeScreen.style.display = 'flex';
      envelopeScreen.classList.remove('hidden');
    });

    replayTl.to(envelopeScreen, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out'
    });
  }

  // ==========================================================================
  // 7. EVENT LISTENERS
  // ==========================================================================
  function setupEventListeners() {
    // Wax Seal / Open Envelope triggers
    if (waxSeal) {
      waxSeal.addEventListener('click', openRoyalEnvelope);
      waxSeal.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') openRoyalEnvelope();
      });
    }

    if (openInviteBtn) {
      openInviteBtn.addEventListener('click', openRoyalEnvelope);
    }

    if (envelopeWrapper) {
      envelopeWrapper.addEventListener('click', () => {
        if (!state.isEnvelopeOpened) openRoyalEnvelope();
      });
    }

    // Music Toggle
    if (musicBtn) {
      musicBtn.addEventListener('click', toggleRoyalMusic);
    }

    // Replay Envelope button
    if (replayEnvelopeBtn) {
      replayEnvelopeBtn.addEventListener('click', replayEnvelope);
    }

    // Google Map Link & Toggle
    const googleMapBtn = document.getElementById('googleMapBtn');
    if (googleMapBtn) {
      googleMapBtn.addEventListener('click', (e) => {
        if (window.handleMapClick) {
          window.handleMapClick(e);
        }
      });
    }

    const toggleMapBtn = document.getElementById('toggleMapBtn');
    if (toggleMapBtn) {
      toggleMapBtn.addEventListener('click', (e) => {
        if (window.toggleGoogleMap) {
          window.toggleGoogleMap(e);
        }
      });
    }
  }

  // Primary Map Click: opens Google Maps directions and previews map on card
  window.handleMapClick = function (e) {
    const mapUrl = "https://www.google.com/maps/search/?api=1&query=Jalaram+Banquet+Hall,+PP+Marg,+near+Bus+Depot,+Gaothan,+Virar+West,+Vasai-Virar,+Maharashtra+401303";
    const mapContainer = document.getElementById('mapIframeContainer');
    const toggleBtn = document.getElementById('toggleMapBtn');
    if (mapContainer) {
      mapContainer.style.setProperty('display', 'block', 'important');
    }
    if (toggleBtn) {
      const toggleText = toggleBtn.querySelector('.toggle-text') || toggleBtn;
      toggleText.textContent = '🗺️ पत्रिकेतील नकाशा बंद करा (Close Preview) ▲';
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
    try {
      window.open(mapUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      window.location.href = mapUrl;
    }
  };

  // Inline Toggle Map Preview
  window.toggleGoogleMap = function (e) {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    const mapContainer = document.getElementById('mapIframeContainer');
    const toggleBtn = document.getElementById('toggleMapBtn');
    if (!mapContainer) return;

    const currentDisplay = window.getComputedStyle(mapContainer).display;
    const isHidden = mapContainer.style.display === 'none' || currentDisplay === 'none' || mapContainer.style.display === '';

    if (isHidden) {
      mapContainer.style.setProperty('display', 'block', 'important');
      if (toggleBtn) {
        const toggleText = toggleBtn.querySelector('.toggle-text') || toggleBtn;
        toggleText.textContent = '🗺️ पत्रिकेतील नकाशा बंद करा (Close Preview) ▲';
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
      setTimeout(() => {
        mapContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 60);
    } else {
      mapContainer.style.setProperty('display', 'none', 'important');
      if (toggleBtn) {
        const toggleText = toggleBtn.querySelector('.toggle-text') || toggleBtn;
        toggleText.textContent = '🗺️ पत्रिकेत नकाशा दाखवा (Preview Map Here) ▼';
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    }
  };

  // Initialize properly even if DOMContentLoaded already fired
  function initializeInvitation() {
    initParticles();
    setupEventListeners();
    attemptAutoplay();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeInvitation);
  } else {
    initializeInvitation();
  }

  // Also attempt autoplay immediately as soon as the script loads
  attemptAutoplay();

})();
