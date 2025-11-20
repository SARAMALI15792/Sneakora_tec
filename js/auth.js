const modal = document.getElementById('authModal');
const loginBtn = document.getElementById('loginBtn');
const closeBtn = document.getElementsByClassName('close')[0];
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Modal Logic
loginBtn.onclick = function () {
    modal.style.display = "block";
}

closeBtn.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function toggleAuthMode() {
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

// API Calls
async function register() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if (res.ok) {
        showToast('Registration successful! Please login.', 'success');
        toggleAuthMode();
        // Clear form
        document.getElementById('regName').value = '';
        document.getElementById('regEmail').value = '';
        document.getElementById('regPassword').value = '';
    } else {
        showToast('Error: ' + data.error, 'error');
    }
}

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
        showToast('Welcome back, ' + data.name + '!', 'success');
        localStorage.setItem('user', JSON.stringify(data));
        modal.style.display = "none";
        updateUI();
        // Clear form
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
    } else {
        showToast('Error: ' + data.error, 'error');
    }
}

function logout() {
    const user = JSON.parse(localStorage.getItem('user'));
    localStorage.removeItem('user');
    showToast(`Goodbye, ${user?.name || 'User'}! See you soon.`, 'info');

    // Update UI
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

function updateUI() {
    const user = JSON.parse(localStorage.getItem('user'));
    const logoutBtn = document.getElementById('logoutBtn');

    if (user) {
        // User is logged in
        loginBtn.textContent = `Hi, ${user.name}`;
        loginBtn.style.display = 'none';

        if (logoutBtn) {
            logoutBtn.style.display = 'block';
            logoutBtn.onclick = logout;
        }
    } else {
        // User is not logged in
        loginBtn.textContent = 'Login';
        loginBtn.style.display = 'block';
        loginBtn.onclick = function () {
            modal.style.display = "block";
        };

        if (logoutBtn) {
            logoutBtn.style.display = 'none';
        }
    }
}

// Init
updateUI();
