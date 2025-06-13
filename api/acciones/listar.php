<?php
// api/acciones/listar.php

// Asumimos que ya se incluyó config.php y ya hay $mysqli
if (!isset($mysqli)) {
    // por si lo incluyes directo (no recomendado)
    require_once __DIR__ . '/../config.php';
    $mysqli = obtenerConexion();
}

$query  = "
  SELECT 
    id, titulo, descripcion, empresa, ubicacion, experiencia, fecha_publicacion, fecha_cierre
  FROM empleos
  ORDER BY fecha_publicacion DESC
";
$result = $mysqli->query($query);
if (!$result) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al listar empleos: ' . $mysqli->error], JSON_UNESCAPED_UNICODE);
    exit;
}

$empleos = [];
while ($row = $result->fetch_assoc()) {
    $empleos[] = $row;
}
echo json_encode($empleos, JSON_UNESCAPED_UNICODE);
exit;
