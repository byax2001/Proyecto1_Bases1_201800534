const express = require('express');
const morgan = require('morgan');
const corse = require('cors');

const _app = express();
_app.use(express.json({limit: '50mb'}));
_app.use(express.urlencoded({ limit: "30mb", extended: true }));
_app.use(morgan('dev'));
_app.use(corse());

//ROUTES
_app.get('/',function(req,res){
    res.json({nombre:"Brandon Oswaldo Yax Campos",carnet:201800534, mensaje:"Hola mundo"})
})


_app.use('/consultas',require('./consultas/consulta')) //para hacer mas personalizados los puntos a consumir
                                                        // localhost:8080/consultas/servicio1
module.exports=_app;