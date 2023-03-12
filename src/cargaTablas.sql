DROP TABLE Ubicacion;
DROP TABLE TRATAMIENTO;
DROP Table tipo_contacto;
drop Table Allegado;
DROP TABLE hospital;
DROP TABLE Victima;
DROP TABLE REGISTRO;
DROP TABLE victima_tratamiento;
DROP TABLE Lugar_victima;
DROP TABLE CONTACTO;

--------------------------
-- Insertar Ubicaciones --
--------------------------
INSERT INTO Ubicacion (ubicacion) 
SELECT DISTINCT
    temporal.direccion_victima,
    temporal.direccion_hospital,
    temporal.ubicacion_victima
FROM temporal
WHERE 
    temporal.direccion_victima is not null AND 
    temporal.direccion_hospital is not null AND 
    temporal.ubicacion_victima is not null 
;

SELECT * FROM ubicacion;
ORDER by id_ubicacion;

--------------------------
---Insertar Tratamiento---
--------------------------
INSERT INTO Tratamiento (nombre,efectividad) 
SELECT DISTINCT
    temporal.TRATAMIENTO,
    temporal.EFECTIVIDAD,
FROM temporal
WHERE 
    temporal.tratamiento is not null AND 
    temporal.EFECTIVIDAD is not null
;
SELECT * FROM Tratamiento;
ORDER by id_tratamiento;

----------------------------
---Insertar Tipo Contacto---
----------------------------
INSERT INTO Tipo_contacto (nombre) 
SELECT DISTINCT
    temporal.CONTACTO_FISICO
FROM temporal
WHERE 
    temporal.CONTACTO_FISICO is not null
;
SELECT * FROM Tipo_contacto;
ORDER by id_tipocontacto;

----------------------------
--Insertar Allegado--
----------------------------
INSERT INTO Allegado (nombre,apellido,fecha_conocio) 
SELECT DISTINCT
    temporal.NOMBRE_ASOCIADO,
    TEMPORAL.APELLIDO_ASOCIADO,
    TEMPORAL.FECHA_CONOCIO
FROM temporal
WHERE 
    temporal.NOMBRE_ASOCIADO is not null
;
SELECT * FROM Tipo_contacto;
ORDER by id_allegado;

-------------------------
---Insertar Hospitales---
-------------------------
INSERT INTO Hospital (id_ubicacion, nombre) 
SELECT DISTINCT
    ubicacion.id_ubicacion    --tomar id de la ubicacion
    temporal.NOMBRE_HOSPITAL, --tomar el nombre del hospital
FROM Temporal, Ubicacion
WHERE 
    temporal.NOMBRE_HOSPITAL is not null AND --que el nombre del hospital no sea nulo
    --BUSCA LA FILA DE UBICACION CON LA CONCIDENCIA Y LA REGRESA PARA EL DISTINCT
    temporal.DIRECCION_HOSPITAL = Ubicacion.ubicacion --tomar el id_ubicacion donde ubicacion sea igual a direccion hospital
;
SELECT * FROM Hospital
ORDER BY id_hospital;

-----------------------
-- Insertar Victima --
-----------------------
INSERT INTO Victima (nombre, apellido, id_direccion, fecha_primera_sospecha, fecha_confirmacion, fecha_muerte,status_enfermedad) 
SELECT DISTINCT 
       temporal.NOMBRE_VICTIMA,
       temporal.APELLIDO_VICTIMA,
       ubicacion.id_ubicacion,
       temporal.FECHA_PRIMERA_SOSPECHA,
       temporal.FECHA_CONFIRMACION,
       TEMPORAL.FECHA_MUERTE,
       TEMPORAL.ESTADO_VICTIMA
FROM temporal, Ubicacion
WHERE
   TEMPORAL.DIRECCION_VICTIMA = Ubicacion.ubicacion
;
SELECT * FROM Victima;

----------------------
-- Insertar Registro (victima-Hospital) --
----------------------
INSERT INTO Registro(id_hospital,id_victima)
SELECT DISTINCT 
    Hospital.id_hospital,
    victima.id_victima,
FROM Temporal, Hospital, victima 
WHERE 
    Temporal.NOMBRE_HOSPITAL != NULL AND
    temporal.NOMBRE_HOSPITAL = Hospital.nombre and
    temporal.NOMBRE_VICTIMA = Victima.nombre;

SELECT * FROM Registro;


----------------------------------
-- Insertar Victima-tratamiento --
----------------------------------
INSERT INTO victima_tratamiento(id_victima,id_tratamiento,efectividad_en_victima,FECHA_INICIO_TRATAMIENTO,FECHA_FIN_TRATAMIENTO)
SELECT DISTINCT 
    Victima.id_victima,
    Tratamiento.id_tratamiento,
    TEMPORAL.EFECTIVIDAD_EN_VICTIMA,
    TEMPORAL.FECHA_INICIO_TRATAMIENTO,
    TEMPORAL.FECHA_FIN_TRATAMIENTO
FROM Temporal, Hospital, victima, 
WHERE 
    TEMPORAL.TRATAMIENTO = Tratamiento.nombre and
    TEMPORAL.NOMBRE_ASOCIADO = Victima.nombre
SELECT * FROM victima_tratamiento;

----------------------------
---Insertar Lugar_victima---
----------------------------
INSERT INTO victima_tratamiento(id_victima,id_ubicacion,fecha_llegada,fecha_retiro)
SELECT DISTINCT 
    Victima.id_victima,
    Ubicacion.ubicacion
    TEMPORAL.FECHA_LLEGADA,
    TEMPORAL.FECHA_RETIRO
FROM Temporal, Ubicacion, victima, 
WHERE 
    TEMPORAL.UBICACION_VICTIMA = Ubicacion.ubicacion and
    TEMPORAL.NOMBRE_ASOCIADO = Victima.nombre
SELECT * FROM victima_tratamiento;

----------------------------------------
-- Insertar Contacto(Allegado-Victima)--
----------------------------------------
INSERT INTO Contacto(id_victima,id_allegado,id_tipocontacto,fecha_inicio_contacto,fecha_fin_contacto)
SELECT DISTINCT
    Victima.id_victima,
    Allegado.id_allegado,
    Tipo_contacto.id_tipocontacto,
    TEMPORAL.FECHA_INICIO_CONTACTO,
    TEMPORAL.FECHA_FIN_CONTACTO
FROM temporal,Victima,Allegado
WHERE 
    TEMPORAL.NOMBRE_VICTIMA = Victima.nombre and
    TEMPORAL.NOMBRE_ASOCIADO = Allegado.nombre and
    TEMPORAL.CONTACTO_FISICO = Tipo_contacto.tipo_contacto;
SELECT * FROM CONTACTO;
