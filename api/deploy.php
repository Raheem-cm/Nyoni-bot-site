<?php
// api/deploy.php - UPDATED FOR YOUR SESSION FORMAT

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Data directory
$dataDir = __DIR__ . '/../data/';

// Get action
$action = $_GET['action'] ?? $_POST['action'] ?? '';

// Special function for your session format
function generateRaheemSession() {
    $prefix = 'RAHEEM-';
    $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $random = '';
    
    for ($i = 0; $i < 8; $i++) {
        $random .= $characters[rand(0, strlen($characters) - 1)];
    }
    
    return $prefix . $random;
}

// Function to validate your session
function validateRaheemSession($sessionToken) {
    if (strpos($sessionToken, 'RAHEEM-') === 0) {
        return true;
    }
    
    // Also check for RAHEEM-XMD~ format
    if (strpos($sessionToken, 'RAHEEM-XMD~') === 0) {
        return true;
    }
    
    return false;
}

switch ($action) {
    case 'login':
        handleRaheemLogin();
        break;
    case 'register':
        handleRaheemRegister();
        break;
    case 'deploy':
        handleRaheemDeploy();
        break;
    case 'get_bots':
        handleRaheemGetBots();
        break;
    case 'check_session':
        handleCheckSession();
        break;
    default:
        echo json_encode([
            'status' => 'online',
            'server' => 'Nyoni Bot',
            'version' => '1.0',
            'session_format' => 'RAHEEM-XXXXXX'
        ]);
        break;
}

function handleRaheemLogin() {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // If no JSON, check form data
    if (!$data) {
        $data = $_POST;
    }
    
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    
    if (!$email || !$password) {
        echo json_encode([
            'success' => false,
            'error' => 'Email na password zinahitajika',
            'code' => 'MISSING_FIELDS'
        ]);
        return;
    }
    
    // Load users
    $usersFile = __DIR__ . '/../data/users.json';
    if (!file_exists($usersFile)) {
        createDefaultUsers();
    }
    
    $users = json_decode(file_get_contents($usersFile), true);
    
    // Check user
    $foundUser = null;
    foreach ($users as $user) {
        if (($user['email'] === $email || $user['username'] === $email) && 
            $user['password'] === $password) {
            $foundUser = $user;
            break;
        }
    }
    
    if (!$foundUser) {
        // Auto-create user if not found (demo mode)
        $newUser = [
            'id' => 'user_' . time(),
            'username' => explode('@', $email)[0] ?? 'user',
            'email' => $email,
            'password' => $password,
            'plan' => 'free',
            'max_bots' => 5,
            'created_at' => time(),
            'last_login' => time()
        ];
        
        $users[] = $newUser;
        file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT));
        $foundUser = $newUser;
    }
    
    // Generate RAHEEM session token
    $sessionToken = generateRaheemSession();
    
    // Save session
    $sessionsFile = __DIR__ . '/../data/sessions.json';
    $sessions = file_exists($sessionsFile) ? 
                json_decode(file_get_contents($sessionsFile), true) : [];
    
    $sessionData = [
        'session_id' => $sessionToken,
        'user_id' => $foundUser['id'],
        'token' => $sessionToken,
        'created_at' => time(),
        'expires_at' => time() + (7 * 24 * 60 * 60),
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
    ];
    
    $sessions[] = $sessionData;
    file_put_contents($sessionsFile, json_encode($sessions, JSON_PRETTY_PRINT));
    
    // Return success with RAHEEM token
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'session_token' => $sessionToken,
        'session_type' => 'RAHEEM',
        'user' => [
            'id' => $foundUser['id'],
            'username' => $foundUser['username'],
            'email' => $foundUser['email'],
            'plan' => $foundUser['plan']
        ],
        'redirect' => 'panel/dashboard.html'
    ]);
}

function handleRaheemRegister() {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        $data = $_POST;
    }
    
    $username = $data['username'] ?? '';
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    
    if (!$username || !$email || !$password) {
        echo json_encode([
            'success' => false,
            'error' => 'Sehemu zote zinahitajika'
        ]);
        return;
    }
    
    $usersFile = __DIR__ . '/../data/users.json';
    $users = file_exists($usersFile) ? 
             json_decode(file_get_contents($usersFile), true) : [];
    
    // Check if exists
    foreach ($users as $user) {
        if ($user['email'] === $email) {
            echo json_encode([
                'success' => false,
                'error' => 'Email tayari imesajiliwa'
            ]);
            return;
        }
    }
    
    // Create new user
    $newUser = [
        'id' => 'user_' . time() . '_' . bin2hex(random_bytes(4)),
        'username' => $username,
        'email' => $email,
        'password' => $password,
        'plan' => 'free',
        'max_bots' => 5,
        'created_at' => time(),
        'last_login' => time(),
        'settings' => [
            'theme' => 'dark',
            'language' => 'sw'
        ]
    ];
    
    $users[] = $newUser;
    file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT));
    
    // Generate session
    $sessionToken = generateRaheemSession();
    
    echo json_encode([
        'success' => true,
        'message' => 'Akaunti imeundwa',
        'session_token' => $sessionToken,
        'user' => [
            'id' => $newUser['id'],
            'username' => $username,
            'email' => $email,
            'plan' => 'free'
        ]
    ]);
}

