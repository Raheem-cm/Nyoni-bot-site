 // Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
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
                }
            });
        });
    });
    
    // Show/hide password
    const showPasswordBtns = document.querySelectorAll('.show-password');
    showPasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Password match validation for register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        const passwordInput = document.getElementById('register-password');
        const confirmInput = document.getElementById('register-confirm');
        
        function validatePasswordMatch() {
            if (passwordInput.value !== confirmInput.value) {
                confirmInput.style.borderColor = '#EF4444';
                return false;
            } else {
                confirmInput.style.borderColor = '';
                return true;
            }
        }
        
        confirmInput.addEventListener('input', validatePasswordMatch);
        passwordInput.addEventListener('input', validatePasswordMatch);
        
        registerForm.addEventListener('submit', function(e) {
            if (!validatePasswordMatch()) {
                e.preventDefault();
                alert('Passwords do not match!');
            }
        });
    }
    
    // Social login buttons
    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const provider = this.classList.contains('github') ? 'GitHub' :
                           this.classList.contains('google') ? 'Google' : 'Discord';
            
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
            this.disabled = true;
            
            // Simulate social login
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
                
                // Show notification
                showNotification(`Redirecting to ${provider} authentication...`, 'info');
            }, 1500);
        });
    });
    
    // Initialize particles for panel
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
    
    // Check if we're on dashboard page
    if (window.location.pathname.includes('dashboard.html')) {
        initializeDashboard();
    }
    
    // Dashboard functionality
    function initializeDashboard() {
        // Load user data
        loadUserData();
        
        // Load bots
        loadBots();
        
        // Setup deploy form
        setupDeployForm();
        
        // Setup bot actions
        setupBotActions();
        
        // Setup logout
        document.getElementById('logout-btn')?.addEventListener('click', logout);
    }
    
    function loadUserData() {
        // Simulate loading user data
        setTimeout(() => {
            const usernameElement = document.getElementById('username');
            const emailElement = document.getElementById('user-email');
            
            if (usernameElement) usernameElement.textContent = 'JohnDoe';
            if (emailElement) emailElement.textContent = 'john@example.com';
        }, 500);
    }
    
    function loadBots() {
        const botsGrid = document.querySelector('.bots-grid');
        if (!botsGrid) return;
        
        const bots = [
            { id: 1, name: 'Discord Music Bot', type: 'discord', status: 'online', uptime: '15d 6h', memory: '128MB' },
            { id: 2, name: 'Telegram News Bot', type: 'telegram', status: 'offline', uptime: '2d 3h', memory: '64MB' },
            { id: 3, name: 'WhatsApp Assistant', type: 'whatsapp', status: 'pending', uptime: '0d 0h', memory: '256MB' },
            { id: 4, name: 'Discord Moderator', type: 'discord', status: 'online', uptime: '30d 12h', memory: '192MB' }
        ];
        
        botsGrid.innerHTML = bots.map(bot => `
            <div class="bot-card" data-bot-id="${bot.id}">
                <div class="bot-header">
                    <div>
                        <h3>${bot.name}</h3>
                        <p><i class="fab fa-${bot.type}"></i> ${bot.type.charAt(0).toUpperCase() + bot.type.slice(1)}</p>
                    </div>
                    <span class="bot-status status-${bot.status}">${bot.status.toUpperCase()}</span>
                </div>
                <div class="bot-info">
                    <p><i class="fas fa-clock"></i> Uptime: ${bot.uptime}</p>
                    <p><i class="fas fa-memory"></i> Memory: ${bot.memory}</p>
                    <p><i class="fas fa-calendar"></i> Created: 2 weeks ago</p>
                </div>
                <div class="bot-actions">
                    <button class="btn-small btn-start" data-action="start" data-bot="${bot.id}">
                        <i class="fas fa-play"></i> Start
                    </button>
                    <button class="btn-small btn-stop" data-action="stop" data-bot="${bot.id}">
                        <i class="fas fa-stop"></i> Stop
                    </button>
                    <button class="btn-small btn-restart" data-action="restart" data-bot="${bot.id}">
                        <i class="fas fa-redo"></i> Restart
                    </button>
                    <button class="btn-small btn-edit" data-action="edit" data-bot="${bot.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    function setupDeployForm() {
        const deployForm = document.getElementById('deploy-form');
        const fileUpload = document.querySelector('.file-upload');
        const fileInput = document.getElementById('bot-files');
        
        if (fileUpload && fileInput) {
            fileUpload.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', function(e) {
                if (this.files.length > 0) {
                    fileUpload.innerHTML = `
                        <i class="fas fa-check-circle" style="color: #10B981;"></i>
                        <p>${this.files.length} file(s) selected</p>
                        <p class="file-names">${Array.from(this.files).map(f => f.name).join(', ')}</p>
                    `;
                }
            });
        }
        
        if (deployForm) {
            deployForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deploying...';
                submitBtn.disabled = true;
                
                // Simulate deployment
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    showNotification('Bot deployed successfully!', 'success');
                    
                    // Reload bots list
                    setTimeout(() => {
                        loadBots();
                        setupBotActions();
                    }, 1000);
                    
                    // Reset form
                    deployForm.reset();
                    if (fileUpload) {
                        fileUpload.innerHTML = `
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Drag & drop your bot files here</p>
                            <p class="file-names">or click to browse</p>
                        `;
                    }
                }, 3000);
            });
        }
    }
    
    function setupBotActions() {
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                const botId = this.getAttribute('data-bot');
                const botCard = this.closest('.bot-card');
                const statusElement = botCard?.querySelector('.bot-status');
                
                let newStatus = '';
                let message = '';
                
                switch (action) {
                    case 'start':
                        newStatus = 'online';
                        message = 'Bot started successfully!';
                        break;
                    case 'stop':
                        newStatus = 'offline';
                        message = 'Bot stopped successfully!';
                        break;
                    case 'restart':
                        newStatus = 'pending';
                        message = 'Bot restarting...';
                        setTimeout(() => {
                            if (statusElement) {
                                statusElement.className = 'bot-status status-online';
                                statusElement.textContent = 'ONLINE';
                            }
                            showNotification('Bot restarted successfully!', 'success');
                        }, 2000);
                        break;
                    case 'edit':
                        showNotification('Opening bot editor...', 'info');
                        return;
                }
                
                if (statusElement && newStatus) {
                    statusElement.className = `bot-status status-${newStatus}`;
                    statusElement.textContent = newStatus.toUpperCase();
                }
                
                if (message) {
                    showNotification(message, 'success');
                }
            });
        });
    }
    
    function logout() {
        showNotification('Logging out...', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
    
    // Notification function (same as in main script)
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }
});
