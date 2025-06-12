<?php
// 1) Configuración de logging (producción)
ini_set('display_errors', 0);                             // No exponer errores al cliente
ini_set('log_errors', 1);                                 // Activar log de errores
ini_set('error_log', __DIR__ . '/logs/api_errors.log');   // Fichero de log
error_reporting(E_ALL);                                   // Registrar todos los niveles

// 2) CORS / Preflight
if (isset($_SERVER['HTTP_ORIGIN'])) {
    $origen = $_SERVER['HTTP_ORIGIN'];
} else {
    $origen = '';
}
$originesPermitidos = [
    'http://localhost:5173',
    'https://empleos.zoomlion.com.pe'
];
if (in_array($origen, $originesPermitidos, true)) {
    header("Access-Control-Allow-Origin: $origen");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 3) Cabecera para JSON
header('Content-Type: application/json; charset=utf-8');

// 4) (Opcional) Registro de arranque para verificar que el log funciona
trigger_error('API index.php cargado correctamente', E_USER_NOTICE);

// 5) Despacho al router principal
require_once __DIR__ . '/api.php';
