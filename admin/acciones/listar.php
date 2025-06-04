<?php
// /empleos/admin/acciones/listar.php

header('Content-Type: application/json; charset=UTF-8');

// Incluir config.php (desde /admin/acciones subimos un nivel)
require_once __DIR__ . '/../config.php';
$mysqli = obtenerConexion();

$query = "
    SELECT 
      id, 
      titulo, 
      empresa, 
      ubicacion, 
      fecha_publicacion, 
      fecha_cierre
    FROM empleos
    ORDER BY fecha_publicacion DESC
";
$result = $mysqli->query($query);

if (!$result) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Error al listar empleos: ' . $mysqli->error
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$empleos = [];
while ($row = $result->fetch_assoc()) {
    $empleos[] = [
        'id'                => $row['id'],
        'titulo'            => $row['titulo'],
        'empresa'           => $row['empresa'],
        'ubicacion'         => $row['ubicacion'],
        'fecha_publicacion' => $row['fecha_publicacion'],
        'fecha_cierre'      => $row['fecha_cierre']
    ];
}

echo json_encode($empleos, JSON_UNESCAPED_UNICODE);
exit;
