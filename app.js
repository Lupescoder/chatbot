const fs = require('fs');
const wppconnect = require('@wppconnect-team/wppconnect');
const express  = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = 8080;
const request = require('request');


app.use(express.json());
app.use(express.urlencoded({extended: true}));



wppconnect.create({
    session: 'sessionName',
    statusFind: (statusSession, session) => {
      console.log('Status Session', statusSession);
      console.log('Session Name', session);
    },
    headless: true,
    puppeteerOptions: {
      userDataDir: 'tokens/sessionName'
    },
    catchQR: (base64Qr, asciiQR) => {
      console.log(asciiQR); // Optional to log the QR in the terminal
      var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

      if (matches.length !== 3) {
        return new Error('Invalid input string');
      }
      response.type = matches[1];
      response.data = new Buffer.from(matches[2], 'base64');

      var imageBuffer = response;
      require('fs').writeFile(
        'out.png',
        imageBuffer['data'],
        'binary',
        function (err) {
          if (err != null) {
            console.log(err);
          }
        }
      );
    },
    logQR: false,
  })
  .then((client) => start(client))
  .catch((error) => console.log(error));



  function start(client) {
    console.log('ChatBot Teste - Iniciando ...');

    client.onMessage((message) => {
        try {
          const options = {
            'method': 'POST',
            'url': 'http://127.0.0.1:5678/webhook/489deb8e-cfe7-41e4-ad17-40ac30b9a7cd',
            'headers': {
              'Content-Type': 'application/json'
            },
            json: message
          }

          request(options, function (error, response){
            if(error){
              throw new Error(error);
            }else{
              console.log(response.body);
            }

          })


        } catch (error) {
            console.log(error)
        }
        
    });

    app.post('/send-message', async (req, res) => {
      const number = req.body.number;
      const message = req.body.message;

      client.sendText(number, message).then(response => {
        res.status(200).json({
          status: true,
          message: 'O Bot envou Mensagem',
          response: response
        });
      }).catch(err => {
        res.status(500).json({
          status: false,
          message: 'O Bot não envou Mensagem',
          response: err.text
        });
      })
    })

  }


  server.listen(port, function() {
    console.log('O bot esta na porta'+ port);
  });