'use strict';

// DOM Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnsFilter = document.querySelectorAll('.btn--filter');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelectorAll('.btn--close-modal');
const modalForm = document.querySelector('.modal__form');
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const inputFirstName = document.querySelector('.login__input--first-name');
const inputLastName = document.querySelector('.login__input--last-name');
const inputEmail = document.querySelector('.login__input--email');
const usernameList = document.querySelector('#usernames');

// Data
let accounts = [
  {
    owner: 'Ahmet Yılmaz',
    username: 'ay',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2,
    pin: 'ahya',
    movementsDates: [
      '2019-11-18T21:31:17.178Z',
      '2019-12-23T07:42:02.383Z',
      '2020-01-28T09:15:04.904Z',
      '2020-04-01T10:17:24.185Z',
      '2020-05-08T14:11:59.604Z',
      '2020-07-26T17:01:17.194Z',
      '2020-07-28T23:36:17.929Z',
      '2020-08-01T10:51:36.790Z',
    ],
    currency: 'TRY',
    locale: 'tr-TR',
  },
  {
    owner: 'Elif Kaya',
    username: 'ek',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 'elka',
    movementsDates: [
      '2019-11-01T13:15:33.035Z',
      '2019-11-30T09:48:16.867Z',
      '2019-12-25T06:04:23.907Z',
      '2020-01-25T14:18:46.235Z',
      '2020-02-05T16:33:06.386Z',
      '2020-04-10T14:43:26.374Z',
      '2020-06-25T18:49:59.371Z',
      '2020-07-26T12:01:20.894Z',
    ],
    currency: 'TRY',
    locale: 'tr-TR',
  },
];

// localStorage'dan hesapları yükle
const loadAccounts = function () {
  const storedAccounts = localStorage.getItem('accounts');
  if (storedAccounts) {
    accounts = JSON.parse(storedAccounts);
  }
  // index.html'den gelen veriyi ekle
  const loginData = JSON.parse(sessionStorage.getItem('loginData'));
  if (loginData && !accounts.some(acc => acc.username === loginData.username)) {
    accounts.push({
      owner: loginData.owner,
      username: loginData.username,
      movements: [1000],
      interestRate: 1.2,
      pin: loginData.pin,
      movementsDates: [new Date().toISOString()],
      currency: 'TRY',
      locale: 'tr-TR',
    });
    localStorage.setItem('accounts', JSON.stringify(accounts));
  }
};
loadAccounts();

// Functions
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    if (!acc.username) {
      acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join('');
    }
  });
};
createUsernames(accounts);

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Bugün';
  if (daysPassed === 1) return 'Dün';
  if (daysPassed <= 7) return `${daysPassed} gün önce`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false, filter = 'all') {
  containerMovements.innerHTML = '';
  let combinedMovsDates = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: acc.movementsDates.at(i),
  }));
  if (filter === 'deposit') {
    combinedMovsDates = combinedMovsDates.filter(obj => obj.movement > 0);
  } else if (filter === 'withdrawal') {
    combinedMovsDates = combinedMovsDates.filter(obj => obj.movement < 0);
  }
  if (sort) combinedMovsDates.sort((a, b) => a.movement - b.movement);
  combinedMovsDates.forEach(function (obj, i) {
    const { movement, movementDate } = obj;
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const typeText = movement > 0 ? 'Para Yatırma' : 'Para Çekme';
    const date = new Date(movementDate);
    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMov = formatCur(movement, acc.locale, acc.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${typeText}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const updateUsernameList = function () {
  usernameList.innerHTML = '';
  accounts.forEach(acc => {
    const option = document.createElement('option');
    option.value = acc.username;
    usernameList.appendChild(option);
  });
};
updateUsernameList();

const calcCreditScore = function (acc) {
  const totalDeposits = acc.movements
    .filter(mov => mov > 0)
    .reduce((sum, mov) => sum + mov, 0);
  const totalWithdrawals = Math.abs(
    acc.movements.filter(mov => mov < 0).reduce((sum, mov) => sum + mov, 0)
  );
  const transactionCount = acc.movements.length;
  const score = Math.min(
    1000,
    Math.round(
      (totalDeposits * 0.5) / (totalWithdrawals + 1) + transactionCount * 10
    )
  );
  return score;
};

const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
  updateUsernameList();
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Başlamak için giriş yapın';
      containerApp.style.opacity = 0;
    }
    time--;
  };
  let time = 300; // 5 dakika
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

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
}

if (btnCloseModal.length > 0) {
  btnCloseModal.forEach(btn => btn.addEventListener('click', closeModal));
}

if (overlay) {
  overlay.addEventListener('click', closeModal);
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
      accounts.push({
        owner: `${firstName} ${lastName}`,
        username: username,
        movements: [500],
        interestRate: 1.2,
        pin: pin,
        movementsDates: [new Date().toISOString()],
        currency: 'TRY',
        locale: 'tr-TR',
      });
      localStorage.setItem('accounts', JSON.stringify(accounts));
      updateUsernameList();
      inputFirstName.value = inputLastName.value = inputEmail.value = '';
      closeModal();
    } else {
      alert('Lütfen tüm alanları doldurun!');
    }
  });
}

// Event handlers
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === inputLoginPin.value) {
    labelWelcome.textContent = `Hoş geldiniz, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
  } else {
    alert('Kullanıcı adı veya şifre yanlış!');
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    localStorage.setItem('accounts', JSON.stringify(accounts));
    updateUI(currentAccount);
    clearInterval(timer);
    timer = startLogOutTimer();
    inputTransferAmount.value = inputTransferTo.value = '';
    alert(
      `Transfer başarılı! ${receiverAcc.owner}'a ${formatCur(
        amount,
        currentAccount.locale,
        currentAccount.currency
      )} gönderildi.`
    );
  } else {
    alert('Geçersiz transfer! Lütfen alıcıyı ve miktarı kontrol edin.');
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  const creditScore = calcCreditScore(currentAccount);
  const maxLoan = creditScore * 100;
  if (amount > 0 && amount <= maxLoan) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      localStorage.setItem('accounts', JSON.stringify(accounts));
      updateUI(currentAccount);
      clearInterval(timer);
      timer = startLogOutTimer();
      alert(
        `Kredi onaylandı! ${formatCur(
          amount,
          currentAccount.locale,
          currentAccount.currency
        )} hesabınıza eklendi.`
      );
    }, 2500);
  } else {
    alert(
      `Kredi talebiniz reddedildi. Kredi puanınız: ${creditScore}. Maksimum kredi: ${formatCur(
        maxLoan,
        currentAccount.locale,
        currentAccount.currency
      )}.`
    );
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    localStorage.setItem('accounts', JSON.stringify(accounts));
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Başlamak için giriş yapın';
    alert('Hesabınız başarıyla kapatıldı.');
  } else {
    alert('Hesap kapatma işlemi başarısız. Bilgileri kontrol edin.');
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  const currentFilter =
    document.querySelector('.btn--filter--active')?.dataset.filter || 'all';
  displayMovements(currentAccount, !sorted, currentFilter);
  sorted = !sorted;
});

btnsFilter.forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    btnsFilter.forEach(b => b.classList.remove('btn--filter--active'));
    btn.classList.add('btn--filter--active');
    displayMovements(currentAccount, sorted, btn.dataset.filter);
  });
});
