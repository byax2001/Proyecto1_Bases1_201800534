const { spawn } = require('child_process');


// Función que ejecuta el proceso de SQL Loader
async function cargarDatos(req, res) {
  const dbConfig = {
    user: "system",
    password: password,
    connectString: "localhost:1521/xe"
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
          reject(new Error(`El proceso de SQL Loader terminó con un código de salida ${code}`));
        }
      });
    });
    
  } catch (error) {
    //console.error(error);
    res.status(500).send(error.message);
  } finally {
    // Cerrar la conexión a la base de datos Oracle
    if (connection) {
      try {
        await connection.close();
        res.status(200).send('Datos cargados exitosamente');
      } catch (error) {
        console.error(error);
      }
    }
  }
}