<?php
// api/api.php

require_once __DIR__ . '/config.php';   // para obtener obtenerConexion() y configuración

// 1. Conexión a la base de datos
$mysqli = obtenerConexion();

// 2. Método y parámetros (GET/POST/…)  
$method = $_SERVER['REQUEST_METHOD'];
$parsedUrl = parse_url($_SERVER['REQUEST_URI']);
$query     = [];
if (!empty($parsedUrl['query'])) {
    parse_str($parsedUrl['query'], $query);
}

// 3. Ruteo simplificado:

// --- 3.1. GET sin ?id y sin ?postulacion → listar todos los empleos
if ($method === 'GET' && !isset($query['id']) && !isset($query['postulacion'])) {
    require_once __DIR__ . '/acciones/listar.php';
    exit;
}

// --- 3.2. GET con ?id=XX → detalle de empleo
if ($method === 'GET' && isset($query['id']) && !isset($query['postulacion'])) {
    // pasar $query['id'] por $_GET['id'], para que detalle.php lo lea igual
    $_GET['id'] = $query['id'];
    require_once __DIR__ . '/acciones/detalle.php';
    exit;
}

// --- 3.3. POST sin ?postulacion → crear un nuevo empleo
if ($method === 'POST' && !isset($query['postulacion'])) {
    // Nota: asumimos JSON en el body; crear_empleo.php se encargará de parsearlo
    require_once __DIR__ . '/acciones/crear_empleo.php';
    exit;
}

// --- 3.4. POST con ?postulacion=1 → subir CV y crear postulación
if ($method === 'POST' && isset($query['postulacion'])) {
    $_GET['postulacion'] = 1;  // para que crear_postulacion.php lo detecte
    require_once __DIR__ . '/acciones/crear_postulacion.php';
    exit;
}

// --- 3.5. Si no coincide ninguna ruta:
http_response_code(404);
echo json_encode(['error' => 'Ruta no encontrada o método no soportado'], JSON_UNESCAPED_UNICODE);
exit;
