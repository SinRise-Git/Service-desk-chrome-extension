const valg = {
    "Nord": [
        "Brannstasjonen",
        "Haugland skole",
        "Ravnagner sykehjem (Helsestasjon, Omsorgsbolig, Sone Midtre)",
        "Ravnanger ungdomsskole",
        "Tveit skole",
        "Tveit barnehage",
        "Hanøy skole",
        "Hanøy barnehage",
        "Ramsøy barnehage",
        "Davanger skole",
        "Træet skole",
        "Fromereide eldresenter",
        "Fauskanger barne- og ungdomsskole",
    ],
    "Sør": [
        "Rådhuset",
        "Senteret",
        "Holmedalen PLO",
        "Energigården",
        "Kleppestø sykehjem",
        "Fenring legesenter",
        "Rasmussenhuset",
        "Kleppestø barneskole",
        "Kleppestø barnehage",
        "Kleppestø ungdomsskole",
        "Kleppe skole",
        "Kleppegrennd",
        "Juvik boliger",
        "IT-avdelingen",
    ],
    "Vest": [
        "Strusshamn skole",
        "Shoddien",
        "Strusshamn helsestasjon",
        "Flagget omsorgsbolig",
        "Flagget arbeidslag",
        "Follese skole",
        "Hetlevik skole"
    ],
    "Øst": [
        "Florvåg skole",
        "Flimmerne",
        "Florvåg barnehage",
        "Florvåg helsestasjon",
        "Bakavågen",
        "Erdal barneskole",
        "Erdal ungdomsskole",
        "Furulyområdet",
        "Strømssnes boliger",
        "Hop skole",
        "Ask barnehage"
    ]
}

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const inputValue = searchInput.value.toLowerCase();
            for (const [key, locations] of Object.entries(valg)) {
                for (const location of locations) {
                    if (location.toLowerCase().includes(inputValue)) {
                        console.log(`Can exist in ${location}, which is in ${key}`);
                    }
                }
            }
        });
    } else {
        console.warn('No input with ID "searchInput" found.');
    }
});