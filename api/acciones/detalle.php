<?php
// api/acciones/detalle.php

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Falta parámetro id'], JSON_UNESCAPED_UNICODE);
    exit;
}
$id = intval($_GET['id']);

if (!isset($mysqli)) {
    require_once __DIR__ . '/../config.php';
    $mysqli = obtenerConexion();
}

$stmt = $mysqli->prepare("
  SELECT id, titulo, descripcion, empresa, ubicacion, fecha_publicacion, fecha_cierre
  FROM empleos
  WHERE id = ?
");
$stmt->bind_param('i', $id);
$stmt->execute();
$result = $stmt->get_result();
if ($empleo = $result->fetch_assoc()) {
    echo json_encode($empleo, JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Empleo no encontrado'], JSON_UNESCAPED_UNICODE);
}
$stmt->close();
exit;
