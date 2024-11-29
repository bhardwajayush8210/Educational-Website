
// Simulated user database (replace with actual backend integration)
const users = [];

// DOM elements
const authButton = document.getElementById('authButton');
const authModal = document.getElementById('authModal');
const signInForm = document.getElementById('signInForm');
const signUpForm = document.getElementById('signUpForm');
const showSignUpLink = document.getElementById('showSignUp');
const showSignInLink = document.getElementById('showSignIn');

// Event listeners for switching between sign in and sign up forms
showSignUpLink.addEventListener('click', (e) => {
    e.preventDefault();
    signInForm.classList.add('hidden');
    signUpForm.classList.remove('hidden');
});

showSignInLink.addEventListener('click', (e) => {
    e.preventDefault();
    signUpForm.classList.add('hidden');
    signInForm.classList.remove('hidden');
});

// Function to toggle auth modal visibility
function toggleAuthModal() {
    authModal.classList.toggle('hidden');
}

// Event listener for auth button
authButton.addEventListener('click', toggleAuthModal);

// Function to handle sign in
function handleSignIn(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        alert(`Welcome back, ${user.name}!`);
        toggleAuthModal();
        updateUIForAuthenticatedUser(user);
    } else {
        alert('Invalid email or password.');
    }
}

// Function to handle sign up
function handleSignUp(name, email, password, role) {
    if (users.some(u => u.email === email)) {
        alert('Email already in use.');
        return;
    }
    const newUser = { name, email, password, role };
    users.push(newUser);
    alert('Account created successfully! Please sign in.');
    signUpForm.classList.add('hidden');
    signInForm.classList.remove('hidden');
}

// Event listener for sign in form submission
document.getElementById('signInSubmit').addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;
    handleSignIn(email, password);
});

// Event listener for sign up form submission
document.getElementById('signUpSubmit').addEventListener('click', (e) => {
    e.preventDefault();
    const name = document.getElementById('signUpName').value;
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    const role = document.getElementById('signUpRole').value;
    handleSignUp(name, email, password, role);
});

// Function to update UI for authenticated user
function updateUIForAuthenticatedUser(user) {
    authButton.textContent = Welcome, `${user.name}`;
    if (user.role === 'teacher') {
        window.eduQuestApp.toggleTeacherDashboard(true);
    } else {
        window.eduQuestApp.toggleTeacherDashboard(false);
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        toggleAuthModal();
    }
});
