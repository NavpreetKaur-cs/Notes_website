// Handle Login
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const res = await fetch('https://notes-backend-mfjc.onrender.com/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem('token', data.token);
          document.getElementById('message').textContent = 'Login successful!';
          window.location.href = 'dashboard.html';
        } else {
          document.getElementById('message').textContent = data.message;
        }
      } catch (err) {
        document.getElementById('message').textContent = 'Server error. Please try again.';
      }
    });
  }

  // Handle Signup
  if (registerForm) {
    registerForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const res = await fetch('https://notes-backend-mfjc.onrender.com/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem('token', data.token);
          document.getElementById('message').textContent = 'Signup successful!';
          window.location.href = 'dashboard.html';
        } else {
          document.getElementById('message').textContent = data.message;
        }
      } catch (err) {
        document.getElementById('message').textContent = 'Server error. Please try again.';
      }
    });
  }
});