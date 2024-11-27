// Esperar a que la página esté completamente cargada
window.onload = function () {
    // Cargar el archivo XML de los resultados de las pruebas
    fetch('/tests/test-results.xml')
        .then(response => response.text()) // Obtener el contenido en texto (XML)
        .then(data => {
            // Parsear el XML
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(data, "text/xml");
            let testCases = xmlDoc.getElementsByTagName("testcase");

            // Obtener el contenedor de la tabla donde se mostrarán los resultados
            let tableBody = document.getElementById('test-results').getElementsByTagName('tbody')[0];

            // Iterar sobre los casos de prueba y agregar las filas a la tabla
            Array.from(testCases).forEach(testCase => {
                let row = tableBody.insertRow(); // Crear una nueva fila
                let nameCell = row.insertCell(0);
                let statusCell = row.insertCell(1);
                let timeCell = row.insertCell(2);

                // Nombre de la prueba
                nameCell.textContent = testCase.getAttribute("name");

                // Estado de la prueba (si tiene el atributo "failure" o no)
                if (testCase.getElementsByTagName("failure").length > 0) {
                    statusCell.textContent = "Fallida";
                    statusCell.style.color = 'red';
                } else {
                    statusCell.textContent = "Exitoso";
                    statusCell.style.color = 'green';
                }

                // Duración de la prueba
                timeCell.textContent = testCase.getAttribute("time") + " segundos";
            });
        })
        .catch(error => {
            console.error("Error al cargar el archivo de resultados de las pruebas:", error);
        });
};
