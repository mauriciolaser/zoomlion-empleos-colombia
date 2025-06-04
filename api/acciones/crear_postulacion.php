<?php
// api/acciones/crear_postulacion.php

if (!isset($_POST['usuario_id'], $_POST['empleo_id']) || !isset($_FILES['archivo'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan campos obligatorios'], JSON_UNESCAPED_UNICODE);
    exit;
}

$usuario_id = intval($_POST['usuario_id']);
$empleo_id  = intval($_POST['empleo_id']);
$mensaje    = isset($_POST['mensaje']) ? $_POST['mensaje'] : null;

if (!isset($mysqli)) {
    require_once __DIR__ . '/../config.php';
    $mysqli = obtenerConexion();
}

// Procesar archivo
$uploadDir = __DIR__ . '/../uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$archivo   = $_FILES['archivo'];
$tmpName   = $archivo['tmp_name'];
$original  = basename($archivo['name']);
$timestamp = time();
$destino   = $uploadDir . $timestamp . '_' . $original;

if (!move_uploaded_file($tmpName, $destino)) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al subir archivo'], JSON_UNESCAPED_UNICODE);
    exit;
}

$rutaRelativa = 'uploads/' . basename($destino);

$sql = "
  INSERT INTO postulaciones
    (usuario_id, empleo_id, archivo, mensaje)
  VALUES
    (?, ?, ?, ?)
";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param('iiss', $usuario_id, $empleo_id, $rutaRelativa, $mensaje);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode([
        'message' => 'Postulación registrada correctamente',
        'id'      => $stmt->insert_id
    ], JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'No se pudo guardar la postulación: ' . $stmt->error], JSON_UNESCAPED_UNICODE);
}
$stmt->close();
exit;
