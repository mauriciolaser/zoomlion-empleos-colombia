<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);

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

register_shutdown_function(function () {
    $e = error_get_last();
    if ($e !== null) {
        error_log('shutdown: '.$e['message']);
        http_response_code(500);
        echo json_encode(['ok'=>false,'error'=>'Fatal: '.$e['message']], JSON_UNESCAPED_UNICODE);
    }
});
set_error_handler(function ($severity,$msg,$file,$line) {
    throw new Exception($msg.' @'.$file.':'.$line, 500);
});

try {
    if (
        !isset($_POST['proceso_id'], $_POST['nombre'], $_POST['apellidos'], $_POST['dni'],
               $_POST['telefono'], $_POST['correo']) ||
        !isset($_FILES['archivo'])
    ) {
        throw new Exception('Campos requeridos faltantes', 400);
    }

    $proceso_id = intval($_POST['proceso_id']);
    $nombre     = trim($_POST['nombre']);
    $apellidos  = trim($_POST['apellidos']);
    $dni        = trim($_POST['dni']);
    $telefono   = trim($_POST['telefono']);
    $correo     = trim($_POST['correo']);
    $mensaje    = isset($_POST['mensaje']) ? trim($_POST['mensaje']) : null;

    $mysqli = obtenerConexionMain();
    $mysqli->begin_transaction();

    // Verificar que el proceso de selección existe
    $stmt = $mysqli->prepare("SELECT 1 FROM procesos WHERE id = ?");
    $stmt->bind_param("i", $proceso_id);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows === 0) {
        throw new Exception('Proceso de selección no encontrado', 400);
    }
    $stmt->close();

    // 1) Insertar en postulantes
    $u = $mysqli->prepare("
        INSERT INTO postulantes (nombre, apellidos, dni, telefono, correo)
        VALUES (?, ?, ?, ?, ?)
    ");
    $u->bind_param('sssss', $nombre, $apellidos, $dni, $telefono, $correo);
    if (!$u->execute()) {
        throw new Exception('Error al insertar postulante: '.$u->error, 500);
    }
    $postulante_id = $mysqli->insert_id;
    $u->close();

    // 2) Subida de archivo con debug
    if (!defined('UPLOADS_PATH')) {
        // Apunta dos niveles arriba a /empleos/uploads
        $rawPath = __DIR__ . '/../../uploads';
        error_log("DEBUG: path bruto → " . $rawPath);
        $resolved = realpath($rawPath);
        error_log("DEBUG: realpath → " . var_export($resolved, true));
        if (!$resolved) {
            throw new Exception('Ruta de uploads no existe: ' . $rawPath, 500);
        }
        define('UPLOADS_PATH', rtrim($resolved, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR);
    }
    if (!defined('UPLOADS_URL')) {
        define('UPLOADS_URL', '/empleos/uploads/');
    }
    // Verificar existencia y permisos
    if (!is_dir(UPLOADS_PATH) || !is_writable(UPLOADS_PATH)) {
        throw new Exception('Uploads no existe o no es escribible: ' . UPLOADS_PATH, 500);
    }

    $f = $_FILES['archivo'];
    if ($f['error'] !== UPLOAD_ERR_OK) {
        error_log("DEBUG: upload error code → " . $f['error']);
        throw new Exception('Error en la carga: código ' . $f['error'], 500);
    }
    if (!file_exists($f['tmp_name'])) {
        error_log("DEBUG: tmp file no existe → " . $f['tmp_name']);
        throw new Exception('Archivo temporal no encontrado', 500);
    }

    $filename = time() . '_' . basename($f['name']);
    $destino  = UPLOADS_PATH . $filename;
    error_log("DEBUG: moviendo " . $f['tmp_name'] . " → " . $destino);
    if (!move_uploaded_file($f['tmp_name'], $destino)) {
        error_log("DEBUG: fallo move_uploaded_file");
        throw new Exception('Error al subir archivo', 500);
    }
    $ruta = UPLOADS_URL . $filename;

    // 3) Insertar en postulaciones
    $p = $mysqli->prepare("
        INSERT INTO postulaciones (postulante_id, proceso_id, archivo, mensaje)
        VALUES (?, ?, ?, ?)
    ");
    $p->bind_param('iiss', $postulante_id, $proceso_id, $ruta, $mensaje);
    if (!$p->execute()) {
        throw new Exception('Error al insertar postulación: '.$p->error, 500);
    }
    $postulacion_id = $mysqli->insert_id;
    $p->close();

    // 4) Commit y respuesta
    $mysqli->commit();
    http_response_code(201);
    echo json_encode([
        'ok'              => true,
        'postulante_id'   => $postulante_id,
        'postulacion_id'  => $postulacion_id,
        'archivo'         => $ruta
    ], JSON_UNESCAPED_UNICODE);
    exit;

} catch (Exception $e) {
    // Rollback en caso de fallo
    if (isset($mysqli) && $mysqli->errno === 0) {
        $mysqli->rollback();
    }
    error_log('crear_postulacion: '.$e->getMessage());
    http_response_code($e->getCode() ?: 500);
    echo json_encode(['ok'=>false,'error'=>$e->getMessage()], JSON_UNESCAPED_UNICODE);
    exit;
}
