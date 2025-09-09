// Handle login form submission
document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Get form values
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();

      // Validate inputs
      if (!username || !password) {
        alert('Lütfen tüm alanları doldurun.');
        return;
      }

      // Get accounts from localStorage
      const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');

      // Find user
      const user = accounts.find(
        account =>
          account.username === username && account.password === password
      );

      if (user) {
        // Save current user to localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));

        // Redirect to bank page
        window.location.href = 'bank.html';
      } else {
        alert('Hatalı kullanıcı adı veya şifre.');
      }
    });
  }
});
