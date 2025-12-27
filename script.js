 // Main JavaScript for Nyoni Bot Site
document.addEventListener('DOMContentLoaded', function() {
    // Initialize website
    initWebsite();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load initial data
    loadInitialData();
});

function initWebsite() {
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('fa-bars');
            this.classList.toggle('fa-times');
        });
    }
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('fa-times');
            mobileToggle.classList.add('fa-bars');
        });
    });
}

function setupEventListeners() {
    // Deploy form submission
    const deployForm = document.getElementById('deployForm');
    if (deployForm) {
        deployForm.addEventListener('submit', handleDeployForm);
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function loadInitialData() {
    // Load deployment statistics
    updateDeploymentStats();
    
    // Check for active deployments
    checkActiveDeployments();
    
    // Initialize code editor
    initCodeEditor();
}

function updateDeploymentStats() {
    // In a real app, this would fetch from API
    // For now, we'll update with random data
    const stats = {
        botsDeployed: Math.floor(Math.random() * 1000) + 2000,
        uptime: '99.9',
        activeUsers: Math.floor(Math.random() * 3000) + 2000
    };
    
    // Update the stats in hero section
    document.querySelectorAll('.stat h3').forEach((stat, index) => {
        switch(index) {
            case 0:
                stat.textContent = stats.botsDeployed.toLocaleString();
                break;
            case 1:
                stat.textContent = stats.uptime + '%';
                break;
            case 2:
                stat.textContent = stats.activeUsers.toLocaleString();
                break;
        }
    });
}

function checkActiveDeployments() {
    // Check if user has active deployments
    const deployments = JSON.parse(localStorage.getItem('nyoniDeployments')) || [];
    
    if (deployments.length > 0) {
        // Show deployment status in terminal
        updateTerminalWithDeployments(deployments);
    }
}

function updateTerminalWithDeployments(deployments) {
    const terminal = document.querySelector('.terminal-body');
    if (!terminal) return;
    
    // Clear terminal and add deployment info
    terminal.innerHTML = '';
    
    deployments.forEach((deployment, index) => {
        if (index < 3) { // Show only 3 latest deployments
            const status = deployment.status === 'running' ? '🟢 ONLINE' : '🔴 OFFLINE';
            const line = `<p><span class="terminal-prompt">$</span> ${deployment.name}: <span class="terminal-status">${status}</span></p>`;
            terminal.innerHTML += line;
        }
    });
    
    // Add info about total deployments
    if (deployments.length > 3) {
        terminal.innerHTML += `<p><span class="terminal-info">ℹ️</span> +${deployments.length - 3} more bots...</p>`;
    }
}

function initCodeEditor() {
    // Simple code editor features
    const botCodeTextarea = document.getElementById('botCode');
    if (botCodeTextarea) {
        // Add tab support
        botCodeTextarea.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                
                const start = this.selectionStart;
                const end = this.selectionEnd;
                
                // Insert tab character
                this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
                
                // Move cursor
                this.selectionStart = this.selectionEnd = start + 4;
            }
        });
        
        // Add syntax highlighting preview
        botCodeTextarea.addEventListener('input', function() {
            highlightSyntax(this);
        });
    }
}

function highlightSyntax(textarea) {
    // Simple syntax highlighting for JavaScript
    const code = textarea.value;
    const lines = code.split('\n');
    
    // This is a simplified version - in production, use a proper syntax highlighter
    const highlightedLines = lines.map(line => {
        // Highlight comments
        if (line.includes('//')) {
            const parts = line.split('//');
            return `<span class="code-comment">//${parts[1]}</span>`;
        }
        return line;
    });
    
    // In a real app, you would update a preview area
}

