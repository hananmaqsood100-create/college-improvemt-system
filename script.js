// ==================== PASSWORD VISIBILITY TOGGLE ====================
function togglePassword(fieldId = 'password') {
    const passwordField = document.getElementById(fieldId);
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        if (eyeIcon) eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        if (eyeIcon) eyeIcon.classList.remove('fa-eye-slash');
    }
}

// ==================== LOGIN HANDLER ====================
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validation
    if (!email || !password) {
        showAlert('Please fill in all fields', 'danger');
        return;
    }
    
    // Simulate login (Replace with actual API call)
    console.log('Login attempt:', { email, password, rememberMe });
    
    // Show success message
    showAlert('Login successful! Redirecting...', 'success');
    
    // Redirect after delay
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

// ==================== REGISTER HANDLER ====================


// ==================== FEEDBACK FORM HANDLERS ====================
function updateSubcategory() {
    const category = document.getElementById('category').value;
    const subcategorySelect = document.getElementById('subcategory');
    
    const subcategories = {
        infrastructure: ['Classrooms', 'Laboratories', 'Library', 'Cafeteria', 'Parking', 'Washrooms'],
        academic: ['Course Content', 'Teaching Quality', 'Assignments', 'Exams', 'Study Materials'],
        faculty: ['Faculty Availability', 'Communication', 'Support', 'Mentoring'],
        policies: ['Attendance', 'Fee Structure', 'Discipline', 'Leave Policy'],
        services: ['Registration', 'Admission', 'Financial Aid', 'Counseling']
    };
    
    subcategorySelect.innerHTML = '<option value="">-- Select Subcategory --</option>';
    
    if (category && subcategories[category]) {
        subcategories[category].forEach(sub => {
            const option = document.createElement('option');
            option.value = sub.toLowerCase();
            option.textContent = sub;
            subcategorySelect.appendChild(option);
        });
    }
}

function setRating(value) {
    document.getElementById('rating').value = value;
    const ratingText = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    document.getElementById('ratingText').textContent = ratingText[value];
    
    // Update stars
    const stars = document.querySelectorAll('#ratingStars i');
    stars.forEach((star, index) => {
        if (index < value) {
            star.classList.remove('far');
            star.classList.add('fas', 'active');
        } else {
            star.classList.add('far');
            star.classList.remove('fas', 'active');
        }
    });
}

// ==================== CHARACTER COUNTERS ====================
document.addEventListener('DOMContentLoaded', function() {
    const titleInput = document.getElementById('title');
    if (titleInput) {
        titleInput.addEventListener('keyup', function() {
            document.getElementById('titleCount').textContent = this.value.length;
        });
    }
    
    const descInput = document.getElementById('description');
    if (descInput) {
        descInput.addEventListener('keyup', function() {
            document.getElementById('descCount').textContent = this.value.length;
        });
    }
});

// ==================== ALERT MESSAGES ====================
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.appendChild(alertDiv);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// ==================== FAQ SEARCH ====================
function searchFAQ() {
    const searchTerm = document.getElementById('faqSearch')?.value.toLowerCase().trim() || '';
    const faqItems   = document.querySelectorAll('.accordion-item');
    let   visibleCount = 0;

    faqItems.forEach(item => {
        const question = item.querySelector('.accordion-button')?.textContent.toLowerCase() || '';
        const answer   = item.querySelector('.accordion-body')?.textContent.toLowerCase()  || '';

        const matches = question.includes(searchTerm) || answer.includes(searchTerm);
        item.style.display = matches ? '' : 'none';
        if (matches) visibleCount++;
    });

    // No results message
    let noResult = document.getElementById('faqNoResult');
    if (!noResult) {
        noResult = document.createElement('div');
        noResult.id = 'faqNoResult';
        noResult.style.cssText = 'text-align:center; padding:20px; color:#666; font-size:16px;';
        document.querySelector('#faqAccordion').after(noResult);
    }

    if (searchTerm && visibleCount === 0) {
        noResult.innerHTML = '😕 <b>"' + searchTerm + '"</b> ke liye koi result nahi mila. <br><small>Chatbot se poochein!</small>';
        noResult.style.display = 'block';
    } else {
        noResult.style.display = 'none';
    }
}

// ==================== CHATBOT FUNCTIONS ====================
function sendMessage(event) {
    event.preventDefault();
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    userInput.value = '';
    userInput.focus();
    
    // Simulate bot response
    setTimeout(() => {
        const botResponse = getBotResponse(message);
        addMessage(botResponse, 'bot');
    }, 500);
}

