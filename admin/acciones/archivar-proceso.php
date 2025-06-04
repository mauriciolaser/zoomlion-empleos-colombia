<?php
// /empleos/admin/acciones/archivar-proceso.php

// Cabeceras CORS (si no están ya en index.php, de lo contrario omitir)
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Verificamos método
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido. Usa POST.']);
    exit;
}

// Obtener payload JSON
$input = json_decode(file_get_contents('php://input'), true);
if (!isset($input['id']) || !is_numeric($input['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Falta el campo id o no es válido.']);
    exit;
}

$id = intval($input['id']);

// Conexión a BD
require_once __DIR__ . '/../config.php';
$conn = obtenerConexion();

// **Asumimos que la tabla `empleos` tiene una columna `archivado` TINYINT(1) o equivalente.**
// Si no existiera, habría que agregarla previamente con un ALTER TABLE,
// por ejemplo: ALTER TABLE empleos ADD COLUMN archivado TINYINT(1) NOT NULL DEFAULT 0;

$sql = "UPDATE empleos SET archivado = 1 WHERE id = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error al preparar la consulta: ' . $conn->error]);
    exit;
}

$stmt->bind_param('i', $id);
if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error al ejecutar la consulta: ' . $stmt->error]);
    exit;
}

if ($stmt->affected_rows === 0) {
    // Quizá el id no existe o ya estaba archivado
    echo json_encode(['success' => false, 'message' => 'No se encontró el proceso o ya estaba archivado.']);
} else {
    echo json_encode(['success' => true, 'message' => 'Proceso archivado correctamente.']);
}

$stmt->close();
$conn->close();
