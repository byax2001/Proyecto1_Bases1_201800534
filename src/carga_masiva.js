const { spawn } = require('child_process');
const oracledb =require('oracledb')

// Función que ejecuta el proceso de SQL Loader
async function cargarDatos(req, res) {
  const dbConfig = {
    user: "ldecast",
    password: "ldecast",
    connectString: "34.30.194.63:1521/ORCL18"
  };
  
  // Nombre del archivo de control de SQL Loader
  const controlFile = 'filecontrol.ctl';
  
  // Nombre del archivo de datos a cargar
  const dataFile = 'DB_Excel.csv';

  let connection;
  try {
    // Establecer una conexión a la base de datos Oracle
    connection = await oracledb.getConnection(dbConfig);

    // Ejecutar el proceso de SQL Loader
    const sqlldr = spawn('sqlldr', ['userid=' + dbConfig.user + '/' + dbConfig.password, 'control=' + controlFile, 'data=' + dataFile + ' skip=1']);

    // Capturar la salida estándar y de error del proceso de SQL Loader
    sqlldr.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    sqlldr.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    // Esperar a que el proceso de SQL Loader termine
    await new Promise((resolve, reject) => {
      sqlldr.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          console.log("ERRROROROORORORO")
          reject(new Error(`El proceso de SQL Loader terminó con un código de salida ${code}`));
        }
      });
    });
    
  } catch (error) {
    //console.error(error);
    //return res.send(error.message);
  } finally {
    // Cerrar la conexión a la base de datos Oracle
    if (connection) {
      try {
        await connection.close();
        //return res.send('Datos cargados exitosamente');
      } catch (error) {
        console.error(error);
      }
    }
  }
}

module.exports=cargarDatos;