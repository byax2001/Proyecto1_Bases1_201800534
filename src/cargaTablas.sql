DROP TABLE Categoria_Pelicula;
DROP TABLE Categoria;
DROP TABLE Traduccion;
DROP TABLE Idioma;
DROP TABLE Pelicula_Actor;
DROP TABLE Actor;
DROP TABLE Inventario;
DROP TABLE Renta;
DROP TABLE Pelicula;
DROP TABLE Clasificacion;
DROP TABLE Cliente;
DROP TABLE Ciudad;
DROP TABLE Pais;
DROP TABLE Empleado;
DROP TABLE Tienda;

---------------------
-- Insertar Ubicaciones --
---------------------
INSERT INTO Ubicacion (nombre) 
SELECT DISTINCT
    temporal.pais_cliente 
FROM temporal
WHERE temporal.pais_cliente != '-';

SELECT * FROM pais;

-----------------------
-- Insertar Ciudades --
-----------------------
INSERT INTO ciudad (nombre, codigo_postal,id_pais) 
SELECT DISTINCT
    temporal.ciudad_cliente,
    temporal.codigo_postal_cliente,
    pais.id_pais    
FROM temporal, pais
WHERE 
    pais.nombre = temporal.pais_cliente AND
    temporal.codigo_postal_cliente != '-' AND
    temporal.ciudad_cliente != '-'
;

SELECT * FROM ciudad
ORDER BY id_ciudad;

----------------------
-- Insertar Tiendas --
----------------------
INSERT INTO tienda (direccion)
SELECT DISTINCT 
    temporal.direccion_tienda
FROM temporal
WHERE temporal.direccion_tienda != '-';

SELECT * FROM tienda;

-----------------------
-- Insertar Clientes --
-----------------------
INSERT INTO cliente (nombre, apellido, correo, direccion, fecha_reg, activo, videoteca_fav, id_ciudad) 
SELECT DISTINCT 
       SUBSTR(temporal.nombre_cliente, 1, INSTR(temporal.nombre_cliente, ' ')-1) AS "Nombre",
       SUBSTR(temporal.nombre_cliente, INSTR(temporal.nombre_cliente, ' ')+1) AS "Apellido",
       temporal.correo_cliente,
       temporal.direccion_cliente,
       TO_TIMESTAMP(temporal.fecha_creacion),
       temporal.cliente_activo,
       temporal.tienda_preferida,
       CAST(ciudad.id_ciudad AS INTEGER)
FROM temporal, ciudad
WHERE
    temporal.nombre_cliente != '-' AND
    temporal.correo_cliente != '-' AND
    temporal.direccion_cliente!= '-' AND
    temporal.fecha_creacion != '-' AND
    temporal.cliente_activo != '-' AND
    temporal.tienda_preferida != '-' AND
    ciudad.nombre = temporal.ciudad_cliente
;
SELECT * FROM cliente;


------------------------
-- Insertar Empleados --
------------------------
INSERT INTO empleado (nombre, apellido, direccion, correo, activo, usuario, password, jefe_tienda, id_tienda)
SELECT DISTINCT
    SUBSTR(temporal.nombre_empleado, 1, INSTR(temporal.nombre_empleado, ' ')-1) AS "Nombre Empleado",
    SUBSTR(temporal.nombre_empleado, INSTR(temporal.nombre_empleado, ' ')+1) AS "Apellido Empleado", 
    temporal.direccion_empleado,
    temporal.correo_empleado,
    temporal.empleado_activo,
    temporal.usuario_empleado,
    temporal.contrasenia_empleado,
    temporal.encargado_tienda,
    CAST(tienda.id_tienda AS INTEGER)
FROM temporal, tienda
WHERE
    temporal.nombre_empleado != '-' AND
    tienda.direccion = temporal.direccion_tienda
;

SELECT * FROM empleado;

------------------------------
-- Insertar Clasificaciones --
------------------------------
INSERT INTO clasificacion (clasificacion)
SELECT DISTINCT
    temporal.clasificacion
FROM temporal
WHERE temporal.clasificacion != '-';

SELECT * FROM clasificacion;


------------------------------
-- Insertar Categorias      --
------------------------------
INSERT INTO categoria(nombre)
SELECT DISTINCT
    temporal.categoria_pelicula
FROM temporal
WHERE temporal.categoria_pelicula != '-';

SELECT * FROM categoria;

------------------------------
-- Insertar Idiomas         --
------------------------------
INSERT INTO idioma(idioma)
SELECT DISTINCT
    temporal.lenguaje_pelicula
FROM temporal
WHERE temporal.lenguaje_pelicula != '-';

SELECT * FROM idioma;

------------------------------
-- Insertar Actores         --
------------------------------
INSERT INTO actor(nombre, apellido)
SELECT DISTINCT
    SUBSTR(temporal.actor_pelicula, 1, INSTR(temporal.actor_pelicula, ' ')-1) AS "Nombre Actor",
    SUBSTR(temporal.actor_pelicula, INSTR(temporal.actor_pelicula, ' ')+1) AS "Apellido Actor"
