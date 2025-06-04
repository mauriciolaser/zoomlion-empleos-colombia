<?php
// /empleos/admin/index.php

session_start();

// 1. CORS / preflight
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS, GET');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// 2. Leer acción
$action = $_GET['action'] ?? '';

// 3. ENDPOINT "listar": GET /index.php?action=listar devuelve JSON de empleos
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'listar') {
    require_once __DIR__ . '/acciones/listar.php';
    // listar.php ya hace echo json_encode(...) y exit;
}

// 4. ENDPOINT "crear": POST /index.php?action=crear recibe datos y devuelve JSON
elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'crear') {
    require_once __DIR__ . '/acciones/crear-empleo.php';
    // crear-empleo.php debería devolver algo tipo { success: true, id: ... } o { error: ... }
}

// 5. ENDPOINT "ver-postulaciones": GET /index.php?action=ver-postulaciones devuelve JSON de postulaciones
elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'ver-postulaciones') {
    require_once __DIR__ . '/acciones/ver-postulaciones.php';
    // ver-postulaciones.php ya hace echo json_encode(...) y exit;
}

// 6. ENDPOINT "actualizar-proceso": POST /index.php?action=actualizar-proceso recibe JSON y actualiza el proceso
elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'actualizar-proceso') {
    require_once __DIR__ . '/acciones/actualizar-proceso.php';
    // actualizar-proceso.php se encarga de devolver JSON de éxito o error
}
elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'archivar-proceso') {
    require_once __DIR__ . '/acciones/archivar-proceso.php';
}
// 7. Cualquier otra petición (GET sin action=listar, POST sin action=crear o sin action=actualizar-proceso, etc.) devuelve error JSON.
else {
    http_response_code(400);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode([
        'error' => 'Acción no válida o método HTTP no soportado'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
