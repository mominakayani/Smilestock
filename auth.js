// User authentication handling
class Auth {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
    }

    // Save users to localStorage
    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    // Sign up new user
    signup(username, email, password) {
        // Check if user already exists
        if (this.users.find(user => user.email === email)) {
            return { success: false, message: 'Email already registered' };
        }

        // Create new user
        const newUser = {
            username,
            email,
            password, // In a real application, this should be hashed
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsers();
        return { success: true, message: 'Signup successful' };
    }

    // Login user
    login(email, password) {
        const user = this.users.find(user => user.email === email && user.password === password);
        if (user) {
            // Store logged in user info
            localStorage.setItem('currentUser', JSON.stringify({
                username: user.username,
                email: user.email
            }));
            return { success: true, message: 'Login successful' };
        }
        return { success: false, message: 'Invalid email or password' };
    }

    // Check if user is logged in
    isLoggedIn() {
        return localStorage.getItem('currentUser') !== null;
    }

    // Get current user
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    // Logout user
    logout() {
        localStorage.removeItem('currentUser');
    }
}

// Initialize auth
const auth = new Auth();

// Handle form submissions
document.addEventListener('DOMContentLoaded', () => {
    // Signup form handling
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const result = auth.signup(username, email, password);
            if (result.success) {
                alert(result.message);
                window.location.href = 'login.html';
            } else {
                alert(result.message);
            }
        });
    }

    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            const result = auth.login(email, password);
            if (result.success) {
                alert(result.message);
                window.location.href = 'checkout.html';
            } else {
                alert(result.message);
            }
        });
    }

    // Update navigation based on login status
    const updateNavigation = () => {
        const loginLink = document.querySelector('a[href="login.html"]');
        if (loginLink) {
            if (auth.isLoggedIn()) {
                loginLink.textContent = 'Logout';
                loginLink.href = '#';
                loginLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    auth.logout();
                    window.location.reload();
                });
            } else {
                loginLink.textContent = 'Login';
                loginLink.href = 'login.html';
            }
        }
    };

    updateNavigation();
}); 