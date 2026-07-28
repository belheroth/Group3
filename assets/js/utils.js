// ========================================
// Amos Garden - Shared Utilities
// Bootstrap 5 Interactive Components Library
// Based on: Bootstrap 5 Components PDF, Interactive Components PDF, Layout & Utilities PDF
// ========================================

/**
 * Toast Notification System
 * Uses Bootstrap 5 Toast component (Interactive Components PDF)
 */
class ToastManager {
  constructor() {
    this.container = null;
    this.initContainer();
  }

  initContainer() {
    this.container = document.getElementById('toastContainer');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toastContainer';
      this.container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      this.container.style.zIndex = '1080';
      document.body.appendChild(this.container);
    }
  }

  /**
   * Show a toast notification
   * @param {string} message - Message to display
   * @param {'success'|'danger'|'warning'|'info'} type - Toast type
   * @param {number} delay - Auto-dismiss delay in ms (default 3000)
   */
  show(message, type = 'success', delay = 3000) {
    const toastId = 'toast-' + Date.now();
    const icons = {
      success: 'bi-check-circle-fill',
      danger: 'bi-exclamation-triangle-fill',
      warning: 'bi-exclamation-triangle-fill',
      info: 'bi-info-circle-fill'
    };
    const bgClasses = {
      success: 'bg-success',
      danger: 'bg-danger',
      warning: 'bg-warning',
      info: 'bg-info'
    };

    const toastHtml = `
      <div id="${toastId}" class="toast ${bgClasses[type]} text-white" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="${delay}">
        <div class="toast-header ${bgClasses[type]} text-white">
          <i class="bi ${icons[type]} me-2"></i>
          <strong class="me-auto">Amos Garden</strong>
          <small>Just now</small>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">${message}</div>
      </div>
    `;

    this.container.insertAdjacentHTML('beforeend', toastHtml);
    const toastEl = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastEl);
    toast.show();

    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());

    return toast;
  }

  success(message, delay) { return this.show(message, 'success', delay); }
  danger(message, delay) { return this.show(message, 'danger', delay); }
  warning(message, delay) { return this.show(message, 'warning', delay); }
  info(message, delay) { return this.show(message, 'info', delay); }
}

/**
 * Modal Manager - Enhanced Bootstrap 5 Modal handling
 * Uses Modal component (Components PDF)
 */
class ModalManager {
  static show(modalId, options = {}) {
    const modalEl = document.getElementById(modalId);
    if (!modalEl) return null;

    const modal = new bootstrap.Modal(modalEl, {
      backdrop: options.backdrop !== false,
      keyboard: options.keyboard !== false,
      focus: options.focus !== false
    });
    modal.show();
    return modal;
  }

  static hide(modalId) {
    const modalEl = document.getElementById(modalId);
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
  }

  static confirm(title, message, onConfirm, onCancel) {
    // Create dynamic confirmation modal
    const modalId = 'confirmModal-' + Date.now();
    const modalHtml = `
      <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">${message}</div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="${modalId}-confirm">Confirm</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modalEl = document.getElementById(modalId);
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    document.getElementById(`${modalId}-confirm`).addEventListener('click', () => {
      modal.hide();
      if (onConfirm) onConfirm();
    });

    modalEl.addEventListener('hidden.bs.modal', () => {
      if (onCancel) onCancel();
      modalEl.remove();
    });
  }
}

/**
 * Offcanvas Cart Drawer
 * Uses Offcanvas component (Interactive Components PDF)
 */
class CartOffcanvas {
  constructor() {
    this.offcanvasEl = null;
    this.offcanvas = null;
    this.init();
  }

  init() {
    // Check if offcanvas already exists
    this.offcanvasEl = document.getElementById('cartOffcanvas');
    if (this.offcanvasEl) {
      this.offcanvas = new bootstrap.Offcanvas(this.offcanvasEl);
    }
  }

  /**
   * Create and show the cart offcanvas
   * @param {Array} cartItems - Array of cart items
   */
  show(cartItems = []) {
    if (!this.offcanvasEl) {
      this.createOffcanvas();
    }
    this.renderCart(cartItems);
    this.offcanvas.show();
  }

  createOffcanvas() {
    const offcanvasHtml = `
      <div class="offcanvas offcanvas-end" tabindex="-1" id="cartOffcanvas" aria-labelledby="cartOffcanvasLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="cartOffcanvasLabel">
            <i class="bi bi-cart3 me-2"></i>Shopping Cart
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <div id="offcanvasCartContent"></div>
          <hr>
          <div class="d-flex justify-content-between mb-2">
            <span>Subtotal</span>
            <strong id="offcanvasSubtotal">₱0.00</strong>
          </div>
          <div class="d-flex justify-content-between mb-3">
            <span>Delivery</span>
            <strong id="offcanvasDelivery">₱0.00</strong>
          </div>
          <hr>
          <div class="d-flex justify-content-between fw-bold fs-5">
            <span>Total</span>
            <span id="offcanvasTotal" style="color: var(--bs-primary);">₱0.00</span>
          </div>
          <div class="d-grid gap-2 mt-3">
            <button class="btn btn-outline-secondary" data-bs-dismiss="offcanvas">
              <i class="bi bi-arrow-left me-2"></i>Continue Shopping
            </button>
            <a href="checkout.html" class="btn btn-primary" style="background-color: var(--bs-secondary); border-color: var(--bs-secondary);">
              <i class="bi bi-credit-card me-2"></i>Proceed to Checkout
            </a>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', offcanvasHtml);
    this.offcanvasEl = document.getElementById('cartOffcanvas');
    this.offcanvas = new bootstrap.Offcanvas(this.offcanvasEl);
  }

