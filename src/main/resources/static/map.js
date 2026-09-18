const map = L.map('map').setView([-12.9714, -38.5014], 15);
const cache = [];

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    {maxZoom: 19, attribution: 'Tiles &copy; Esri'}).addTo(map);

const icon = {
    UBS: L.icon({ iconUrl: 'ubs.png', iconSize: [60, 60], iconAnchor: [30, 60], popupAnchor: [0, -60] })
};

// basicamente aqui gera o visual dos objetos no mapa
cache:add = function(object_list) {
    cache:remove();
    object_list.forEach(objeto => {
        const marcador = L.marker([objeto.lat, objeto.lng], {icon: icon[objeto.tipo]});
        marcador.bindPopup(`
            <strong>${objeto.nome}</strong><br>
            Tipo: ${objeto.tipo}<br>
            Latitude: ${objeto.lat.toFixed(6)}<br>
            Longitude: ${objeto.lng.toFixed(6)}
        `);
        cache.push(marcador);
    });
}

// aqui reseta o cache pra receber novos objetos
cache:remove = function() {
    cache.forEach(marcador => {
        if (map.hasLayer(marcador)) {
            map.removeLayer(marcador);
        }
    });
    cache.length = 0;
}

// aqui somente serve como incio provisorio, sem o back end, com ele basta inicar objectview()
cache:start = function() {
    cache:add([{nome: "Objeto 1", tipo: "UBS", lat: -12.9702, lng: -38.5030}, {nome: "Objeto 2", tipo: "UBS", lat: -12.9730, lng: -38.4995}, {nome: "Objeto 3", tipo: "UBS", lat: -12.9695, lng: -38.4985}, {nome: "Objeto 4", tipo: "UBS", lat: -12.9740, lng: -38.5040}]);
    objectview();
}

objectview = function() {
    const zoom = map.getZoom();
    cache.forEach(marcador => {
        if (zoom >= 14) {
            if (!map.hasLayer(marcador)) {
                marcador.addTo(map);
            }
        } else {
            if (map.hasLayer(marcador)) {
                map.removeLayer(marcador);
            }
        }
    });
}

// emula a entrada de cache vinda do backend com base na coordenada atual
cache:start();
map.on('moveend', function () { objectview(); cache:get(map.getCenter().lat, map.getCenter().lng); }); // sempre que mover o mapa
map.on('zoomend', function () { objectview(); }); // sempre que alterar o zoom

var reversed = ""; // o nome do lugar atual
// o backend deve retornar o reversed da coordenada assim como a lista de objetos
cache:get = async function(lat, lon) {
    const consult = await fetch(`/api/reversed?lat=${lat}&lon=${lon}&region=${reversed}`);
    const data = await consult.json();
    if (data.reversed) {
        if (reversed !== data.reversed) {
            cache:add(data.objetos);
            reversed = data.reversed;
            searchInput.value = reversed;
        }
    }
}

const searchInput = document.getElementById("search");
const resultsContainer = document.getElementById("results");
// funcao que pesquisa via API do Nominatim, recebe o json de retorno e imprime na tela as correspondencias, ao clicar em uma delas o mapa se move para a coordenada
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