FROM temporal
WHERE temporal.actor_pelicula != '-';


------------------------------
-- Insertar Peliculas       --
------------------------------
INSERT INTO pelicula(titulo, descripcion, lanzamiento, duracion, dias_renta,
                    costo_renta, cargo_extra, idioma_original, id_clasificacion)
SELECT DISTINCT
    temporal.nombre_pelicula AS "NOMBRE",
    temporal.descripcion_pelicula AS "DESCRIPCION",
    temporal.anio_lanzamiento AS "LANZAMIENTO",
    temporal.duracion AS "DIRECCION",
    temporal.dias_renta AS "DIAS RENTA",
    temporal.costo_renta AS "COSTO RENTA",
    temporal.costo_por_danio AS "COSTO POR DANIO",
    temporal.lenguaje_pelicula AS "IDIOMA",
    clasificacion.id_clasificacion AS "CLASIFICACION"
FROM 
    temporal, clasificacion
WHERE
    temporal.nombre_pelicula !='-'
    AND temporal.descripcion_pelicula !='-'
    AND temporal.anio_lanzamiento !='-'
    AND temporal.duracion !='-'
    AND temporal.dias_renta !='-'
    AND temporal.clasificacion = clasificacion.clasificacion
;

SELECT * FROM pelicula;



---------------------------------
-- Insertar Categoria_Pelicula --
---------------------------------
INSERT INTO categoria_pelicula (id_categoria,id_pelicula)
SELECT DISTINCT
    categoria.id_categoria,
    pelicula.id_pelicula
FROM 
    categoria, 
    pelicula, 
    temporal
WHERE
    temporal.nombre_pelicula = pelicula.titulo 
    AND temporal.categoria_pelicula = categoria.nombre
ORDER BY categoria.id_categoria;


---------------------------------
-- Insertar Pelicula_Actor     --
---------------------------------
INSERT INTO pelicula_actor(id_pelicula, id_actor)
SELECT DISTINCT
    pelicula.id_pelicula,
    actor.id_actor
FROM 
    pelicula,
    actor,
    temporal
WHERE
    temporal.nombre_pelicula = pelicula.titulo
    AND temporal.actor_pelicula = CONCAT(CONCAT( actor.nombre,' '), actor.apellido)
;

---------------------------------
-- Insertar Traduccion         --
---------------------------------
INSERT INTO traduccion (id_idioma,id_pelicula)
SELECT DISTINCT
    idioma.id_idioma,
    pelicula.id_pelicula
FROM 
    idioma,
    pelicula,
    temporal
WHERE 
    temporal.lenguaje_pelicula = idioma.idioma 
    AND temporal.nombre_pelicula = pelicula.titulo
;

---------------------------------
-- Insertar Inventario         --
---------------------------------
INSERT INTO inventario(id_tienda, id_pelicula)
SELECT DISTINCT
    tienda.id_tienda,
    pelicula.id_pelicula
FROM
    tienda,
    pelicula,
    temporal
WHERE
    temporal.direccion_tienda = tienda.direccion
    AND temporal.nombre_pelicula = pelicula.titulo
;

SELECT COUNT(*) FROM inventario;

---------------------------------
-- Insertar Renta              --
---------------------------------
INSERT INTO renta (id_cliente, id_empleado, pago, fecha_pago, fecha_rent,
                    fecha_dev, id_pelicula)
SELECT DISTINCT
    CAST(cliente.id_cliente AS INTEGER),
    CAST(empleado.id_empleado AS INTEGER),
    CAST(temporal.monto_a_pagar AS FLOAT),
    TO_TIMESTAMP(temporal.fecha_pago),
    TO_TIMESTAMP(temporal.fecha_renta),
    TO_TIMESTAMP(temporal.fecha_retorno),
    CAST(pelicula.id_pelicula AS INTEGER)
FROM 
    cliente,
    empleado,
    temporal,
    pelicula
WHERE
    temporal.nombre_cliente = CONCAT(CONCAT( cliente.nombre,' '), cliente.apellido)
    AND temporal.nombre_empleado = CONCAT(CONCAT(empleado.nombre,' '), empleado.apellido)
    AND temporal.nombre_pelicula = pelicula.titulo
    AND temporal.fecha_pago != '-'
    AND temporal.fecha_renta != '-'
    AND temporal.fecha_retorno != '-'
;

SELECT COUNT(*) FROM renta;


COMMIT;



SELECT 
    cliente.nombre,
    pelicula.titulo
FROM renta, cliente, pelicula
WHERE
    renta.id_cliente = cliente.id_cliente
    AND renta.id_pelicula = pelicula.id_pelicula
ORDER BY cliente.nombre;



SELECT  DISTINCT temporal.nombre_cliente, temporal.nombre_pelicula,
        temporal.fecha_renta
FROM temporal
WHERE nombre_cliente != '-'
ORDER BY temporal.nombre_cliente;