  renderCart(cartItems) {
    const contentEl = document.getElementById('offcanvasCartContent');
    const products = JSON.parse(localStorage.getItem('amosGardenProducts') || '[]');
    const defaultProducts = [
      { id: 1, name: "Aloe Vera", price: 150.00, image: "https://via.placeholder.com/60x60/f8fbf9/52b788?text=Aloe" },
      { id: 2, name: "Snake Plant", price: 200.00, image: "https://via.placeholder.com/60x60/f8fbf9/52b788?text=Snake" },
      { id: 3, name: "Monstera Deliciosa", price: 350.00, image: "https://via.placeholder.com/60x60/f8fbf9/52b788?text=Mon" },
      { id: 5, name: "Peace Lily", price: 280.00, image: "https://via.placeholder.com/60x60/f8fbf9/52b788?text=Peace" }
    ];
    const allProducts = [...products, ...defaultProducts];

    if (cartItems.length === 0) {
      contentEl.innerHTML = `
        <div class="text-center py-4">
          <i class="bi bi-cart-x display-1 text-muted"></i>
          <h5 class="mt-3" style="color: var(--bs-secondary);">Your cart is empty</h5>
          <p class="text-muted">Add some plants to get started!</p>
        </div>
      `;
      this.updateTotals(0);
      return;
    }

    let subtotal = 0;
    let html = '<div class="list-group list-group-flush">';

    cartItems.forEach(([id, qty]) => {
      const product = allProducts.find(p => p.id === parseInt(id));
      if (!product) return;

      const itemTotal = product.price * qty;
      subtotal += itemTotal;

      html += `
        <div class="list-group-item px-0">
          <div class="d-flex gap-3 align-items-center">
            <img src="${product.image}" alt="${product.name}" class="rounded" style="width: 50px; height: 50px; object-fit: cover;">
            <div class="flex-grow-1">
              <h6 class="mb-1">${product.name}</h6>
              <small class="text-muted">₱${product.price.toFixed(2)} each</small>
            </div>
            <div class="d-flex align-items-center gap-2">
              <button class="btn btn-sm btn-outline-secondary btn-qty-decrease" data-id="${id}" aria-label="Decrease quantity">-</button>
              <span class="fw-bold">${qty}</span>
              <button class="btn btn-sm btn-outline-secondary btn-qty-increase" data-id="${id}" aria-label="Increase quantity">+</button>
              <button class="btn btn-sm btn-outline-danger btn-remove" data-id="${id}" aria-label="Remove item">
                <i class="bi bi-trash"></i>
              </button>
            </div>
            <div class="ms-auto fw-bold" style="color: var(--bs-primary-dark);">₱${itemTotal.toFixed(2)}</div>
          </div>
        </div>
      `;
    });

    html += '</div>';
    contentEl.innerHTML = html;
    this.updateTotals(subtotal);
    this.attachEvents(cartItems);
  }

  updateTotals(subtotal) {
    const delivery = subtotal >= 1000 ? 0 : 100;
    const total = subtotal + delivery;

    document.getElementById('offcanvasSubtotal').textContent = this.formatPrice(subtotal);
    document.getElementById('offcanvasDelivery').textContent = delivery === 0 ? 'FREE' : this.formatPrice(delivery);
    document.getElementById('offcanvasTotal').textContent = this.formatPrice(total);
  }

