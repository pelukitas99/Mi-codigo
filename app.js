
// Initialize QuaggaJS for barcode scanning
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

// Event listener for barcode detection
Quagga.onDetected(function(result) {
    const barcode = result.codeResult.code;
    document.getElementById('barcodeResult').textContent = barcode;
    fetchProductData(barcode);
});

// Function to fetch product details (simulating an API or database search)
function fetchProductData(barcode) {
    // Replace this with real API or database call
    const productData = {
        '6977042830008': { name: "Coca-cola", description: "Envase de 2L", units: 5, storage: "Almacén A" },
        '7121710860807': { name: "Cereal Kellogg's", description: "Caja de 600g", units: 1, storage: "Almacén C" },
        // Add more products here
    };

    const product = productData[barcode];
    if (product) {
        document.getElementById('productDetails').innerHTML = `
            <li><strong>Nombre:</strong> ${product.name}</li>
            <li><strong>Descripción:</strong> ${product.description}</li>
            <li><strong>Unidades:</strong> ${product.units}</li>
            <li><strong>Almacén:</strong> ${product.storage}</li>
        `;
    } else {
        document.getElementById('productDetails').innerHTML = `<li>Producto no encontrado</li>`;
    }
}
