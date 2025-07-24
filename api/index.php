<?php
// 1) Configuración de logging (producción)
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/logs/api_errors.log');
error_reporting(E_ALL);

// 2) CORS / Preflight
$originesPermitidos = [
    'http://localhost:5173',
    'https://empleos.zoomlion.com.pe',
    'https://dashboard.zoomlion.com.pe'
];

$origen = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origen, $originesPermitidos, true)) {
    header("Access-Control-Allow-Origin: $origen");
    header('Access-Control-Allow-Credentials: true');
} else {
    header('Access-Control-Allow-Origin: *');
}

header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 3) Cabecera para JSON
header('Content-Type: application/json; charset=utf-8');

// ─── DEBUG: registrar método y acción ─────────────────────────
error_log('DEBUG /api/index.php ▶️ Método: ' . $_SERVER['REQUEST_METHOD']);
error_log('DEBUG /api/index.php ▶️ URI: ' . $_SERVER['REQUEST_URI']);
error_log('DEBUG /api/index.php ▶️ $_GET["action"]: ' . ($_GET['action'] ?? '[no action]'));
// ────────────────────────────────────────────────────────────────

// 4) Despacho al router principal
require_once __DIR__ . '/api.php';