function addMessage(text, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-content">${text}</div>
        <div class="message-time">${currentTime}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function quickReply(question) {
    document.getElementById('userInput').value = question;
    const form = document.querySelector('.chat-input-area form');
    form.dispatchEvent(new Event('submit'));
}

function getBotResponse(message) {
    const responses = {
        'feedback': 'To submit feedback, click "Submit Feedback" from the menu. Fill in the form with your feedback details and submit. Your feedback is completely anonymous!',
        'anonymous': 'Yes! Your feedback is 100% anonymous. We never reveal your identity unless you provide your email for follow-up.',
        'password': 'To reset your password, click "Forgot Password" on the login page and follow the instructions sent to your email.',
        'account': 'To create an account, click "Register" and fill in your details using your college email. Verify your email and you\'re ready!',
        'category': 'We have 6 feedback categories: Infrastructure, Academic, Faculty, Policies, Services, and Other.',
        'rating': 'You can rate your feedback experience using a 5-star rating system.',
        'support': 'For support, you can email us at feedback@pgcmuridke.edu.pk or call +92-123-456-7890 (Mon-Fri, 9 AM - 5 PM)',
        'system': 'Our system works on all modern browsers (Chrome, Firefox, Safari, Edge) and is fully mobile responsive.',
        'default': 'I\'m here to help! You can ask me about submitting feedback, account issues, system features, or campus information. What would you like to know?'
    };
    
    const lowerMessage = message.toLowerCase();
    
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }
    
    return responses.default;
}

function clearChat() {
    document.getElementById('chatMessages').innerHTML = `
        <div class="message bot-message">
            <div class="message-content">
                <p>👋 Hello! I'm your Campus Feedback System Support Bot. How can I help you today?</p>
            </div>
            <div class="message-time">Now</div>
        </div>
    `;
}

// ==================== LOGOUT ====================
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'fyp.html';
    }
}

// ==================== EXPORT PDF (MOCK) ====================
function exportToPDF() {
    alert('PDF export feature will be implemented in Week 3 with backend integration');
}

