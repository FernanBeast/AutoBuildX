// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Directorio donde guardamos los resultados de las pruebas
const resultsPath = path.join(__dirname, 'tests', 'test-results.xml');

app.get('/', (req, res) => {
  // Leer el archivo XML de resultados de pruebas
  fs.readFile(resultsPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error al leer los resultados de las pruebas.');
      return;
    }

    // Convertir el XML a HTML (aquí podrías utilizar un parser de XML si quieres darle un mejor formato)
    res.send(`
      <html>
        <head>
          <title>Resultados de Pruebas Unitarias</title>
        </head>
        <body>
          <h1>Resultados de las Pruebas Unitarias</h1>
          <pre>${data}</pre>
        </body>
      </html>
    `);
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
