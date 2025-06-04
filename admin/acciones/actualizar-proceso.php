<?php
// /empleos/admin/acciones/actualizar-proceso.php

header('Content-Type: application/json; charset=UTF-8');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Incluir config.php que está en la carpeta admin/
require_once __DIR__ . '/../config.php'; 
// ↑ de acciones/ subimos a admin/ y ahí está config.php

// Obtener la conexión
$conn = obtenerConexion();
if (!$conn) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'No se pudo conectar a la base de datos'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Leer cuerpo raw y decodificar JSON
$raw = file_get_contents('php://input');
if (!$raw) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'No se recibió ningún body en la petición'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$data = json_decode($raw, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'JSON inválido: ' . json_last_error_msg()
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Validar campos obligatorios
$id                = $data['id']                ?? null;
$titulo            = $data['titulo']            ?? null;
$empresa           = $data['empresa']           ?? null;
$ubicacion         = $data['ubicacion']         ?? null;
$fecha_publicacion = $data['fecha_publicacion'] ?? null;
$fecha_cierre      = $data['fecha_cierre']      ?? null;

if (
    $id === null ||
    trim($titulo) === '' ||
    trim($empresa) === '' ||
    trim($ubicacion) === '' ||
    trim($fecha_publicacion) === '' ||
    trim($fecha_cierre) === ''
) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Faltan campos obligatorios: id, titulo, empresa, ubicacion, fecha_publicacion, fecha_cierre'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Preparar consulta UPDATE
$sql = "
    UPDATE empleos 
    SET titulo = ?, empresa = ?, ubicacion = ?, fecha_publicacion = ?, fecha_cierre = ?
    WHERE id = ?
";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error al preparar la consulta: ' . $conn->error
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Vincular parámetros y ejecutar
$stmt->bind_param(
    'sssssi',
    $titulo,
    $empresa,
    $ubicacion,
    $fecha_publicacion,
    $fecha_cierre,
    $id
);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error al ejecutar UPDATE: ' . $stmt->error
    ], JSON_UNESCAPED_UNICODE);
    $stmt->close();
    exit;
}

// Verificar filas afectadas
if ($stmt->affected_rows === 0) {
    echo json_encode([
        'success' => true,
        'message' => 'No se modificó ningún registro. Quizá el ID no existe o los datos son iguales.'
    ], JSON_UNESCAPED_UNICODE);
    $stmt->close();
    $conn->close();
    exit;
}

// Éxito
echo json_encode([
    'success' => true,
    'message' => 'Proceso actualizado correctamente'
], JSON_UNESCAPED_UNICODE);

$stmt->close();
$conn->close();
exit;
