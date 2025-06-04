<?php
// /empleos/admin/acciones/crear-empleo.php

// Nota: aquí no enviamos headers CORS ni manejamos OPTIONS (lo hace index.php)

// Leer cuerpo JSON
$body = file_get_contents('php://input');
$data = json_decode($body, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'JSON inválido en el cuerpo'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Validar campos obligatorios
if (
    !isset($data['titulo']) ||
    !isset($data['descripcion']) ||
    !isset($data['empresa']) ||
    !isset($data['ubicacion']) ||
    !isset($data['fecha_publicacion'])
) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan campos obligatorios'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Conectarse a BD
require_once __DIR__ . '/../../api/config.php';
$mysqli = obtenerConexion();

$titulo            = $mysqli->real_escape_string($data['titulo']);
$descripcion       = $mysqli->real_escape_string($data['descripcion']);
$empresa           = $mysqli->real_escape_string($data['empresa']);
$ubicacion         = $mysqli->real_escape_string($data['ubicacion']);
$fecha_publicacion = $mysqli->real_escape_string($data['fecha_publicacion']);
$fecha_cierre      = null;
if (!empty($data['fecha_cierre'])) {
    $fecha_cierre = $mysqli->real_escape_string($data['fecha_cierre']);
}

$sql = "
  INSERT INTO empleos
    (titulo, descripcion, empresa, ubicacion, fecha_publicacion, fecha_cierre)
  VALUES
    (?, ?, ?, ?, ?, ?)
";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param('ssssss', $titulo, $descripcion, $empresa, $ubicacion, $fecha_publicacion, $fecha_cierre);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode([
        'message' => 'Empleo creado correctamente',
        'id'      => $stmt->insert_id
    ], JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'No se pudo crear el empleo: ' . $stmt->error], JSON_UNESCAPED_UNICODE);
}

$stmt->close();
exit;
