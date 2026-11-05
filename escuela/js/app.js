/**
 * Escuela de Lenguaje Santa María de Vínculo
 * Archivo interactivo principal de la aplicación (UI/UX)
 * Totalmente modular, accesible y reactivo.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileDrawer();
  initLevelSelector();
  initAdmissionForm();
  initURLParams();
  initFaqAccordion();
  initModals();
  initFloatingActions();
});

function initURLParams() {
  const levelSelect = document.getElementById('target-level');
  if (!levelSelect) return;

  const level = new URLSearchParams(window.location.search).get('nivel');
  const labels = {
    'medio-mayor': 'Medio Mayor',
    'pre-kinder': 'Pre-Kínder',
    kinder: 'Kínder'
  };
  const label = labels[level];

  if (!label) return;

  levelSelect.value = level;
  levelSelect.classList.add('field-highlight');
  showToast(`Nivel ${label} preseleccionado`, 'info');

  const form = document.getElementById('formulario-admision');
  if (form) {
    form.scrollIntoView({ behavior: 'smooth' });
  }
}

/* ==========================================================================
   1. MENÚ MÓVIL
   ========================================================================== */
function initMobileDrawer() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');
  const mobileDrawerBackdrop = document.getElementById('mobile-drawer-backdrop');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileDrawer);
  }
  if (mobileDrawerClose) {
    mobileDrawerClose.addEventListener('click', closeMobileDrawer);
  }
  if (mobileDrawerBackdrop) {
    mobileDrawerBackdrop.addEventListener('click', closeMobileDrawer);
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      const targetId = link.getAttribute('href').slice(1);
      if (document.getElementById(targetId)) {
        closeMobileDrawer();
      }
    });
  });
}

function openMobileDrawer() {
  const drawer = document.getElementById('mobile-drawer');
  if (drawer) {
    drawer.classList.remove('pointer-events-none');
    drawer.querySelector('.drawer-backdrop').classList.remove('opacity-0');
    drawer.querySelector('.drawer-backdrop').classList.add('opacity-100');
    drawer.querySelector('.drawer-content').classList.remove('translate-x-full');
    drawer.querySelector('.drawer-content').classList.add('translate-x-0');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileDrawer() {
  const drawer = document.getElementById('mobile-drawer');
  if (drawer) {
    drawer.querySelector('.drawer-backdrop').classList.remove('opacity-100');
    drawer.querySelector('.drawer-backdrop').classList.add('opacity-0');
    drawer.querySelector('.drawer-content').classList.remove('translate-x-0');
    drawer.querySelector('.drawer-content').classList.add('translate-x-full');
    drawer.classList.add('pointer-events-none');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   2. NIVELES EDUCATIVOS, FILTROS Y PRE-SELECCIÓN DE FORMULARIO
   ========================================================================== */
function initLevelSelector() {
  // Filtros interactivos por nivel
  const filterBtns = document.querySelectorAll('.level-filter-btn');
  const levelCards = document.querySelectorAll('.level-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => {
        b.classList.remove('bg-peach', 'text-white', 'shadow-sm');
        b.classList.add('bg-surface-container-lowest', 'text-on-surface-variant');
      });
      btn.classList.add('bg-peach', 'text-white', 'shadow-sm');
      btn.classList.remove('bg-surface-container-lowest', 'text-on-surface-variant');

      levelCards.forEach(card => {
        if (filter === 'all' || card.dataset.level === filter) {
          card.classList.remove('hidden');
          card.classList.add('flex');
        } else {
          card.classList.add('hidden');
          card.classList.remove('flex');
        }
      });
    });
  });

  // Botones de postulación directa desde las tarjetas
  const applyLevelButtons = [
    { selector: 'a[href="#formulario-admision"]:not(.hero-btn)', level: 'medio-mayor' },
  ];

  // Interceptar clicks en los botones de "Postular a..."
  document.querySelectorAll('a[href="#formulario-admision"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const text = btn.innerText.toLowerCase();
      let targetVal = '';
      let levelLabel = '';

      if (text.includes('medio mayor')) {
        targetVal = 'medio-mayor';
        levelLabel = 'Medio Mayor';
      } else if (text.includes('pre-kínder') || text.includes('pre-kinder')) {
        targetVal = 'pre-kinder';
        levelLabel = 'Pre-Kínder';
      } else if (text.includes('kínder') || text.includes('kinder')) {
        targetVal = 'kinder';
        levelLabel = 'Kínder';
      }

      if (targetVal) {
        preselectAdmissionLevel(targetVal, levelLabel);
      }
    });
  });
}

