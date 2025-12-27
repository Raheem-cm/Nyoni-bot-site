 <?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Get bot ID from query parameter
$botId = $_GET['bot_id'] ?? '';

if (empty($botId)) {
    // Return overall system status
    echo json_encode([
        'status' => 'online',
        'uptime' => '99.9%',
        'total_bots' => 1250,
        'active_bots' => 1100,
        'system_load' => '32%',
        'memory_usage' => '45%',
        'last_updated' => date('Y-m-d H:i:s')
    ]);
    exit;
}

// Check specific bot status
$botsFile = '../data/deployments.json';
if (!file_exists($botsFile)) {
    echo json_encode(['error' => 'No bots found']);
    exit;
}

$bots = json_decode(file_get_contents($botsFile), true);
$botFound = false;

foreach ($bots as $bot) {
    if ($bot['id'] === $botId) {
        $botFound = true;
        
        // Simulate bot status (in real app, check actual process)
        $status = $bot['status'];
        $uptime = isset($bot['uptime']) ? $bot['uptime'] : rand(0, 100000);
        
        // Format uptime
        $days = floor($uptime / 86400);
        $hours = floor(($uptime % 86400) / 3600);
        $uptimeFormatted = $days > 0 ? "{$days}d {$hours}h" : "{$hours}h";
        
        echo json_encode([
            'id' => $bot['id'],
            'name' => $bot['name'],
            'type' => $bot['type'],
            'status' => $status,
            'uptime' => $uptimeFormatted,
            'memory_used' => $bot['memory_limit'] ?? '128MB',
            'created_at' => date('Y-m-d H:i:s', $bot['created_at']),
            'last_activity' => date('Y-m-d H:i:s', $bot['updated_at'] ?? time()),
            'logs' => [
                'last_error' => null,
                'total_requests' => rand(1000, 100000)
            ]
        ]);
        break;
    }
}

if (!$botFound) {
    echo json_encode(['error' => 'Bot not found']);
}
?>
