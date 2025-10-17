document.addEventListener("DOMContentLoaded", function () {
    let currentName = "";
    chrome.storage.local.get(['user_name'], function (result) {
        if (result.user_name) {
            currentName = result.user_name;
            document.getElementById("nameDisplay").innerText = currentName;
        }
    });

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