function preselectAdmissionLevel(levelValue, levelLabel) {
  const levelSelect = document.getElementById('target-level');
  if (levelSelect) {
    levelSelect.value = levelValue;
    levelSelect.classList.remove('field-highlight');
    void levelSelect.offsetWidth; // trigger reflow
    levelSelect.classList.add('field-highlight');

    showToast(`Nivel ${levelLabel} preseleccionado en el formulario`, 'info');
  }
}

/* ==========================================================================
   3. FORMULARIO DE ADMISIÓN INTELIGENTE
   ========================================================================== */
let lastSubmittedData = null;

function initAdmissionForm() {
  const form = document.getElementById('admisionForm');
  const rutInput = document.getElementById('child-rut');
  const birthInput = document.getElementById('child-birth');
  const levelSelect = document.getElementById('target-level');
  const phoneInput = document.getElementById('parent-phone');
  const requestedLevel = new URLSearchParams(window.location.search).get('nivel');
  const levelLabels = {
    'medio-mayor': 'Medio Mayor',
    'pre-kinder': 'Pre-Kínder',
    kinder: 'Kínder'
  };

  if (levelSelect && requestedLevel && levelLabels[requestedLevel]
    && Array.from(levelSelect.options).some(option => option.value === requestedLevel)) {
    preselectAdmissionLevel(requestedLevel, levelLabels[requestedLevel]);
  }

  // 1. Formateador de RUT Chileno automático
  if (rutInput) {
    rutInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/[^0-9kK]/g, '').toUpperCase();
      if (value.length > 9) value = value.slice(0, 9);
      
      if (value.length > 1) {
        const dv = value.slice(-1);
        let cuerpo = value.slice(0, -1);
        cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        e.target.value = `${cuerpo}-${dv}`;
      } else {
        e.target.value = value;
      }
    });
  }

  // 2. Formateador de Teléfono WhatsApp chileno
  if (phoneInput) {
    phoneInput.addEventListener('focus', () => {
      if (!phoneInput.value.trim()) {
        phoneInput.value = '+56 9 ';
      }
    });
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value;
      if (!val.startsWith('+56 9 ')) {
        // Mantener prefijo si el usuario borra
        if (val.startsWith('+56')) {
          // permitir continuar
        }
      }
    });
  }

  // 3. Calculador de Edad según Fecha de Nacimiento (al 31 de Marzo 2027)
  if (birthInput) {
    const feedbackPill = document.createElement('div');
    feedbackPill.id = 'birthdate-suggestion-pill';
    feedbackPill.className = 'hidden items-center gap-1.5 text-label-sm text-peach-text font-medium mt-1 transition-all';
    birthInput.parentNode.appendChild(feedbackPill);

    birthInput.addEventListener('change', () => {
      const birthDate = new Date(birthInput.value + 'T00:00:00');
      if (isNaN(birthDate.getTime())) return;

      // Fecha de corte MINEDUC: 31 de Marzo 2027
      const cutOffDate = new Date('2027-03-31T00:00:00');
      
      let years = cutOffDate.getFullYear() - birthDate.getFullYear();
      let months = cutOffDate.getMonth() - birthDate.getMonth();
      if (months < 0 || (months === 0 && cutOffDate.getDate() < birthDate.getDate())) {
        years--;
        months += 12;
      }

      feedbackPill.classList.remove('hidden');
      feedbackPill.classList.add('flex');

      if (years === 3) {
        feedbackPill.innerHTML = `
          <span class="material-symbols-outlined text-[15px] text-secondary">check_circle</span>
          <span>Edad al 31/03/2027: <strong>${years} años</strong> → Corresponde a <strong>Medio Mayor</strong></span>
        `;
        levelSelect.value = 'medio-mayor';
        levelSelect.classList.add('field-highlight');
      } else if (years === 4) {
        feedbackPill.innerHTML = `
          <span class="material-symbols-outlined text-[15px] text-secondary">check_circle</span>
          <span>Edad al 31/03/2027: <strong>${years} años</strong> → Corresponde a <strong>Pre-Kínder</strong></span>
        `;
        levelSelect.value = 'pre-kinder';
        levelSelect.classList.add('field-highlight');
      } else if (years === 5) {
        feedbackPill.innerHTML = `
          <span class="material-symbols-outlined text-[15px] text-secondary">check_circle</span>
          <span>Edad al 31/03/2027: <strong>${years} años</strong> → Corresponde a <strong>Kínder</strong></span>
        `;
        levelSelect.value = 'kinder';
        levelSelect.classList.add('field-highlight');
      } else if (years < 3) {
        feedbackPill.innerHTML = `
          <span class="material-symbols-outlined text-[15px] text-primary">info</span>
          <span>Tendrá menos de 3 años. Consulta en secretaría por cupos de estimulación temprana.</span>
        `;
      } else {
        feedbackPill.innerHTML = `
          <span class="material-symbols-outlined text-[15px] text-primary">info</span>
          <span>Tendrá ${years} años. Consulta por continuidad en 1° Básico con fonoaudiología.</span>
        `;
      }
    });
  }

  // 4. Manejo del Submit del Formulario
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn.innerHTML;

      // Estado de carga
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="inline-block animate-spin material-symbols-outlined text-[20px]">progress_activity</span>
        <span>Generando Solicitud y Reservando Cupo...</span>
      `;

      // Guardar datos
      const childName = document.getElementById('child-name').value.trim();
      const childRut = document.getElementById('child-rut').value.trim();
      const childBirth = document.getElementById('child-birth').value;
      const targetLevel = document.getElementById('target-level').value;
      const targetLevelText = document.getElementById('target-level').options[document.getElementById('target-level').selectedIndex].text;
      const targetShift = document.getElementById('target-shift').value;
      const targetShiftText = document.getElementById('target-shift').options[document.getElementById('target-shift').selectedIndex].text;
      const parentName = document.getElementById('parent-name').value.trim();
      const parentPhone = document.getElementById('parent-phone').value.trim();
      const parentMail = document.getElementById('parent-mail').value.trim();
      const parentNotes = document.getElementById('parent-notes').value.trim();

      const folio = 'SMV-2027-' + Math.floor(1000 + Math.random() * 9000);
      const submissionDate = new Date().toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      lastSubmittedData = {
        folio,
        childName,
        childRut,
        childBirth,
        targetLevel,
        targetLevelText,
        targetShiftText,
        parentName,
        parentPhone,
        parentMail,
        parentNotes,
        submissionDate
      };

      try {
        localStorage.setItem('smv_last_registration', JSON.stringify(lastSubmittedData));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;

        showSuccessFeedback(lastSubmittedData);
        showToast('¡Solicitud registrada correctamente!', 'success');
      }, 700);
    });
  }
}

function showSuccessFeedback(data) {
  const form = document.getElementById('admisionForm');
  const successBox = document.getElementById('formSuccessState');
  
  if (form && successBox) {
    form.classList.add('hidden');
    successBox.classList.remove('hidden');

    // Actualizar contenido enriquecido del estado exitoso
    const detailsContainer = document.getElementById('success-details-container');
    if (detailsContainer && data) {
      detailsContainer.innerHTML = `
        <div class="w-full max-w-lg bg-surface-container-low/70 border border-outline-variant/30 rounded-xl p-space-md text-left flex flex-col gap-2 my-space-sm text-on-surface">
          <div class="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <span class="font-label-md text-label-md text-peach-text font-bold">N° DE FOLIO OFICIAL</span>
            <span class="px-2.5 py-1 rounded-md bg-secondary-container text-on-secondary-container font-headline-sm text-headline-sm font-bold">${data.folio}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-body-sm pt-1">
            <div>
              <span class="text-on-surface-variant font-label-sm block">Estudiante:</span>
              <strong class="text-on-surface">${data.childName}</strong>
            </div>
            <div>
              <span class="text-on-surface-variant font-label-sm block">RUT / IPE:</span>
              <strong>${data.childRut}</strong>
            </div>
            <div>
              <span class="text-on-surface-variant font-label-sm block">Nivel Postulado:</span>
              <strong class="text-primary">${data.targetLevelText.split('(')[0]}</strong>
            </div>
            <div>
              <span class="text-on-surface-variant font-label-sm block">Jornada:</span>
              <strong>${data.targetShiftText.split(':')[0]}</strong>
            </div>
            <div class="col-span-2">
              <span class="text-on-surface-variant font-label-sm block">Apoderado Responsable:</span>
              <strong>${data.parentName} (${data.parentPhone})</strong>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-space-sm pt-2">
          <button type="button" onclick="openVoucherModal()" class="inline-flex items-center gap-1.5 px-space-md py-2.5 rounded-lg bg-surface-container text-primary border border-outline-variant/40 font-label-md text-label-md hover:bg-peach hover:text-white transition-all shadow-sm">
            <span class="material-symbols-outlined text-[18px]">receipt_long</span>
            <span>Ver Comprobante Oficial</span>
          </button>
          <a href="https://wa.me/56993418219?text=Hola,%20acabo%20de%20postular%20en%20la%20web%20con%20el%20Folio%20${data.folio}%20para%20${encodeURIComponent(data.childName)}.%20Quisiera%20confirmar%20el%20estado%20de%20la%20evaluación." target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-space-md py-2.5 rounded-lg bg-secondary text-white font-label-md text-label-md hover:bg-opacity-90 transition-all shadow-sm">
            <span class="material-symbols-outlined text-[18px]">chat</span>
            <span>Confirmar por WhatsApp</span>
          </a>
        </div>
      `;
    }

    // Scroll suave hasta el encabezado del feedback
    const offset = successBox.getBoundingClientRect().top + window.pageYOffset - 120;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  }
}

function resetForm() {
  const form = document.getElementById('admisionForm');
  const successBox = document.getElementById('formSuccessState');
  const pill = document.getElementById('birthdate-suggestion-pill');
  
  if (form && successBox) {
    form.reset();
    form.classList.remove('hidden');
    successBox.classList.add('hidden');
    if (pill) pill.classList.add('hidden');

    const firstInput = document.getElementById('child-name');
    if (firstInput) firstInput.focus();
  }
}

/* ==========================================================================
   4. ACORDEÓN DE PREGUNTAS FRECUENTES Y BÚSQUEDA
   ========================================================================== */
function initFaqAccordion() {
  // Búsqueda en vivo de FAQs
  const searchInput = document.getElementById('faq-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const items = document.querySelectorAll('#faq-accordion > div');

      items.forEach(item => {
        const question = item.querySelector('button').innerText.toLowerCase();
        const answer = item.querySelector('.faq-answer-content').innerText.toLowerCase();
        
        if (question.includes(query) || answer.includes(query)) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  }

  // Filtros de categorías FAQ
  const catButtons = document.querySelectorAll('.faq-category-chip');
  catButtons.forEach(chip => {
    chip.addEventListener('click', () => {
      const category = chip.dataset.faqCategory;

      catButtons.forEach(c => {
        c.classList.remove('bg-peach', 'text-white');
        c.classList.add('bg-surface-container-lowest', 'text-on-surface-variant');
      });
      chip.classList.add('bg-peach', 'text-white');
      chip.classList.remove('bg-surface-container-lowest', 'text-on-surface-variant');

      const items = document.querySelectorAll('#faq-accordion > div');
      items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

function toggleFaq(button) {
  const content = button.nextElementSibling;
  const icon = button.querySelector('.material-symbols-outlined');
  const isHidden = content.classList.contains('hidden');
  
  // Cerrar todos los demás acordiones
  document.querySelectorAll('#faq-accordion > div > div.faq-answer-content:not(.hidden)').forEach(el => {
    el.classList.add('hidden');
  });
  document.querySelectorAll('#faq-accordion button .material-symbols-outlined').forEach(ic => {
    ic.style.transform = 'rotate(0deg)';
  });

  if (isHidden) {
    content.classList.remove('hidden');
    icon.style.transform = 'rotate(180deg)';
  }
}

/* ==========================================================================
   5. SISTEMA CENTRAL DE MODALES (PORTAL FAMILIA, PEI, REGLAMENTO, ETC.)
   ========================================================================== */
function initModals() {
  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // Cerrar haciendo click en los fondos oscuros
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });

  // Conectar botones de apertura de modales por data-modal-target
  document.querySelectorAll('[data-open-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-open-modal');
      openModal(modalId);
    });
  });

  // Pestañas internas del Portal Familia
  initPortalFamiliaTabs();
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    // Focus en primer elemento accesible si existe
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) closeBtn.focus();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(modal => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  });
  document.body.style.overflow = '';
}

function openVoucherModal() {
  if (!lastSubmittedData) {
    try {
      const stored = localStorage.getItem('smv_last_registration');
      if (stored) lastSubmittedData = JSON.parse(stored);
    } catch (err) {}
  }

  if (!lastSubmittedData) {
    showToast('No hay una solicitud reciente para mostrar', 'info');
    return;
  }

  const voucherModal = document.getElementById('modal-comprobante');
  if (voucherModal) {
    document.getElementById('voucher-folio').innerText = lastSubmittedData.folio;
    document.getElementById('voucher-date').innerText = lastSubmittedData.submissionDate;
    document.getElementById('voucher-child-name').innerText = lastSubmittedData.childName;
    document.getElementById('voucher-child-rut').innerText = lastSubmittedData.childRut;
    document.getElementById('voucher-level').innerText = lastSubmittedData.targetLevelText;
    document.getElementById('voucher-shift').innerText = lastSubmittedData.targetShiftText;
    document.getElementById('voucher-parent-name').innerText = lastSubmittedData.parentName;
    document.getElementById('voucher-parent-phone').innerText = lastSubmittedData.parentPhone;
    document.getElementById('voucher-parent-mail').innerText = lastSubmittedData.parentMail;

    openModal('modal-comprobante');
  }
}

function printVoucher() {
  window.print();
}

function initPortalFamiliaTabs() {
  const tabButtons = document.querySelectorAll('.portal-tab-btn');
  const tabPanels = document.querySelectorAll('.portal-tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.portalTab;

      tabButtons.forEach(b => {
        b.classList.remove('border-peach', 'text-peach-text', 'font-bold');
        b.classList.add('border-transparent', 'text-on-surface-variant');
      });
      btn.classList.add('border-peach', 'text-peach-text', 'font-bold');
      btn.classList.remove('border-transparent', 'text-on-surface-variant');

      tabPanels.forEach(panel => {
        if (panel.id === `portal-tab-${target}`) {
          panel.classList.remove('hidden');
          panel.classList.add('block');
        } else {
          panel.classList.add('hidden');
          panel.classList.remove('block');
        }
      });
    });
  });
}

/* ==========================================================================
   6. BOTONES FLOTANTES (WHATSAPP, SCROLL TO TOP)
   ========================================================================== */
function initFloatingActions() {
  const scrollTopBtn = document.getElementById('btn-scroll-top');
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      if (scrollTopBtn) scrollTopBtn.classList.remove('opacity-0', 'pointer-events-none');
    } else {
      if (scrollTopBtn) scrollTopBtn.classList.add('opacity-0', 'pointer-events-none');
    }
  }, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Botón flotante WhatsApp - Quick Chat
  const waFab = document.getElementById('floating-whatsapp-btn');
  const waPopup = document.getElementById('whatsapp-quick-popup');
  const waClose = document.getElementById('whatsapp-popup-close');

  if (waFab && waPopup) {
    waFab.addEventListener('click', (e) => {
      e.stopPropagation();
      waPopup.classList.toggle('hidden');
    });

    if (waClose) {
      waClose.addEventListener('click', (e) => {
        e.stopPropagation();
        waPopup.classList.add('hidden');
      });
    }

    document.addEventListener('click', (e) => {
      if (!waPopup.contains(e.target) && e.target !== waFab) {
        waPopup.classList.add('hidden');
      }
    });
  }
}

/* ==========================================================================
   7. SISTEMA DE TOAST NOTIFICATIONS
   ========================================================================== */
function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `pointer-events-auto p-space-md rounded-xl shadow-lg border flex items-center gap-space-sm bg-surface-container-lowest toast-enter ${
    type === 'success' 
      ? 'border-secondary/40 text-on-surface' 
      : type === 'error'
      ? 'border-error/40 text-on-surface'
      : 'border-peach/40 text-on-surface'
  }`;

  const iconName = type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info';
  const iconColor = type === 'success' ? 'text-secondary' : type === 'error' ? 'text-error' : 'text-peach';

  toast.innerHTML = `
    <span class="material-symbols-outlined ${iconColor} text-[22px] shrink-0">${iconName}</span>
    <span class="font-body-sm text-body-sm leading-snug flex-1">${message}</span>
    <button type="button" class="text-outline-variant hover:text-on-surface ml-1 p-1" onclick="this.parentElement.remove()">
      <span class="material-symbols-outlined text-[16px]">close</span>
    </button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('toast-enter');
    toast.classList.add('toast-exit');
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 280);
  }, duration);
}

// Funciones globales expuestas para atributos inline de HTML
window.toggleFaq = toggleFaq;
window.resetForm = resetForm;
window.openModal = openModal;
window.closeModal = closeModal;
window.closeAllModals = closeAllModals;
window.openVoucherModal = openVoucherModal;
window.printVoucher = printVoucher;
window.preselectAdmissionLevel = preselectAdmissionLevel;
window.showToast = showToast;
