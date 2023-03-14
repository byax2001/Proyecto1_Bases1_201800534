# Manual Tecnico
### Objetivos:


- Utilizar consultas para presentar la información requerida de una base
de datos relacional.

- Aprender a realizar cargas masivas desde archivos brindados.
- Aprender a utilizar modelar y crear una base de datos.
- Creación de consultas óptimas y funcionales para extraer reportería 
de una base de datos.
- Desarrollar una API para consumo y muestra de los resultados

> Este proyecto consiste en la utilizacion del gestor de bases de datos Oracle para la creacion de una base la cual fuera consultada con una api, api desarrollada en NodeJs, de forma que fuera posible ejecutar multiples peticiones que retornaran un objeto json con los resultados.

#### Modelo Conceptual

![modelo_conceptual](https://user-images.githubusercontent.com/63923585/224888715-f45978d5-cff6-4d07-9ab9-c56bed553e16.png)

#### Modelo Logico
![modelo_logico](https://user-images.githubusercontent.com/63923585/224888718-7fed6244-7afc-4cc7-b56d-6be1d59d11dc.png)

#### Modelo Relacional
![modelo_relacional](https://user-images.githubusercontent.com/63923585/224888722-262f11e5-4b26-4918-a4cd-cbfca66ca817.png)

En total para la correcta estructura y almacenamiento de la  base de datos fue necesaria la creacion de 10 tablas las cuales permitirian tanto navegar de forma sencilla y realizar de forma practica las consulta asi como tambien romper relaciones de muchos a muchos. 

## Pasos para el uso de Oracle:
> Una vez creada la maquina virtual, a traves de google cloud con una imagen de Ubuntu en este caso, se procede a ingresar a esta y ejecutar estos comandos:

### Usar Oracle a traves de una Maquina virtual:
~~~bash
sudo apt-get update
~~~
### Instalacion de Docker
~~~bash
sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io

sudo docker --version
~~~

### Instalacion de ORACLE 18C
~~~bash
sudo docker pull dockerhelp/docker-oracle-ee-18c

sudo docker run -it -d -p 1521:1521 --name=oracle dockerhelp/docker-oracle-ee-18c /bin/bash

sudo docker ps -a
~~~
### Iniciar Oracle si ya fue creado el contenedor
~~~bash
sudo docker start [ID_CONTAINER]

sudo docker exec -it oracle /bin/bash

sh post_install.sh
~~~
### Entrar a ORACLE 18C para configurarlo (realizar esto una sola vez)
~~~bash
sqlplus

user-name: sys as sysdba #USUARIO POR DEFECTO

password: oracle #PASSWORD POR DEFECTO
~~~

### Crear un Usuario en Oracle (Sustituir asteriscos y variables)
~~~bash
alter session set "_ORACLE_SCRIPT"=true;

create user **username** identified by **username**;

grant all privileges to **username**;
~~~
### Comando para conectarse a la base de datos desde CMD y Powershell (Sustituir asteriscos y variables)

~~~bash
sqlplus **username**/**username**@**ip_externa maquina virtual**:1521/ORCL18
~~~
### Para ingresar y prender la base de datos constantemente usar estos comandos:
~~~bash
sudo docker start [ID_CONTAINER]

sudo docker exec -it oracle /bin/bash

sh post_install.sh
~~~

### Para apagar la base de datos usar: 
~~~bash
sudo docker stop [ID_CONTAINER]
~~~
### Conexiones
Para futuras conexiones con otros software la base de datos se llama **ORLC18** y los puertos: **ip_llave_externa:1521/ORLC18**

## Para la consultas a través de la API se ejecuto este metodo como base para el resto:
~~~bash
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
~~~
## CONCLUSIONES:
- Oracle es una de las bases de datos más usadas debido a su alta fiabilidad y escalabilidad. Además, ofrece una amplia gama de características avanzadas, como la capacidad de manejar grandes volúmenes de datos, soporte para múltiples usuarios y transacciones en línea, así como una alta disponibilidad y seguridad.

- SQL Loader es una herramienta utilizada para cargar datos en Oracle desde archivos externos. Es muy eficiente para manejar grandes volúmenes de datos y se puede configurar fácilmente para adaptarse a diferentes formatos de archivo. 
- Google Cloud es una plataforma en la nube que ofrece una base de datos en la nube altamente escalable y segura, lo que permite a las empresas almacenar y gestionar grandes cantidades de datos de manera rentable y eficiente.

- DBeaver es una herramienta de gestión de bases de datos que admite múltiples plataformas de bases de datos. Es fácil de usar y cuenta con características avanzadas como la edición de datos en línea, la importación y exportación de datos, y la ejecución de consultas complejas.


> Nota: En caso este dando conflictos la base de datos apagar y volver a enceder el contenedor de oracle.
