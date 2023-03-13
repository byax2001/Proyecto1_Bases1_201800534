## Brandon Oswaldo Yax Campos
## Bases de datos 1, proyecto 1
### Tutorial para usar oracle en una maquina virtual:
sudo apt-get update
### INSTALACION DE DOCKER
sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io

sudo docker --version


### INSTALACION DE ORACLE 18C

sudo docker pull dockerhelp/docker-oracle-ee-18c

sudo docker run -it -d -p 1521:1521 --name=oracle dockerhelp/docker-oracle-ee-18c /bin/bash

sudo docker ps -a

### INICIAR DOCKER SI YA CREARON LA IMAGEN

sudo docker start [ID_CONTAINER]

sudo docker exec -it oracle /bin/bash

sh post_install.sh


### ENTRAR A ORACLE 18C

sqlplus

user-name: sys as sysdba #USUARIO POR DEFECTO

password: oracle #PASSWORD POR DEFECTO


### CREAR OTRO USUARIO EN ORACLE
alter session set "_ORACLE_SCRIPT"=true;

create user **username** identified by **username**;

grant all privileges to **username**;

### PARA CONECTARSE A TRAVES DE CMD O POWERSHELL

sqlplus **username**/**username**@**ip_externa maquina virtual**:1521/ORCL18