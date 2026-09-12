const searchInput = document.getElementById("search");
const resultsContainer = document.getElementById("results");
const map = document.getElementById("map");

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
    resultsContainer.innerHTML = "";
    if (results.length === 0) {
        resultsContainer.innerHTML =
            "Nenhum resultado encontrado.";
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
        `;
        div.addEventListener("click", () => {
            move_to(
                parseFloat(result.lat),
                parseFloat(result.lon),
                result.display_name
            );
        });
        resultsContainer.appendChild(div);
    });
}

function move_to(lat, lon, newvalue) {
    /*
        * Criamos uma pequena área ao redor
        * da coordenada pesquisada.
        */
    resultsContainer.style.display = "none";
    searchInput.value = newvalue;

    const delta = 0.01;

    const minLon = lon - delta;
    const maxLon = lon + delta;

    const minLat = lat - delta;
    const maxLat = lat + delta;

    const bbox =
        `${minLon},${minLat},${maxLon},${maxLat}`;

    const newUrl =
        "https://www.openstreetmap.org/export/embed.html" +
        "?bbox=" + encodeURIComponent(bbox) +
        "&layer=mapnik" +
        "&marker=" + lat + "%2C" + lon;

    map.src = newUrl;
}

//* searchButton.addEventListener( "click", searchLocal );
searchInput.addEventListener( "keydown", (event) => {
    if (event.key === "Enter") {
        searchLocal();
    }
});