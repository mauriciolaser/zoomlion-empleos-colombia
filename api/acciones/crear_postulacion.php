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
        !isset($_POST['empleo_id'], $_POST['nombre'], $_POST['apellidos'], $_POST['dni'],
                $_POST['telefono'], $_POST['correo']) ||
        !isset($_FILES['archivo'])
    ) {
        throw new Exception('Campos requeridos faltantes', 400);
    }

    $empleo_id = intval($_POST['empleo_id']);
    $nombre    = trim($_POST['nombre']);
    $apellidos = trim($_POST['apellidos']);
    $dni       = trim($_POST['dni']);
    $telefono  = trim($_POST['telefono']);
    $correo    = trim($_POST['correo']);
    $mensaje   = isset($_POST['mensaje']) ? trim($_POST['mensaje']) : null;

    require_once __DIR__ . '/../config.php';
    $mysqli = obtenerConexion();

    if (!defined('UPLOADS_PATH')) define('UPLOADS_PATH', __DIR__ . '/../uploads/');
    if (!defined('UPLOADS_URL'))  define('UPLOADS_URL', '/empleos/uploads/');

    $u = $mysqli->prepare("INSERT INTO usuarios (nombre, apellidos, dni, telefono, correo) VALUES (?,?,?,?,?)");
    if (!$u->execute([$nombre,$apellidos,$dni,$telefono,$correo])) {
        throw new Exception('Insert usuario: '.$u->error, 500);
    }
    $usuario_id = $u->insert_id;
    $u->close();

    if (!is_dir(UPLOADS_PATH) && !mkdir(UPLOADS_PATH, 0755, true)) {
        throw new Exception('No se pudo crear carpeta uploads', 500);
    }
    $f        = $_FILES['archivo'];
    $filename = time().'_'.basename($f['name']);
    $destino  = UPLOADS_PATH.$filename;
    if (!move_uploaded_file($f['tmp_name'],$destino)) {
        throw new Exception('Error al subir archivo', 500);
    }
    $ruta     = UPLOADS_URL.$filename;

    $p = $mysqli->prepare("INSERT INTO postulaciones (usuario_id, empleo_id, archivo, mensaje) VALUES (?,?,?,?)");
    if (!$p->execute([$usuario_id,$empleo_id,$ruta,$mensaje])) {
        throw new Exception('Insert postulación: '.$p->error, 500);
    }

    http_response_code(201);
    echo json_encode(['ok'=>true,'id'=>$p->insert_id,'archivo'=>$ruta], JSON_UNESCAPED_UNICODE);
    $p->close();
    exit;

} catch (Exception $e) {
    error_log('crear_postulacion: '.$e->getMessage());
    http_response_code($e->getCode() ?: 500);
    echo json_encode(['ok'=>false,'error'=>$e->getMessage()], JSON_UNESCAPED_UNICODE);
    exit;
}
