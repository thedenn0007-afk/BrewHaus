// ── Navbar scroll effect ──
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ── Hamburger menu ──
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = navLinks.classList.contains('open') ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity = navLinks.classList.contains('open') ? '0' : '1';
    spans[2].style.transform = navLinks.classList.contains('open') ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });
  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }));
}

// ── Active nav link ──
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === 'index.html' && href === './') || href === currentPage.replace('.html','')) {
    a.classList.add('active');
  }
});

// ── Scroll Reveal ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), entry.target.dataset.delay || 0);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.dataset.delay = (i % 4) * 80;
  revealObserver.observe(el);
});

// ── Category Tabs (Menu page) ──
const tabs = document.querySelectorAll('.cat-tab');
const cards = document.querySelectorAll('.menu-card[data-cat]');
if (tabs.length) {
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.cat;
      cards.forEach(card => {
        if (cat === 'all' || card.dataset.cat === cat) {
          card.style.display = '';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ── Add to cart toast ──
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>✓</span> ${msg}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

document.querySelectorAll('.card-add').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const name = btn.closest('.menu-card').querySelector('.card-name').textContent;
    showToast(`${name} added to cart!`);
    btn.style.transform = 'scale(1.3)';
    setTimeout(() => btn.style.transform = '', 300);
  });
});

// ── Burger Builder ──
const builderChoices = document.querySelectorAll('.builder-choice');
if (builderChoices.length) {
  const basePrice = { bun: { 'Sesame Bun': 0, 'Brioche Bun': 20, 'Whole Wheat': 10, 'Pita Wrap': 15 }, patty: { 'Chicken Patty': 0, 'Beef Patty': 30, 'Veg Patty': 0, 'Paneer Patty': 20, 'Double Patty': 60 }, cheese: { 'No Cheese': 0, 'Cheddar': 20, 'Mozzarella': 20, 'Pepper Jack': 25, 'Double Cheese': 40 }, sauce: { 'Ketchup': 0, 'BBQ': 0, 'Chipotle': 10, 'Sriracha Mayo': 10, 'Garlic Aioli': 10 } };
  const selections = { bun: 'Sesame Bun', patty: 'Chicken Patty', cheese: 'No Cheese', sauce: 'Ketchup' };
  const BASE = 149;

  function updateBurger() {
    const priceEl = document.querySelector('.burger-price');
    const ingEl = document.querySelector('.burger-ingredients');
    const nameEl = document.querySelector('.burger-name');
    if (!priceEl) return;
    let total = BASE;
    Object.keys(selections).forEach(k => total += (basePrice[k]?.[selections[k]] || 0));
    priceEl.textContent = `₹${total}`;
    const pattyEmoji = { 'Veg Patty': '🥦', 'Paneer Patty': '🧀', 'Beef Patty': '🥩', 'Double Patty': '🥩🥩' };
    ingEl.innerHTML = `${selections.bun} · ${selections.patty} · ${selections.cheese !== 'No Cheese' ? selections.cheese : 'No Cheese'} · ${selections.sauce}`;
    nameEl.textContent = selections.patty === 'Double Patty' ? 'The Monster Burger' : `${selections.patty.replace(' Patty','')} ${selections.cheese !== 'No Cheese' ? selections.cheese.replace(' Cheese','') : ''} Burger`;
  }

  builderChoices.forEach(choice => {
    choice.addEventListener('click', () => {
      const group = choice.dataset.group;
      document.querySelectorAll(`.builder-choice[data-group="${group}"]`).forEach(c => c.classList.remove('selected'));
      choice.classList.add('selected');
      selections[group] = choice.textContent.trim();
      updateBurger();
      const visual = document.querySelector('.burger-visual');
      if (visual) { visual.style.transform = 'scale(1.2)'; setTimeout(() => visual.style.transform = '', 300); }
    });
  });
  updateBurger();
}

// ── Contact form ──
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast("Message sent! We'll get back to you soon.");
    contactForm.reset();
  });
}

// ── Reservation form ──
const resForm = document.getElementById('resForm');
if (resForm) {
  resForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Table reserved! Confirmation SMS sent.');
    resForm.reset();
  });
}

// ── Counter animation ──
function animateCounters() {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current + suffix;
      if (current === target) clearInterval(timer);
    }, 25);
  });
}
const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) animateCounters();
  }, { threshold: 0.5 }).observe(statsSection);
}

// ── Gallery lightbox ──
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (!img) return;
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
    const bigImg = document.createElement('img');
    bigImg.src = img.src;
    bigImg.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:12px;object-fit:contain;';
    overlay.appendChild(bigImg);
    overlay.addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
  });
});

// keyframe for menu filter
const style = document.createElement('style');
style.textContent = '@keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }';
document.head.appendChild(style);
