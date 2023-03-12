Router = require('express')
const oracledb = require('oracledb');
const fs = require('fs')
const path = require('path')
const router = Router()

const dbConfig = {
    user: 'ldecast',
    password: 'ldecast',
    connectString: '34.30.194.63:1521/ORCL18', // cambiar por la cadena de conexión correcta
  };
  

router.get("/consulta1",async function(req,res){
    //http://localhost:8080/consultas/consulta1
    let connection;

    try {
        // establecer la conexión con la base de datos
        connection = await oracledb.getConnection(dbConfig);
        // realizar la consulta
        const consulta = `
        SELECT h.nombre AS Hospital, u.UBICACION, COUNT(v.id_victima) AS Fallecidos
        FROM Hospital h
        LEFT JOIN Ubicacion u ON h.id_ubicacion = u.id_ubicacion
        JOIN REGISTRO hv ON h.id_hospital = hv.id_hospital
        JOIN Victima v ON hv.id_victima = v.id_victima
        WHERE v.fecha_muerte IS NOT NULL
        GROUP BY u.UBICACION, h.nombre
        ORDER BY Fallecidos DESC
        `;
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
})
router.get("/consulta2",async function(req,res){
    let connection;

    try {
        // establecer la conexión con la base de datos
        connection = await oracledb.getConnection(dbConfig);
        // realizar la consulta
        var consulta = `SELECT v.NOMBRE, v.APELLIDO, v.STATUS_ENFERMEDAD, vt.EFECTIVIDAD_EN_VICTIMA 
        FROM VICTIMA v 
        JOIN VICTIMA_TRATAMIENTO vt ON v.ID_VICTIMA = vt.ID_VICTIMA 
        JOIN TRATAMIENTO t ON vt.ID_TRATAMIENTO = t.ID_TRATAMIENTO 
        WHERE v.STATUS_ENFERMEDAD = 'En cuarentena' AND t.NOMBRE = 'Transfusiones de sangre' AND vt.EFECTIVIDAD_EN_VICTIMA > 5`
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
})
router.get("/consulta3",async function(req,res){
    let connection;

    try {
        // establecer la conexión con la base de datos
        connection = await oracledb.getConnection(dbConfig);
        // realizar la consulta
        var consulta = `SELECT v.NOMBRE, V.APELLIDO , u.Ubicacion, COUNT(av.ID_ALLEGADO) AS ALLEGADOS 
        FROM VICTIMA v 
        JOIN UBICACION u ON u.ID_UBICACION =v.ID_DIRECCION 
        JOIN ALLEGADO_VICTIMA av ON av.ID_VICTIMA = V.ID_VICTIMA 
        WHERE v.FECHA_MUERTE IS not NULL 
        GROUP BY v.NOMBRE , V.APELLIDO, U.UBICACION 
        HAVING COUNT(DISTINCT av.ID_ALLEGADO) > 3  ORDER BY allegados`
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

})
router.get("/eliminarModelo",async function(req,res){

})
router.get("/cargarTemporal",async function(req,res){

})
router.get("/cargarModelo",async function(req,res){

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