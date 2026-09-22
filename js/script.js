// Lokale database voor snelle/bekende targets (je kunt hier zelf items aan toevoegen)
const localDatabase = {
    "PH-RAC": {
        type: "Cessna 172 Skyhawk",
        model: "C172",
        owner: "Privé / Aeroclub",
        icao: "4844CD",
        status: "Geregistreerd / Actief"
    },
    "PH-BVA": {
        type: "Boeing 737-8K2",
        model: "B738",
        owner: "KLM - Royal Dutch Airlines",
        icao: "484123",
        status: "Commercieel Vliegtuig"
    },
    "PH-UTL": {
        type: "Dassault",
        model: "Falcon 8X",
        owner: "Max Verstappen",
        icao: "4867E6",
        status: "Active"
    },
    "PH-TLP": {
        type: "Dassault",
        model: "Falcon 7X",
        owner: "Talpa / John de Mol",
        icao: "485171",
        status: "Active"
    }
};

document.getElementById('searchBtn').addEventListener('click', performSearch);
document.getElementById('searchInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

async function performSearch() {
    const query = document.getElementById('searchInput').value.trim().toUpperCase();
    const resultCard = document.getElementById('resultCard');
    const errorCard = document.getElementById('errorCard');
    const loading = document.getElementById('loading');

    if (!query) return;

    // Reset schermen
    resultCard.classList.add('hidden');
    errorCard.classList.add('hidden');
    loading.classList.remove('hidden');

    setTimeout(async () => {
        loading.classList.add('hidden');

        // 1. Controleer lokale database
        if (localDatabase[query]) {
            displayResult(query, localDatabase[query]);
            return;
        }

        // 2. Zoek via live openbare API (adsb.lol)
        try {
            const response = await fetch(`https://api.adsb.lol/v2/reg/${query}`);
            const data = await response.json();

            if (data && data.ac && data.ac.length > 0) {
                const plane = data.ac[0];
                displayResult(query, {
                    type: plane.type || "Onbekend type",
                    model: plane.desc || "Standaard luchtvaartuig",
                    owner: plane.ownOp || "Onbekende exploitant",
                    icao: plane.hex || "N.v.t.",
                    status: "Actief transponder signaal"
                });
            } else {
                errorCard.classList.remove('hidden');
                document.getElementById('errorText').innerText = `Geen gegevens gevonden voor registratie: ${query}`;
            }
        } catch (err) {
            errorCard.classList.remove('hidden');
            document.getElementById('errorText').innerText = `Fout bij opzoeken. Controleer de netwerkverbinding.`;
        }
    }, 500);
}

async function displayResult(reg, data) {
    document.getElementById('resReg').innerText = reg;
    document.getElementById('resType').innerText = data.type;
    document.getElementById('resModel').innerText = data.model;
    document.getElementById('resOwner').innerText = data.owner;
    document.getElementById('resIcao').innerText = data.icao;
    document.getElementById('resStatus').innerText = data.status;

    // Afbeelding ophalen via Planespotters API
    const imgElement = document.getElementById('resImage');
    imgElement.classList.add('hidden'); // Verberg tijdelijk tijdens laden

    try {
        const photoResponse = await fetch(`https://api.planespotters.net/pub/photos/reg/${reg}`);
        const photoData = await photoResponse.json();

        if (photoData && photoData.photos && photoData.photos.length > 0) {
            // Neem de URL van de eerste beschikbare foto
            imgElement.src = photoData.photos[0].thumbnail_large.src;
            imgElement.classList.remove('hidden');
        }
    } catch (e) {
        // Als er geen foto gevonden kan worden, blijft het element onzichtbaar
    }

    document.getElementById('resultCard').classList.remove('hidden');
}
