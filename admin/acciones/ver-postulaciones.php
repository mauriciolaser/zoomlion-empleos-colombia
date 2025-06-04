<?php
// /empleos/admin/acciones/ver-postulaciones.php

// 1. Cabeceras CORS + JSON 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS, GET');
header('Access-Control-Allow-Headers: Content-Type');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// 2. Incluir config.php de la raíz de admin y obtener conexión
require_once __DIR__ . '/../config.php';
$conn = obtenerConexion();

// 3. Consulta para obtener todas las postulaciones
$sql = "
    SELECT 
        id, 
        usuario_id, 
        empleo_id, 
        archivo, 
        mensaje, 
        fecha_postulacion 
    FROM postulaciones 
    ORDER BY fecha_postulacion DESC
";
$result = $conn->query($sql);

$postulaciones = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $postulaciones[] = $row;
    }
    $result->free();
} else {
    http_response_code(500);
    echo json_encode([
        'error'   => 'Error al obtener las postulaciones',
        'detalle' => $conn->error
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$conn->close();

// 4. Devolver JSON con todas las postulaciones
echo json_encode($postulaciones, JSON_UNESCAPED_UNICODE);
exit;
