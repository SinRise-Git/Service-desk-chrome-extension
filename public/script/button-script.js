document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('toggleSwitch');

    chrome.storage.local.get(['show_hylle'], function (result) {
        if (result.show_hylle === undefined) {
            toggleButton.checked = true;
            chrome.storage.local.set({ show_hylle: true });
        } else {
            toggleButton.checked = result.show_hylle;
        }
    });

    toggleButton.addEventListener('change', function () {
        chrome.storage.local.set({ show_hylle: this.checked }, function () {
            console.log("Stored new value:", toggleButton.checked);
        });
    });
});