async function handleDeployForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = {
        name: document.getElementById('botName').value,
        type: document.getElementById('botType').value,
        code: document.getElementById('botCode').value,
        packageJson: document.getElementById('packageJson').value,
        timestamp: new Date().toISOString(),
        status: 'deploying'
    };
    
    // Validate form
    if (!formData.name || !formData.type || !formData.code) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deploying...';
    submitBtn.disabled = true;
    
    try {
        // Simulate deployment process
        await simulateDeployment(formData);
        
        // Save deployment to localStorage
        saveDeployment(formData);
        
        // Show success message
        showNotification('Bot deployed successfully! Redirecting to panel...', 'success');
        
        // Redirect to panel after delay
        setTimeout(() => {
            window.location.href = 'panel/index.html';
        }, 2000);
        
    } catch (error) {
        console.error('Deployment error:', error);
        showNotification('Deployment failed. Please try again.', 'error');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

async function simulateDeployment(deploymentData) {
    // Simulate deployment process with delays
    return new Promise((resolve, reject) => {
        try {
            // Step 1: Validating code
            updateDeploymentStatus('Validating code...');
            
            setTimeout(() => {
                // Step 2: Installing dependencies
                updateDeploymentStatus('Installing dependencies...');
                
                setTimeout(() => {
                    // Step 3: Starting bot
                    updateDeploymentStatus('Starting bot...');
                    
                    setTimeout(() => {
                        // Step 4: Bot connected
                        updateDeploymentStatus('Bot connected to WhatsApp');
                        deploymentData.status = 'running';
                        deploymentData.botUrl = `https://nyoni.site/bot-${Date.now().toString().slice(-6)}`;
                        
                        resolve(deploymentData);
                    }, 1000);
                }, 1500);
            }, 1000);
        } catch (error) {
            reject(error);
        }
    });
}

function updateDeploymentStatus(message) {
    // Update terminal with deployment progress
    const terminal = document.querySelector('.terminal-body');
    if (terminal) {
        const statusLine = `<p><span class="terminal-info">ℹ️</span> ${message}</p>`;
        terminal.innerHTML += statusLine;
        terminal.scrollTop = terminal.scrollHeight;
    }
}

function saveDeployment(deploymentData) {
    // Get existing deployments
    let deployments = JSON.parse(localStorage.getItem('nyoniDeployments')) || [];
    
    // Add new deployment
    deploymentData.id = Date.now().toString();
    deploymentData.createdAt = new Date().toISOString();
    deploymentData.uptime = '0d 0h 0m';
    deploymentData.memory = '45MB';
    deploymentData.cpu = '2%';
    
    deployments.push(deploymentData);
    
    // Save to localStorage
    localStorage.setItem('nyoniDeployments', JSON.stringify(deployments));
    
    // Update user stats
    updateUserStats();
}

function updateUserStats() {
    const stats = JSON.parse(localStorage.getItem('nyoniUserStats')) || {
        deployments: 0,
        totalUptime: 0,
        lastDeployment: null
    };
    
    stats.deployments = (stats.deployments || 0) + 1;
    stats.lastDeployment = new Date().toISOString();
    
    localStorage.setItem('nyoniUserStats', JSON.stringify(stats));
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add notification styles if not exists
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(26, 26, 46, 0.95);
                backdrop-filter: blur(10px);
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                gap: 15px;
                z-index: 9999;
                animation: slideIn 0.3s ease;
                max-width: 400px;
                border-left: 4px solid #667eea;
            }
            .notification.success {
                border-left-color: #28ca42;
            }
            .notification.error {
                border-left-color: #ff4757;
            }
            .notification.info {
                border-left-color: #4facfe;
            }
            .notification i {
                font-size: 1.2rem;
            }
            .notification.success i {
                color: #28ca42;
            }
            .notification.error i {
                color: #ff4757;
            }
            .notification.info i {
                color: #4facfe;
            }
            .notification button {
                background: none;
                border: none;
                color: #b0b0d0;
                cursor: pointer;
                margin-left: auto;
                transition: color 0.3s;
            }
            .notification button:hover {
                color: white;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Initialize particles
window.addEventListener('load', function() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS.load('particles-js', 'assets/js/particles-config.json', function() {
            console.log('Particles loaded');
        });
    }
});
