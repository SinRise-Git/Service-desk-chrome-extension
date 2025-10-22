(() => {
    async function attachListenerResolution(addTimeCheckbox) {
        if (addTimeCheckbox.found) return;
        addTimeCheckbox.found = true;

        addTimeCheckbox.addEventListener('change', async function () {
            if (!this.checked) return;

            const saveButton = document.getElementById('js-event-ViewWorkOrderResolution-4');
            if (!saveButton) return;

            let dataHour = 0
            let dataMin = 0
            let stored_name = 'username not set';

            let { ownername, timeSpentHours, timeSpentMinutes, endTime } = await startObservingTaskDetails();
            saveButton.addEventListener("mouseover", function () {
                ownername = document.getElementsByClassName('form-control-static hide spot-static pr25 fc-spot-edit')[0].innerText.trim()
            })

            chrome.storage.local.get(['user_name'], function (result) {
                if (result.user_name) {
                    stored_name = result.user_name;
                } else {
                    chrome.storage.local.set({ user_name: ownername });
                    stored_name = ownername;
                }
            });

            if (timeSpentHours && timeSpentMinutes) {
                timeSpentHours.addEventListener('change', function () {
                    dataHour = Number(timeSpentHours.value);
                })
                timeSpentMinutes.addEventListener('change', function () {
                    dataMin = Number(timeSpentMinutes.value);
                })
            }


            saveButton.addEventListener('click', function (event) {
                const isValidHour = Number.isInteger(dataHour) && dataHour >= 0;
                const isValidMin = Number.isInteger(dataMin) && dataMin >= 0;
                if (isValidHour && isValidMin && stored_name === ownername) {
                    const time = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`
                    const data = {
                        time: time,
                        end_date: endTime.value,
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
        });
    }

    function attachListenerWorklog(iframeDocument, ownername, timeSpentHours, timeSpentMinutes, endTime) {
        let dataHour = 0
        let dataMin = 0
        let stored_name = 'username not set';
        const submitButton = iframeDocument.getElementsByClassName('btn btn-primary')[0];

        chrome.storage.local.get(['user_name'], function (result) {
            if (result.user_name) {
                stored_name = result.user_name;
            } else {
                chrome.storage.local.set({ user_name: ownername });
                stored_name = ownername;
            }
        });

        timeSpentHours.addEventListener('change', function () {
            dataHour = Number(timeSpentHours.value);
        })
        timeSpentMinutes.addEventListener('change', function () {
            dataMin = Number(timeSpentMinutes.value);
        });

        submitButton.addEventListener('click', function (event) {
            const isValidHour = Number.isInteger(dataHour) && dataHour >= 0;
            const isValidMin = Number.isInteger(dataMin) && dataMin >= 0;
            if (isValidHour && isValidMin && stored_name === ownername) {
                const time = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`
                const data = {
                    time: time,
                    end_date: endTime,
                    minutes: dataMin + (dataHour * 60),
                    user: stored_name
                }; 
                console.log('Storing time entry from worklog:', data);
                chrome.storage.local.get(['time_entries'], function (result) {
                    let existing_time_entries = result.time_entries || [];
                    existing_time_entries.push(data);
                    chrome.storage.local.set({ time_entries: existing_time_entries });
                
                });
                refreshWorklogs();
            }
        });

    }

    function startObservingResolutionAddTime() {
        if (window.location.hash == '#resolution') {
            const observer = new MutationObserver((mutations, obs) => {
                const addTimeCheckbox = document.getElementById('timeSpentId');
                if (addTimeCheckbox) {
                    attachListenerResolution(addTimeCheckbox);
                }
            });

            observer.observe(document.documentElement || document, {
                childList: true,
                subtree: true
            });
        }
    }
    async function startObservingTaskDetails() {
        if (window.location.hash == '#resolution') {
            return new Promise((resolve) => {
                const observer = new MutationObserver((mutations, obs) => {
                    const ownerName = document.getElementsByClassName('form-control-static hide spot-static pr25 fc-spot-edit')[0].innerText.trim();
                    const divHour = document.getElementById('timespenthrs');
                    const divMin = document.getElementById('timespentmins')
                    const endTime = document.getElementById('end_time_IN_Display');
                    if (ownerName && divHour && divMin && endTime) {
                        resolve({ ownername: ownerName, timeSpentHours: divHour, timeSpentMinutes: divMin, endTime: endTime, });
                        obs.disconnect();
                    }
                });

                observer.observe(document.documentElement || document, {
                    childList: true,
                    subtree: true
                });
            });
        }
    }
    async function startObservingWorklogAddTime() {
        if (window.location.hash == '#worklogs') {
            const observer = new MutationObserver((mutations, obs) => {
                const iframe = document.getElementById('worklogs_popup-frame');
                if (iframe) {
                    iframe.onload = () => {
                        try {
                            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                            const ownerName = iframeDocument.getElementsByClassName('form-control-static hide spot-static pr25 fc-spot-edit')[0].innerText.trim();
                            const divHour = iframeDocument.getElementById('timespenthrs');
                            const divMin = iframeDocument.getElementById('timespentmins')
                            const endTime = iframeDocument.getElementById('end_time_IN_Display').value;
                            if (iframeDocument && ownerName && divHour && divMin && endTime) {
                                attachListenerWorklog(iframeDocument, ownerName, divHour, divMin, endTime);
                            }
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }
            });

            observer.observe(document.documentElement || document, {
                childList: true,
                subtree: true
            });
        }
    }
    startObservingWorklogAddTime()
    startObservingResolutionAddTime()
})();

