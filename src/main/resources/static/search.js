const map = L.map('map').setView([-12.9714, -38.5014], 15);

L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri'
    }
).addTo(map);

function atualizarCoordenadas() {
    const centro = map.getCenter();
    document.getElementById('coordinates').textContent =
        `Latitude: ${centro.lat.toFixed(6)} | Longitude: ${centro.lng.toFixed(6)}`;
}

const objetos = [
    {
        nome: "Objeto 1",
        tipo: "Hospital",
        lat: -12.9702,
        lng: -38.5030
    },
    {
        nome: "Objeto 2",
        tipo: "Escola",
        lat: -12.9730,
        lng: -38.4995
    },
    {
        nome: "Objeto 3",
        tipo: "UBS",
        lat: -12.9695,
        lng: -38.4985
    },
    {
        nome: "Objeto 4",
        tipo: "Posto de atendimento",
        lat: -12.9740,
        lng: -38.5040
    }
];

// objetos aparecem a partir deste zoom
const ZOOM_MINIMO = 14;
const marcadores = [];

// basicamente ta simulando o recebimento dos objetos do backend, mas como não tem backend, ta simulando com um array de objetos
objetos.forEach(objeto => {

    const marcador = L.marker([
        objeto.lat,
        objeto.lng
    ]);

    marcador.bindPopup(`
        <strong>${objeto.nome}</strong><br>
        Tipo: ${objeto.tipo}<br>
        Latitude: ${objeto.lat.toFixed(6)}<br>
        Longitude: ${objeto.lng.toFixed(6)}
    `);

    marcadores.push(marcador);
});

function atualizarObjetos() {

    const zoomAtual = map.getZoom();

    if (zoomAtual >= ZOOM_MINIMO) {

        // Adiciona os marcadores
        marcadores.forEach(marcador => {

            if (!map.hasLayer(marcador)) {
                marcador.addTo(map);
            }

        });

    } else {

        // Remove os marcadores
        marcadores.forEach(marcador => {

            if (map.hasLayer(marcador)) {
                map.removeLayer(marcador);
            }

        });

    }
}

map.on('moveend', function () {

    atualizarCoordenadas();
    atualizarObjetos();

});

map.on('zoomend', function () {

    atualizarObjetos();

});

atualizarCoordenadas();
atualizarObjetos();

const searchInput = document.getElementById("search");
const resultsContainer = document.getElementById("results");

async function searchLocal() {
    const query = searchInput.value.trim();
    if (!query) {
        resultsContainer.style.display = "none";
        resultsContainer.innerHTML = "";
        return;
    }
    resultsContainer.style.display = "grid";
    resultsContainer.innerHTML = "...";
    const url =
        "https://nominatim.openstreetmap.org/search" +
        "?format=json" +
        "&q=" + encodeURIComponent(query) +
        "&limit=12" +
        "&addressdetails=1";
    try {
        const response = await fetch(url, {
            headers: {
                "Accept": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error("Erro na requisição");
        }
        const data = await response.json();
        show_results(data);
    } catch (error) {
        console.error(error);
        resultsContainer.innerHTML =
            "Tente novamente!";
    }
}

function show_results(results) {
    resultsContainer.innerHTML = "<div class='sectionbreak'></div>";
    resultsContainer.style.textAlign = "left";
    if (results.length === 0) {
        resultsContainer.innerHTML =
            "Nenhum resultado encontrado.";
        resultsContainer.style.textAlign = "center";
        return;
    }
    results.forEach((result) => {
        const div = document.createElement("div");
        div.classList.add("result");
        div.innerHTML = `
            <div class="result-title">
                ${result.display_name}
            </div>
            <div class="result-coordinates">
                Latitude: ${result.lat}
                Longitude: ${result.lon}
            </div>
            <div class="sectionbreak"></div>
        `;
        div.addEventListener("click", () => {
            resultsContainer.style.display = "none";
            searchInput.value = result.display_name;
            map.flyTo([parseFloat(result.lat), parseFloat(result.lon)], 15);
        });
        resultsContainer.appendChild(div);
    });
}

//* searchButton.addEventListener( "click", searchLocal );
searchInput.addEventListener( "keydown", (event) => {
    if (event.key === "Enter") {
        searchLocal();
    }
});