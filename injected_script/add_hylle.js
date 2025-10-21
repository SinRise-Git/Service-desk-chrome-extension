let triggeredByClick = false;
document.addEventListener('click', function (event) {
    triggeredByClick = true;
    const link = event.target.closest('a[href]');
    if (link) {
        startObservingAddCopyButton();
    }
});

function startObservingAddCopyButton() {
    var observer = new MutationObserver((mutations, observer) => {
        const resolutionDiv = document.getElementById('js-event-Resolution-1');
        const hylleDiv = document.querySelector('.req_header_hylle');
        const copyButton = document.getElementById('copyHylleButton');
        if (resolutionDiv && hylleDiv && !copyButton && window.location.hash == '#resolution') {
            observer.disconnect();
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
        button.id = 'copyHylleButton';

        lineParent.appendChild(button);

        button.addEventListener('click', (e) => {
            e.preventDefault();
            const hylleText = hylleDiv.querySelectorAll('.mr5.sb.fl')[1].innerText.trim();
            if (hylleText != 'Ukjent') {
                chrome.storage.local.get(['end_text'], function (result) {
                    const hylleTextRaw = result.end_text || 'Ligger i $sted$'
                    const hylleTextCopy = hylleTextRaw.includes('$sted$') ? hylleTextRaw.replace('$sted$', hylleText) : `Ligger i ${hylleText}`;
                    navigator.clipboard.writeText(hylleTextCopy);
                })
            }
        });
    }
}

if (!triggeredByClick) {
    startObservingAddCopyButton();
}

