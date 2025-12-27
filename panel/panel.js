// ============================================
// NYONI BOT PANEL - WORKING AUTH SYSTEM
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the panel
    initPanel();
});

function initPanel() {
    console.log('🚀 Nyoni Bot Panel Initialized');
    
    // Tab switching
    setupTabs();
    
    // Show/hide password
    setupPasswordToggle();
    
    // Form submissions
    setupForms();
    
    // Initialize particles
    initParticles();
}

// =============== TAB SYSTEM ===============
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show active tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                    content.style.animation = 'fadeIn 0.5s ease';
                }
            });
        });
    });
}

// =============== PASSWORD TOGGLE ===============
function setupPasswordToggle() {
    document.querySelectorAll('.show-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// =============== FORM HANDLING ===============
function setupForms() {
    // LOGIN FORM
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Validation
            if (!email || !password) {
                showAlert('Tafadhali jaza sehemu zote', 'error');
                return;
            }
            
            // Show loading
            showLoading(true);
            
            try {
                // Try to login
                const success = await attemptLogin(email, password, rememberMe);
                
                if (success) {
                    showAlert('Umefanikiwa kuingia!', 'success');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else {
                    showAlert('Email au password sio sahihi', 'error');
                }
            } catch (error) {
                showAlert('Hitilafu imetokea, jaribu tena', 'error');
            } finally {
                showLoading(false);
            }
        });
    }
    
    // REGISTER FORM
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('registerUsername').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirm').value;
            const agreeTerms = document.getElementById('agreeTerms').checked;
            
            // Validation
            if (!username || !email || !password || !confirmPassword) {
                showAlert('Tafadhali jaza sehemu zote', 'error');
                return;
            }
            
            if (username.length < 3) {
                showAlert('Username lazima iwe na angalau herufi 3', 'error');
                return;
            }
            
            if (password.length < 6) {
                showAlert('Password lazima iwe na angalau herufi 6', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showAlert('Password hazifanani', 'error');
                return;
            }
            
            if (!agreeTerms) {
                showAlert('Lazima ukubali masharti', 'error');
                return;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showAlert('Email sio sahihi', 'error');
                return;
            }
            
            // Show loading
            showLoading(true);
            
            try {
                // Try to register
                const success = await attemptRegister(username, email, password);
                
                if (success) {
                    showAlert('Akaunti imeundwa! Sasa ingia', 'success');
                    
                    // Switch to login tab
                    setTimeout(() => {
                        document.querySelector('[data-tab="login"]').click();
                        document.getElementById('loginEmail').value = email;
                        document.getElementById('loginPassword').value = '';
                        document.getElementById('loginPassword').focus();
                    }, 1500);
                } else {
                    showAlert('Username au email tayari imetumika', 'error');
                }
            } catch (error) {
                showAlert('Hitilafu imetokea, jaribu tena', 'error');
            } finally {
                showLoading(false);
            }
        });
    }
    
    // Password match validation
    const confirmInput = document.getElementById('registerConfirm');
    if (confirmInput) {
        confirmInput.addEventListener('input', function() {
            const password = document.getElementById('registerPassword').value;
            if (password && this.value && password !== this.value) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '';
            }
        });
    }
}

// =============== AUTH FUNCTIONS ===============
async function attemptLogin(email, password, rememberMe) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check local storage first
    const users = getUsers();
    
    // Find user by email or username
    const user = users.find(u => u.email === email || u.username === email);
    
    if (!user) {
        // If no user found, create demo user for first time
        if (users.length === 0) {
            createDemoUser();
            return attemptLogin(email, password, rememberMe);
        }
        return false;
    }
    
    // In real app, this would compare hashed passwords
    if (user.password === password) {
        // Save user session
        const userData = {
            id: user.id,
            username: user.username,
            email: user.email,
            plan: user.plan,
            loggedIn: true,
            loginTime: Date.now()
        };
        
        // Save to localStorage
        if (rememberMe) {
            localStorage.setItem('nyoni_user', JSON.stringify(userData));
            localStorage.setItem('nyoni_token', generateToken());
        } else {
            sessionStorage.setItem('nyoni_user', JSON.stringify(userData));
        }
        
        return true;
    }
    
    return false;
}

