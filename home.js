const wrapper = document.querySelector('.wrapper');
      const loginLink = document.querySelector('.register-link');
      const registerLink = document.querySelector('.login-link');
      const btnPopup = document.querySelector('#signInBtn');
      const iconClose = document.querySelector('.icon-close');
      const loginForm = document.getElementById('loginForm');
      const registerForm = document.getElementById('registerForm');
      const watchNowBtn = document.getElementById('watchNowBtn');

      // Redirect to index1.html if the user is already logged in
      document.addEventListener('DOMContentLoaded', () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          window.location.href = 'index1.html'; // Redirect to the main website
        }
      });

      loginLink?.addEventListener('click', (e) => {
        e.preventDefault();
        wrapper.classList.add('active');
      });

      registerLink?.addEventListener('click', (e) => {
        e.preventDefault();
        wrapper.classList.remove('active');
      });

      btnPopup.addEventListener('click', (e) => {
        e.preventDefault();
        wrapper.classList.add('active-popup');
      });

      iconClose.addEventListener('click', () => {
        wrapper.classList.remove('active-popup');
      });

      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const user = JSON.parse(localStorage.getItem('user'));

        if (user && user.email === email && user.password === password) {
          alert('Login successful!');
          wrapper.classList.remove('active-popup');
          window.location.href = 'index1.html'; // Redirect to the main website after login
        } else {
          alert('Invalid email or password');
        }
      });

      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        const user = { username, email, password };
        localStorage.setItem('user', JSON.stringify(user));
        alert('Registration successful! Please login.');
        wrapper.classList.remove('active');
      });