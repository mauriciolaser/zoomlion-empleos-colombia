<?php
if (isset($_SERVER['HTTP_ORIGIN'])) {
    $origen = $_SERVER['HTTP_ORIGIN'];
} else {
    $origen = '';
}
$originesPermitidos = ['http://localhost:5173'];
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
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/api.php';
