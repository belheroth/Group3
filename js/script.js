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
    user ? user.email : '';
  }
};

function updateNavbar() {
  const user = UserSession.get();
  const isLoggedIn = user && user.loggedIn === true;

  const navbarNav = document.querySelector('#navbarNav .navbar-nav');
  if (!navbarNav) return;

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

      const logoutBtn = authItem.querySelector('#logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
          e.preventDefault();
          UserSession.clear();
          updateNavbar();
          updateCartCount();
          if (window.location.pathname.includes('my_account') || window.location.pathname.includes('checkout')) {
            window.location.href = 'logout.html';
          }
        });
      }
    } else {
      link.className = 'nav-link btn btn-primary btn-nav';
      link.href = 'login.html';
      link.innerHTML = 'Sign Up / Login';
    }
  }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('amosGardenCart') || '{}');
    const itemCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
    const cartBadge = document.getElementById('cartCount');
    if (cartBadge) {
        cartBadge.textContent = itemCount;
        if (itemCount === 0) {
            cartBadge.classList.add('d-none');
        } else {
            cartBadge.classList.remove('d-none');
        }
    }
}

function initTooltips() {
    const tooltips = document.queryAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });
}

function showToast(message, type = 'success') {
    console.log(type.toUpperCase() + ': ' + message);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
    }).format(amount);
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initTooltips();
    updateCartCount();
    updateNavbar();
});