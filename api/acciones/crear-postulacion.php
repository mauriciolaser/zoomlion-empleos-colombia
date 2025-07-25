<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);

// CORS y preflight
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

// Cargar configuración
require_once __DIR__ . '/../config.php';

// Captura errores fatales
register_shutdown_function(function () {
    $e = error_get_last();
    if ($e !== null) {
        error_log('shutdown: ' . $e['message']);
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'Fatal: ' . $e['message']], JSON_UNESCAPED_UNICODE);
    }
});

// Convierte warnings/notices en excepciones
set_error_handler(function ($severity, $msg, $file, $line) {
    throw new Exception($msg . " @ {$file}:{$line}", 500);
});

try {
    // Validación de campos requeridos
    $required = ['proceso_id', 'nombre', 'apellidos', 'dni', 'telefono', 'correo'];
    foreach ($required as $field) {
        if (empty($_POST[$field])) {
            throw new Exception("Campo requerido faltante: {$field}", 400);
        }
    }
    if (
        !isset($_FILES['archivo']) ||
        $_FILES['archivo']['error'] !== UPLOAD_ERR_OK
    ) {
        throw new Exception('Error en el archivo adjunto', 400);
    }

    // Sanitizar entradas
    $proceso_id = intval($_POST['proceso_id']);
    $nombre     = trim($_POST['nombre']);
    $apellidos  = trim($_POST['apellidos']);
    $dni        = trim($_POST['dni']);
    $telefono   = trim($_POST['telefono']);
    $correo     = trim($_POST['correo']);
    $mensaje    = isset($_POST['mensaje']) ? trim($_POST['mensaje']) : null;

    // Conexión y transacción
    $mysqli = obtenerConexionMain();
    $mysqli->begin_transaction();

    // Verificar existencia del proceso
    $stmt = $mysqli->prepare("SELECT 1 FROM procesos WHERE id = ?");
    $stmt->bind_param("i", $proceso_id);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows === 0) {
        throw new Exception('Proceso de selección no encontrado', 400);
    }
    $stmt->close();

    // 1) Insertar postulante
    $ins = $mysqli->prepare("
        INSERT INTO postulantes (nombre, apellidos, dni, telefono, correo)
        VALUES (?, ?, ?, ?, ?)
    ");
    $ins->bind_param('sssss', $nombre, $apellidos, $dni, $telefono, $correo);
    if (!$ins->execute()) {
        throw new Exception('Error al insertar postulante: ' . $ins->error, 500);
    }
    $postulante_id = $mysqli->insert_id;
    $ins->close();

    // 2) Preparar ruta de uploads
    if (!is_dir(UPLOADS_PATH) || !is_writable(UPLOADS_PATH)) {
        throw new Exception('Uploads no existe o no es escribible: ' . UPLOADS_PATH, 500);
    }

    // 3) Mover archivo
    $f = $_FILES['archivo'];
    if (!is_uploaded_file($f['tmp_name'])) {
        throw new Exception('Archivo temporal inválido', 500);
    }
    $filename = time() . '_' . basename($f['name']);
    $destino  = UPLOADS_PATH . $filename;
    if (!move_uploaded_file($f['tmp_name'], $destino)) {
        throw new Exception('Error al subir archivo', 500);
    }
    $ruta = UPLOADS_URL . $filename;

    // 4) Insertar postulación
    $p = $mysqli->prepare("
        INSERT INTO postulaciones (postulante_id, proceso_id, archivo, mensaje)
        VALUES (?, ?, ?, ?)
    ");
    $p->bind_param('iiss', $postulante_id, $proceso_id, $ruta, $mensaje);
    if (!$p->execute()) {
        throw new Exception('Error al insertar postulación: ' . $p->error, 500);
    }
    $postulacion_id = $mysqli->insert_id;
    $p->close();

    // Commit y respuesta
    $mysqli->commit();
    http_response_code(201);
    echo json_encode([
        'ok'             => true,
        'postulante_id'  => $postulante_id,
        'postulacion_id' => $postulacion_id,
        'archivo'        => $ruta,
    ], JSON_UNESCAPED_UNICODE);
    exit;

} catch (Exception $e) {
    // Rollback si hay error
    if (isset($mysqli) && $mysqli->errno === 0) {
        $mysqli->rollback();
    }
    error_log('crear_postulacion: ' . $e->getMessage());
    http_response_code($e->getCode() ?: 500);
    echo json_encode(['ok' => false, 'error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
    exit;
}