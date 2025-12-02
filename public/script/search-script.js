document.addEventListener('DOMContentLoaded', function () {
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
    };

    document.addEventListener('DOMContentLoaded', function () {
        const searchInput = document.getElementById('searchInput');
        const resultsDiv = document.getElementById('results');

        searchInput.addEventListener('input', function () {
            const inputValue = searchInput.value.toLowerCase();
            resultsDiv.innerHTML = "";

            if (inputValue.trim() === "") return;

            let found = false;

            for (const [region, locations] of Object.entries(valg)) {
                const matches = locations.filter(loc => loc.toLowerCase().includes(inputValue));

                if (matches.length > 0) {
                    found = true;
                    const regionDiv = document.createElement('div');
                    regionDiv.classList.add('region-block');

                    const regionTitle = document.createElement('h2');
                    regionTitle.textContent = region;
                    regionDiv.appendChild(regionTitle);

                    const ul = document.createElement('ul');
                    matches.forEach(loc => {
                        const li = document.createElement('li');
                        li.innerHTML = loc
                        ul.appendChild(li);
                    });

                    regionDiv.appendChild(ul);
                    resultsDiv.appendChild(regionDiv);
                }
            }

            if (!found) {
                resultsDiv.innerHTML = `<p class="no-results">Finner ingen ting for denne lokasjonene</p>`;
            }
        });
    });
})