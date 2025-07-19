<?php
// listar.php — Devuelve todos los empleos visibles
// ------------------------------------------------------------

/* 0 · CORS --------------------------------------------------*/
$originesPermitidos = [
    'http://localhost:5173',
    'https://empleos.zoomlion.com.pe'
];

$origen = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origen, $originesPermitidos, true)) {
    header("Access-Control-Allow-Origin: $origen");
    header('Access-Control-Allow-Credentials: true');
} else {
    header('Access-Control-Allow-Origin: *'); // «*» solo si no usas credentials
}

header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

/* 1 · Cabecera JSON ----------------------------------------*/
header('Content-Type: application/json; charset=utf-8');

/* 2 · Conexión MySQL ---------------------------------------*/
$mysqli = new mysqli('localhost', 'root', '', 'zlcpanel_empleos_db');
if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión: ' . $mysqli->connect_error], JSON_UNESCAPED_UNICODE);
    exit;
}

/* 3 · Consulta ---------------------------------------------*/
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
    FROM empleos
    WHERE archivado = 0
    ORDER BY fecha_publicacion DESC
";

$result = $mysqli->query($sql);
if (!$result) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la consulta'], JSON_UNESCAPED_UNICODE);
    exit;
}

$empleos = $result->fetch_all(MYSQLI_ASSOC);
echo json_encode($empleos, JSON_UNESCAPED_UNICODE);

/* 4 · Limpieza ---------------------------------------------*/
$result->free();
$mysqli->close();
