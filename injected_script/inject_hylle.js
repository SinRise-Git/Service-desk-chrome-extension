(() => {
    const exist = document.getElementById('req_header_hylle');
    if (exist) {
        return;
    }

    chrome.storage.local.get(['steder'], (result) => {
        const steder = result.steder || {};
        const parentDiv = document.querySelector('.pt5.mb10.mr10.fl.disp-flex.valign-center.flex-wrap');
        const sted = document.querySelector('p.form-control-static.spot-static[fafr-name="SITE"]')?.innerText || document.querySelector('p[data-name="site"]')?.innerText;

        if (parentDiv && sted) {
            let hylle = 'Ikke registrert';
            for (const [key, locations] of Object.entries(steder)) {
                console.log(key, locations);
                if (locations.some(location => sted.toLowerCase().includes(location.toLowerCase()))) {
                    hylle = key;
                    console.log('Matched hylle:', hylle);
                    break;
                }
            }

            const spanGroup = document.createElement('span');
            spanGroup.id = 'req_header_hylle';

            const space = document.createElement('span');
            space.className = 'text-muted fl';
            space.style.marginLeft = '5px';
            space.textContent = '|';

            const type = document.createElement('span');
            type.className = 'sb ml10 mr5 fl';
            type.textContent = 'Hylle :';

            const place = document.createElement('span');
            place.className = 'mr5 sb fl';
            place.textContent = hylle;

            spanGroup.appendChild(space);
            spanGroup.appendChild(type);
            spanGroup.appendChild(place);
            parentDiv.append(spanGroup);
        }

    });
})();