// ==================== DASHBOARD CHARTS ====================
function initializeDashboardCharts() {
    // Pie Chart - Feedback by Category
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        new Chart(categoryCtx, {
            type: 'pie',
            data: {
                labels: ['Infrastructure', 'Academic', 'Faculty', 'Policies', 'Services', 'Other'],
                datasets: [{
                    data: [250, 300, 200, 180, 220, 95],
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb',
                        '#4facfe',
                        '#00f2fe',
                        '#43e97b'
                    ],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Bar Chart - Rating Distribution
    const ratingCtx = document.getElementById('ratingChart');
    if (ratingCtx) {
        new Chart(ratingCtx, {
            type: 'bar',
            data: {
                labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
                datasets: [{
                    label: 'Number of Ratings',
                    data: [45, 89, 156, 432, 523],
                    backgroundColor: '#667eea',
                    borderColor: '#667eea',
                    borderRadius: 5,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Line Chart - Feedback Trend
    const trendCtx = document.getElementById('trendChart');
    if (trendCtx) {
        new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10'],
                datasets: [{
                    label: 'Feedback Submitted',
                    data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: '#667eea'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Initialize charts when dashboard page loads
//if (document.readyState === 'loading') {
  //  document.addEventListener('DOMContentLoaded', function() {
    //    if (document.getElementById('categoryChart')) {
      //      initializeDashboardCharts();
        //}
    //});
//} else {
  //  if (document.getElementById('categoryChart')) {
    //    initializeDashboardCharts();
    //}
//}
// ============ CHECK USER LOGIN STATUS ON PAGE LOAD ============
document.addEventListener('DOMContentLoaded', function() {
  checkUserLoginStatus();
});

// ============ CHECK IF USER IS LOGGED IN ============
function checkUserLoginStatus() {
  const currentUser = localStorage.getItem('currentUser');
  
  const loggedInMenu = document.getElementById('loggedInMenu');
  const notLoggedInMenu = document.getElementById('notLoggedInMenu');

  if (currentUser) {
    // User is logged in
    if (loggedInMenu) loggedInMenu.style.display = 'flex';
    if (notLoggedInMenu) notLoggedInMenu.style.display = 'none';
    
    const userEmail = JSON.parse(currentUser).email;
    const userEmailDisplay = document.getElementById('userEmailDisplay');
    if (userEmailDisplay) {
      userEmailDisplay.textContent = userEmail;
    }
  } else {
    // User is not logged in
    if (loggedInMenu) loggedInMenu.style.display = 'none';
    if (notLoggedInMenu) notLoggedInMenu.style.display = 'flex';
  }
}

// ============ CHECK LOGIN AND REDIRECT ============
function checkLoginAndRedirect(page) {
  const currentUser = localStorage.getItem('currentUser');
  
  if (!currentUser) {
    // User not logged in - show modal
    showLoginModal();
    return false;
  } else {
    // User logged in - redirect
    window.location.href = page;
  }
}

// ============ SHOW LOGIN MODAL ============
function showLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

// ============ CLOSE LOGIN MODAL ============
function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// ============ LOGOUT FUNCTION ============
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'fyp.html';
}

// ============ REGISTER FUNCTION ============
function handleRegister(event) {
  event.preventDefault();

  const firstname = document.getElementById('firstname').value.trim();
const lastname = document.getElementById('lastname').value.trim();
const fullname = firstname + ' ' + lastname;
  const email = document.getElementById('email').value.trim();
  const role = document.getElementById('role').value;
  const department = document.getElementById('department').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const terms = document.getElementById('terms').checked;

  clearAllErrors();

  let isValid = true;

  if (fullname.length < 3) {
    showError('fullnameError', 'Full name must be at least 3 characters');
    isValid = false;
  }

const ALLOWED_DOMAIN = '@pgcmuridke.edu.pk';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
    showError('emailError', 'Please enter a valid email address');
    isValid = false;
} else if (!email.endsWith(ALLOWED_DOMAIN)) {
    showError('emailError', 'Sirf college email allowed hai! (@pgcmuridke.edu.pk)');
    isValid = false;
}

  

  if (password.length < 8) {
    showError('passwordError', 'Password must be at least 8 characters');
    isValid = false;
  }

  if (password !== confirmPassword) {
    showError('confirmError', 'Passwords do not match');
    isValid = false;
  }

  if (!terms) {
    showError('termsError', 'You must agree to the Terms and Conditions');
    isValid = false;
  }

  if (isValid) {
    // SAVE USER DATA TO localStorage
    fetch('http://127.0.0.1:5000/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: fullname,
        email: email,
        password: password,
        role: role
    })
})
.then(res => res.json())
.then(data => {
    if (data.message === 'User registered successfully!') {
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('successMessage').style.display = 'flex';
        setTimeout(() => { window.location.href = '/login.html'; }, 1500);
    } else {
        showError('generalError', data.message);
    }
})
.catch(err => {
    showError('generalError', 'Server se connection nahi ho raha!');
});

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
  }
}

// ============ LOGIN FUNCTION ============
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  clearAllErrors();

  let isValid = true;

  if (!email) {
    showError('loginEmailError', 'Please enter your email');
    isValid = false;
  }

  if (!password) {
    showError('loginPasswordError', 'Please enter your password');
    isValid = false;
  }

  if (isValid) {
    // CHECK IF USER EXISTS IN localStorage
    const allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
    const user = allUsers.find(u => u.email === email && u.password === password);

    if (user) {
      // LOGIN SUCCESSFUL
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      document.getElementById('loginForm').style.display = 'none';
      document.getElementById('loginSuccessMessage').style.display = 'flex';

      setTimeout(() => {
        window.location.href = 'fyp.html';
      }, 2000);
    } else {
      showError('loginError', 'Invalid email or password');
    }
  }
}

// ============ SUBMIT FEEDBACK FUNCTION ============
async function handleFeedbackSubmit(event) {
  event.preventDefault();

  // CHECK IF USER IS LOGGED IN
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    showLoginModal();
    return false;
  }
const userObj = JSON.parse(currentUser);
if (userObj.role === 'admin') {
    alert('Admins cannot submit feedback!');
    window.location.href = 'admin-dashboard.html';
    return false;
}
  const category = document.getElementById('category').value;
  const rating = document.getElementById('rating').value;
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const email = document.getElementById('contactEmail').value.trim();

  clearAllErrors();
  let isValid = true;

  if (!category) {
    showError('categoryError', 'Please select a category');
    isValid = false;
  }

  if (!rating) {
    showError('ratingError', 'Please select a rating');
    isValid = false;
  }

  if (title.length < 5) {
    showError('titleError', 'Title must be at least 5 characters');
    isValid = false;
  }

  if (description.length < 20) {
    showError('descriptionError', 'Description must be at least 20 characters');
    isValid = false;
  }

  if (isValid) {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        const response = await fetch('http://127.0.0.1:5000/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUser.id,
                category: category,
                message: description,
                title: title,
                rating: parseInt(rating) || 0
            })
        });

        const data = await response.json();

        if (response.ok) {
            showAlert('Feedback submitted successfully!', 'success');
            document.getElementById('feedbackForm').reset();
            setTimeout(() => {
                window.location.href = 'student-dashboard.html';
            }, 2000);
        } else {
            showAlert('Error: ' + data.message, 'danger');
        }
    } catch (err) {
        showAlert('Server se connect nahi ho saka!', 'danger');
        console.error(err);
    }
}
}

// ============ SHOW ERROR ============
function showError(elementId, message) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
    element.style.display = 'block';
  }
}

// ============ CLEAR ALL ERRORS ============
function clearAllErrors() {
  const errorElements = document.querySelectorAll('.error-msg');
  errorElements.forEach(el => {
    el.textContent = '';
    el.style.display = 'none';
  });
}

// ============ TOGGLE PASSWORD ============
function togglePassword(fieldId) {
  const field = document.getElementById(fieldId);
  const isPassword = field.type === 'password';
  field.type = isPassword ? 'text' : 'password';
}

// ============ MODAL CLOSE ============
window.onclick = function(event) {
  const modal = document.getElementById('loginModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
}
// ✅ جب page load ہو
document.addEventListener('DOMContentLoaded', function() {
  checkUserLoginStatus();  // یہ function چلے گا
});

// ✅ CHANGE 6: یہ function navbar کو update کرتا ہے
function checkUserLoginStatus() {
  const currentUser = localStorage.getItem('currentUser');
  
  const loggedInMenu = document.getElementById('loggedInMenu');
  const notLoggedInMenu = document.getElementById('notLoggedInMenu');

  if (currentUser) {
    // ✅ User LOGGED IN ہے
    if (loggedInMenu) loggedInMenu.style.display = 'flex';
if (notLoggedInMenu) notLoggedInMenu.style.display = 'none';
    
    // User کا email navbar میں دکھائیں
    const userEmail = JSON.parse(currentUser).email;
    const userEmailDisplay = document.getElementById('userEmailDisplay');
    if (userEmailDisplay) {
      userEmailDisplay.textContent = userEmail;
        const myFeedbackLink = document.getElementById('myFeedbackLink');
    const adminDashLink = document.getElementById('adminDashLink');
    const user = JSON.parse(currentUser);
    if (myFeedbackLink && adminDashLink) {
        if (user.role === 'admin') {
            myFeedbackLink.style.display = 'none';
            adminDashLink.style.display = 'inline';
        } else {
            myFeedbackLink.style.display = 'inline';
            adminDashLink.style.display = 'none';
        }
    }
    }
  } else {
    // ❌ User LOGGED OUT ہے
    if (loggedInMenu) loggedInMenu.style.display = 'none';
if (notLoggedInMenu) notLoggedInMenu.style.display = 'flex';

  }
}
// ✅ CHANGE 7: یہ function check کرتا ہے login ہے یا نہیں
function checkLoginAndRedirect(page) {
  const currentUser = localStorage.getItem('currentUser');
  
  if (!currentUser) {
    // ❌ User LOGGED OUT ہے → Modal دکھائیں
    showLoginModal();
    return false;
  } else {
    // ✅ User LOGGED IN ہے → Feedback page پر جائیں
    window.location.href = page;
  }
}
// ✅ CHANGE 8: Modal کو visible کرتا ہے
function showLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.style.display = 'flex';  // Modal دکھائیں
  }
}
// ✅ CHANGE 9: Modal کو hide کرتا ہے
function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.style.display = 'none';  // Modal چھپائیں
  }
}
// ✅ CHANGE 10: User کو logout کرتا ہے
function logout() {
  localStorage.removeItem('currentUser');  // User data ہٹائیں
  window.location.href = 'fyp.html';    // Home page پر جائیں
}

