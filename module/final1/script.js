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
const logoutBtn = document.querySelector('.logout-btn');
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const usernameList = document.querySelector('#usernames');

// Currency conversion rates (simplified for demo)
const exchangeRates = {
  TRY: 1,
  USD: 0.031, // 1 TRY = 0.031 USD
  EUR: 0.028, // 1 TRY = 0.028 EUR
};

// Current currency (default is TRY)
let currentCurrency = 'TRY';

// Data
let accounts = [];
let currentAccount, timer;
let sorted = false;

// Load accounts from localStorage
function loadAccounts() {
  const storedAccounts = localStorage.getItem('accounts');
  if (storedAccounts) {
    accounts = JSON.parse(storedAccounts);
  }
}
loadAccounts();

// Convert currency
function convertCurrency(amount, fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) return amount;

  // Convert to TRY first
  let amountInTRY = amount;
  if (fromCurrency !== 'TRY') {
    amountInTRY = amount / exchangeRates[fromCurrency];
  }

  // Convert to target currency
  if (toCurrency === 'TRY') {
    return amountInTRY;
  } else {
    return amountInTRY * exchangeRates[toCurrency];
  }
}

// Format movement date
function formatMovementDate(date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Bugün';
  if (daysPassed === 1) return 'Dün';
  if (daysPassed <= 7) return `${daysPassed} gün önce`;
  return new Intl.DateTimeFormat('tr-TR').format(date);
}

// Format currency
function formatCur(value, currency = currentCurrency) {
  // Convert value to current currency
  const convertedValue = convertCurrency(value, 'TRY', currency);

  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency,
  }).format(convertedValue);
}

// Display movements
function displayMovements(acc, filter = 'all') {
  containerMovements.innerHTML = '';

  let movs = acc.movements.map((mov, i) => ({
    movement: mov,
    date: new Date(acc.movementsDates[i]),
  }));

  // Apply filter
  if (filter === 'deposit') {
    movs = movs.filter(mov => mov.movement > 0);
  } else if (filter === 'withdrawal') {
    movs = movs.filter(mov => mov.movement < 0);
  }

  // Apply sorting
  if (sorted) movs.sort((a, b) => a.movement - b.movement);

  movs.forEach(function (mov, i) {
    const type = mov.movement > 0 ? 'deposit' : 'withdrawal';
    const typeText = mov.movement > 0 ? 'Para Yatırma' : 'Para Çekme';
    const displayDate = formatMovementDate(mov.date);
    const formattedMov = formatCur(Math.abs(mov.movement));

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
}

// Calculate and display balance
function calcDisplayBalance(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance);
}

// Calculate and display summary
function calcDisplaySummary(acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out));

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest);
}

// Update username list for transfers
function updateUsernameList() {
  usernameList.innerHTML = '';
  accounts.forEach(acc => {
    if (acc.username !== currentAccount.username) {
      const option = document.createElement('option');
      option.value = acc.username;
      usernameList.appendChild(option);
    }
  });
}

// Calculate credit score
function calculateCreditScore(acc) {
  const totalDeposits = acc.movements
    .filter(mov => mov > 0)
    .reduce((sum, mov) => sum + mov, 0);
  const totalWithdrawals = Math.abs(
    acc.movements.filter(mov => mov < 0).reduce((sum, mov) => sum + mov, 0)
  );
  const transactionCount = acc.movements.length;
  const score = Math.min(
    100,
    Math.round(
      (totalDeposits * 0.5) / (totalWithdrawals + 1) + transactionCount * 2
    )
  );
  return score;
}

// Update UI
function updateUI(acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
  updateUsernameList();
}

// Start logout timer
function startLogOutTimer() {
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

  let time = 300; // 5 minutes
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}

// Save account data to localStorage
function saveAccounts() {
  localStorage.setItem('accounts', JSON.stringify(accounts));
}

// Event handlers
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.password === inputLoginPin.value) {
    labelWelcome.textContent = `Hoş geldiniz, ${currentAccount.username}`;
    containerApp.style.opacity = 100;
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat('tr-TR', options).format(
      now
    );

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
  } else {
    alert('Hatalı kullanıcı adı veya şifre.');
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  // Convert amount to TRY for processing
  const amountInTRY = convertCurrency(amount, currentCurrency, 'TRY');

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amountInTRY &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Add transfer to current user
    currentAccount.movements.push(-amountInTRY);
    currentAccount.movementsDates.push(new Date().toISOString());

    // Add transfer to receiver
    receiverAcc.movements.push(amountInTRY);
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Save data
    saveAccounts();

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();

    // Clear form
    inputTransferAmount.value = inputTransferTo.value = '';

    alert(
      `Transfer başarılı! ${receiverAcc.username}'a ${formatCur(
        amountInTRY,
        'TRY'
      )} gönderildi.`
    );
  } else {
    alert('Geçersiz transfer! Lütfen alıcıyı ve miktarı kontrol edin.');
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  // Convert amount to TRY for processing
  const amountInTRY = convertCurrency(amount, currentCurrency, 'TRY');

  const creditScore = calculateCreditScore(currentAccount);
  const maxLoan = creditScore * 100;

  if (amount > 0 && amountInTRY <= maxLoan) {
    setTimeout(function () {
      // Add loan to current user
      currentAccount.movements.push(amountInTRY);
      currentAccount.movementsDates.push(new Date().toISOString());

      // Save data
      saveAccounts();

      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();

      alert(
        `Kredi onaylandı! ${formatCur(amountInTRY, 'TRY')} hesabınıza eklendi.`
      );
    }, 2500);
  } else {
    alert(
      `Kredi talebiniz reddedildi. Kredi puanınız: ${creditScore}. Maksimum kredi: ${formatCur(
        maxLoan,
        'TRY'
      )}.`
    );
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    inputClosePin.value === currentAccount.password
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    saveAccounts();
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Başlamak için giriş yapın';
    alert('Hesabınız başarıyla kapatıldı.');
  } else {
    alert('Hesap kapatma işlemi başarısız. Bilgileri kontrol edin.');
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(
    currentAccount,
    document.querySelector('.btn--filter--active')?.dataset.filter || 'all'
  );
  sorted = !sorted;
});

btnsFilter.forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    btnsFilter.forEach(b => b.classList.remove('btn--filter--active'));
    btn.classList.add('btn--filter--active');
    displayMovements(currentAccount, btn.dataset.filter);
  });
});

// Add currency selector
const currencySelector = document.createElement('select');
currencySelector.id = 'currency-selector';
currencySelector.innerHTML = `
  <option value="TRY">TRY (₺)</option>
  <option value="USD">USD ($)</option>
  <option value="EUR">EUR (€)</option>
`;
currencySelector.style.cssText = `
  position: absolute;
  top: 2rem;
  right: 2rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #ddd;
  font-family: inherit;
  font-size: 1.2rem;
`;

// Add currency selector to the app
document.querySelector('.app').prepend(currencySelector);

// Handle currency change
currencySelector.addEventListener('change', function () {
  currentCurrency = this.value;
  updateUI(currentAccount);
});

// Logout button
logoutBtn.addEventListener('click', function () {
  localStorage.removeItem('currentUser');
  window.location.href = '../../index.html';
});

// Lazy loading implementation
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
