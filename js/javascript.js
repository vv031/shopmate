document.addEventListener('DOMContentLoaded', function() {
  // Constants and Configuration
  const CONFIG = {
    freeShippingThreshold: 499,
    toastDuration: 5000,
    debounceTime: 300,
    minSearchChars: 2
  };

  // Initialize Bootstrap components
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  const tooltipList = tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

  // DOM Elements
  const elements = {
    mobileMenuToggle: document.querySelector('.navbar-toggler'),
    mainNavbar: document.getElementById('mainNavbar'),
    cartBtn: document.getElementById('cartBtn'),
    cartModal: new bootstrap.Modal('#cartModal'),
    cartCount: document.getElementById('cartCount'),
    cartItemCount: document.getElementById('cartItemCount'),
    cartItems: document.getElementById('cartItems'),
    emptyCart: document.getElementById('emptyCart'),
    cartTotal: document.getElementById('cartTotal'),
    userBtn: document.getElementById('userBtn'),
    loginModal: new bootstrap.Modal('#loginModal'),
    registerModal: new bootstrap.Modal('#registerModal'),
    forgotPasswordModal: new bootstrap.Modal('#forgotPasswordModal'),
    backToTopBtn: document.getElementById('backToTop'),
    searchInput: document.getElementById('searchInput'),
    searchSuggestions: document.getElementById('searchSuggestions'),
    searchBtn: document.querySelector('.search-btn')
  };

  // Product database
  const products = [
    { 
      id: 'p1', 
      name: 'Premium Sketchbook', 
      category: 'Art Books & Paper', 
      price: 199, 
      originalPrice: 299,
      image: 'images/fp1.png',
      description: 'High-quality sketchbook with 100gsm paper, perfect for all drawing mediums',
      rating: 4.5,
      reviews: 24,
      stock: 50,
      tags: ['sketching', 'paper', 'artist'],
      badge: 'Sale'
    },
    { 
      id: 'p2', 
      name: 'Artist Brush Set', 
      category: 'Art & Craft', 
      price: 349, 
      image: 'images/fp2.png',
      description: 'Professional brush set with 12 different sizes for all painting techniques',
      rating: 4,
      reviews: 18,
      stock: 30,
      tags: ['painting', 'brushes', 'artist'],
      badge: 'New'
    },
    { 
      id: 'p3', 
      name: 'Drafting Scale Set', 
      category: 'Architech & Design', 
      price: 149, 
      image: 'images/fp3.png',
      description: 'Precision drafting scales set with 3 different scales for technical drawings',
      rating: 5,
      reviews: 42,
      stock: 75,
      tags: ['drafting', 'architecture', 'tools']
    },
    { 
      id: 'p4', 
      name: 'Watercolor Paint Set', 
      category: 'Art & Craft', 
      price: 499, 
      image: 'images/fp4.png',
      description: '24-color professional watercolor set with mixing palette',
      rating: 4.5,
      reviews: 36,
      stock: 25,
      tags: ['painting', 'watercolor', 'artist'],
      badge: 'Best Seller'
    },
    { 
      id: 'p5', 
      name: 'Drawing Board', 
      category: 'Architech & Design', 
      price: 899, 
      image: 'images/cat3.png',
      description: 'Adjustable drawing board with clip and carrying handle',
      rating: 4.2,
      reviews: 15,
      stock: 20,
      tags: ['drafting', 'board', 'artist']
    },
    { 
      id: 'p6', 
      name: 'Craft Paper Pack', 
      category: 'Art & Craft', 
      price: 99, 
      image: 'images/cat2.png',
      description: 'Assorted craft paper pack with 50 sheets in different colors',
      rating: 3.8,
      reviews: 28,
      stock: 100,
      tags: ['craft', 'paper', 'kids']
    },
    { 
      id: 'p7', 
      name: 'Architectural Templates', 
      category: 'Architech & Design', 
      price: 249, 
      image: 'images/cat1.png',
      description: 'Set of 3 architectural drafting templates with common shapes',
      rating: 4.7,
      reviews: 33,
      stock: 40,
      tags: ['drafting', 'architecture', 'tools']
    },
    { 
      id: 'p8', 
      name: 'Stationery Gift Set', 
      category: 'Stationery', 
      price: 399, 
      image: 'images/cat5.png',
      description: 'Premium stationery set including pen, notebook, and accessories',
      rating: 4.3,
      reviews: 47,
      stock: 35,
      tags: ['stationery', 'gift', 'office']
    },
    { 
      id: 'p9', 
      name: 'Oil Pastels Set', 
      category: 'Art & Craft', 
      price: 279, 
      image: 'images/fp5.png',
      description: '36-color oil pastel set with smooth application and vibrant colors',
      rating: 4.6,
      reviews: 39,
      stock: 45,
      tags: ['drawing', 'pastels', 'artist']
    },
    { 
      id: 'p10', 
      name: 'Calligraphy Pen Set', 
      category: 'Art & Craft', 
      price: 349, 
      image: 'images/fp6.png',
      description: 'Beginner calligraphy set with 3 nibs, ink, and practice sheets',
      rating: 4.4,
      reviews: 22,
      stock: 30,
      tags: ['calligraphy', 'writing', 'artist']
    }
  ];

  // Cart state
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Initialize the application
  function init() {
    setupEventListeners();
    updateCart();
    addDataIdsToProductCards();
    setupHoverEffects();
  }

  // Set up all event listeners
  function setupEventListeners() {
    // Mobile menu toggle
    if (elements.mobileMenuToggle) {
      elements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Cart functionality
    if (elements.cartBtn) {
      elements.cartBtn.addEventListener('click', openCartModal);
      setupButtonHoverEffect(elements.cartBtn, 'bi-bag', 'bi-bag-fill');
    }

    // User modal functionality
    if (elements.userBtn) {
      elements.userBtn.addEventListener('click', () => elements.loginModal.show());
      setupButtonHoverEffect(elements.userBtn, 'bi-person', 'bi-person-fill');
    }

    // Modal navigation
    document.querySelectorAll('[data-bs-target="#loginModal"], [data-bs-target="#registerModal"], [data-bs-target="#forgotPasswordModal"]')
      .forEach(button => {
        button.addEventListener('click', handleModalNavigation);
      });

    // Form submissions
    if (document.getElementById('loginForm')) {
      document.getElementById('loginForm').addEventListener('submit', handleLogin);
    }
    if (document.getElementById('registerForm')) {
      document.getElementById('registerForm').addEventListener('submit', handleRegistration);
    }
    if (document.getElementById('forgotPasswordForm')) {
      document.getElementById('forgotPasswordForm').addEventListener('submit', handleForgotPassword);
    }

    // Back to top button
    if (elements.backToTopBtn) {
      window.addEventListener('scroll', toggleBackToTopButton);
      elements.backToTopBtn.addEventListener('click', scrollToTop);
      setupButtonHoverEffect(elements.backToTopBtn, 'bi-arrow-up', 'bi-arrow-up-circle-fill');
    }

    // Search functionality
    if (elements.searchInput) {
      let debounceTimer;
      elements.searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(handleSearch, CONFIG.debounceTime);
      });
      
      document.addEventListener('click', (e) => {
        if (e.target !== elements.searchInput && (!elements.searchSuggestions || !elements.searchSuggestions.contains(e.target))) {
          hideSearchSuggestions();
        }
      });
    }

    if (elements.searchBtn) {
      setupButtonHoverEffect(elements.searchBtn, null, null, 'btn-outline-secondary', 'btn-primary');
    }

    // Product interactions
    document.addEventListener('click', handleProductInteractions);
    document.addEventListener('mouseover', handleProductHoverEffects);
    document.addEventListener('mouseout', handleProductHoverEffects);

    // Category hover effects
    document.querySelectorAll('.cat-item').forEach(item => {
      item.addEventListener('mouseenter', () => highlightCategory(item, true));
      item.addEventListener('mouseleave', () => highlightCategory(item, false));
    });

    // Budget shop hover effects
    document.querySelectorAll('.budget-item').forEach(item => {
      item.addEventListener('mouseenter', () => highlightBudgetItem(item, true));
      item.addEventListener('mouseleave', () => highlightBudgetItem(item, false));
    });
  }

  // Mobile menu toggle
  function toggleMobileMenu() {
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !isExpanded);
    const icon = this.querySelector('i');
    icon.classList.toggle('bi-list');
    icon.classList.toggle('bi-x');
  }

  // Cart functions
  function openCartModal() {
    renderCartItems();
    elements.cartModal.show();
  }

  function updateCart() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    elements.cartCount.textContent = count;
    elements.cartItemCount.textContent = count;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    elements.cartTotal.textContent = `₹${total.toFixed(2)}`;
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update free shipping message
    updateFreeShippingMessage(total);
    
    if (count > 0) {
      elements.cartCount.classList.add('animate-bounce');
      setTimeout(() => elements.cartCount.classList.remove('animate-bounce'), 1000);
    }
  }

  function updateFreeShippingMessage(cartTotal) {
    const freeShippingMsg = document.querySelector('.top-bar p:last-child');
    if (freeShippingMsg) {
      if (cartTotal >= CONFIG.freeShippingThreshold) {
        freeShippingMsg.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>You qualify for FREE shipping!';
      } else {
        const remaining = CONFIG.freeShippingThreshold - cartTotal;
        freeShippingMsg.innerHTML = `<i class="bi bi-truck me-2"></i>Add ₹${remaining} more for FREE shipping`;
      }
    }
  }

  function renderCartItems() {
    if (cart.length === 0) {
      elements.emptyCart.style.display = 'block';
      elements.cartItems.style.display = 'none';
      return;
    }

    elements.emptyCart.style.display = 'none';
    elements.cartItems.style.display = 'block';
    
    elements.cartItems.innerHTML = cart.map(item => {
      const product = products.find(p => p.id === item.id) || item;
      return `
        <div class="cart-item d-flex align-items-center p-3 border-bottom">
          <img src="${product.image}" alt="${product.name}" class="cart-item-img rounded me-3" width="80">
          <div class="cart-item-details flex-grow-1">
            <h5 class="cart-item-title mb-1">${product.name}</h5>
            <small class="text-muted d-block mb-2">${product.category}</small>
            <div class="d-flex justify-content-between align-items-center">
              <span class="cart-item-price text-danger fw-bold">₹${product.price.toFixed(2)}</span>
              <div class="quantity-selector d-flex align-items-center">
                <button class="btn btn-sm btn-outline-secondary decrease-quantity" data-id="${product.id}">
                  <i class="bi bi-dash"></i>
                </button>
                <span class="mx-2 quantity-display">${item.quantity}</span>
                <button class="btn btn-sm btn-outline-secondary increase-quantity" data-id="${product.id}">
                  <i class="bi bi-plus"></i>
                </button>
              </div>
            </div>
          </div>
          <button class="btn btn-link text-danger remove-item ms-2" data-id="${product.id}" title="Remove item">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `;
    }).join('');
    
    // Add event listeners to cart item buttons
    setupCartItemButtons();
  }

  function setupCartItemButtons() {
    document.querySelectorAll('.increase-quantity').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');
        const item = cart.find(i => i.id === id);
        if (item) {
          item.quantity++;
          updateCart();
          renderCartItems();
          showToast(`Increased quantity for ${item.name}`, 'info');
        }
      });
      setupButtonHoverEffect(button, null, null, 'btn-outline-secondary', 'btn-primary');
    });
    
    document.querySelectorAll('.decrease-quantity').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');
        const itemIndex = cart.findIndex(i => i.id === id);
        if (itemIndex !== -1) {
          if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity--;
            showToast(`Decreased quantity for ${cart[itemIndex].name}`, 'info');
          } else {
            const removedItem = cart[itemIndex];
            cart.splice(itemIndex, 1);
            showToast(`${removedItem.name} removed from cart`, 'warning');
          }
          updateCart();
          renderCartItems();
        }
      });
      setupButtonHoverEffect(button, null, null, 'btn-outline-secondary', 'btn-primary');
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');
        const itemIndex = cart.findIndex(i => i.id === id);
        if (itemIndex !== -1) {
          const removedItem = cart[itemIndex];
          cart.splice(itemIndex, 1);
          updateCart();
          renderCartItems();
          showToast(`${removedItem.name} removed from cart`, 'warning');
        }
      });
      
      button.addEventListener('mouseenter', () => {
        button.querySelector('i').classList.add('bi-trash-fill');
        button.querySelector('i').classList.remove('bi-trash');
      });
      button.addEventListener('mouseleave', () => {
        button.querySelector('i').classList.remove('bi-trash-fill');
        button.querySelector('i').classList.add('bi-trash');
      });
    });
  }

  // Modal navigation
  function handleModalNavigation(e) {
    e.preventDefault();
    const targetModal = this.getAttribute('data-bs-target');
    
    if (targetModal === '#loginModal') {
      elements.loginModal.show();
    } else if (targetModal === '#registerModal') {
      elements.registerModal.show();
    } else if (targetModal === '#forgotPasswordModal') {
      elements.forgotPasswordModal.show();
    }
    
    // Hide current modal if we're switching
    const currentModal = this.closest('.modal');
    if (currentModal) {
      bootstrap.Modal.getInstance(currentModal).hide();
    }
  }

  // Form handlers
  function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation
    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    
    // Email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    
    // Password length validation
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    
    // Simulate successful login
    showToast('Login successful!', 'success');
    elements.loginModal.hide();
    
    // Update user button to show logged in state
    if (elements.userBtn) {
      elements.userBtn.innerHTML = '<i class="bi bi-person-check"></i>';
      elements.userBtn.setAttribute('title', 'My Account');
      new bootstrap.Tooltip(elements.userBtn);
    }
  }

  function handleRegistration(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Simple validation
    if (!name || !email || !password || !confirmPassword) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    
    // Name validation
    if (name.length < 3) {
      showToast('Name must be at least 3 characters', 'error');
      return;
    }
    
    // Email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    
    // Simulate successful registration
    showToast('Registration successful! Please login', 'success');
    elements.registerModal.hide();
    elements.loginModal.show();
    
    // Reset form
    e.target.reset();
  }

  function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgotEmail').value;
    
    // Simple validation
    if (!email) {
      showToast('Please enter your email', 'error');
      return;
    }
    
    // Email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    
    // Simulate password reset
    showToast('Password reset link sent to your email', 'success');
    elements.forgotPasswordModal.hide();
    
    // Reset form
    e.target.reset();
  }

  // Back to top functionality
  function toggleBackToTopButton() {
    if (window.pageYOffset > 300) {
      elements.backToTopBtn.classList.add('show');
    } else {
      elements.backToTopBtn.classList.remove('show');
    }
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Search functionality
  function handleSearch() {
    const query = elements.searchInput.value.trim().toLowerCase();
    
    if (query.length > CONFIG.minSearchChars) {
      const suggestions = products.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.category.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.includes(query))
      );
      
      showSearchSuggestions(suggestions);
    } else {
      hideSearchSuggestions();
    }
  }

  function showSearchSuggestions(suggestions) {
    if (!elements.searchSuggestions) return;
    
    if (suggestions.length > 0) {
      elements.searchSuggestions.innerHTML = suggestions.map(item => `
        <div class="suggestion-item p-2 border-bottom d-flex align-items-center" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" width="40" height="40" class="me-3 rounded">
          <div class="flex-grow-1">
            <div class="fw-bold">${item.name}</div>
            <small class="text-muted">${item.category} • ₹${item.price.toFixed(2)}</small>
          </div>
          <button class="btn btn-sm btn-outline-primary add-to-cart-from-search" data-id="${item.id}">
            <i class="bi bi-plus"></i>
          </button>
        </div>
      `).join('');
      
      elements.searchSuggestions.style.display = 'block';
      
      // Add hover effects to suggestion items
      document.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('mouseenter', () => item.classList.add('bg-light'));
        item.addEventListener('mouseleave', () => item.classList.remove('bg-light'));
        
        // Add click event to suggestion items
        item.addEventListener('click', function(e) {
          if (!e.target.closest('.add-to-cart-from-search')) {
            const productId = item.getAttribute('data-id');
            const product = products.find(p => p.id === productId);
            
            if (product) {
              elements.searchInput.value = product.name;
              hideSearchSuggestions();
            }
          }
        });
      });
      
      // Add to cart buttons in search suggestions
      document.querySelectorAll('.add-to-cart-from-search').forEach(button => {
        button.addEventListener('click', function(e) {
          e.stopPropagation();
          const productId = button.getAttribute('data-id');
          const product = products.find(p => p.id === productId);
          
          if (product) {
            addToCart(product);
            showToast(`${product.name} added to cart`);
          }
        });
        
        setupButtonHoverEffect(button, 'bi-plus', 'bi-cart-plus-fill', 'btn-outline-primary', 'btn-primary');
      });
    } else {
      elements.searchSuggestions.innerHTML = '<div class="p-3 text-muted">No products found. Try a different search term.</div>';
      elements.searchSuggestions.style.display = 'block';
    }
  }

  function hideSearchSuggestions() {
    if (elements.searchSuggestions) {
      elements.searchSuggestions.style.display = 'none';
    }
  }

  // Product functions
  function addToCart(product) {
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: 1
      });
    }
    
    updateCart();
    
    // Add animation to cart button
    if (elements.cartBtn) {
      elements.cartBtn.classList.add('animate-bounce');
      setTimeout(() => elements.cartBtn.classList.remove('animate-bounce'), 1000);
    }
  }

  function handleProductInteractions(e) {
    // Add to cart button click
    if (e.target.closest('.product-card button')) {
      const button = e.target.closest('.product-card button');
      const productCard = button.closest('.product-card');
      const productId = productCard.dataset.id;
      
      // Find the product in our database
      const product = products.find(p => p.id === productId);
      
      if (product) {
        addToCart(product);
        showToast(`${product.name} added to cart`);
      }
    }
  }

  function handleProductHoverEffects(e) {
    const addToCartBtn = e.target.closest('.product-card button');
    if (!addToCartBtn) return;

    if (e.type === 'mouseover') {
      addToCartBtn.classList.add('btn-primary');
      addToCartBtn.classList.remove('btn-outline-primary');
      const icon = addToCartBtn.querySelector('i');
      if (icon) {
        icon.classList.add('bi-cart-plus-fill');
        icon.classList.remove('bi-plus');
      }
    } else if (e.type === 'mouseout') {
      addToCartBtn.classList.remove('btn-primary');
      addToCartBtn.classList.add('btn-outline-primary');
      const icon = addToCartBtn.querySelector('i');
      if (icon) {
        icon.classList.remove('bi-cart-plus-fill');
        icon.classList.add('bi-plus');
      }
    }
  }

  // UI Effects
  function highlightCategory(item, isHovering) {
    const span = item.querySelector('span');
    const img = item.querySelector('img');
    
    if (span) span.style.opacity = isHovering ? '1' : '0';
    if (img) {
      img.style.transform = isHovering ? 'scale(1.05)' : 'scale(1)';
      img.style.transition = 'transform 0.3s ease';
    }
  }

  function highlightBudgetItem(item, isHovering) {
    const button = item.querySelector('button');
    if (button) {
      if (isHovering) {
        button.classList.remove('btn-outline-dark');
        button.classList.add('btn-light');
      } else {
        button.classList.add('btn-outline-dark');
        button.classList.remove('btn-light');
      }
    }
  }

  function setupButtonHoverEffect(button, iconClass, iconHoverClass, btnClass = null, btnHoverClass = null) {
    if (!button) return;
    
    if (iconClass && iconHoverClass) {
      const icon = button.querySelector('i');
      if (icon) {
        button.addEventListener('mouseenter', () => {
          icon.classList.add(iconHoverClass);
          icon.classList.remove(iconClass);
        });
        button.addEventListener('mouseleave', () => {
          icon.classList.remove(iconHoverClass);
          icon.classList.add(iconClass);
        });
      }
    }
    
    if (btnClass && btnHoverClass) {
      button.addEventListener('mouseenter', () => {
        button.classList.add(btnHoverClass);
        button.classList.remove(btnClass);
      });
      button.addEventListener('mouseleave', () => {
        button.classList.remove(btnHoverClass);
        button.classList.add(btnClass);
      });
    }
  }

  function setupHoverEffects() {
    // Add hover effects to all buttons with icons
    document.querySelectorAll('.btn i').forEach(icon => {
      const btn = icon.closest('.btn');
      if (btn) {
        btn.addEventListener('mouseenter', function() {
          if (icon.classList.contains('bi-arrow-right')) {
            icon.classList.remove('bi-arrow-right');
            icon.classList.add('bi-arrow-right-circle-fill');
          } else if (icon.classList.contains('bi-lightning-charge-fill')) {
            icon.classList.add('animate-flash');
          }
        });
        
        btn.addEventListener('mouseleave', function() {
          if (icon.classList.contains('bi-arrow-right-circle-fill')) {
            icon.classList.add('bi-arrow-right');
            icon.classList.remove('bi-arrow-right-circle-fill');
          } else if (icon.classList.contains('bi-lightning-charge-fill')) {
            icon.classList.remove('animate-flash');
          }
        });
      }
    });
  }

  // Toast notification system
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    // Icons for different notification types
    const icons = {
      success: 'bi-check-circle-fill',
      error: 'bi-exclamation-circle-fill',
      warning: 'bi-exclamation-triangle-fill',
      info: 'bi-info-circle-fill'
    };
    
    toast.innerHTML = `
      <div class="toast-icon" aria-hidden="true">
        <i class="bi ${icons[type] || 'bi-check-circle-fill'}"></i>
      </div>
      <div class="toast-message">${message}</div>
      <button class="toast-close" aria-label="Close notification">
        <i class="bi bi-x" aria-hidden="true"></i>
      </button>
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    });
    
    // Auto-remove after duration
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, CONFIG.toastDuration);
    
    // Focus the close button for accessibility
    closeBtn.focus();
  }

  // Utility functions
  function addDataIdsToProductCards() {
    document.querySelectorAll('.product-card').forEach((card, index) => {
      if (index < products.length) {
        card.dataset.id = products[index].id;
      }
    });
  }

  // Initialize the application
  init();
});