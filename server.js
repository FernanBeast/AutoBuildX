const express = require('express');
const fs = require('fs');
const path = require('path');
const { parseString } = require('xml2js');  // Usaremos xml2js para convertir XML a JSON

const app = express();
const port = 3000;

// Directorio donde guardamos los resultados de las pruebas
const resultsPath = path.join(__dirname, 'tests', 'test-results.xml');

// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal: Mostrar la página con los resultados de las pruebas
app.get('/', (req, res) => {
  fs.readFile(resultsPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error al leer los resultados de las pruebas.');
      return;
    }

    // Convertir el XML a JSON para poder procesarlo más fácilmente
    parseString(data, (err, result) => {
      if (err) {
        res.status(500).send('Error al procesar los resultados de las pruebas.');
        return;
      }

      // Extraer los casos de prueba del JSON
      const testCases = result.testsuites.testsuite[0].testcase || [];

      // Generar las filas de la tabla a partir de los casos de prueba
      let tableRows = testCases.map(testCase => {
        const name = testCase.$.name;
        const time = testCase.$.time;
        const failure = testCase.failure ? 'Fallida' : 'Exitosa';
        const failureStyle = testCase.failure ? 'style="color: red;"' : 'style="color: green;"';

        return `<tr>
                  <td>${name}</td>
                  <td ${failureStyle}>${failure}</td>
                  <td>${time} s</td>
                </tr>`;
      }).join('');

      // Enviar el HTML con los resultados de las pruebas
      res.send(`
        <html>
          <head>
            <title>Resultados de Pruebas Unitarias</title>
            <link rel="stylesheet" href="/style.css" />
          </head>
          <body>
            <h1>Resultados de las Pruebas Unitarias</h1>
            <table border="1">
              <thead>
                <tr>
                  <th>Nombre de la Prueba</th>
                  <th>Estado</th>
                  <th>Tiempo (s)</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </body>
        </html>
      `);
    });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
