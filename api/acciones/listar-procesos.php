<?php
$originesPermitidos = [
    'http://localhost:5173',
    'https://empleos.zoomlion.com.pe',
    'https://dashboard.zoomlion.com.pe'
];

$origen = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origen, $originesPermitidos, true)) {
    header("Access-Control-Allow-Origin: $origen");
    header('Access-Control-Allow-Credentials: true');
} else {
    header('Access-Control-Allow-Origin: *');
}

header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

$mysqli = obtenerConexionMain();

$sql = "
    SELECT
        id,
        slug,
        titulo,
        descripcion,
        empresa,
        ubicacion,
        fecha_publicacion,
        fecha_cierre,
        experiencia
    FROM procesos
    WHERE archivado = 0
        AND (cerrado_manualmente = 0 OR cerrado_manualmente IS NULL)
        AND (fecha_cierre IS NULL OR fecha_cierre >= CURDATE())
    ORDER BY fecha_publicacion DESC
";

$result = $mysqli->query($sql);
if (! $result) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la consulta'], JSON_UNESCAPED_UNICODE);
    exit;
}

$procesos = $result->fetch_all(MYSQLI_ASSOC);
echo json_encode($procesos, JSON_UNESCAPED_UNICODE);

$result->free();
$mysqli->close();