function handleRaheemDeploy() {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        $data = $_POST;
    }
    
    // Check session
    $sessionToken = $data['session_token'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    
    if (!validateRaheemSession($sessionToken)) {
        echo json_encode([
            'success' => false,
            'error' => 'Session invalid au imekwisha',
            'code' => 'INVALID_SESSION'
        ]);
        return;
    }
    
    $botName = $data['bot_name'] ?? '';
    $botType = $data['bot_type'] ?? 'discord';
    $config = $data['config'] ?? [];
    
    if (!$botName) {
        echo json_encode([
            'success' => false,
            'error' => 'Jina la bot linahitajika'
        ]);
        return;
    }
    
    // Create bot
    $botId = 'bot_' . time() . '_' . bin2hex(random_bytes(4));
    
    $newBot = [
        'id' => $botId,
        'name' => $botName,
        'type' => $botType,
        'status' => 'pending',
        'config' => $config,
        'created_at' => time(),
        'updated_at' => time(),
        'session_token' => $sessionToken,
        'memory' => '512MB',
        'logs' => []
    ];
    
    // Save to deployments
    $deploymentsFile = __DIR__ . '/../data/deployments.json';
    $deployments = file_exists($deploymentsFile) ? 
                   json_decode(file_get_contents($deploymentsFile), true) : [];
    
    $deployments[] = $newBot;
    file_put_contents($deploymentsFile, json_encode($deployments, JSON_PRETTY_PRINT));
    
    // Add to logs
    $logsFile = __DIR__ . '/../data/logs.json';
    $logs = file_exists($logsFile) ? 
            json_decode(file_get_contents($logsFile), true) : [];
    
    $logs[] = [
        'id' => 'log_' . time(),
        'bot_id' => $botId,
        'action' => 'deploy',
        'status' => 'started',
        'message' => 'Bot deployment imeanzishwa',
        'timestamp' => time(),
        'session' => $sessionToken
    ];
    
    file_put_contents($logsFile, json_encode($logs, JSON_PRETTY_PRINT));
    
    echo json_encode([
        'success' => true,
        'message' => 'Bot imeanza kutengenezwa',
        'bot_id' => $botId,
        'bot_name' => $botName,
        'status' => 'pending',
        'estimated_time' => '30 seconds',
        'session_token' => $sessionToken
    ]);
}

function handleRaheemGetBots() {
    $sessionToken = $_GET['session_token'] ?? '';
    
    if (!validateRaheemSession($sessionToken)) {
        echo json_encode([
            'success' => false,
            'error' => 'Session haikubaliki',
            'code' => 'SESSION_REQUIRED'
        ]);
        return;
    }
    
    $deploymentsFile = __DIR__ . '/../data/deployments.json';
    if (!file_exists($deploymentsFile)) {
        echo json_encode([
            'success' => true,
            'bots' => [],
            'count' => 0,
            'message' => 'Hakuna bots bado'
        ]);
        return;
    }
    
    $deployments = json_decode(file_get_contents($deploymentsFile), true);
    
    // Filter by session
    $userBots = array_filter($deployments, function($bot) use ($sessionToken) {
        return ($bot['session_token'] ?? '') === $sessionToken;
    });
    
    echo json_encode([
        'success' => true,
        'bots' => array_values($userBots),
        'count' => count($userBots),
        'session' => $sessionToken
    ]);
}

function handleCheckSession() {
    $sessionToken = $_GET['token'] ?? '';
    
    if (!validateRaheemSession($sessionToken)) {
        echo json_encode([
            'valid' => false,
            'message' => 'Session sio sahihi'
        ]);
        return;
    }
    
    $sessionsFile = __DIR__ . '/../data/sessions.json';
    if (!file_exists($sessionsFile)) {
        echo json_encode([
            'valid' => true,
            'message' => 'Session iko sawa (demo mode)',
            'session' => $sessionToken,
            'type' => 'RAHEEM'
        ]);
        return;
    }
    
    $sessions = json_decode(file_get_contents($sessionsFile), true);
    $found = false;
    
    foreach ($sessions as $session) {
        if ($session['token'] === $sessionToken) {
            $found = true;
            break;
        }
    }
    
    echo json_encode([
        'valid' => $found,
        'message' => $found ? 'Session iko sawa' : 'Session haipo',
        'session' => $sessionToken,
        'format' => 'RAHEEM'
    ]);
}

function createDefaultUsers() {
    $usersFile = __DIR__ . '/../data/users.json';
    
    $defaultUsers = [
        [
            'id' => 'admin_001',
            'username' => 'admin',
            'email' => 'admin@nyonibot.com',
            'password' => 'admin123',
            'plan' => 'pro',
            'max_bots' => 20,
            'created_at' => time(),
            'last_login' => time()
        ],
        [
            'id' => 'demo_001',
            'username' => 'demo',
            'email' => 'demo@nyonibot.com',
            'password' => 'demo123',
            'plan' => 'free',
            'max_bots' => 5,
            'created_at' => time(),
            'last_login' => time()
        ]
    ];
    
    file_put_contents($usersFile, json_encode($defaultUsers, JSON_PRETTY_PRINT));
}

// Create data directory if not exists
if (!file_exists(__DIR__ . '/../data')) {
    mkdir(__DIR__ . '/../data', 0755, true);
}

// Create default files if not exist
$requiredFiles = [
    'users.json' => '[]',
    'deployments.json' => '[]',
    'sessions.json' => '[]',
    'logs.json' => '[]',
    'config.json' => '{"site_name":"Nyoni Bot","demo_mode":true}'
];

foreach ($requiredFiles as $file => $defaultContent) {
    $filePath = __DIR__ . '/../data/' . $file;
    if (!file_exists($filePath)) {
        file_put_contents($filePath, $defaultContent);
    }
}
?>
