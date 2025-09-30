document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('toggleSwitch');

    chrome.storage.local.get(['show_hylle'], function (result) {
        toggleButton.checked = result.show_hylle || false;
        console.log("Initial state from storage:", result.show_hylle);
    });

    toggleButton.addEventListener('change', function () {
        chrome.storage.local.set({ show_hylle: this.checked }, function () {
            console.log("Stored new value:", toggleButton.checked);
        });
    });
});
