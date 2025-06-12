<?php
// /empleos/admin/admin.php

// 1. Conexión a BD
require_once __DIR__ . '/config.php';
$mysqli = obtenerConexion();

// 2. Método y acción
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// 3. Ruteo de acciones
if ($method === 'GET' && $action === 'listar') {
    require_once __DIR__ . '/acciones/listar.php';
    exit;
}
elseif ($method === 'POST' && $action === 'crear') {
    require_once __DIR__ . '/acciones/crear-empleo.php';
    exit;
}
elseif ($method === 'GET' && $action === 'ver-postulaciones') {
    require_once __DIR__ . '/acciones/ver-postulaciones.php';
    exit;
}
elseif ($method === 'POST' && $action === 'actualizar-proceso') {
    require_once __DIR__ . '/acciones/actualizar-proceso.php';
    exit;
}
elseif ($method === 'POST' && $action === 'archivar-proceso') {
    require_once __DIR__ . '/acciones/archivar-proceso.php';
    exit;
}

// 4. Ruta no encontrada o método no soportado
http_response_code(400);
header('Content-Type: application/json; charset=UTF-8');
echo json_encode([
    'error' => 'Ruta no encontrada o método HTTP no soportado'
], JSON_UNESCAPED_UNICODE);
exit;
