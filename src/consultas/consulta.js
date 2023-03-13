Router = require('express')
const oracledb = require('oracledb');
const router = Router()
const { exec } = require('child_process');
const path = require('path');

const dbConfig = {
    user: 'ldecast',
    password: 'ldecast',
    connectString: '34.30.194.63:1521/ORCL18', // cambiar por la cadena de conexión correcta
  };
  

router.get("/consulta1",async function(req,res){
    //http://localhost:8080/consultas/consulta1
    const consulta = `
        SELECT h.nombre AS Hospital, u.UBICACION, COUNT(v.id_victima) AS Fallecidos
        FROM Hospital h
        LEFT JOIN Ubicacion u ON h.id_ubicacion = u.id_ubicacion
        JOIN REGISTRO hv ON h.id_hospital = hv.id_hospital
        JOIN Victima v ON hv.id_victima = v.id_victima
        WHERE v.fecha_muerte IS NOT NULL
        GROUP BY u.UBICACION, h.nombre
        ORDER BY Fallecidos desc
        `;
    m_consulta(req,res,consulta)
})
router.get("/consulta2",async function(req,res){
    var consulta = `SELECT v.NOMBRE, v.APELLIDO, vt.EFECTIVIDAD_EN_VICTIMA 
    FROM VICTIMA v 
    JOIN VICTIMA_TRATAMIENTO vt ON v.ID_VICTIMA = vt.ID_VICTIMA 
    JOIN TRATAMIENTO t ON vt.ID_TRATAMIENTO = t.ID_TRATAMIENTO 
    WHERE v.STATUS_ENFERMEDAD = 'En cuarentena' AND t.NOMBRE = 'Transfusiones de sangre' AND vt.EFECTIVIDAD_EN_VICTIMA > 5`
    m_consulta(req,res,consulta)
})
router.get("/consulta3",async function(req,res){
    var consulta = `SELECT v.NOMBRE, V.APELLIDO , u.Ubicacion, COUNT(av.ID_ALLEGADO) AS ALLEGADOS 
    FROM VICTIMA v 
    JOIN UBICACION u ON u.ID_UBICACION =v.ID_DIRECCION 
    JOIN ALLEGADO_VICTIMA av ON av.ID_VICTIMA = V.ID_VICTIMA 
    WHERE v.FECHA_MUERTE IS not NULL 
    GROUP BY v.NOMBRE , V.APELLIDO, U.UBICACION 
    HAVING COUNT(DISTINCT av.ID_ALLEGADO) > 3  ORDER BY allegados`
    m_consulta(req,res,consulta)
})
router.get("/consulta4",async function(req,res){
    let consulta =`SELECT v.NOMBRE, V.APELLIDO ,v.STATUS_ENFERMEDAD 
    FROM VICTIMA v 
    JOIN ALLEGADO_VICTIMA av ON av.ID_VICTIMA = V.ID_VICTIMA
    JOIN TIPO_CONTACTO tc ON tc.ID_TIPOCONTACTO  = av.ID_TIPOCONTACTO 
    WHERE v.STATUS_ENFERMEDAD = 'Suspendida' AND tc.TIPO_CONTACTO ='Beso'
    GROUP BY v.NOMBRE , V.APELLIDO, v.STATUS_ENFERMEDAD 
    HAVING COUNT(DISTINCT av.ID_ALLEGADO) > 2`
    m_consulta(req,res,consulta)
})
router.get("/consulta5",async function(req,res){
    let consulta= `
    SELECT v.NOMBRE, V.APELLIDO, t.NOMBRE, COUNT(vt.ID_P_TRATAMIENTO) AS Tratamientos 
    FROM VICTIMA v 
    JOIN VICTIMA_TRATAMIENTO vt ON vt.ID_VICTIMA = v.ID_VICTIMA 
    JOIN TRATAMIENTO t ON t.ID_TRATAMIENTO = vt.ID_TRATAMIENTO 
    WHERE t.NOMBRE = 'Oxigeno' 
    GROUP BY v.NOMBRE, t.NOMBRE, v.APELLIDO 
    ORDER BY Tratamientos 
    FETCH FIRST 5 ROWS ONLY
    `
    m_consulta(req,res,consulta)
})
router.get("/consulta6",async function(req,res){
    let consulta =  `SELECT v.NOMBRE, V.APELLIDO , V.FECHA_MUERTE  
    FROM VICTIMA v 
    JOIN VICTIMA_TRATAMIENTO vt ON vt.ID_VICTIMA =v.ID_VICTIMA 
    JOIN TRATAMIENTO t ON t.ID_TRATAMIENTO =vt.ID_TRATAMIENTO 
    JOIN LUGAR_VICTIMA lv ON LV.ID_VICTIMA = V.ID_VICTIMA 
    JOIN UBICACION u ON U.ID_UBICACION = LV.ID_UBICACION 
    WHERE u.UBICACION ='1987 Delphine Well' AND t.NOMBRE = 'Manejo de la presion arterial'`;
    m_consulta(req,res,consulta)
})
router.get("/consulta7",async function(req,res){
    const consulta = `SELECT V.NOMBRE, V.APELLIDO, U.UBICACION
    FROM VICTIMA V
    JOIN UBICACION U ON U.ID_UBICACION = V.ID_DIRECCION
    JOIN VICTIMA_TRATAMIENTO VT ON V.ID_VICTIMA = VT.ID_VICTIMA
    JOIN REGISTRO R ON V.ID_VICTIMA = R.ID_VICTIMA
    JOIN ALLEGADO_VICTIMA AV ON V.ID_VICTIMA = AV.ID_VICTIMA
    GROUP BY V.ID_VICTIMA, V.NOMBRE, V.APELLIDO, U.UBICACION
    HAVING COUNT(DISTINCT AV.ID_ALLEGADO) < 2 AND COUNT(DISTINCT VT.ID_TRATAMIENTO) = 2`;
    m_consulta(req,res,consulta)

})
router.get("/consulta8",async function(req,res){
    const consulta = `SELECT v.NOMBRE, V.APELLIDO, EXTRACT(MONTH FROM V.FECHA_PRIMERA_SOSPECHA) AS MES_SOSPECHA, COUNT(vt.ID_P_TRATAMIENTO) AS N_tratamientos
    FROM  VICTIMA v 
    JOIN VICTIMA_TRATAMIENTO vt ON vt.ID_VICTIMA =v.ID_VICTIMA 
    GROUP BY v.NOMBRE, V.APELLIDO, EXTRACT(MONTH FROM v.FECHA_PRIMERA_SOSPECHA) 
    HAVING COUNT(*) = (
    SELECT MAX(N_TRATAMIENTOS) 
    FROM (
        SELECT COUNT(*) AS N_TRATAMIENTOS 
        FROM Victima V
        JOIN VICTIMA_TRATAMIENTO vt2  ON V.ID_VICTIMA  = vt2.ID_VICTIMA 
        GROUP BY v.NOMBRE, v.APELLIDO 
    )
    ) UNION 
    SELECT v.NOMBRE, V.APELLIDO, EXTRACT(MONTH FROM V.FECHA_PRIMERA_SOSPECHA) AS MES_SOSPECHA, COUNT(vt.ID_P_TRATAMIENTO) AS N_tratamientos
    FROM  VICTIMA v 
    JOIN VICTIMA_TRATAMIENTO vt ON vt.ID_VICTIMA =v.ID_VICTIMA 
    GROUP BY v.NOMBRE, V.APELLIDO, EXTRACT(MONTH FROM v.FECHA_PRIMERA_SOSPECHA) 
    HAVING COUNT(*) = (
    SELECT MIN(N_TRATAMIENTOS)
    FROM (
        SELECT COUNT(*) AS N_TRATAMIENTOS
        FROM Victima V
        JOIN VICTIMA_TRATAMIENTO vt2  ON V.ID_VICTIMA  = vt2.ID_VICTIMA 
        GROUP BY v.NOMBRE, v.APELLIDO 
    )
    ) ORDER BY N_TRATAMIENTOS DESC`;
    m_consulta(req,res,consulta)
})
router.get("/consulta9",async function(req,res){
    const consulta = `SELECT h.NOMBRE, (COUNT(R.ID_REGISTRO)/(SELECT COUNT(*) FROM VICTIMA)*100) AS PORCENTAJE, COUNT(R.ID_REGISTRO) AS N_REGISTROS
    FROM HOSPITAL h 
    JOIN REGISTRO r ON R.ID_HOSPITAL =H.ID_HOSPITAL 
    GROUP BY h.NOMBRE `;
    m_consulta(req,res,consulta)
})
router.get("/consulta10",async function(req,res){
    const consulta = `SELECT h.NOMBRE , c.TIPO_CONTACTO , 
    (COUNT(DISTINCT v.id_Victima) / (SELECT COUNT(*) FROM Victima) * 100) AS porcentaje
    FROM Hospital h
    JOIN  REGISTRO rh ON h.id_Hospital = rh.id_Hospital
    JOIN Victima v ON rh.id_Victima = v.id_Victima
    JOIN ALLEGADO_VICTIMA la ON v.id_Victima = la.id_Victima
    JOIN TIPO_CONTACTO  c ON la.ID_TIPOCONTACTO  = c.ID_TIPOCONTACTO 
    WHERE rh.id_Victima IN (
        SELECT id_Victima FROM ALLEGADO_VICTIMA
        WHERE id_TIPOCONTACTO = (
            SELECT ID_TIPOCONTACTO  FROM (
                SELECT id_TIPOCONTACTO, COUNT(*) cnt
                FROM ALLEGADO_VICTIMA av 
                GROUP BY id_TIPOCONTACTO
                ORDER BY cnt DESC
                FETCH FIRST 1 ROW ONLY
            )
        )
    )
    GROUP BY h.NOMBRE , c.TIPO_CONTACTO`
    m_consulta(req,res,consulta)
})
router.get("/eliminarTemporal",async function(req,res){
    let connection;
    try {
        // establecer la conexión con la base de datos
        connection = await oracledb.getConnection(dbConfig);
        // realizar la consulta
        await connection.execute("DROP TABLE TEMPORAL");
        await connection.execute(`CREATE TABLE TEMPORAL (
            NOMBRE_VICTIMA VARCHAR(60),
            APELLIDO_VICTIMA VARCHAR(60),
            DIRECCION_VICTIMA VARCHAR(100),
            FECHA_PRIMERA_SOSPECHA DATE,
            FECHA_CONFIRMACION DATE,
            FECHA_MUERTE DATE,
            ESTADO_VICTIMA VARCHAR(60),
            NOMBRE_ASOCIADO VARCHAR(60),
            APELLIDO_ASOCIADO VARCHAR(60),
            FECHA_CONOCIO  DATE,
            CONTACTO_FISICO VARCHAR(60),
            FECHA_INICIO_CONTACTO DATE ,
            FECHA_FIN_CONTACTO DATE ,
            NOMBRE_HOSPITAL VARCHAR(60),
            DIRECCION_HOSPITAL VARCHAR(100),
            UBICACION_VICTIMA VARCHAR(100),
            FECHA_LLEGADA DATE,
            FECHA_RETIRO DATE,
            TRATAMIENTO VARCHAR(60),
            EFECTIVIDAD int,
            FECHA_INICIO_TRATAMIENTO DATE,
            FECHA_FIN_TRATAMIENTO DATE,
            EFECTIVIDAD_EN_VICTIMA INT
          )`);
        await connection.close();

        // devolver el resultado como un JSON
        res.json({estado:"Temporal Eliminada"})
    } catch (err) {
        console.error(err.message);
        if (connection) {
        await connection.close();
        }
        return res.status(500).send('Error al realizar la consulta');
    }
})
router.get("/eliminarModelo",async function(req,res){
    let connection;
    try {
        // establecer la conexión con la base de datos
        connection = await oracledb.getConnection(dbConfig);
        // realizar la consulta
        await connection.execute('DROP TABLE Ubicacion CASCADE CONSTRAINTS');
        await connection.execute('DROP TABLE TRATAMIENTO CASCADE CONSTRAINTS');
        await connection.execute('DROP TABLE tipo_contacto CASCADE CONSTRAINTS');
        await connection.execute('DROP TABLE Allegado CASCADE CONSTRAINTS');
        await connection.execute('DROP TABLE hospital CASCADE CONSTRAINTS');
        await connection.execute('DROP TABLE Victima CASCADE CONSTRAINTS');
        await connection.execute('DROP TABLE REGISTRO CASCADE CONSTRAINTS');
        await connection.execute('DROP TABLE victima_tratamiento CASCADE CONSTRAINTS');
        await connection.execute('DROP TABLE Lugar_victima CASCADE CONSTRAINTS');
        await connection.execute('DROP TABLE Allegado_victima CASCADE CONSTRAINTS');
        await connection.close();

        // devolver el resultado como un JSON
        res.json({estado:"Modelo Eliminado con Exito"})
    } catch (err) {
        console.error(err.message);
        if (connection) {
        await connection.close();
        }
        return res.status(500).send('Error al realizar la consulta');
    }
})
router.get("/cargarTemporal",async function(req,res){
    const connectionString = 'ldecast/ldecast@34.30.194.63:1521/ORCL18';
    const controlFile = 'filecontrol.ctl';
    const dataFile = 'DB_Excel.csv';
    const command = `sqlldr ${connectionString} control=${controlFile} data=${dataFile}`;
    
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(stdout);
      return res.json({Carga:"carga exitosa"})
    });
})
router.get("/cargarModelo",async function(req,res){
    let connection;
    try {
        // establecer la conexión con la base de datos
        connection = await oracledb.getConnection(dbConfig);
        // realizar la consulta
        await connection.execute(`
        CREATE TABLE Ubicacion(
            id_ubicacion INTEGER GENERATED BY DEFAULT as identity (START WITH 1 INCREMENT BY 1) ,
            ubicacion VARCHAR(60),
            CONSTRAINT pk_ubicacion PRIMARY KEY(id_ubicacion)
        )`);
        
        await connection.execute(`
        CREATE TABLE Tratamiento (
            id_tratamiento INTEGER GENERATED BY DEFAULT as identity (START WITH 1 INCREMENT BY 1) ,
            nombre VARCHAR(50),
            efectividad int,
            PRIMARY KEY(id_tratamiento)
        )`);
        
        await connection.execute(`
        CREATE Table Tipo_contacto(
            id_tipocontacto INTEGER GENERATED BY DEFAULT as identity (START WITH 1 INCREMENT BY 1) ,
            tipo_contacto VARCHAR(50),
            PRIMARY key(id_tipocontacto)
        )`);
        
        await connection.execute(`
        CREATE Table Allegado(
            id_allegado INTEGER GENERATED BY DEFAULT as identity (START WITH 1 INCREMENT BY 1) ,
            nombre VARCHAR(50),
            apellido VARCHAR(50),
            PRIMARY KEY(id_allegado)
        )`);
        
        await connection.execute(`
        CREATE TABLE Hospital (
            id_hospital INTEGER GENERATED BY DEFAULT as identity (START WITH 1 INCREMENT BY 1) ,
            nombre VARCHAR(60),
            id_ubicacion int, 
            PRIMARY KEY (id_hospital),
            FOREIGN KEY (id_ubicacion) REFERENCES Ubicacion(id_ubicacion) 
        )`);
        
        await connection.execute(`
        CREATE TABLE Victima (
            id_victima INTEGER GENERATED BY DEFAULT as identity (START WITH 1 INCREMENT BY 1) ,
            nombre VARCHAR(60),
            apellido VARCHAR(60),
            id_direccion int,
            fecha_primera_sospecha date,
            fecha_confirmacion date,
            fecha_muerte date,
            status_enfermedad VARCHAR(50),
            PRIMARY key(id_victima),
            FOREIGN KEY (id_direccion) REFERENCES Ubicacion(id_ubicacion)
        )`);
        
        await connection.execute(`
        CREATE TABLE Registro(
            id_registro INTEGER GENERATED BY DEFAULT as identity (START WITH 1 INCREMENT BY 1) ,
            id_hospital int,
            id_victima int,
            PRIMARY KEY(id_registro),
            FOREIGN KEY (id_hospital) REFERENCES Hospital(id_hospital) ,
            FOREIGN KEY (id_victima) REFERENCES victima(id_victima) 
        )`);
        
        await connection.execute(`
        CREATE TABLE victima_tratamiento(
            id_p_tratamiento INTEGER GENERATED BY DEFAULT as identity (START WITH 1 INCREMENT BY 1) ,
            id_victima int,
            id_tratamiento int,
            efectividad_en_victima int,
            FECHA_INICIO_TRATAMIENTO DATE,
            FECHA_FIN_TRATAMIENTO DATE,
            PRIMARY KEY(id_p_tratamiento),
            FOREIGN KEY (id_victima) REFERENCES victima(id_victima),
            FOREIGN KEY (id_tratamiento) REFERENCES Tratamiento(id_tratamiento)
        )`);
        
        await connection.execute(`
        CREATE TABLE Lugar_victima(
            id_lugarvictima INTEGER GENERATED BY DEFAULT as identity (START WITH 1 INCREMENT BY 1) ,
            id_ubicacion int,
            id_victima int,
            fecha_llegada date,
            fecha_retiro date,
            PRIMARY KEY(id_lugarvictima),
            FOREIGN KEY (id_ubicacion) REFERENCES Ubicacion(id_ubicacion),
            FOREIGN KEY (id_victima) REFERENCES VICTIMA(id_victima)
        )`);
        
        await connection.execute(`
        CREATE TABLE Allegado_victima(
            id_allegadovictima INTEGER GENERATED BY DEFAULT as identity (START WITH 1 INCREMENT BY 1) ,
            id_victima int,
            id_allegado int,
            id_tipocontacto int,
            fecha_conocio date,
            fecha_inicio_contacto date,
            fecha_fin_contacto date,
            PRIMARY KEY(id_allegadovictima),
            FOREIGN KEY (id_victima) REFERENCES victima(id_victima),
            FOREIGN KEY (id_allegado) REFERENCES Allegado(id_allegado),
            FOREIGN KEY (id_tipocontacto) REFERENCES Tipo_contacto(id_tipocontacto)
        )`);
        
        //RELLENAR TABLAS
        await connection.execute(`INSERT INTO Ubicacion(ubicacion)
        SELECT DISTINCT temporal.direccion_victima FROM TEMPORAL union
        select DISTINCT temporal.direccion_hospital FROM temporal union
        select DISTINCT temporal.ubicacion_victima FROM TEMPORAL
        WHERE 
            temporal.direccion_victima is not null AND 
            temporal.direccion_hospital is not null AND 
            temporal.ubicacion_victima is not null 
        `);
        

        await connection.execute(`INSERT INTO Tratamiento (nombre,efectividad) 
        SELECT DISTINCT
            temporal.TRATAMIENTO,
            temporal.EFECTIVIDAD
        FROM temporal
        WHERE 
            temporal.tratamiento is not null AND 
            temporal.EFECTIVIDAD is not null
        `);


        await connection.execute(`INSERT INTO Tipo_contacto(tipo_contacto) 
        SELECT DISTINCT
            temporal.CONTACTO_FISICO
        FROM temporal
        WHERE 
            temporal.CONTACTO_FISICO is not null
        `);


        await connection.execute(`INSERT INTO ALLEGADO(nombre,apellido) 
        SELECT DISTINCT 
            TEMPORAL.NOMBRE_ASOCIADO,
            TEMPORAL.APELLIDO_ASOCIADO
        FROM TEMPORAL
        WHERE 
            TEMPORAL.NOMBRE_ASOCIADO is not null
        `);

        await connection.execute(`INSERT INTO Hospital (id_ubicacion, nombre) 
        SELECT DISTINCT
            ubicacion.id_ubicacion,   
            temporal.NOMBRE_HOSPITAL 
        FROM Temporal, Ubicacion
        WHERE 
            temporal.NOMBRE_HOSPITAL is not null AND 
            temporal.DIRECCION_HOSPITAL = Ubicacion.ubicacion 
        `);

        await connection.execute(`INSERT INTO Victima (nombre, apellido, id_direccion, fecha_primera_sospecha, fecha_confirmacion, fecha_muerte,status_enfermedad) 
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
        `);
        await connection.execute(`INSERT INTO Registro(id_hospital,id_victima)
        SELECT DISTINCT 
            Hospital.id_hospital,
            victima.id_victima
        FROM Temporal, Hospital, victima 
        WHERE 
            temporal.NOMBRE_HOSPITAL = Hospital.nombre and
            temporal.NOMBRE_VICTIMA = Victima.nombre AND 
            TEMPORAL.APELLIDO_VICTIMA = Victima.APELLIDO 
        `);


        await connection.execute(`INSERT INTO victima_tratamiento(id_victima,id_tratamiento,efectividad_en_victima,FECHA_INICIO_TRATAMIENTO,FECHA_FIN_TRATAMIENTO)
        SELECT DISTINCT 
            Victima.id_victima,
            Tratamiento.id_tratamiento,
            TEMPORAL.EFECTIVIDAD_EN_VICTIMA,
            TEMPORAL.FECHA_INICIO_TRATAMIENTO,
            TEMPORAL.FECHA_FIN_TRATAMIENTO
        FROM Temporal, TRATAMIENTO, victima 
        WHERE 
            TEMPORAL.NOMBRE_VICTIMA = VICTIMA.NOMBRE AND
            TEMPORAL.APELLIDO_VICTIMA = VICTIMA.APELLIDO AND 
            TEMPORAL.TRATAMIENTO = TRATAMIENTO.NOMBRE 
        `);

        await connection.execute(`INSERT INTO Lugar_victima(id_victima,id_ubicacion,fecha_llegada,fecha_retiro)
        SELECT DISTINCT 
            Victima.id_victima,
            Ubicacion.ID_UBICACION,
            TEMPORAL.FECHA_LLEGADA,
            TEMPORAL.FECHA_RETIRO
        FROM Temporal, Ubicacion, victima 
        WHERE 
            TEMPORAL.UBICACION_VICTIMA = Ubicacion.ubicacion and
            TEMPORAL.NOMBRE_VICTIMA  = Victima.nombre AND 
            TEMPORAL.APELLIDO_VICTIMA  = Victima.APELLIDO 
        `);


        await connection.execute(`INSERT INTO ALLEGADO_victima(id_victima,id_allegado,id_tipocontacto,fecha_inicio_contacto,fecha_fin_contacto, fecha_conocio)
        SELECT DISTINCT 
            Victima.id_victima,
            Allegado.id_allegado,
            Tipo_contacto.id_tipocontacto,
            TEMPORAL.FECHA_INICIO_CONTACTO,
            TEMPORAL.FECHA_FIN_CONTACTO,
            TEMPORAL.FECHA_CONOCIO
        FROM temporal,Victima,Allegado,TIPO_CONTACTO
        WHERE 
            TEMPORAL.NOMBRE_VICTIMA = VICTIMA.NOMBRE  AND
            temporal.APELLIDO_VICTIMA = victima.APELLIDO AND
            TEMPORAL.NOMBRE_ASOCIADO = ALLEGADO.NOMBRE  AND
            temporal.APELLIDO_ASOCIADO = allegado.APELLIDO AND 
            TEMPORAL.CONTACTO_FISICO = TIPO_CONTACTO.TIPO_CONTACTO`);
        connection.close();
        // devolver el resultado como un JSON
        res.json({estado:"Tablas creadas y cargadas"})
    } catch (err) {
        console.error(err.message);
        if (connection) {
        await connection.close();
        }
        return res.status(500).send('Error al realizar la consulta');
    }
})

m_consulta=async(req,res,consulta)=>{
    let connection;
    try {
        // establecer la conexión con la base de datos
        connection = await oracledb.getConnection(dbConfig);
        // realizar la consulta
        const result = await connection.execute(consulta);
        const rows = result.rows;
        const columnNames = result.metaData.map(column => column.name);
        const data = rows.map(row => {
        return columnNames.reduce((obj, column, index) => {
            obj[column] = row[index];
            return obj;
        }, {});
        });
        // cerrar la conexión
        await connection.close();
        // devolver el resultado como un JSON
        return res.json(data);
        return res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        if (connection) {
        await connection.close();
        }
        return res.status(500).send('Error al realizar la consulta');
    }
}



module.exports=router;