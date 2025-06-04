<?php
// /empleos/admin/acciones/listar.php

header('Content-Type: application/json; charset=UTF-8');

require_once __DIR__ . '/../config.php';
$mysqli = obtenerConexion();

// Ahora seleccionamos también el campo `archivado`
$query = "
    SELECT 
      id, 
      titulo, 
      empresa, 
      ubicacion, 
      fecha_publicacion, 
      fecha_cierre,
      archivado
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
        'id'                => (int) $row['id'],
        'titulo'            => $row['titulo'],
        'empresa'           => $row['empresa'],
        'ubicacion'         => $row['ubicacion'],
        'fecha_publicacion' => $row['fecha_publicacion'],
        'fecha_cierre'      => $row['fecha_cierre'],
        // Convertimos archivado a entero (0 o 1)
        'archivado'         => (int) $row['archivado'],
    ];
}

echo json_encode($empleos, JSON_UNESCAPED_UNICODE);
exit;
