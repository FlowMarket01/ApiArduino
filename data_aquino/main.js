let total = 0;

const serialport = require('serialport');
const express = require('express');
const mysql = require('mysql2');

const SERIAL_BAUD_RATE = 9600;
const SERVIDOR_PORTA = 3300;

const HABILITAR_OPERACAO_INSERIR = true;

const serial = async (
    valorSensorUltrassonico
) => {

    // conexão com o banco de dados MySQL
    let poolBancoDados = mysql.createPool(
        {
            host: 'localhost',
            user: 'flowmarket_api',
            password: '1408Tech!',
            database: 'flowmarket',
            port: 3307
        }
    ).promise();

    const portas = await serialport.SerialPort.list();
    const portaArduino = portas.find((porta) => porta.vendorId == 2341 && porta.productId == 43);
    if (!portaArduino) {
        throw new Error('O arduino não foi encontrado em nenhuma porta serial');
    }

    const arduino = new serialport.SerialPort(
        {
            path: portaArduino.path,
            baudRate: SERIAL_BAUD_RATE
        }
    );

    arduino.on('open', () => {
        console.log(`A leitura do arduino foi iniciada na porta ${portaArduino.path} utilizando Baud Rate de ${SERIAL_BAUD_RATE}`);
    });

    arduino.pipe(new serialport.ReadlineParser({ delimiter: '\r\n' })).on('data', async (data) => {
        console.log(data);
        const valores = data.split(';');

        const sensorUltrassonico = parseInt(valores[0]);
        const sensorID = parseInt(valores[1]);
        const valorRegiao = parseInt(valores[2]);

        valorSensorUltrassonico.push(sensorUltrassonico);

        if (HABILITAR_OPERACAO_INSERIR) {

            // Este insert irá inserir os dados na tabela "leituraRegiaoFila"
            if (valorRegiao == 0){
                await poolBancoDados.execute(
                'INSERT INTO leituraRegiaoFila (fk_idSensor, presenca) VALUES (?, ?)',
                [sensorID, sensorUltrassonico]
            );
            } 
            else 
            {
            // Este insert irá inserir os dados na tabela "leituraCorredor" 
            await poolBancoDados.execute(
                'INSERT INTO leituraCorredor (fk_idSensor, presenca) VALUES (?, ?)',
                [sensorID, sensorUltrassonico]
            );
            }
        
            console.log("valores inseridos no banco: " + sensorID + ' ' + sensorUltrassonico);
        }

    });

    arduino.on('error', (mensagem) => {
        console.error(`Erro no arduino (Mensagem: ${mensagem}`)
    });
}

const servidor = (
    valorSensorUltrassonico
) => {
    const app = express();

    app.use((request, response, next) => {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
        next();
    });

    app.listen(SERVIDOR_PORTA, () => {
        console.log(`API executada com sucesso na porta ${SERVIDOR_PORTA}`);
    });

    app.get('/sensores/ultrassonico', (_, response) => {
        return response.json(valorSensorUltrassonico);
    });
}

(async () => {
    const valorSensorUltrassonico = [];

    await serial(
        valorSensorUltrassonico
    );

    servidor(
        valorSensorUltrassonico
    );
})();