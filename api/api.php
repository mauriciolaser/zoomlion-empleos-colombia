<?php
// api/api.php
require_once __DIR__ . '/config.php';
$mysqli = obtenerConexion();

$method    = $_SERVER['REQUEST_METHOD'];
$parsedUrl = parse_url($_SERVER['REQUEST_URI']);
$path      = trim($parsedUrl['path'], '/');           // ej: api/ver_empleo
$query     = [];
if (!empty($parsedUrl['query'])) {
    parse_str($parsedUrl['query'], $query);
}

/* ── 1 · ver_empleo ─────────────────────────────── */
if ($method === 'GET' && $path === 'api/ver_empleo') {
    require 'acciones/ver_empleo.php';
    exit;
}

/* ── 2 · listar ─────────────────────────────────── */
if ($method === 'GET' && $path === 'api/listar') {
    require 'acciones/listar.php';
    exit;
}

/* ── 3 · detalle por id ─────────────────────────── */
if ($method === 'GET' && isset($query['id']) && !isset($query['postulacion'])) {
    $_GET['id'] = $query['id'];
    require 'acciones/detalle.php';
    exit;
}

/* ── 4 · crear postulación ─────────────── */

if ($method === 'POST' && $path === 'api/crear_postulacion') {
    require 'acciones/crear_postulacion.php';
    exit;
}

/* ── 5 · crear empleo ─────────────── */


if ($method === 'POST' && !isset($query['postulacion'])) {
    require 'acciones/crear_empleo.php';
    exit;
}


/* ── 5 · fallback 404 ───────────────────────────── */
http_response_code(404);
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['error' => 'Ruta no encontrada o método no soportado'], JSON_UNESCAPED_UNICODE);
exit;