async function attemptRegister(username, email, password) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = getUsers();
    
    // Check if user exists
    const userExists = users.some(u => u.email === email || u.username === username);
    if (userExists) {
        return false;
    }
    
    // Create new user
    const newUser = {
        id: 'user_' + Date.now(),
        username: username,
        email: email,
        password: password, // In real app, hash this!
        plan: 'free',
        maxBots: 5,
        createdAt: new Date().toISOString(),
        bots: []
    };
    
    // Add to users
    users.push(newUser);
    localStorage.setItem('nyoni_users', JSON.stringify(users));
    
    return true;
}

// =============== USER MANAGEMENT ===============
function getUsers() {
    const users = localStorage.getItem('nyoni_users');
    return users ? JSON.parse(users) : [];
}

function createDemoUser() {
    const demoUsers = [
        {
            id: 'demo_001',
            username: 'admin',
            email: 'admin@nyonibot.com',
            password: 'admin123',
            plan: 'pro',
            maxBots: 20,
            createdAt: new Date().toISOString(),
            bots: [
                {
                    id: 'bot_001',
                    name: 'Music Bot',
                    type: 'discord',
                    status: 'online',
                    uptime: '5d 3h',
                    created: '2024-01-15'
                }
            ]
        },
        {
            id: 'demo_002',
            username: 'testuser',
            email: 'test@example.com',
            password: 'test123',
            plan: 'free',
            maxBots: 5,
            createdAt: new Date().toISOString(),
            bots: []
        }
    ];
    
    localStorage.setItem('nyoni_users', JSON.stringify(demoUsers));
}

function generateToken() {
    return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2);
}

function socialLogin(provider) {
    showAlert(`Inafungua ${provider} login...`, 'info');
    
    // Simulate social login
    setTimeout(() => {
        const demoUser = {
            id: `${provider}_user_${Date.now()}`,
            username: `${provider}user`,
            email: `${provider}@example.com`,
            plan: 'free',
            loggedIn: true
        };
        
        localStorage.setItem('nyoni_user', JSON.stringify(demoUser));
        localStorage.setItem('nyoni_token', generateToken());
        
        showAlert('Umefanikiwa kuingia!', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }, 1500);
}

// =============== UI FUNCTIONS ===============
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) existingAlert.remove();
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="alert-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(alert);
    
    // Show alert
    setTimeout(() => {
        alert.classList.add('show');
    }, 10);
    
    // Close button
    alert.querySelector('.alert-close').addEventListener('click', () => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 300);
        }
    }, 5000);
}

function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (!spinner) return;
    
    if (show) {
        spinner.style.display = 'flex';
        setTimeout(() => {
            spinner.classList.add('show');
        }, 10);
    } else {
        spinner.classList.remove('show');
        setTimeout(() => {
            spinner.style.display = 'none';
        }, 300);
    }
}

function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 800 } },
                color: { value: "#7C3AED" },
                shape: { type: "circle" },
                opacity: { value: 0.2, random: true },
                size: { value: 2, random: true },
                line_linked: {
                    enable: true,
                    distance: 120,
                    color: "#7C3AED",
                    opacity: 0.1,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1.5,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
}

// =============== DASHBOARD FUNCTIONS ===============
if (window.location.pathname.includes('dashboard.html')) {
    // Check authentication
    const user = JSON.parse(localStorage.getItem('nyoni_user') || sessionStorage.getItem('nyoni_user'));
    
    if (!user || !user.loggedIn) {
        window.location.href = 'index.html';
    } else {
        // Update dashboard with user info
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('username').textContent = user.username;
            document.getElementById('userEmail').textContent = user.email;
            document.getElementById('userPlan').textContent = user.plan;
            
            // Load user's bots
            loadUserBots(user.id);
        });
    }
    
    // Logout function
    window.logout = function() {
        localStorage.removeItem('nyoni_user');
        localStorage.removeItem('nyoni_token');
        sessionStorage.removeItem('nyoni_user');
        window.location.href = 'index.html';
    };
    
    function loadUserBots(userId) {
        const users = getUsers();
        const currentUser = users.find(u => u.id === userId);
        
        if (currentUser && currentUser.bots) {
            const botsGrid = document.querySelector('.bots-grid');
            if (botsGrid) {
                if (currentUser.bots.length === 0) {
                    botsGrid.innerHTML = `
                        <div class="no-bots">
                            <i class="fas fa-robot"></i>
                            <h3>Huna bots bado</h3>
                            <p>Anza kwa kubonyeza "Deploy New Bot" hapa chini</p>
                        </div>
                    `;
                } else {
                    botsGrid.innerHTML = currentUser.bots.map(bot => `
                        <div class="bot-card">
                            <div class="bot-header">
                                <h3>${bot.name}</h3>
                                <span class="bot-status status-${bot.status}">${bot.status.toUpperCase()}</span>
                            </div>
                            <div class="bot-info">
                                <p><i class="fab fa-${bot.type}"></i> ${bot.type}</p>
                                <p><i class="fas fa-clock"></i> Uptime: ${bot.uptime}</p>
                                <p><i class="fas fa-calendar"></i> Created: ${bot.created}</p>
                            </div>
                            <div class="bot-actions">
                                <button class="btn-action" onclick="startBot('${bot.id}')">
                                    <i class="fas fa-play"></i> Start
                                </button>
                                <button class="btn-action" onclick="stopBot('${bot.id}')">
                                    <i class="fas fa-stop"></i> Stop
                                </button>
                                <button class="btn-action" onclick="deleteBot('${bot.id}')">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                    `).join('');
                }
            }
        }
    }
}

