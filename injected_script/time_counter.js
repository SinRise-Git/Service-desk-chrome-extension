(() => {
    async function attachListener(addTimeCheckbox) {
        if (addTimeCheckbox.found) return;
        addTimeCheckbox.found = true;

        addTimeCheckbox.addEventListener('change', async function () {
            if (!this.checked) return;

            const saveButton = document.getElementById('js-event-ViewWorkOrderResolution-4');
            if (!saveButton) return;

            let dataHour = 0
            let dataMin = 0

            const divHour = document.getElementById('timespenthrs');
            const divMin = document.getElementById('timespentmins')

            let ownerName = document.getElementsByClassName('form-control-static hide spot-static pr25 fc-spot-edit')[0].innerText.trim();
            const endTimeElement = await startObservingEndTime();
            saveButton.addEventListener("mouseover", function() {
                ownerName = document.getElementsByClassName('form-control-static hide spot-static pr25 fc-spot-edit')[0].innerText.trim()
            })           
            
            let stored_name = 'username not set';
            chrome.storage.local.get(['user_name'], function (result) {
                if (result.user_name) {
                    stored_name = result.user_name;
                } else {
                    chrome.storage.local.set({ user_name: ownerName});
                    stored_name = ownerName;
                }
            });

            if (divHour && divMin) {
                divHour.addEventListener('change', function () {
                    dataHour = Number(divMin.value);
                })
                divMin.addEventListener('change', function () {
                    dataMin = Number(divMin.value);
                })
            }

            saveButton.addEventListener('click', function (event) {
                const isValidHour = Number.isInteger(dataHour) && dataHour >= 0;
                const isValidMin = Number.isInteger(dataMin) && dataMin >= 0;
                if (isValidHour && isValidMin && stored_name === ownerName) {
                    const timeRaw = (new Date());
                    const time =`${timeRaw.getDate()}/${timeRaw.getMonth() + 1}/${timeRaw.getFullYear()}`
                
                    const data = {
                        time : time,
                        end_date: endTimeElement.value,
                        minutes: dataMin + (dataHour * 60),
                        user: stored_name
                    };
                    console.log('Storing time entry:', data);
                    chrome.storage.local.get(['time_entries'], function (result) {
                        let existing_time_entries = result.time_entries || [];
                        existing_time_entries.push(data);
                        chrome.storage.local.set({ time_entries: existing_time_entries });
                    });
                }
           });
      })
    }
            
    function startObservingAddTimeCheckbox() {
        const observer = new MutationObserver((mutations, obs) => {
            const addTimeCheckbox = document.getElementById('timeSpentId');
                if (addTimeCheckbox) {
                    attachListener(addTimeCheckbox);
                    return true;
                }
                return false;
            });

            observer.observe(document.documentElement || document, {
                childList: true,
                subtree: true
            });
    }
    async function startObservingEndTime() {
        return new Promise((resolve) => {
            const observer = new MutationObserver((mutations, obs) => {
                const endTime = document.getElementById('end_time_IN_Display');
                if (endTime) {
                    resolve(endTime);
                    obs.disconnect();
                }
            });

            observer.observe(document.documentElement || document, {
                childList: true,
                subtree: true
            });
        });
    }
    startObservingAddTimeCheckbox();
})();