function handleLogin(event) {
  // ... validation code ...
event.preventDefault();
const email = document.getElementById('email').value.trim();
const password = document.getElementById('password').value;
let isValid = true;
if (!email) isValid = false;
if (!password) isValid = false;
  if (isValid) {
    fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.message === 'Login successful!') {
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            document.getElementById('message') && (document.getElementById('message').innerText = 'Login successful! Redirecting...');
            setTimeout(() => {
    if (data.user.role === 'admin') {
        window.location.href = '/admin-dashboard.html';
    } else {
        window.location.href = '/student-dashboard.html';
    }
},  1500);
        } else {
            showError('loginError', data.message);
        }
    })
    .catch(err => {
        showError('loginError', 'Server se connection nahi ho raha!');
    });
}
}

// ✅ NEW: Check Role and Redirect to Dashboard
function checkRoleAndRedirect() {
  const currentUser = localStorage.getItem('currentUser');
  
  if (!currentUser) {
    // User logged in نہیں ہے
    alert('Please login first to access dashboard');
    window.location.href = 'login.html';
    return;
  }

  const user = JSON.parse(currentUser);
  
  if (user.role === 'admin') {
    // Admin کو admin dashboard پر بھیجیں
    window.location.href = 'admin-dashboard.html';
  } else {
    // Student/Faculty/Staff کو student dashboard پر بھیجیں
    window.location.href = 'student-dashboard.html';
  }
}
