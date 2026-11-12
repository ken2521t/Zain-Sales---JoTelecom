/**
 * Zain Sales Jordan Portal - JoTelecom
 * Main JavaScript Application
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================
  // 1. Toast Notification Helper
  // ==========================================
  function showToast(message, icon = 'check_circle') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="material-symbols-outlined text-tertiary-fixed-dim text-[18px]">${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-leave');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // ==========================================
  // 2. Tab Navigation & Hash Routing
  // ==========================================
  const validTabs = ['gox-lite', 'savings-calculator', 'cards-rates', 'zain-codes'];
  const tabTitles = {
    'gox-lite': 'عرض GO X Lite 2 الحصري - زين الأردن | JoTelecom',
    'savings-calculator': 'حاسبة مقارنة الوفر مع البطاقات - زين الأردن | JoTelecom',
    'cards-rates': 'أسعار البطاقات والدول المشمولة - زين الأردن | JoTelecom',
    'zain-codes': 'دليل أكواد زين وخدمة العملاء 1234 - زين الأردن | JoTelecom'
  };

  const desktopNavLinks = document.querySelectorAll('nav[data-portal-nav] a[data-tab]');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link[data-tab]');
  const views = document.querySelectorAll('.portal-view');

  function switchTab(tabId, updateHash = true) {
    if (!validTabs.includes(tabId)) {
      tabId = 'gox-lite';
    }

    const targetView = document.getElementById(`view-${tabId}`);
    if (!targetView) {
      // If view is not present in standalone page, route to index.html with hash
      window.location.href = `index.html#${tabId}`;
      return;
    }

    // Update document title
    if (tabTitles[tabId]) {
      document.title = tabTitles[tabId];
    }

    // Update active views
    views.forEach(view => {
      if (view.id === `view-${tabId}`) {
        view.classList.add('active');
        view.classList.remove('hidden');
      } else {
        view.classList.remove('active');
        view.classList.add('hidden');
      }
    });

    // Update desktop navigation styles
    desktopNavLinks.forEach(link => {
      const targetTab = link.getAttribute('data-tab');
      if (targetTab === tabId) {
        link.setAttribute('aria-current', 'page');
        link.className = 'transition-colors bg-primary-container text-on-primary-container font-label-md rounded-full px-space-md py-space-xs';
      } else {
        link.removeAttribute('aria-current');
        link.className = 'px-space-md py-space-xs rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors';
      }
    });

    // Update mobile navigation styles
    mobileNavLinks.forEach(link => {
      const targetTab = link.getAttribute('data-tab');
      if (targetTab === tabId) {
        link.className = 'mobile-nav-link flex items-center gap-space-sm px-space-md py-space-sm rounded-xl bg-primary-container text-on-primary-container font-label-lg transition-colors';
      } else {
        link.className = 'mobile-nav-link flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-on-surface hover:bg-surface-container transition-colors font-label-lg';
      }
    });

    if (updateHash) {
      if (history.pushState) {
        history.pushState(null, null, `#${tabId}`);
      } else {
        window.location.hash = `#${tabId}`;
      }
    }

    // Scroll smoothly to top of the view
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger components re-calculation if needed
    if (tabId === 'savings-calculator' && window.recalculateSavings) {
      window.recalculateSavings();
    }
  }

  // Attach click listeners to all tab links across the page
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
      closeMobileMenu();
    });
  });

  // Handle URL hash on initial load and back/forward navigation
  function handleHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash && validTabs.includes(hash)) {
      switchTab(hash, false);
    } else {
      const existingView = document.querySelector('.portal-view');
      if (existingView && existingView.id) {
        const defaultTab = existingView.id.replace('view-', '');
        switchTab(defaultTab, false);
      } else {
        switchTab('gox-lite', false);
      }
    }
  }

  window.addEventListener('hashchange', handleHash);
  handleHash();

  // ==========================================
  // 3. Mobile Drawer Navigation
  // ==========================================
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileDrawerBackdrop = document.getElementById('mobile-drawer-backdrop');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');

  function openMobileMenu() {
    if (mobileDrawer && mobileDrawerBackdrop) {
      mobileDrawer.classList.add('open');
      mobileDrawerBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileMenu() {
    if (mobileDrawer && mobileDrawerBackdrop) {
      mobileDrawer.classList.remove('open');
      mobileDrawerBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', openMobileMenu);
  }
  if (mobileDrawerClose) {
    mobileDrawerClose.addEventListener('click', closeMobileMenu);
  }
  if (mobileDrawerBackdrop) {
    mobileDrawerBackdrop.addEventListener('click', closeMobileMenu);
  }

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });

  // ==========================================
  // 4. Back to Top Button
  // ==========================================
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================
  // 5. GO X Lite 2 Promo Banner Logic
  // ==========================================
  let ENABLE_PROMO = false;
  const promoBanner = document.getElementById('exclusive-promo-banner');
  const promoStatusIndicator = document.getElementById('promo-status-indicator');
  const togglePromoBtn = document.getElementById('toggle-promo-btn');

  function updatePromoBannerState() {
    if (!promoBanner || !promoStatusIndicator) return;
    if (ENABLE_PROMO) {
      promoBanner.classList.remove('hidden');
      promoStatusIndicator.textContent = 'نشط (ظاهر)';
      promoStatusIndicator.classList.remove('bg-surface-container-high', 'text-on-surface');
      promoStatusIndicator.classList.add('bg-tertiary-fixed', 'text-on-tertiary-fixed');
    } else {
      promoBanner.classList.add('hidden');
      promoStatusIndicator.textContent = 'غير نشط (مخفي)';
      promoStatusIndicator.classList.remove('bg-tertiary-fixed', 'text-on-tertiary-fixed');
      promoStatusIndicator.classList.add('bg-surface-container-high', 'text-on-surface');
    }
  }

  updatePromoBannerState();
  if (togglePromoBtn) {
    togglePromoBtn.addEventListener('click', () => {
      ENABLE_PROMO = !ENABLE_PROMO;
      updatePromoBannerState();
    });
  }

  // ==========================================
  // 6. Interactive 3D Tilt Card
  // ==========================================
  const tiltCard = document.getElementById('tilt-featured-card');
  if (tiltCard) {
    tiltCard.addEventListener('mousemove', (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      tiltCard.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
    });

    tiltCard.addEventListener('mouseleave', () => {
      tiltCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // ==========================================
  // 7. First Bill Prorated Calculator
  // ==========================================
  const daysSlider = document.getElementById('days-input-range');
  const daysNumber = document.getElementById('days-number-input');
  const calcDaysLabel = document.getElementById('calc-days-label');
  const calcProratedAmount = document.getElementById('calc-prorated-amount');
  const calcTotalAmount = document.getElementById('calc-total-amount');
  const calcWhatsappBtn = document.getElementById('calc-whatsapp-btn');

  const DAILY_RATE = 0.39;
  const BASE_MONTHLY_RATE = 11.90;

  function recalculateFirstBill(days) {
    if (!daysSlider || !daysNumber || !calcDaysLabel || !calcProratedAmount || !calcTotalAmount) return;
    const validDays = Math.max(1, Math.min(30, parseInt(days, 10) || 1));
    if (daysSlider.value != validDays) daysSlider.value = validDays;
    if (daysNumber.value != validDays) daysNumber.value = validDays;

    const proratedCost = validDays * DAILY_RATE;
    const totalFirstBill = proratedCost + BASE_MONTHLY_RATE;

    calcDaysLabel.textContent = validDays;
    calcProratedAmount.textContent = proratedCost.toFixed(2) + ' د.أ';
    calcTotalAmount.textContent = totalFirstBill.toFixed(2);

    if (calcWhatsappBtn) {
      const msg = encodeURIComponent(`مرحبا، قمت بحساب فاتورتي الأولى لخط GO X Lite 2 بقيمة ${totalFirstBill.toFixed(2)} دينار (متبقي ${validDays} يوماً على 16 الشهر)، وأرغب بتثبيت الطلب الآن مع التوصيل المجاني.`);
      calcWhatsappBtn.href = `https://wa.me/message/QFLRIQPVI23NP1?text=${msg}`;
    }
  }

  if (daysSlider && daysNumber) {
    daysSlider.addEventListener('input', (e) => recalculateFirstBill(e.target.value));
    daysNumber.addEventListener('input', (e) => recalculateFirstBill(e.target.value));
    recalculateFirstBill(10);
  }

  // ==========================================
  // 8. Reactive Savings Comparison Calculator
  // ==========================================
  const planSelect = document.getElementById('current-plan-select');
  const addonCli = document.getElementById('addon-cli');
  const addonData = document.getElementById('addon-data');

  const outCurrentCost = document.getElementById('out-current-cost');
  const outCostBreakdownNote = document.getElementById('out-cost-breakdown-note');
  const outCurrentGb = document.getElementById('out-current-gb');
  const outMonthlySaving = document.getElementById('out-monthly-saving');
  const outYearlySaving = document.getElementById('out-yearly-saving');
  const outDataBonus = document.getElementById('out-data-bonus');
  const savingsPercentageLabel = document.getElementById('savings-percentage-label');

  const meterCurrentGbBar = document.getElementById('meter-current-gb-bar');
  const meterBonusGbBar = document.getElementById('meter-bonus-gb-bar');
  const meterDataText = document.getElementById('meter-data-text');
  const meterLabelCurrentGb = document.getElementById('meter-label-current-gb');

  const svgCurrentBar = document.getElementById('svg-current-bar');
  const svgCurrentVal = document.getElementById('svg-current-val');
  const svgGoxBar = document.getElementById('svg-gox-bar');

  const GOX_COST = 11.90;
  const GOX_GB = 40;

  function recalculateSavings() {
    if (!planSelect || !addonCli || !addonData || !outCurrentCost) return;

    const selectedOption = planSelect.options[planSelect.selectedIndex];
    const basePlanCost = parseFloat(planSelect.value);
    const currentGb = parseInt(selectedOption.getAttribute('data-gb'), 10) || 15;

    let extraAddons = 0;
    let breakdownParts = [];

    if (addonCli.checked) {
      extraAddons += 2.00;
      breakdownParts.push('2.00 د.أ إظهار رقم');
    }
    if (addonData.checked) {
      extraAddons += 2.00;
      breakdownParts.push('2.00 د.أ حزمة إنترنت');
    }

    const totalCurrentCost = basePlanCost + extraAddons;
    const monthlySaving = Math.max(0, totalCurrentCost - GOX_COST);
    const yearlySaving = monthlySaving * 12;
    const percentageSaved = Math.round((monthlySaving / totalCurrentCost) * 100);
    const gbDifference = GOX_GB - currentGb;

    outCurrentCost.textContent = totalCurrentCost.toFixed(2);
    if (extraAddons > 0) {
      outCostBreakdownNote.textContent = `(${basePlanCost.toFixed(2)} د.أ أساسي + ${breakdownParts.join(' + ')})`;
    } else {
      outCostBreakdownNote.textContent = 'شامل ضريبة المبيعات الرسمية والرسوم الحكومية';
    }

    if (outCurrentGb) outCurrentGb.textContent = `${currentGb} جيجابايت`;
    if (outMonthlySaving) outMonthlySaving.textContent = `${monthlySaving.toFixed(2)} د.أ`;
    if (outYearlySaving) outYearlySaving.textContent = `${yearlySaving.toFixed(2)} د.أ`;

    if (outDataBonus && meterDataText) {
      if (gbDifference > 0) {
        outDataBonus.textContent = `+${gbDifference} GB كل شهر`;
        meterDataText.textContent = `GO X Lite 2 تمنحك +${gbDifference} GB إضافية شهرياً`;
      } else {
        outDataBonus.textContent = 'سعة متكافئة 40 GB مع ترحيل 200%';
        meterDataText.textContent = 'استمتع بميزة ترحيل البيانات 200%';
      }
    }

    if (savingsPercentageLabel) {
      savingsPercentageLabel.textContent = `وفر مؤكد بنسبة ${percentageSaved}%`;
    }
    if (meterLabelCurrentGb) {
      meterLabelCurrentGb.textContent = `باقتك الحالية: ${currentGb} GB`;
    }

    if (meterCurrentGbBar && meterBonusGbBar) {
      const currentGbPct = Math.min(100, Math.round((currentGb / GOX_GB) * 100));
      const bonusGbPct = Math.max(0, 100 - currentGbPct);
      meterCurrentGbBar.style.width = currentGbPct + '%';
      meterBonusGbBar.style.width = bonusGbPct + '%';
    }

    const yearlyCurrent = totalCurrentCost * 12;
    const yearlyGox = GOX_COST * 12;
    if (svgCurrentVal) svgCurrentVal.textContent = yearlyCurrent.toFixed(2) + ' د.أ';

    const maxScale = 220;
    const currentSvgWidth = Math.min(480, Math.max(120, (yearlyCurrent / maxScale) * 480));
    const goxSvgWidth = Math.min(480, Math.max(120, (yearlyGox / maxScale) * 480));

    if (svgCurrentBar) svgCurrentBar.setAttribute('width', currentSvgWidth);
    if (svgGoxBar) svgGoxBar.setAttribute('width', goxSvgWidth);
  }

  window.recalculateSavings = recalculateSavings;

  if (planSelect && addonCli && addonData) {
    planSelect.addEventListener('change', recalculateSavings);
    addonCli.addEventListener('change', recalculateSavings);
    addonData.addEventListener('change', recalculateSavings);
    recalculateSavings();
  }

  // ==========================================
  // 9. USSD Live Search & Category Filtering
  // ==========================================
  const searchInput = document.getElementById('ussdSearchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  const cards = document.querySelectorAll('.code-card');
  const noResults = document.getElementById('noResultsState');
  const filterPills = document.querySelectorAll('.filter-pill');

  let activeFilter = 'all';

  function filterCodes() {
    if (!searchInput) return;
    const term = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach(card => {
      const keywords = card.getAttribute('data-keywords') ? card.getAttribute('data-keywords').toLowerCase() : '';
      const titleElem = card.querySelector('h3');
      const title = titleElem ? titleElem.textContent.toLowerCase() : '';
      const codeElem = card.querySelector('span[dir="ltr"]');
      const code = codeElem ? codeElem.textContent.toLowerCase() : '';

      const matchesSearch = !term || keywords.includes(term) || title.includes(term) || code.includes(term);
      const matchesFilter = activeFilter === 'all' || keywords.includes(activeFilter);

      if (matchesSearch && matchesFilter) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (clearBtn) {
      if (term.length > 0) {
        clearBtn.classList.remove('hidden');
      } else {
        clearBtn.classList.add('hidden');
      }
    }

    if (noResults) {
      if (visibleCount === 0) {
        noResults.classList.remove('hidden');
      } else {
        noResults.classList.add('hidden');
      }
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterCodes);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      filterCodes();
      searchInput.focus();
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', function() {
      filterPills.forEach(p => {
        p.classList.remove('bg-on-surface', 'text-surface');
        p.classList.add('bg-surface-container', 'text-on-surface');
      });
      this.classList.remove('bg-surface-container', 'text-on-surface');
      this.classList.add('bg-on-surface', 'text-surface');

      activeFilter = this.getAttribute('data-filter') || 'all';
      filterCodes();
    });
  });

  // ==========================================
  // 10. Copy to Clipboard with Visual Feedback
  // ==========================================
  const copyButtons = document.querySelectorAll('.copy-code-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const code = this.getAttribute('data-code');
      if (code) {
        navigator.clipboard.writeText(code).then(() => {
          const originalHtml = this.innerHTML;
          this.innerHTML = '<span class="material-symbols-outlined text-[16px]">check</span><span>تم النسخ!</span>';
          this.classList.remove('bg-primary-container', 'text-on-primary-container');
          this.classList.add('bg-tertiary-container', 'text-on-tertiary-container');

          showToast(`تم نسخ الكود ${code} إلى الحافظة بنجاح`);

          setTimeout(() => {
            this.innerHTML = originalHtml;
            this.classList.remove('bg-tertiary-container', 'text-on-tertiary-container');
            this.classList.add('bg-primary-container', 'text-on-primary-container');
          }, 2000);
        }).catch(err => {
          console.error('Copy failed:', err);
        });
      }
    });
  });

  // ==========================================
  // 11. FAQ Accordion Toggle
  // ==========================================
  const faqToggles = document.querySelectorAll('.faq-toggle');
  faqToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const icon = this.querySelector('.faq-icon');
      const isOpen = !content.classList.contains('hidden');

      document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-icon').forEach(i => i.style.transform = 'rotate(0deg)');

      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });

});
