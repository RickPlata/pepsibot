var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pepsico"
  });

const insertReport = (data) => {
    var sql = 'INSERT INTO fallas VALUES ?';
    var values = [["NULL", data[1], data[6], "1" ,data[2],data[3],data[4],data[5]]]
    con.query(sql, [values], function (result) {
        //if (err) throw err;
        console.log("Reporte guardado");
    })
}


function conectar(){
    con.query('select 1 + 1 as solution', function (result){
        console.log('Comprobación de la base de datos:   ' + 'hora: ' + hora() + ' ---- ' + 'Fecha' + fecha())
    });
}

module.exports = {insertReport, conectar}