document.addEventListener('DOMContentLoaded', function () {

    chrome.storage.local.get(['steder'], (result) => {
        const steder = result.steder || {};

        const searchInput = document.getElementById('searchInput');
        const resultsDiv = document.getElementById('results');

        searchInput.addEventListener('input', function () {
            const inputValue = searchInput.value.toLowerCase();
            resultsDiv.innerHTML = "";

            if (inputValue.trim() === "") return;

            let found = false;

            for (const [region, locations] of Object.entries(steder)) {
                const matches = locations.filter(location => location.toLowerCase().includes(inputValue));

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
    })
});