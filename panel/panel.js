 // panel/panel.js - UPDATED FOR RAHEEM SESSIONS

// RAHEEM Session Management
class RaheemSession {
    constructor() {
        this.sessionKey = 'raheem_session_token';
        this.userKey = 'raheem_user_data';
    }
    
    // Generate local RAHEEM token
    generateLocalToken() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let token = 'RAHEEM-';
        
        for (let i = 0; i < 8; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return token;
    }
    
    // Check if token is RAHEEM format
    isRaheemToken(token) {
        return token && (token.startsWith('RAHEEM-') || token.startsWith('RAHEEM-XMD~'));
    }
    
    // Get current session
    getSession() {
        const token = localStorage.getItem(this.sessionKey);
        const user = JSON.parse(localStorage.getItem(this.userKey) || 'null');
        
        return {
            token: token,
            user: user,
            isValid: this.isRaheemToken(token) && user !== null
        };
    }
    
    // Save session
    saveSession(token, userData) {
        // Ensure it's RAHEEM format
        if (!this.isRaheemToken(token)) {
            token = this.generateLocalToken();
        }
        
        localStorage.setItem(this.sessionKey, token);
        localStorage.setItem(this.userKey, JSON.stringify(userData));
        
        return token;
    }
    
    // Clear session
    clearSession() {
        localStorage.removeItem(this.sessionKey);
        localStorage.removeItem(this.userKey);
    }
    
    // Validate with server
    async validateWithServer(token) {
        try {
            const response = await fetch(`../api/deploy.php?action=check_session&token=${encodeURIComponent(token)}`);
            const data = await response.json();
            return data.valid === true;
        } catch (error) {
            // If offline, check local format
            return this.isRaheemToken(token);
        }
    }
}

// Initialize session manager
const raheemSession = new RaheemSession();

// API Helper with RAHEEM sessions
class RaheemAPI {
    constructor() {
        this.baseURL = '../api/deploy.php';
    }
    
    async request(action, data = {}, method = 'POST') {
        const session = raheemSession.getSession();
        
        // Add session token to all requests
        if (session.token) {
            data.session_token = session.token;
        }
        
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        
        try {
            const response = await fetch(`${this.baseURL}?action=${action}`, {
                method: method,
                body: formData
            });
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return {
                success: false,
                error: 'Connection failed',
                offline: true
            };
        }
    }
    
    async login(email, password) {
        const result = await this.request('login', { email, password });
        
        if (result.success && result.session_token) {
            // Save the RAHEEM token
            raheemSession.saveSession(
                result.session_token,
                result.user
            );
        }
        
        return result;
    }
    
    async register(username, email, password) {
        const result = await this.request('register', { username, email, password });
        
        if (result.success && result.session_token) {
            raheemSession.saveSession(
                result.session_token,
                result.user
            );
        }
        
        return result;
    }
    
    async deployBot(botName, botType, config = {}) {
        return await this.request('deploy', {
            bot_name: botName,
            bot_type: botType,
            config: JSON.stringify(config)
        });
    }
    
    async getMyBots() {
        const session = raheemSession.getSession();
        if (!session.isValid) {
            return { success: false, error: 'Not logged in' };
        }
        
        return await this.request('get_bots', {}, 'GET');
    }
}

// Initialize API
const raheemAPI = new RaheemAPI();

// Update login form handler
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!email || !password) {
            showAlert('Tafadhali jaza email na password', 'error');
            return;
        }
        
        showLoading(true);
        
        try {
            const result = await raheemAPI.login(email, password);
            
            if (result.success) {
                showAlert('Umefanikiwa kuingia!', 'success');
                
                // Check session token format
                const session = raheemSession.getSession();
                console.log('RAHEEM Session:', session.token);
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                showAlert(result.error || 'Login failed', 'error');
            }
        } catch (error) {
            showAlert('Hitilafu ya mtandao', 'error');
        } finally {
            showLoading(false);
        }
    });
}

// Update register form handler
function setupRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;
    
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirm').value;
        
        // Validation
        if (password !== confirmPassword) {
            showAlert('Password hazifanani', 'error');
            return;
        }
        
        showLoading(true);
        
        try {
            const result = await raheemAPI.register(username, email, password);
            
            if (result.success) {
                showAlert('Akaunti imeundwa!', 'success');
                
                // Auto login after registration
                const loginResult = await raheemAPI.login(email, password);
                
                if (loginResult.success) {
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                }
            } else {
                showAlert(result.error || 'Registration failed', 'error');
            }
        } catch (error) {
            showAlert('Hitilafu ya mtandao', 'error');
        } finally {
            showLoading(false);
        }
    });
}

// Update dashboard initialization
function initializeDashboard() {
    // Check session
    const session = raheemSession.getSession();
    
    if (!session.isValid) {
        // Redirect to login
        window.location.href = 'index.html';
        return;
    }
    
    console.log('Dashboard loaded with session:', session.token);
    
    // Update UI with user info
    if (session.user) {
        document.getElementById('username').textContent = session.user.username;
        document.getElementById('userEmail').textContent = session.user.email;
        document.getElementById('planType').textContent = session.user.plan || 'Free';
    }
    
    // Load bots
    loadBots();
}

// Update bot loading with session
async function loadBots() {
    const session = raheemSession.getSession();
    
    if (!session.isValid) {
        return;
    }
    
    showLoading(true);
    
    try {
        const result = await raheemAPI.getMyBots();
        
        if (result.success) {
            displayBots(result.bots || []);
        } else {
            showAlert('Could not load bots', 'error');
        }
    } catch (error) {
        console.error('Error loading bots:', error);
    } finally {
        showLoading(false);
    }
}

// Logout function
function logout() {
    if (confirm('Una hakika unataka kutoka?')) {
        raheemSession.clearSession();
        window.location.href = 'index.html';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on dashboard
    if (window.location.pathname.includes('dashboard.html')) {
        initializeDashboard();
    } else {
        // Check if already logged in
        const session = raheemSession.getSession();
        if (session.isValid) {
            window.location.href = 'dashboard.html';
        }
        
        // Setup login/register forms
        setupLoginForm();
        setupRegisterForm();
    }
    
    // Test session format
    console.log('Current session format:', raheemSession.getSession());
});

// Helper functions
function showAlert(message, type = 'info') {
    // Your existing alert code...
}

function showLoading(show) {
    // Your existing loading code...
                    }
