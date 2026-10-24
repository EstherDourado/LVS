/**
 * LVS Empreiteira & Fábrica de Artefatos de Concreto
 * Main Interactive Logic
 * - Sticky Header & Mobile Navigation
 * - Animated Counters
 * - Interactive Service Tabs
 * - Product Category Filtering
 * - Contextual WhatsApp Message Generator
 * - Lightbox Modal for Gallery
 * - Scroll Reveal Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initScrollReveal();
  initAnimatedCounters();
  initQuemSomosParticles();
  initServiceTabs();
  initProductFilter();
  initQuoteForm();
  initGalleryLightbox();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   1. Fixed & Sticky Header
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const headerWrapper = document.getElementById('site-header-wrapper') || document.querySelector('.site-header-wrapper');
  const header = document.querySelector('.header');
  if (!headerWrapper && !header) return;

  const handleScroll = () => {
    const isScrolled = window.scrollY > 30;
    if (headerWrapper) headerWrapper.classList.toggle('scrolled', isScrolled);
    if (header) header.classList.toggle('scrolled', isScrolled);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMobile = document.querySelector('.nav-mobile');
  const overlay = document.querySelector('.nav-mobile-overlay');
  const navLinks = document.querySelectorAll('.nav-mobile-link');

  if (!toggleBtn || !navMobile || !overlay) return;

  const openMenu = () => {
    toggleBtn.classList.add('active');
    navMobile.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    toggleBtn.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    toggleBtn.classList.remove('active');
    navMobile.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    toggleBtn.setAttribute('aria-expanded', 'false');
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMobile.classList.contains('open');
    if (isOpen) closeMenu();
    else openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMobile.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* --------------------------------------------------------------------------
   3. Scroll Reveal Animations (Intersection Observer)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  });

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   4. Animated Metric Counters
   -------------------------------------------------------------------------- */
function initAnimatedCounters() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const counters = document.querySelectorAll('.metric-number, .stat-number-big');
  if (!counters.length) return;

  if (prefersReducedMotion) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetValue = parseInt(el.getAttribute('data-target') || '0', 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';

        if (!targetValue) return;

        let current = 0;
        const duration = 1400;
        const stepTime = 25;
        const steps = duration / stepTime;
        const increment = targetValue / steps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= targetValue) {
            el.textContent = `${prefix}${targetValue}${suffix}`;
            clearInterval(timer);
          } else {
            el.textContent = `${prefix}${Math.floor(current)}${suffix}`;
          }
        }, stepTime);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(counter => observer.observe(counter));
}

/* --------------------------------------------------------------------------
   5. Interactive Service Tabs
   -------------------------------------------------------------------------- */
function initServiceTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.servicos-content-panel');
  if (!tabBtns.length || !panels.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      // Update button active state
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Update panel active state
      panels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. Product Category Filtering
   -------------------------------------------------------------------------- */
function initProductFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  const productCards = document.querySelectorAll('.produto-card');
  const seeMoreBtn = document.getElementById('seeMoreCategoryBtn');
  if (!filterBtns.length || !productCards.length) return;

  const categoryLabels = {
    'pavers': 'Modelos de Pavers & Pisos',
    'tubos': 'Medidas de Tubos de Concreto',
    'meio_fio': 'Modelos de Meio-Fio & Guias',
    'drenantes': 'Pisos e Grelhas Drenantes',
    'caixas_concreto': 'Caixas e Drenagem Urbana',
    'blocos': 'Blocos e Canaletas',
    'equipamentos_maquinas': 'Máquinas & Frota Pesada',
    'outros': 'Peças e Itens Pré-Moldados'
  };

  function applyFilter(category) {
    productCards.forEach(card => {
      const cardCat = card.getAttribute('data-category');
      if (category === 'todos' || cardCat === category) {
        card.style.display = 'flex';
        card.style.animation = 'fadeIn 0.3s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });

    if (seeMoreBtn) {
      const label = categoryLabels[category] || 'Produtos';
      seeMoreBtn.href = `produtos.html?cat=${category}`;
      seeMoreBtn.innerHTML = `<span>Ver Mais ${label} na Tela de Produtos →</span>`;
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const category = btn.getAttribute('data-filter');
      if (!category) return;

      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      applyFilter(category);
    });
  });

  // Inicializa com a categoria ativa definida no HTML
  const activeBtn = document.querySelector('.filter-btn.active[data-filter]');
  if (activeBtn) {
    applyFilter(activeBtn.getAttribute('data-filter'));
  }
}

/* --------------------------------------------------------------------------
   7. WhatsApp Budget / Quote Form Generator
   -------------------------------------------------------------------------- */
function initQuoteForm() {
  const form = document.getElementById('orcamentoForm');
  if (!form) return;

  const phone = '554531979180'; // Telefone oficial LVS Cascavel/PR

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('formNome')?.value.trim() || 'Cliente';
    const empresa = document.getElementById('formEmpresa')?.value.trim() || '';
    const servico = document.getElementById('formServico')?.value || 'Não informado';
    const cidade = document.getElementById('formCidade')?.value.trim() || 'Cascavel e Região';
    const mensagem = document.getElementById('formMensagem')?.value.trim() || '';

    let text = `*SOLICITAÇÃO DE ORÇAMENTO - SITE LVS*\n\n`;
    text += `👤 *Nome:* ${nome}\n`;
    if (empresa) text += `🏢 *Empresa:* ${empresa}\n`;
    text += `📍 *Cidade/Local da Obra:* ${cidade}\n`;
    text += `🏗️ *Interesse Principal:* ${servico}\n`;
    if (mensagem) text += `📝 *Detalhes:* ${mensagem}\n`;
    text += `\n_Enviado pelo formulário oficial da LVS Empreiteira._`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedText}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  });
}

