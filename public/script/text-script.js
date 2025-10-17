document.addEventListener('DOMContentLoaded', function () {
    const inputField = document.getElementById('addInput');
    chrome.storage.local.get(['end_text'], function (result) {
        if (result.end_text) {
            inputField.value = result.end_text;
        } else {
            chrome.storage.local.set({'end_text': 'Ligger i $hylle$' });
            document.getElementById('addInput').value = 'Ligger i $hylle$';
        }
    });

    inputField.addEventListener('input', function (e) {
        let inputValue = e.target.value.trim();
        chrome.storage.local.set({'end_text': inputValue })
    })
});