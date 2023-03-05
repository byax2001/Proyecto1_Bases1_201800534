#!/bin/bash
#userid ORACLE username/password@IP:PUERTO/SID
#control -- control file name
#log -- log file name
#bad -- bad file name
sqlldr userid=admin/ldecast@34.30.194.63:1521/ORCL18  control = filecontrol.ctl
#echo " "
#echo -e
# read
