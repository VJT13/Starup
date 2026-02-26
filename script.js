/* ═══════════════════════════════════════════════
   BÁT TRÀNG DIGITAL HERITAGE — INTERACTIVITY
   ═══════════════════════════════════════════════ */

(function () {
    'use strict';

    // ── DOM Cache ──
    const $ = (s, p = document) => p.querySelector(s);
    const $$ = (s, p = document) => [...p.querySelectorAll(s)];

    // ── State ──
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;
    let scrollY = 0;
    let ticking = false;

    // ═══════════════════════════════════════
    // NAVIGATION
    // ═══════════════════════════════════════
    const navbar = $('#navbar');
    const menuBtn = $('#menuBtn');
    const mobileMenu = $('#mobileMenu');
    const navLinks = $$('.nav-link');
    const sections = $$('section[id]');

    // Scroll state for navbar
    function updateNavbar() {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Active nav link
    function updateActiveLink() {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 200;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === current);
        });
    }

    // Mobile menu
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        $$('.mobile-link, .mobile-cta', mobileMenu).forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ═══════════════════════════════════════
    // PARALLAX FLOATING ELEMENTS (Hero)
    // ═══════════════════════════════════════
    const floatingElements = $$('.float-el');

    document.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function updateParallax() {
        // Smooth interpolation
        mouseX += (targetMouseX - mouseX) * 0.06;
        mouseY += (targetMouseY - mouseY) * 0.06;

        floatingElements.forEach(el => {
            const speed = parseFloat(el.dataset.speed) || 0.03;
            const depth = parseFloat(el.dataset.depth) || 1;
            const moveX = mouseX * speed * 1000 * depth;
            const moveY = mouseY * speed * 800 * depth;
            el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        });

        requestAnimationFrame(updateParallax);
    }
    requestAnimationFrame(updateParallax);

    // ═══════════════════════════════════════
    // GOLD LEAF PARTICLES
    // ═══════════════════════════════════════
    const goldCanvas = $('#goldParticles');
    if (goldCanvas) {
        const gCtx = goldCanvas.getContext('2d');
        const particles = [];
        const PARTICLE_COUNT = 35;

        function resizeGoldCanvas() {
            const hero = goldCanvas.parentElement;
            goldCanvas.width = hero.offsetWidth;
            goldCanvas.height = hero.offsetHeight;
        }
        resizeGoldCanvas();
        window.addEventListener('resize', resizeGoldCanvas);

        // Create particles
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * goldCanvas.width,
                y: Math.random() * goldCanvas.height,
                size: Math.random() * 2.5 + 1,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: Math.random() * 0.2 + 0.05,
                opacity: Math.random() * 0.4 + 0.15,
                phase: Math.random() * Math.PI * 2,
                drift: Math.random() * 0.5 + 0.2,
                hue: Math.random() > 0.5 ? '#E8C76B' : '#D4A843'
            });
        }

        function drawGoldParticles() {
            gCtx.clearRect(0, 0, goldCanvas.width, goldCanvas.height);
            const time = Date.now() * 0.001;

            particles.forEach(p => {
                // Gentle sine wave drift
                const driftX = Math.sin(time * p.drift + p.phase) * 15;
                const driftY = Math.cos(time * p.drift * 0.7 + p.phase) * 8;

                // Mouse parallax influence
                const mInfluence = p.size * 2;
                const mx = mouseX * mInfluence;
                const my = mouseY * mInfluence;

                const drawX = p.x + driftX + mx;
                const drawY = p.y + driftY + my;

                // Pulsing opacity
                const pulseOpacity = p.opacity * (0.6 + 0.4 * Math.sin(time * 1.5 + p.phase));

                gCtx.beginPath();
                gCtx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
                gCtx.fillStyle = p.hue;
                gCtx.globalAlpha = pulseOpacity;
                gCtx.fill();

                // Slow downward drift + wrap
                p.y += p.speedY;
                p.x += p.speedX;
                if (p.y > goldCanvas.height + 10) {
                    p.y = -10;
                    p.x = Math.random() * goldCanvas.width;
                }
                if (p.x < -10) p.x = goldCanvas.width + 10;
                if (p.x > goldCanvas.width + 10) p.x = -10;
            });

            gCtx.globalAlpha = 1;
            requestAnimationFrame(drawGoldParticles);
        }
        requestAnimationFrame(drawGoldParticles);
    }

    // ═══════════════════════════════════════
    // INTERACTIVE TIMELINE (Origin)
    // ═══════════════════════════════════════
    const eraModal = $('#eraModal');
    const modalClose = $('#modalClose');
    const modalArtifact = $('#modalArtifact');
    const modalEraTag = $('#modalEraTag');
    const modalTitle = $('#modalTitle');
    const modalDesc = $('#modalDesc');
    const modalSource = $('#modalSource');
    const eraNodes = $$('.itl-node');

    // Era data with historical content and SVG artifacts
    const eraData = {
        era1: {
            tag: 'Năm 1010',
            title: 'Khai Sinh Bạch Thổ Phường',
            desc: 'Khi vua Lý Thái Tổ dời đô về Thăng Long (1010), các dòng họ từ vùng Bồ Bát — Ninh Bình mang theo kỹ nghệ gốm cổ truyền di cư xuôi theo sông Hồng, lập nên xóm nghề Bạch Thổ Phường tại vùng đất giàu phù sa. Đây là tiền thân của làng gốm Bát Tràng ngày nay, nơi nghệ nhân tận dụng nguồn đất sét trắng quý hiếm để tạo ra những sản phẩm gốm đầu tiên.',
            source: '— Tham khảo: Đại Việt sử ký toàn thư, Dư địa chí (Nguyễn Trãi)',
            artifact: '<img src="assets/era_1010.jpeg" alt="era1 artifact" style="max-width: 100%; height: auto;">'
        },
        era2: {
            tag: 'Thế kỷ XIV',
            title: 'Ba Vị Sứ Giả Truyền Nghề',
            desc: 'Theo truyền thuyết, ba vị thủy tổ nghề gốm — Hứa Vĩnh Kiều, Đào Trí Tiến và Lưu Phong Tú — đã mang đến những bí quyết nung men độc đáo từ Trung Hoa, kết hợp với kỹ thuật bản địa để tạo nên hệ men gốm Bát Tràng đặc trưng. Sự giao thoa giữa hai trường phái đã sinh ra dòng gốm men ngọc và men lam nổi tiếng.',
            source: '— Tham khảo: Bia đình Bát Tràng, Thần phả Tam Vị Tổ Sư',
            artifact: '<img src="assets/era_tk14.png" alt="era2 artifact" style="max-width: 100%; height: auto;">'
        },
        era3: {
            tag: 'Thế kỷ XV — XVII',
            title: 'Thời Kỳ Hoàng Kim',
            desc: 'Đây là giai đoạn hưng thịnh nhất của gốm Bát Tràng. Sản phẩm không chỉ phục vụ triều đình Lê — Mạc — Trịnh mà còn là hàng xuất khẩu quý giá sang Nhật Bản, Đông Nam Á và phương Tây. Men lam Bát Tràng (hoa lam) được thương nhân quốc tế đặc biệt ưa chuộng. Nhiều hiện vật quý từ thời kỳ này vẫn được trưng bày tại các bảo tàng thế giới.',
            source: '— Tham khảo: Đại Việt sử ký toàn thư, Phủ biên tạp lục (Lê Quý Đôn)',
            artifact: '<img src="assets/era_tk15_17.png" alt="era3 artifact" style="max-width: 100%; height: auto;">'
        },
        era4: {
            tag: 'Thế kỷ XVIII — XIX',
            title: 'Sức Sống Bền Bỉ',
            desc: 'Dù trải qua chiến tranh và biến động lịch sử, làng gốm Bát Tràng vẫn duy trì ngọn lửa nghề. Các nghệ nhân phát triển kỹ thuật men rạn — mỗi đường nứt trên bề mặt men là ngẫu nhiên và không thể tái tạo, trở thành dấu ấn nghệ thuật độc nhất vô nhị. Gốm gia dụng và gốm thờ cúng từ Bát Tràng trở thành vật dụng không thể thiếu trong đời sống người Việt.',
            source: '— Tham khảo: Lịch triều hiến chương loại chí (Phan Huy Chú)',
            artifact: '<img src="assets/era_tk18_19.png" alt="era4 artifact" style="max-width: 100%; height: auto;">'
        },
        era5: {
            tag: 'Thế kỷ XX — Nay',
            title: 'Chuyển Mình & Hội Nhập',
            desc: 'Bước sang thế kỷ mới, Bát Tràng chuyển mình mạnh mẽ: từ lò nung củi truyền thống sang lò ga hiện đại, từ sản phẩm thủ công sang kết hợp thiết kế đương đại. Làng nghề được công nhận là Di sản văn hóa phi vật thể quốc gia (2019) và trở thành điểm du lịch văn hóa hàng đầu Hà Nội với hàng triệu lượt khách mỗi năm.',
            source: '— Tham khảo: Bộ Văn hóa Thể thao và Du lịch, UNESCO Hà Nội',
            artifact: '<img src="assets/era_tk20.jpeg" alt="era5 artifact" style="max-width: 100%; height: auto;">'
        }
    };

    // Subtle ceramic clink sound using AudioContext
    function playCeramicClink() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(2400, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.25);
            // Second harmonic for richness
            const osc2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(4800, audioCtx.currentTime);
            osc2.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
            gain2.gain.setValueAtTime(0.04, audioCtx.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
            osc2.connect(gain2);
            gain2.connect(audioCtx.destination);
            osc2.start(audioCtx.currentTime);
            osc2.stop(audioCtx.currentTime + 0.15);
        } catch (e) { /* AudioContext not supported */ }
    }

    // Open modal
    function openEraModal(eraKey) {
        const data = eraData[eraKey];
        if (!data || !eraModal) return;

        modalEraTag.textContent = data.tag;
        modalTitle.textContent = data.title;
        modalDesc.textContent = data.desc;
        modalSource.textContent = data.source;
        modalArtifact.innerHTML = data.artifact;

        eraModal.classList.add('active');
        eraModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        playCeramicClink();

        // Mark active node
        eraNodes.forEach(n => n.classList.remove('active'));
        const activeNode = eraNodes.find(n => n.dataset.era === eraKey);
        if (activeNode) activeNode.classList.add('active');
    }

    // Close modal
    function closeEraModal() {
        if (!eraModal) return;
        eraModal.classList.remove('active');
        eraModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        eraNodes.forEach(n => n.classList.remove('active'));
    }

    // Attach click listeners to era nodes
    eraNodes.forEach(node => {
        node.addEventListener('click', () => openEraModal(node.dataset.era));
    });

    // Close modal events
    if (modalClose) modalClose.addEventListener('click', closeEraModal);
    if (eraModal) {
        eraModal.addEventListener('click', (e) => {
            if (e.target === eraModal) closeEraModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeEraModal();
    });

    // ═══════════════════════════════════════
    // WATER RIPPLE EFFECT (Activities)
    // ═══════════════════════════════════════
    $$('.activity-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--ripple-x', x + '%');
            card.style.setProperty('--ripple-y', y + '%');
        });
    });

    // ═══════════════════════════════════════
    // SCROLL REVEAL
    // ═══════════════════════════════════════
    const revealElements = $$('.reveal-up');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger the reveals
                const delay = Array.from(entry.target.parentElement?.children || [])
                    .filter(c => c.classList.contains('reveal-up'))
                    .indexOf(entry.target) * 100;

                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ═══════════════════════════════════════
    // CLAY DUST CURSOR TRAIL
    // ═══════════════════════════════════════
    const canvas = $('#cursorCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    let particles = [];
    const MAX_PARTICLES = 50;

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 1.5;
            this.speedY = (Math.random() - 0.5) * 1.5 - 0.5;
            this.life = 1;
            this.decay = Math.random() * 0.02 + 0.01;
            // Earth tones
            const colors = [
                [193, 105, 79],  // terracotta
                [212, 168, 67],  // gold
                [181, 169, 158], // warm gray
                [139, 125, 114], // darker gray
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedY += 0.02; // gravity
            this.life -= this.decay;
        }

        draw(ctx) {
            if (this.life <= 0) return;
            ctx.save();
            ctx.globalAlpha = this.life * 0.5;
            ctx.fillStyle = `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    let lastTrailX = 0, lastTrailY = 0;
    document.addEventListener('mousemove', (e) => {
        const dx = e.clientX - lastTrailX;
        const dy = e.clientY - lastTrailY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 8 && particles.length < MAX_PARTICLES) {
            particles.push(new Particle(e.clientX, e.clientY));
            lastTrailX = e.clientX;
            lastTrailY = e.clientY;
        }
    });

    function animateParticles() {
        if (!ctx) return requestAnimationFrame(animateParticles);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles = particles.filter(p => p.life > 0);
        particles.forEach(p => {
            p.update();
            p.draw(ctx);
        });

        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ═══════════════════════════════════════
    // SCROLL HANDLER
    // ═══════════════════════════════════════
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateNavbar();
                updateActiveLink();
                // (Timeline is interaction-based, no scroll update needed)
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // ═══════════════════════════════════════
    // SMOOTH SCROLL
    // ═══════════════════════════════════════
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80; // navbar height
                const top = target.offsetTop - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ═══════════════════════════════════════
    // CONTACT FORM HANDLER
    // ═══════════════════════════════════════
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulate form submission
            contactForm.style.display = 'none';
            if (formSuccess) {
                formSuccess.hidden = false;
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    // ═══════════════════════════════════════
    // BOOKING BAR — Scroll to Tours
    // ═══════════════════════════════════════
    const bookingSearchBtn = document.getElementById('bookingSearchBtn');
    if (bookingSearchBtn) {
        bookingSearchBtn.addEventListener('click', () => {
            const toursSection = document.getElementById('tours');
            if (toursSection) {
                const offset = 80;
                const top = toursSection.offsetTop - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    }

    // ═══════════════════════════════════════
    // BUY / BOOK BUTTONS — Scroll to Contact
    // ═══════════════════════════════════════
    $$('.btn-buy').forEach(btn => {
        btn.addEventListener('click', () => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const offset = 80;
                const top = contactSection.offsetTop - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ═══════════════════════════════════════
    // INITIAL CALLS
    // ═══════════════════════════════════════
    updateNavbar();
    updateActiveLink();

    // Initial reveal for above-fold elements
    setTimeout(() => {
        $$('.hero-section .reveal-up').forEach(el => el.classList.add('revealed'));
    }, 100);

})();


