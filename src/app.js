const {Client, LocalAuth, MessageMedia, NoAuth} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const {insertReport, conectar} = require('./db');

const user = new Map();
var conexion = setInterval(conectar, 2700000);

//Inicialización del cliente
const client = new Client({
    authStrategy: new LocalAuth()
});

console.log('->Iniciando sesión')

//Generación de código qr
client.on('qr', qr => {
    qrcode.generate(qr,{small: true})
});

//evento para saber que el cliente ya esta listo
client.on('ready', () => {
    console.log('->El cliente está listo');
    listenMessage(); //Detección de mensajes
});

client.initialize();

//Función para detectar y responder mensajes
const listenMessage = () => {
    client.on('message',(msg) => {

        const {from, body} = msg;
        let txt = body.normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase();

                //Algoritmo de deteccion de mensajes
                if (user.has(from)){
                    switch (user.get(from)[0]){
                        case 1:                                            
                            user.get(from).push(txt); //GPID
                            user.get(from)[0] = 2;
                            sendMessage(from, "Ingresa la planta: ");
                        break;
                        case 2:                                            
                            user.get(from).push(txt);//planta
                            user.get(from)[0] = 3;
                            sendMessage(from, "Ingresa el turno: ");
                        break;
                        case 3:                                            
                            user.get(from).push(txt);//turno
                            user.get(from)[0] = 4;
                            sendMessage(from, "Ingresa la línea: ");
                        break;
                        case 4:                                            
                            user.get(from).push(txt);//linea
                            user.get(from)[0] = 5;
                            sendMessage(from, "Ingresa el equipo: ");
                        break;
                        case 5:                                            
                            user.get(from).push(txt);//equipo
                            user.get(from)[0] = 6;
                            sendMessage(from, "Ingresa la falla: ");
                        break;                        
                        case 6:                                            
                            user.get(from).push(txt);//falla
                            console.log("Datos ingresdos:  " + user.get(from));
                            insertReport(user.get(from));
                            user.delete(from);
                            sendMessage(from, "El reporte se ha guardado con exito");
                        break;
                    }
                }else{
                    sendMessage(from, "Hola, para iniciar tu reporte por favor ingresa tu GPID")
                    user.set(from,[1])
                }          
        console.log(from, txt);
    })
}

//Función para enviar archivos
const sendMedia = (to, file) => {
    const mediaFile = MessageMedia.fromFilePath(`./mediaSend/${file}`)
    client.sendMessage(to, mediaFile)
}

//Función para enviar mensajes
const sendMessage = (to, message) => {
    client.sendMessage(to, message)
}