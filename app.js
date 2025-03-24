// URL del archivo CSV en Google Sheets (accesible públicamente)
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSKHNIwPCopFbz6NDE-S2FM6U8NwtY696GXiqc4jv_ibp2eji-AHbXW_uIZJmGL9F5ErxCYqrZnoKgI/pub?output=csv";

// Inicializar Quagga para el escaneo de códigos de barras
Quagga.init({
    inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#scanner'),
    },
    decoder: {
        readers: ["code_128_reader", "ean_reader", "ean_8_reader", "upc_reader"]
    },
}, function(err) {
    if (err) {
        console.log("Error initializing Quagga: ", err);
        return;
    }
    console.log("Quagga initialized successfully!");
    Quagga.start();
});

// Evento que se dispara cuando se detecta un código de barras
Quagga.onDetected(function(result) {
    const barcode = result.codeResult.code;
    document.getElementById('barcodeResult').textContent = barcode;
    fetchProductData(barcode);
});

// Función para obtener los datos del producto desde el CSV
function fetchProductData(barcode) {
    Papa.parse(csvUrl, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            // Buscar el producto que coincida con el código de barras
            const product = results.data.find(row => row['Escanear código de barras'] == barcode);

            if (product) {
                // Mostrar los detalles del producto si se encuentra en el CSV
                document.getElementById('productDetails').innerHTML = `
                    <li><strong>Nombre:</strong> ${product['Nombre del producto']}</li>
                    <li><strong>Descripción:</strong> ${product['Descripción del producto']}</li>
                    <li><strong>Unidades:</strong> ${product['Unidades']}</li>
                    <li><strong>Almacén:</strong> ${product['Almacén del producto']}</li>
                `;

                // Actualizar el mapeo del almacén
                updateAlmacenMap(product['Almacén del producto']);
            } else {
                // Si no se encuentra el producto, mostrar un mensaje
                document.getElementById('productDetails').innerHTML = `<li>Producto no encontrado</li>`;
            }
        }
    });
}

// Función para actualizar el mapeo de almacén
function updateAlmacenMap(almacen) {
    // Reiniciar todos los almacenes a su estado original
    document.getElementById('productA').style.backgroundColor = 'white';
    document.getElementById('productB').style.backgroundColor = 'white';
    document.getElementById('productC').style.backgroundColor = 'white';
    document.getElementById('productA').style.color = 'black';
    document.getElementById('productB').style.color = 'black';
    document.getElementById('productC').style.color = 'black';

    // Cambiar el color según el almacén correspondiente
    if (almacen === "Almacén A") {
        document.getElementById('productA').style.backgroundColor = 'green';
        document.getElementById('productA').style.color = 'white';
    } else if (almacen === "Almacén B") {
        document.getElementById('productB').style.backgroundColor = 'yellow';
        document.getElementById('productB').style.color = 'black';
    } else if (almacen === "Almacén C") {
        document.getElementById('productC').style.backgroundColor = 'red';
        document.getElementById('productC').style.color = 'white';
    }
}
