// Utility functions for Amos Garden website

// User Session Helper
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

// Update navbar based on login state
function updateNavbar() {
  const user = UserSession.get();
  const isLoggedIn = user && user.loggedIn === true;

  // Find all navbar nav items that need updating
  const navbarNav = document.querySelector('#navbarNav .navbar-nav');
  if (!navbarNav) return;

  // Find the auth item (Sign Up / Login button)
  const navItems = navbarNav.querySelectorAll('.nav-item');
  let authItem = null;

  navItems.forEach(item => {
    const link = item.querySelector('a');
    if (link && (link.href.includes('login.html') || link.href.includes('register.html'))) {
      authItem = item;
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

// Update cart count in navbar
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('amosGardenCart') || '{}');
    const itemCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
    const cartBadge = document.getElementById('cartCount');
    if (cartBadge) {
        cartBadge.textContent = itemCount;
    }
}

// Initialize tooltips
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });
}

// Toast notification function (if needed)
function showToast(message, type = 'success') {
    // In a more complete implementation, this would create toast notifications
    console.log(type.toUpperCase() + ': ' + message);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
    }).format(amount);
}

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    initTooltips();

    // Update cart count
    updateCartCount();

    // Update navbar based on login state
    updateNavbar();
});