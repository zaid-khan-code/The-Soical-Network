// Track whether we're in login or signup mode
let isLogin = true;

// Toggle between login and signup modes
function toggleMode() {
    isLogin = !isLogin;

    // Get all form elements
    const nameGroup = document.getElementById('name-group');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const submitText = document.getElementById('submit-text');
    const toggleQuestion = document.getElementById('toggle-question');
    const toggleLinkText = document.getElementById('toggle-link-text');

    // Update UI based on mode
    if (isLogin) {
        // Login mode
        nameGroup.style.display = 'none';
        authTitle.textContent = 'Welcome Back';
        authSubtitle.textContent = 'Sign in to continue your journey';
        submitText.textContent = 'Sign In';
        toggleQuestion.textContent = "Don't have an account? ";
        toggleLinkText.textContent = 'Sign Up';
    } else {
        // Signup mode
        nameGroup.style.display = 'flex';
        authTitle.textContent = 'Join Us';
        authSubtitle.textContent = 'Create your account today';
        submitText.textContent = 'Create Account';
        toggleQuestion.textContent = 'Already have an account? ';
        toggleLinkText.textContent = 'Sign In';
    }

    // Clear form fields
    document.getElementById('auth-form').reset();
}

// Show toast notification message
function showToast(message, type) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Handle form submission for both login and signup
function handleSubmit(event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Basic validation
    if (!email || !password || (!isLogin && !name)) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    if (isLogin) {
        // Login flow
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            // Login successful
            localStorage.setItem('currentUser', JSON.stringify(user));
            showToast(`Welcome back, ${user.name}!`, 'success');
            setTimeout(() => {
                window.location.href = '../pages/feed.html';
            }, 1000);
        } else {
            // Login failed
            showToast('Invalid email or password', 'error');
        }
    } else {
        // Signup flow
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Check if email already exists
        if (users.some(u => u.email === email)) {
            showToast('Email already exists', 'error');
            return;
        }

        // Create new user with auto-generated avatar
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        };

        // Save user and log them in
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        showToast(`Account created! Welcome, ${name}!`, 'success');
        setTimeout(() => {
            window.location.href = '../pages/feed.html';
        }, 1000);
    }
}
