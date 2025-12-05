(() => {
    if (window.location.href.includes('#resolution')) {
        const observer = new MutationObserver((mutations, observer) => {
            const resolutionDiv = document.getElementById('js-event-Resolution-1');
            const hylleDiv = document.getElementById('req_header_hylle');
            const copyButton = document.getElementById('copyHylleButton');
            if (resolutionDiv && hylleDiv && !copyButton) {
                addCopyButton(hylleDiv);
            }
        })

        observer.observe(document, {
            childList: true,
            subtree: true,
        });

        function addCopyButton(hylleDiv) {
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

            button.addEventListener('click', (e) => {
                e.preventDefault();
                const hylleText = hylleDiv.querySelectorAll('.mr5.sb.fl')[1].innerText.trim()

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
        }
    }
})();