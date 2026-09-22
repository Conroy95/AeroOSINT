// Lokale database met alle toegevoegde privéjets, helikopters en politievliegtuigen
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
        type: "Dassault Falcon 8X",
        model: "Falcon 8X",
        owner: "Max Verstappen",
        icao: "4867E6",
        status: "Actief"
    },
    "PH-TLP": {
        type: "Dassault Falcon 7X",
        model: "Falcon 7X",
        owner: "Talpa / John de Mol",
        icao: "485171",
        status: "Actief"
    },
    "PH-KFY": {
        type: "Diamond DA-40NG Star",
        model: "DA40",
        owner: "KLM Flight Academy",
        icao: "485993",
        status: "Lesvliegtuig / Actief"
    },
    "PH-CJM": {
        type: "Cessna Citation Sovereign",
        model: "C680",
        owner: "Frits van Eerd - Jumbo",
        icao: "4846F0",
        status: "Business Jet"
    },
    "PH-AJX": {
        type: "Dassault Falcon 7X",
        model: "Falcon 7X",
        owner: "AJAX (Exxaero)",
        icao: "485170",
        status: "Business Jet"
    },
    "OO-NHV": {
        type: "Airbus / Eurocopter Dauphin",
        model: "AS365",
        owner: "Noordzee Helikopters Vlaanderen (NHV)",
        icao: "448A42",
        status: "Helikopter / Offshore"
    },
    "PH-IWS": {
        type: "Dassault Falcon 7X",
        model: "Falcon 7X",
        owner: "Martin Garrix (Exxaero)",
        icao: "4851B8",
        status: "Business Jet"
    },
    "PH-BEJ": {
        type: "Bombardier Global 5000",
        model: "BD-700",
        owner: "Ben Mandemakers (FlyingGroup)",
        icao: "485FD1",
        status: "Business Jet"
    },
    "N900KS": {
        type: "Gulfstream G650ER",
        model: "GV-SP",
        owner: "Steven Spielberg",
        icao: "AC701E",
        status: "Private Jet (USA)"
    },
    "N887WM": {
        type: "Gulfstream G650ER",
        model: "GV-SP",
        owner: "Bill Gates",
        icao: "AC8C34",
        status: "Private Jet (USA)"
    },
    "PH-PXA": {
        type: "Piaggio P.180 Avanti",
        model: "P180",
        owner: "Nationale Politie (Police01)",
        icao: "48401A",
        status: "Overheid / Politie"
    },
    "PH-PXB": {
        type: "Cessna 172 / Overig",
        model: "C172",
        owner: "Nationale Politie (Police02)",
        icao: "48401B",
        status: "Overheid / Politie"
    },
    "PH-PXC": {
        type: "Patrouillevliegtuig",
        model: "Surveillance",
        owner: "Nationale Politie (Police03)",
        icao: "48401C",
        status: "Overheid / Politie"
    },
    "PH-PXX": {
        type: "Surveillance Vliegtuig",
        model: "Custom",
        owner: "Nationale Politie (Police04)",
        icao: "48401D",
        status: "Overheid / Politie"
    },
    "PH-PXD": {
        type: "Surveillance Vliegtuig",
        model: "Custom",
        owner: "Nationale Politie (Police04)",
        icao: "48401E",
        status: "Overheid / Politie"
    },
    "PH-PXZ": {
        type: "Politie Helikopter / Vliegtuig",
        model: "Air Support",
        owner: "Nationale Politie (Police26)",
        icao: "48401F",
        status: "Overheid / Politie"
    },
    "PH-HIP": {
        type: "Airbus Helicopters",
        model: "H135 P3",
        owner: "ANWB Medical Air Assistance BV",
        icao: "486A31",
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
            document.getElementById('errorText').innerText = `Fout bij opzoeken of geen netwerkverbinding.`;
        }
    }, 400);
}

async function displayResult(reg, data) {
    document.getElementById('resReg').innerText = reg;
    document.getElementById('resType').innerText = data.type;
    document.getElementById('resModel').innerText = data.model;
    document.getElementById('resOwner').innerText = data.owner;
    document.getElementById('resIcao').innerText = data.icao;
    document.getElementById('resStatus').innerText = data.status;

    const imgElement = document.getElementById('resImage');
    imgElement.classList.add('hidden');

    try {
        const photoResponse = await fetch(`https://api.planespotters.net/pub/photos/reg/${reg}`);
        const photoData = await photoResponse.json();

        if (photoData && photoData.photos && photoData.photos.length > 0) {
            imgElement.src = photoData.photos[0].thumbnail_large.src;
            imgElement.classList.remove('hidden');
        }
    } catch (e) {
        // Geen foto beschikbaar
    }

    document.getElementById('resultCard').classList.remove('hidden');
}
