document.addEventListener("DOMContentLoaded", function () {
    const nameSelect = document.getElementById("nameSelect");
    if (nameSelect) {
        chrome.storage.local.get(['user_name'], function (result) {
            if (result.user_name) {
                nameSelect.value = result.user_name;
            } else {
                chrome.storage.local.set({ user_name: nameSelect.value });
            }
        });
        nameSelect.addEventListener("change", function () {
            let selectedName = this.value;
            chrome.storage.local.set({ user_name: selectedName });
        });      
    }
});