/* --------------------------------------------------------------------------
   8. Gallery Lightbox Modal
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.galeria-item');
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');

  if (!galleryItems.length || !modal || !modalImg) return;

  const openLightbox = (imgSrc, title, tag) => {
    modalImg.src = imgSrc;
    modalImg.alt = title;
    if (modalCaption) {
      modalCaption.innerHTML = `<strong>${tag}</strong> — ${title}`;
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.galeria-title')?.textContent || '';
      const tag = item.querySelector('.galeria-tag')?.textContent || '';
      if (img) openLightbox(img.src, title, tag);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------------------------------
   9. Smooth Scroll & Active Nav Spy
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   10. Efeito Interativo de Malha Branca (Mesh / Network) no Mouse (Quem Somos)
   -------------------------------------------------------------------------- */
function initQuemSomosParticles() {
  const section = document.getElementById('quem-somos');
  const canvas = document.getElementById('quemSomosCanvas');
  if (!section || !canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let animationFrameId = null;
  let isMouseOver = false;
  let meshAlpha = 0; // Inicia em 0: malha 100% escondida por padrão
  let targetAlpha = 0;

  const nodes = [];
  const MESH_CONNECT_DIST = 110; // Distância de conexão entre nós vizinhos
  const MOUSE_CONNECT_DIST = 175; // Distância de conexão da malha ao cursor

  function resizeCanvas() {
    width = canvas.width = section.offsetWidth;
    height = canvas.height = section.offsetHeight;
    createNodes();
  }

  function createNodes() {
    nodes.length = 0;
    // Quantidade de nós ideal para criar malha geométrica densa e fluida
    const count = width > 900 ? 55 : 28;

    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 1.5 + 1.8,
        baseAlpha: Math.random() * 0.4 + 0.4
      });
    }
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  const mouse = { x: -1000, y: -1000, active: false };

  function activateMesh(x, y) {
    isMouseOver = true;
    targetAlpha = 1;
    mouse.active = true;
    mouse.x = x;
    mouse.y = y;
    canvas.classList.add('active');
    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(render);
    }
  }

  function deactivateMesh() {
    isMouseOver = false;
    targetAlpha = 0;
    mouse.active = false;
    canvas.classList.remove('active');
  }

  section.addEventListener('mouseenter', (e) => {
    const rect = section.getBoundingClientRect();
    activateMesh(e.clientX - rect.left, e.clientY - rect.top);
  });

  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect();
    activateMesh(e.clientX - rect.left, e.clientY - rect.top);
  });

  section.addEventListener('mouseleave', () => {
    deactivateMesh();
  });

  // Suporte a toque no mobile (ao deslizar o dedo na seção)
  section.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      const rect = section.getBoundingClientRect();
      activateMesh(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
    }
  }, { passive: true });

  section.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      const rect = section.getBoundingClientRect();
      activateMesh(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
    }
  }, { passive: true });

  section.addEventListener('touchend', () => {
    deactivateMesh();
  });

  function render() {
    // Interpolação suave de opacidade (fade-in ao parar o mouse, fade-out ao sair)
    meshAlpha += (targetAlpha - meshAlpha) * 0.085;

    // Se estiver saindo e quase invisível, limpa e pausa animação economizando 100% de CPU
    if (!isMouseOver && meshAlpha < 0.01) {
      meshAlpha = 0;
      ctx.clearRect(0, 0, width, height);
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
      return;
    }

    ctx.clearRect(0, 0, width, height);

    // 1. Atualizar e desenhar conexões da malha geométrica
    for (let i = 0; i < nodes.length; i++) {
      const p = nodes[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Conexão elástica até o cursor do mouse
      if (mouse.active) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist < MOUSE_CONNECT_DIST) {
          const alpha = (1 - dist / MOUSE_CONNECT_DIST) * 0.75 * meshAlpha;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 1.35;
          ctx.stroke();

          // Atração dinâmica sutil da malha
          p.x += dx * 0.015;
          p.y += dy * 0.015;
        }
      }
    }

    // 2. Conexões da malha entre pontos vizinhos
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const p1 = nodes[i];
        const p2 = nodes[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

        if (dist < MESH_CONNECT_DIST) {
          const alpha = (1 - dist / MESH_CONNECT_DIST) * 0.32 * meshAlpha;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
    }

    // 3. Desenhar os nós da malha (pontos brancos luminosos)
    for (let i = 0; i < nodes.length; i++) {
      const p = nodes[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.baseAlpha * meshAlpha})`;
      ctx.fill();
    }

    // 4. Desenhar o centro luminoso do cursor na malha
    if (mouse.active && mouse.x >= 0 && mouse.x <= width && mouse.y >= 0 && mouse.y <= height) {
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${meshAlpha})`;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.95)';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    animationFrameId = requestAnimationFrame(render);
  }
}
