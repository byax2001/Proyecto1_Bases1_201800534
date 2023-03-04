const express =require('express');
const morgan= require('morgan');
const cors=require('cors')

var app=express();
var corsOption={origin:true,optionsSuccessStatus:200};
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOption));
app.use(express.urlencoded({extended:true}));
let puerto=8080

//variables ast 
let text="";
app.listen(puerto, function(){
    console.log('Escuchando en el puerto 8080')
});

app.get('/', function (req ,res ){
    res.json({mensaje:"hola mundo"})
})
//OBTENER TODOS LOS ENVIROMENTS
app.get('/ObtenerEnvs', function (req ,res ){
    res.send({Envs:B_datos.getInstance().getListEnviroments(1)});
})
