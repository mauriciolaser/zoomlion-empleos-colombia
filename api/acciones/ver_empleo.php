<?php
// ver_empleo.php — Detalle de empleo por slug
// ------------------------------------------------------------
// Devuelve un empleo por su slug, normalizando los campos
// responsabilidades y requisitos para que siempre lleguen
// como array JSON al frontend.
// ------------------------------------------------------------

/* 0 · CORS --------------------------------------------------*/
header('Access-Control-Allow-Origin: *');
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

/* 3 · Validar método y parámetro ---------------------------*/
if ($_SERVER['REQUEST_METHOD'] !== 'GET' || !isset($_GET['slug'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Se requiere parámetro slug'], JSON_UNESCAPED_UNICODE);
    exit;
}

$slug = $mysqli->real_escape_string($_GET['slug']);

/* 4 · Consulta ---------------------------------------------*/
$stmt = $mysqli->prepare("
    SELECT
        id,
        slug,
        titulo,
        descripcion,
        empresa,
        ubicacion,
        fecha_publicacion,
        fecha_cierre,
        archivado,
        experiencia,
        responsabilidades,
        requisitos
    FROM empleos
    WHERE slug = ?
    LIMIT 1
");
$stmt->bind_param('s', $slug);
$stmt->execute();
$result = $stmt->get_result();

/* 5 · Normalización de datos -------------------------------*/
if ($empleo = $result->fetch_assoc()) {

    foreach (['responsabilidades', 'requisitos'] as $campo) {
        $raw = $empleo[$campo] ?? '';

        // Caso 1: valor vacío → array vacío
        if ($raw === '' || $raw === null) {
            $empleo[$campo] = [];
            continue;
        }

        // Caso 2: intentar decodificar JSON
        $json = json_decode($raw, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($json)) {
            $empleo[$campo] = $json;
            continue;
        }

        // Caso 3: no es JSON → dividir por saltos de línea o comas
        $empleo[$campo] = array_values(
            array_filter(
                array_map('trim', preg_split('/[\r\n,]+/', $raw))
            )
        );
    }

    echo json_encode($empleo, JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Empleo no encontrado'], JSON_UNESCAPED_UNICODE);
}

/* 6 · Limpieza ---------------------------------------------*/
$stmt->close();
$mysqli->close();
?>
