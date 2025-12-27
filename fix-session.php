 <?php
// fix-sessions.php - Run this to fix session issues

// Create data directory if not exists
if (!file_exists(__DIR__ . '/data')) {
    mkdir(__DIR__ . '/data', 0755, true);
    echo "Created data directory\n";
}

// Create sessions.json with RAHEEM format
$sessions = [
    [
        'session_id' => 'RAHEEM-XMD~' . strtoupper(bin2hex(random_bytes(4))),
        'user_id' => 'admin_001',
        'token' => 'RAHEEM-' . strtoupper(bin2hex(random_bytes(4))),
        'created_at' => time(),
        'expires_at' => time() + (30 * 24 * 60 * 60),
        'ip_address' => '127.0.0.1',
        'user_agent' => 'Mozilla/5.0 (Nyoni Bot Fix)',
        'active' => true
    ],
    [
        'session_id' => 'RAHEEM-' . strtoupper(bin2hex(random_bytes(6))),
        'user_id' => 'demo_001',
        'token' => 'RAHEEM-XMD~' . strtoupper(bin2hex(random_bytes(3))),
        'created_at' => time() - 86400,
        'expires_at' => time() + (7 * 24 * 60 * 60),
        'ip_address' => '192.168.1.100',
        'user_agent' => 'Mozilla/5.0 (Test User)',
        'active' => true
    ]
];

file_put_contents(__DIR__ . '/data/sessions.json', json_encode($sessions, JSON_PRETTY_PRINT));
echo "Created sessions.json with RAHEEM format\n";

// Create users.json
$users = [
    [
        'id' => 'admin_001',
        'username' => 'admin',
        'email' => 'admin@nyonibot.com',
        'password' => 'admin123',
        'plan' => 'pro',
        'session_format' => 'RAHEEM-XXXXXX',
        'created_at' => time()
    ]
];

file_put_contents(__DIR__ . '/data/users.json', json_encode($users, JSON_PRETTY_PRINT));
echo "Created users.json\n";

// Create deployments.json
$deployments = [
    [
        'id' => 'bot_' . time(),
        'name' => 'Demo Discord Bot',
        'type' => 'discord',
        'status' => 'online',
        'session_token' => 'RAHEEM-' . strtoupper(bin2hex(random_bytes(4))),
        'created_at' => time()
    ]
];

file_put_contents(__DIR__ . '/data/deployments.json', json_encode($deployments, JSON_PRETTY_PRINT));
echo "Created deployments.json\n";

// Create config.json
$config = [
    'site_name' => 'Nyoni Bot',
    'session_format' => 'RAHEEM',
    'session_prefix' => 'RAHEEM-',
    'accepts_formats' => ['RAHEEM-', 'RAHEEM-XMD~'],
    'demo_mode' => true
];

file_put_contents(__DIR__ . '/data/config.json', json_encode($config, JSON_PRETTY_PRINT));
echo "Created config.json\n";

echo "\n✅ Session fix completed!\n";
echo "🔑 Test accounts:\n";
echo "   Email: admin@nyonibot.com\n";
echo "   Password: admin123\n";
echo "\n🎯 Test URLs:\n";
echo "   http://your-site.com/test-session.html\n";
echo "   http://your-site.com/api/deploy.php?action=login\n";
?>
