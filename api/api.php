<?php
require_once __DIR__ . '/config.php';
$mysqli = obtenerConexionMain();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
if ($method === 'GET' && $action === 'listar-procesos') {
    require __DIR__ . '/acciones/listar-procesos.php';
    exit;
}
$parsedUrl = parse_url($_SERVER['REQUEST_URI']);
$path = trim($parsedUrl['path'], '/');
$query = [];
if (!empty($parsedUrl['query'])) {
    parse_str($parsedUrl['query'], $query);
}
if ($method === 'GET' && $path === 'api/crear-postulacion') {
    require __DIR__ . '/acciones/crear-postulacion.php';
    exit;
}
if ($method === 'GET' && $path === 'api/listar-procesos') {
    require __DIR__ . '/acciones/listar-procesos.php';
    exit;
}
if ($method === 'GET' && isset($query['id']) && !isset($query['postulacion'])) {
    $_GET['id'] = $query['id'];
    require __DIR__ . '/acciones/ver-proceso.php';
    exit;
}
if ($method === 'POST' && $path === 'api/crear-postulacion') {
    require __DIR__ . '/acciones/crear-postulacion.php';
    exit;
}
if ($method === 'POST' && !isset($query['postulacion'])) {
    require __DIR__ . '/acciones/crear_empleo.php';
    exit;
}
http_response_code(404);
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['error' => 'Ruta no encontrada o método no soportado'], JSON_UNESCAPED_UNICODE);
exit;
