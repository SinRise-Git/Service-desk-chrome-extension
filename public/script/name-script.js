document.addEventListener("DOMContentLoaded", function () {
    let currentName = "unknown";
    let totalMinutesDay = 0;
    let totalMinutesMonth = 0;

    chrome.storage.local.get(['user_name'], function (result) {
        if (result.user_name) {
            currentName = result.user_name;
            document.getElementById("nameDisplay").innerText = currentName;
        }
    });
    
    chrome.storage.local.get(['time_entries'], function (result) {
        if (result.time_entries) {
            for (const entry of result.time_entries) {
                console.log('Checking entry:', entry);
                if (entry.user === currentName && entry.time === `${(new Date()).getDate()}/${(new Date()).getMonth() + 1}/${(new Date()).getFullYear()}`) {
                    totalMinutesDay += entry.minutes;
                }
                if (entry.user === currentName && entry.time.includes(`${(new Date()).getMonth() + 1}/${(new Date()).getFullYear()}`)) {
                    totalMinutesMonth += entry.minutes;
                }
            }
            document.getElementById("workHoursDay").innerText = Math.floor(totalMinutesDay / 60);
            document.getElementById("workMinutesDay").innerText = totalMinutesDay % 60;
            document.getElementById("workHoursMonth").innerText = Math.floor(totalMinutesMonth / 60);
            document.getElementById("workMinutesMonth").innerText = totalMinutesMonth % 60;
        }
    });
});
