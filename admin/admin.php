<?php
// admin/admin.php

require_once __DIR__ . '/config.php';
$mysqli = obtenerConexion();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Ruteo
if ($method==='GET'  && $action==='listar')            { require 'acciones/listar.php'; exit; }
if ($method==='POST' && $action==='crear')             { require 'acciones/crear-empleo.php'; exit; }
if ($method==='GET'  && $action==='ver-postulaciones'){ require 'acciones/ver-postulaciones.php'; exit; }
if ($method==='POST' && $action==='actualizar-proceso'){ require 'acciones/actualizar-proceso.php'; exit; }
if ($method==='POST' && $action==='archivar-proceso') { require 'acciones/archivar-proceso.php'; exit; }

// No encontrado
http_response_code(400);
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['error'=>'Ruta no encontrada o método no soportado'], JSON_UNESCAPED_UNICODE);
exit;
