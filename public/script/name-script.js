document.addEventListener("DOMContentLoaded", function () {
    let currentName = 'name not set';
    const nameSelect = document.getElementById("nameSelect");
    if (nameSelect) {
        chrome.storage.local.get(['user_name'], function (result) {
            if (result.user_name) {
                nameSelect.value = result.user_name;
                currentName = result.user_name;
            } else {
                chrome.storage.local.set({ user_name: nameSelect.value });
                currentName = nameSelect.value;
            }
        });
        nameSelect.addEventListener("change", function () {
            let selectedName = this.value;
            currentName = selectedName;
            chrome.storage.local.set({ user_name: selectedName });
            getWorkMinutes()
        });
    }
    function getWorkMinutes() {
        let totalMinutes = 0;
        chrome.storage.local.get(['time_entries'], function (result) {
            if (result.time_entries) {
                for (const entry of result.time_entries) {
                    if (entry.user === currentName && entry.time === `${(new Date()).getDate()}/${(new Date()).getMonth() + 1}/${(new Date()).getFullYear()}`) {
                        totalMinutes += entry.minutes;
                    }
                }
                let hours = Math.floor(totalMinutes / 60);
                let minutes = totalMinutes % 60
                document.getElementById("workHours").innerText = hours;
                document.getElementById("workMinutes").innerText = minutes;
            }
        });
    }
    getWorkMinutes()
});
