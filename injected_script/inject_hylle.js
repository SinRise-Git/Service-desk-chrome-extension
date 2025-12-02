(() => {
    const exist = document.getElementById('req_header_hylle');
    if (exist) {
        return;
    }

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
            "Fagopplæring i Askøy kommune",
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
    
    const parentDiv = document.querySelector('.pt5.mb10.mr10.fl.disp-flex.valign-center.flex-wrap');
    const sted = document.querySelector('p.form-control-static.spot-static[fafr-name="SITE"]')?.innerText || document.querySelector('p[data-name="site"]')?.innerText;
     

    
    if (parentDiv && sted) {
        let hylle = 'Ikke registrert';
        for (const [key, locations] of Object.entries(valg)) {
            if (locations.some(location => sted.toLowerCase().includes(location.toLowerCase()))) {
                hylle = key;
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
})();


