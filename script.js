'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Registration form handling
const modalForm = document.querySelector('.modal__form');
const inputFirstName = document.querySelector('.login__input--first-name');
const inputLastName = document.querySelector('.login__input--last-name');
const inputEmail = document.querySelector('.login__input--email');

modalForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const firstName = inputFirstName.value.trim();
  const lastName = inputLastName.value.trim();
  const email = inputEmail.value.trim();

  // Validate inputs
  if (!firstName || !lastName || !email) {
    alert('Lütfen tüm alanları doldurun.');
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Lütfen geçerli bir e-posta adresi girin.');
    return;
  }

  // Generate username and password
  const username = firstName.charAt(0).toLowerCase() + lastName.toLowerCase();
  const password =
    firstName.slice(0, 2).toLowerCase() + lastName.slice(0, 2).toLowerCase();

  // Get existing accounts from localStorage or initialize empty array
  const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');

  // Check if user already exists
  const existingUser = accounts.find(account => account.username === username);
  if (existingUser) {
    alert(
      'Bu kullanıcı adı zaten mevcut. Lütfen farklı bilgilerle tekrar deneyin.'
    );
    return;
  }

  // Create new account with initial balance of 1000 TL and empty transactions
  const newAccount = {
    owner: `${firstName} ${lastName}`,
    username: username,
    password: password,
    email: email,
    balance: 1000, // Set initial balance to 1000 TL
    movements: [1000], // Add initial deposit to movements
    movementsDates: [new Date().toISOString()], // Add date for initial deposit
    interestRate: 1.2,
    currency: 'TRY',
    locale: 'tr-TR',
  };

  // Add new account to accounts array
  accounts.push(newAccount);

  // Save updated accounts to localStorage
  localStorage.setItem('accounts', JSON.stringify(accounts));

  // Show credentials to user in an alert
  alert(
    `Hesabınız oluşturuldu!\nKullanıcı adınız: ${username}\nŞifreniz: ${password}`
  );

  // Clear form fields
  inputFirstName.value = inputLastName.value = inputEmail.value = '';

  // Close modal
  closeModal();

  // Redirect to bank page after a short delay to allow user to read the alert
  setTimeout(() => {
    window.location.href = 'module/final1/bank.html';
  }, 1000);
});

// Smooth scrolling for "Daha Fazla Bilgi" button
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Tabbed component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));
