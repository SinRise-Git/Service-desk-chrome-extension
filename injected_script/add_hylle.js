(() => {
    if (window.location.href.includes('#resolution')) {
        const observer = new MutationObserver((mutations, observer) => {
            const resolutionDiv = document.getElementById('js-event-Resolution-1');
            const copyButton = document.getElementById('copyHylleButton');
            if (resolutionDiv && !copyButton) {
                addCopyButton();
            }
        })

        observer.observe(document, {
            childList: true,
            subtree: true,
        });

        function addCopyButton() {
            const line = document.getElementById('s2id_woResolution_Id');
            const lineParent = line.parentElement.parentElement;
            const button = document.createElement('button');

            button.innerText = 'Kopier hylle';
            button.style.padding = '4.75px 10px 4.75px 10px';
            button.style.color = 'white';
            button.style.backgroundColor = 'transparent';
            button.style.border = '1px solid #4e4e4e';
            button.style.marginLeft = '10px';
            button.style.cursor = 'pointer';
            button.style.textAlign = 'center';
            button.id = 'copyHylleButton';

            lineParent.appendChild(button);

            chrome.storage.local.get(['steder'], (result) => {
                let hylleText = 'Ikke registrert';
                const steder = result.steder || {};
                const sted = document.querySelector('p.form-control-static.spot-static[fafr-name="SITE"]')?.innerText || document.querySelector('p[data-name="site"]')?.innerText;

                for (const [key, locations] of Object.entries(steder)) {
                    if (locations.some(location => sted.toLowerCase().includes(location.toLowerCase()))) {
                        hylleText = key;
                        break;
                    }
                }

                button.addEventListener('click', (e) => {
                    e.preventDefault();

                    if (hylleText === 'Ikke registrert') {
                        window.alert('Dette stedet er ikke registrert til en hylle, legg stedet til i hylle listen for å kunne kopiere det!');
                    } else {
                        chrome.storage.local.get(['end_text'], function (result) {
                            const hylleTextRaw = result.end_text?.trim() || 'Ligger i $sted$'
                            const hylleTextCopy = hylleTextRaw.includes('$sted$') ? hylleTextRaw.replace('$sted$', hylleText) : `Ligger i ${hylleText}`;
                            navigator.clipboard.writeText(hylleTextCopy);
                        })
                    }
                });
            });

        }
    }
})();
