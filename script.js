'use strict';

// DOM Elements
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelectorAll('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const modalForm = document.querySelector('.modal__form');
const inputFirstName = document.querySelector('.login__input--first-name');
const inputLastName = document.querySelector('.login__input--last-name');
const inputEmail = document.querySelector('.login__input--email');

// Debug selectors
console.log('modal:', modal);
console.log('overlay:', overlay);
console.log('btnCloseModal:', btnCloseModal);
console.log('btnsOpenModal:', btnsOpenModal);
console.log('modalForm:', modalForm);

// Modal window
const openModal = function (e) {
  if (modal && overlay) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  } else {
    console.error('Modal or overlay not found!');
  }
};

const closeModal = function () {
  if (modal && overlay) {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  } else {
    console.error('Modal or overlay not found!');
  }
};

if (btnsOpenModal.length > 0) {
  btnsOpenModal.forEach(btn => {
    btn.addEventListener('click', openModal);
  });
} else {
  console.error('No elements with btn--show-modal found!');
}

if (btnCloseModal.length > 0) {
  btnCloseModal.forEach(btn => btn.addEventListener('click', closeModal));
} else {
  console.error('btnCloseModal not found!');
}

if (overlay) {
  overlay.addEventListener('click', closeModal);
} else {
  console.error('overlay not found!');
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

if (modalForm) {
  modalForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const firstName = inputFirstName.value.trim();
    const lastName = inputLastName.value.trim();
    const email = inputEmail.value.trim();
    if (firstName && lastName && email) {
      const username = (firstName[0] + lastName[0]).toLowerCase();
      const pin = (firstName.slice(0, 2) + lastName.slice(0, 2)).toLowerCase();
      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      alert(
        `Hesabınız oluşturuldu!\nKullanıcı adınız: ${username}\nŞifreniz: ${pin}\nDoğrulama Kodu: ${verificationCode}\nLütfen bu kodu e-posta ile doğrulayın.`
      );
      const newAccount = {
        owner: `${firstName} ${lastName}`,
        username: username,
        movements: [500],
        interestRate: 1.2,
        pin: pin,
        movementsDates: [new Date().toISOString()],
        currency: 'TRY',
        locale: 'tr-TR',
      };
      let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
      if (!accounts.some(acc => acc.username === username)) {
        accounts.push(newAccount);
        localStorage.setItem('accounts', JSON.stringify(accounts));
      }
      sessionStorage.setItem('loginData', JSON.stringify(newAccount));
      inputFirstName.value = inputLastName.value = inputEmail.value = '';
      closeModal();
      window.location.href = './module/final1/bank.html';
    } else {
      alert('Lütfen tüm alanları doldurun!');
    }
  });
}

// Button scrolling
if (btnScrollTo) {
  btnScrollTo.addEventListener('click', function () {
    section1.scrollIntoView({ behavior: 'smooth' });
  });
} else {
  console.error('btnScrollTo not found!');
}

// Page navigation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('sign-in-link') &&
    !e.target.classList.contains('btn--show-modal')
  ) {
    const id = e.target.getAttribute('href');
    if (id && id !== '#' && id !== 'javascript:void(0)') {
      const targetElement = document.querySelector(id);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
});

// Tabbed component
if (tabsContainer) {
  tabsContainer.addEventListener('click', function (e) {
    const clicked = e.target.closest('.operations__tab');
    if (!clicked) return;
    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    tabsContent.forEach(c => c.classList.remove('operations__content--active'));
    clicked.classList.add('operations__tab--active');
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add('operations__content--active');
  });
}

// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
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

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  let curSlide = 0;
  const maxSlide = slides.length;
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
  if (btnRight) btnRight.addEventListener('click', nextSlide);
  if (btnLeft) btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });
  if (dotContainer) {
    dotContainer.addEventListener('click', function (e) {
      if (e.target.classList.contains('dots__dot')) {
        curSlide = Number(e.target.dataset.slide);
        goToSlide(curSlide);
        activateDot(curSlide);
      }
    });
  }
};
slider();
