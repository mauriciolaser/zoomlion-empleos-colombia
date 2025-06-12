<?php
// api/api.php

require_once __DIR__ . '/config.php';
$mysqli = obtenerConexion();

$method    = $_SERVER['REQUEST_METHOD'];
$parsedUrl = parse_url($_SERVER['REQUEST_URI']);
$query     = [];
if (!empty($parsedUrl['query'])) {
    parse_str($parsedUrl['query'], $query);
}

if ($method==='GET'  && !isset($query['id']) && !isset($query['postulacion'])) {
    require 'acciones/listar.php'; exit;
}
if ($method==='GET'  && isset($query['id']) && !isset($query['postulacion'])) {
    $_GET['id']=$query['id']; require 'acciones/detalle.php'; exit;
}
if ($method==='POST' && !isset($query['postulacion'])) {
    require 'acciones/crear_empleo.php'; exit;
}
if ($method==='POST' && isset($query['postulacion'])) {
    $_GET['postulacion']=1; require 'acciones/crear_postulacion.php'; exit;
}

http_response_code(404);
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['error'=>'Ruta no encontrada o método no soportado'], JSON_UNESCAPED_UNICODE);
exit;