// Add CSS for alerts and loading
const styles = `
    /* Alerts */
    .alert {
        position: fixed;
        top: 20px;
        right: 20px;
        min-width: 300px;
        max-width: 400px;
        background: var(--dark);
        border-left: 4px solid var(--primary);
        border-radius: var(--border-radius-sm);
        padding: 15px 20px;
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        transform: translateX(150%);
        transition: transform 0.3s ease;
    }
    
    .alert.show {
        transform: translateX(0);
    }
    
    .alert-success {
        border-left-color: var(--secondary);
    }
    
    .alert-error {
        border-left-color: #ef4444;
    }
    
    .alert-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .alert-content i {
        font-size: 1.2rem;
        flex-shrink: 0;
    }
    
    .alert-success .alert-content i {
        color: var(--secondary);
    }
    
    .alert-error .alert-content i {
        color: #ef4444;
    }
    
    .alert-content span {
        flex: 1;
        color: var(--light);
    }
    
    .alert-close {
        background: none;
        border: none;
        color: var(--gray);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.7;
        transition: opacity 0.2s;
    }
    
    .alert-close:hover {
        opacity: 1;
    }
    
    /* Loading Spinner */
    .loading-spinner {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(17, 24, 39, 0.9);
        backdrop-filter: blur(5px);
        display: none;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .loading-spinner.show {
        opacity: 1;
    }
    
    .spinner {
        width: 60px;
        height: 60px;
        border: 4px solid rgba(124, 58, 237, 0.2);
        border-top: 4px solid var(--primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 20px;
    }
    
    .loading-spinner p {
        color: var(--light);
        font-size: 1.1rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* No Bots State */
    .no-bots {
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px 20px;
        color: var(--gray);
    }
    
    .no-bots i {
        font-size: 4rem;
        margin-bottom: 20px;
        opacity: 0.5;
    }
    
    .no-bots h3 {
        color: var(--light);
        margin-bottom: 10px;
    }
    
    /* Button Actions */
    .btn-action {
        padding: 8px 15px;
        border-radius: var(--border-radius-sm);
        border: none;
        background: rgba(124, 58, 237, 0.2);
        color: var(--primary);
        cursor: pointer;
        transition: var(--transition);
        font-size: 0.9rem;
        display: inline-flex;
        align-items: center;
        gap: 5px;
    }
    
    .btn-action:hover {
        background: rgba(124, 58, 237, 0.3);
        transform: translateY(-2px);
    }
    
    /* Demo Link */
    .demo-link {
        color: var(--accent);
        text-decoration: none;
        font-weight: 600;
    }
    
    .demo-link:hover {
        text-decoration: underline;
    }
    
    .terms-link {
        color: var(--primary);
        text-decoration: none;
    }
    
    .terms-link:hover {
        text-decoration: underline;
    }
    
    .back-home {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--gray);
        text-decoration: none;
        margin-top: 20px;
        transition: var(--transition);
    }
    
    .back-home:hover {
        color: var(--primary);
        gap: 12px;
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Export functions for dashboard
window.startBot = function(botId) {
    showAlert(`Starting bot ${botId}...`, 'info');
};

window.stopBot = function(botId) {
    showAlert(`Stopping bot ${botId}...`, 'info');
};

window.deleteBot = function(botId) {
    if (confirm('Una hakika unataka kufuta bot hii?')) {
        showAlert('Bot imefutwa', 'success');
    }
};
