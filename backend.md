## Sobre Backend

1. Estructura de /api/

/empleos
└── api
    ├── .htaccess
    ├── index.php
    ├── config.php
    └── acciones
        ├── listar.php
        ├── ver-postulaciones.php
        ├── crear-empleo.php
        └── (otros endpoints públicos, si los hubiera)
.htaccess

Redirige todas las peticiones a index.php (por ejemplo, usando mod_rewrite), de modo que cualquier llamada a /api/index.php?action=... quede gestionada por ese único archivo.

index.php

Lee $_GET['action'] y el método HTTP (GET/POST/OPTIONS).

Según action, hace require_once 'acciones/<archivo>.php'.

Si la acción no existe o el método no coincide, devuelve un JSON con código de error.

config.php

Define constantes/conexión a BD, p. ej.:

php

define('DB_HOST','localhost');
define('DB_USER','root');
define('DB_PASSWORD','');
define('DB_NAME','zlcpanel_empleos_db');

function obtenerConexion() {
    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
    if ($mysqli->connect_errno) {
        http_response_code(500);
        echo json_encode(['error'=>'Error de conexión: '.$mysqli->connect_error]);
        exit;
    }
    $mysqli->set_charset('utf8');
    return $mysqli;
}
Toda acción que necesite acceder a la BD usa require_once __DIR__ . '/../config.php' y luego $conn = obtenerConexion();.

/acciones

listar.php

Consulta la tabla empleos y hace echo json_encode($empleos) y exit;.

ver-postulaciones.php

Consulta la tabla de postulaciones (p. ej. postulaciones), devuelve todo o filtra según $_GET['empleo_id'].

crear-empleo.php

Lee php://input (JSON), valida campos, hace INSERT INTO empleos (...) VALUES (...), devuelve { success: true, id: ... }.

(Puedes añadir más archivos al directorio acciones para otros endpoints públicos.)

2. Estructura de /admin/
pgsql

/empleos
└── admin
    ├── .htaccess
    ├── index.php
    ├── config.php
    └── acciones
        ├── listar.php
        ├── crear-empleo.php
        ├── ver-postulaciones.php
        └── actualizar-proceso.php
.htaccess

Igual que en /api, redirige internamente todo a index.php para que se manejen las acciones (action=...).

index.php

Contiene las cabeceras CORS/preflight y lee $_GET['action'].

Ramas típicas:

php

if ($_SERVER['REQUEST_METHOD']==='GET' && $action==='listar') {
    require_once __DIR__ . '/acciones/listar.php';
}
elseif ($_SERVER['REQUEST_METHOD']==='POST' && $action==='crear') {
    require_once __DIR__ . '/acciones/crear-empleo.php';
}
elseif ($_SERVER['REQUEST_METHOD']==='GET' && $action==='ver-postulaciones') {
    require_once __DIR__ . '/acciones/ver-postulaciones.php';
}
elseif ($_SERVER['REQUEST_METHOD']==='POST' && $action==='actualizar-proceso') {
    require_once __DIR__ . '/acciones/actualizar-proceso.php';
}
else {
    http_response_code(400);
    echo json_encode(['error'=>'Acción no válida o método no soportado']);
    exit;
}
Todas las acciones require_once devuelven un JSON y hacen exit; al final.

config.php

Define la conexión a BD para el área de administración. Ejemplo:

php

<?php
// /empleos/admin/config.php

define('DB_HOST',     'localhost');
define('DB_USER',     'root');
define('DB_PASSWORD', '');
define('DB_NAME',     'zlcpanel_empleos_db');

function obtenerConexion() {
    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
    if ($mysqli->connect_errno) {
        http_response_code(500);
        echo json_encode(['error'=>'Error de conexión a BD: '.$mysqli->connect_error]);
        exit;
    }
    $mysqli->set_charset('utf8');
    return $mysqli;
}
Todas las acciones en /admin/acciones hacen require_once __DIR__ . '/../config.php' y luego $conn = obtenerConexion();.

/acciones

listar.php

Consulta y devuelve JSON con todos los procesos/empleos (SELECT * FROM empleos).

crear-empleo.php

Lee php://input, valida, hace INSERT INTO empleos(...) y devuelve { success: true, id: <nuevo_id> }.

ver-postulaciones.php

Devuelve un arreglo JSON con todas las postulaciones (o filtra según $_GET['empleo_id'] si se recibe).

actualizar-proceso.php

Lee php://input (JSON con { id, titulo, empresa, ubicacion, fecha_publicacion, fecha_cierre }), valida, hace UPDATE empleos SET ... WHERE id = ?, y devuelve { success:true, message: 'Proceso actualizado correctamente' } o bien { success:false, error: '...' }.

(Si en el futuro añades nuevas funcionalidades administrativas, simplemente creas un nuevo archivo dentro de admin/acciones y amplías el index.php para que reconozca esa action.)

3. Lógica de enrutamiento con .htaccess
Tanto en /api como en /admin se usa un fichero .htaccess que contiene algo parecido a:

apacheconf

RewriteEngine On
# Si el fichero o directorio existe, lo sirve directamente
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# En cualquier otro caso, redirige a index.php manteniendo query strings
RewriteRule ^ index.php [QSA,L]
De este modo, cualquier URL como /admin/accionX o /api/accionY llega a index.php?action=accionX (en realidad sigue siendo /index.php?action=...), y allí se encarga de despachar a la acción concreta.

4. Cómo consume el front-end estas URLs
En React/Vite tienes en tu .env (o .env.local) una variable:

env

VITE_EMPLEOS_URL=http://localhost/empleos/admin
React hace llamadas así, por ejemplo:

js

fetch(`${import.meta.env.VITE_EMPLEOS_URL}/index.php?action=listar`)
o

js

fetch(`${import.meta.env.VITE_EMPLEOS_URL}/index.php?action=actualizar-proceso`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id, titulo, empresa, … })
});
Gracias a VITE_EMPLEOS_URL, si en producción tu backend estuviera en https://misitio.com/api, bastaría con cambiar la variable de entorno en el servidor para que React apunte a la ruta correcta, sin tocar el código.

Resumen final
/api/acciones/: archivos encargados de exponer endpoints públicos (p. ej. listar empleos, ver postulaciones, crear empleo, etc.).

/admin/acciones/: archivos relacionados solo con la administración (listar, crear, ver postulaciones y actualizar un proceso).

Cada carpeta principal (/api y /admin) lleva su propio .htaccess que redirige todo a index.php, donde se despachan las acciones.

config.php en cada área define la conexión a BD y las constantes necesarias.

El front-end React/Vite utiliza siempre import.meta.env.VITE_EMPLEOS_URL para construir la URL completa hacia index.php?action=….