// Check if user is already logged in
function checkLogin() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        // Redirect to feed if already logged in
        window.location.href = '../pages/feed.html';
    }
}

// Navigate to authentication page
function navigateToAuth() {
    window.location.href = '../pages/auth.html';
}

// Check login status on page load
checkLogin();