  formatPrice(price) {
    return '₱' + price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  attachEvents(cartItems) {
    const cart = JSON.parse(localStorage.getItem('amosGardenCart') || '{}');

    document.querySelectorAll('.btn-qty-decrease').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (cart[id] > 1) {
          cart[id]--;
          localStorage.setItem('amosGardenCart', JSON.stringify(cart));
          this.renderCart(Object.entries(cart));
          this.updateCartCount();
        }
      });
    });

    document.querySelectorAll('.btn-qty-increase').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        cart[id]++;
        localStorage.setItem('amosGardenCart', JSON.stringify(cart));
        this.renderCart(Object.entries(cart));
        this.updateCartCount();
      });
    });

    document.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        delete cart[id];
        localStorage.setItem('amosGardenCart', JSON.stringify(cart));
        this.renderCart(Object.entries(cart));
        this.updateCartCount();
      });
    });
  }

  updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('amosGardenCart') || '{}');
    const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    document.querySelectorAll('#cartCount').forEach(el => el.textContent = totalItems);
  }
}

/**
 * Accordion FAQ Component
 * Uses Accordion component (Interactive Components PDF)
 */
class FAQAccordion {
  static create(items, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '<div class="accordion" id="faqAccordion">';
    items.forEach((item, index) => {
      const itemId = `faq-${index}`;
      html += `
        <div class="accordion-item">
          <h2 class="accordion-header" id="heading-${itemId}">
            <button class="accordion-button ${index !== 0 ? 'collapsed' : ''}" type="button" data-bs-toggle="collapse" data-bs-target="#${itemId}" aria-expanded="${index === 0}" aria-controls="${itemId}">
              ${item.question}
            </button>
          </h2>
          <div id="${itemId}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" aria-labelledby="heading-${itemId}" data-bs-parent="#faqAccordion">
            <div class="accordion-body">
              ${item.answer}
            </div>
          </div>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
  }
}

/**
 * Carousel Component
 * Uses Carousel component (Components PDF)
 */
class ImageCarousel {
  static create(images, containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container || !images.length) return;

    const indicators = images.map((_, i) => `
      <button type="button" data-bs-target="#${containerId}-carousel" data-bs-slide-to="${i}" ${i === 0 ? 'class="active" aria-current="true"' : ''} aria-label="Slide ${i + 1}"></button>
    `).join('');

    const slides = images.map((img, i) => `
      <div class="carousel-item ${i === 0 ? 'active' : ''}">
        <img src="${img.src}" class="d-block w-100" alt="${img.alt || 'Slide ' + (i + 1)}" style="height: ${options.height || '400px'}; object-fit: cover;">
        ${img.caption ? `
          <div class="carousel-caption d-none d-md-block">
            <h5>${img.caption}</h5>
            ${img.captionDesc ? `<p>${img.captionDesc}</p>` : ''}
          </div>
        ` : ''}
      </div>
    `).join('');

    container.innerHTML = `
      <div id="${containerId}-carousel" class="carousel slide" data-bs-ride="${options.autoPlay ? 'carousel' : 'false'}" data-bs-interval="${options.interval || 5000}">
        <div class="carousel-indicators">${indicators}</div>
        <div class="carousel-inner">${slides}</div>
        <button class="carousel-control-prev" type="button" data-bs-target="#${containerId}-carousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#${containerId}-carousel" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    `;
  }
}

/**
 * Tooltip & Popover Initialization
 * Uses Tooltip/Popover components (Components PDF)
 */
function initTooltips() {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl, {
      boundary: 'window',
      delay: { show: 200, hide: 100 }
    });
  });
}

function initPopovers() {
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl, {
      trigger: 'focus',
      boundary: 'window'
    });
  });
}

/**
 * Form Validation Helper
 * Uses Bootstrap 5 Form Validation (Components PDF)
 */
class FormValidator {
  static init(formSelector) {
    const forms = document.querySelectorAll(formSelector);
    forms.forEach(form => {
      form.addEventListener('submit', function(event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }

  static validate(form) {
    return form.checkValidity();
  }

  static reset(form) {
    form.classList.remove('was-validated');
    form.reset();
  }
}

/**
 * ScrollSpy & Smooth Scroll
 * Uses ScrollSpy (Components PDF) and smooth scroll utility
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Update URL without page reload
        history.pushState(null, null, targetId);
      }
    });
  });
}

/**
 * Intersection Observer for Animations
 * Uses Bootstrap 5 animation utilities (Layout & Utilities PDF)
 */
function initScrollAnimations(selector = '.animate-fade-in-up') {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll(selector).forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
}

/**
 * Navbar Update Utility
 * Updates the navbar based on user login state
 */
function updateNavbar() {
  const user = UserSession.get();
  const isLoggedIn = user && user.loggedIn === true;

  // Find all navbar nav items that need updating
  const navbarNav = document.querySelector('#navbarNav .navbar-nav');
  if (!navbarNav) return;

  // Find the cart and login/signup items
  const navItems = navbarNav.querySelectorAll('.nav-item');

  // The last two items are typically Cart and Sign Up/Login
  // We need to find the login/signup item and update it
  let cartItem = null;
  let authItem = null;

  navItems.forEach(item => {
    const link = item.querySelector('a');
    if (link) {
      if (link.href.includes('cart.html')) {
        cartItem = item;
      } else if (link.href.includes('login.html') || link.href.includes('register.html')) {
        authItem = item;
      }
    }
  });

  if (authItem) {
    const link = authItem.querySelector('a');
    if (isLoggedIn) {
      // User is logged in - show user menu with logout
      const userName = user.name || user.email || 'User';
      authItem.innerHTML = `
        <div class="dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-person-circle me-1"></i>${userName}
          </a>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
            <li><a class="dropdown-item" href="my_account.html"><i class="bi bi-person me-2"></i>My Account</a></li>
            <li><a class="dropdown-item" href="checkout.html"><i class="bi bi-bag me-2"></i>My Orders</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-danger" href="#" id="logoutBtn"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
          </ul>
        </div>
      `;

      // Add logout event listener
      const logoutBtn = authItem.querySelector('#logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
          e.preventDefault();
          UserSession.clear();
          updateNavbar();
          updateCartCount();
          if (window.toast) {
            window.toast.success('You have been logged out');
          }
          // Redirect to home if on account page
          if (window.location.pathname.includes('my_account') || window.location.pathname.includes('checkout')) {
            window.location.href = 'index.html';
          }
        });
      }
    } else {
      // User is not logged in - show Sign Up / Login button
      link.className = 'nav-link btn btn-primary btn-nav';
      link.href = 'login.html';
      link.innerHTML = 'Sign Up / Login';
    }
  }
}

/**
 * Cart Count Utility
 */
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('amosGardenCart') || '{}');
  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  document.querySelectorAll('#cartCount').forEach(el => el.textContent = totalItems);
}

/**
 * User Session Helper
 */
const UserSession = {
  get() {
    const data = localStorage.getItem('amosGardenUser');
    return data ? JSON.parse(data) : null;
  },

  set(user) {
    localStorage.setItem('amosGardenUser', JSON.stringify(user));
  },

  clear() {
    localStorage.removeItem('amosGardenUser');
    localStorage.removeItem('amosGardenCart');
    localStorage.removeItem('amosGardenPrefs');
    localStorage.removeItem('amosGardenCheckoutData');
  },

  isLoggedIn() {
    const user = this.get();
    return user && user.loggedIn === true;
  },

  getName() {
    const user = this.get();
    return user ? user.name : 'Guest';
  },

  getEmail() {
    const user = this.get();
    return user ? user.email : '';
  }
};

/**
 * Admin Session Helper
 */
const AdminSession = {
  get() {
    const data = localStorage.getItem('amosGardenAdmin');
    return data ? JSON.parse(data) : null;
  },

  set(admin) {
    localStorage.setItem('amosGardenAdmin', JSON.stringify(admin));
  },

  clear() {
    localStorage.removeItem('amosGardenAdmin');
  },

  isLoggedIn() {
    const admin = this.get();
    return admin && admin.loggedIn === true;
  }
};

// ========================================
// AUTO-INITIALIZATION ON DOM READY
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  // Initialize global toast manager
  window.toast = new ToastManager();

  // Initialize cart offcanvas
  window.cartOffcanvas = new CartOffcanvas();

  // Initialize tooltips and popovers
  initTooltips();
  initPopovers();

  // Initialize smooth scroll
  initSmoothScroll();

  // Initialize scroll animations
  initScrollAnimations();

  // Update cart count on all pages
  updateCartCount();

  // Update navbar based on login state
  updateNavbar();

  // Listen for storage changes (cross-tab sync)
  window.addEventListener('storage', (e) => {
    if (e.key === 'amosGardenCart') {
      updateCartCount();
    }
    if (e.key === 'amosGardenUser') {
      updateNavbar();
    }
  });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ToastManager,
    ModalManager,
    CartOffcanvas,
    FAQAccordion,
    ImageCarousel,
    FormValidator,
    UserSession,
    AdminSession,
    updateCartCount,
    initTooltips,
    initPopovers,
    initSmoothScroll,
    initScrollAnimations
  };
}