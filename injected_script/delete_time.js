(() => {
    function attachListener(worklogLoaded, deleteButton) {
        let selectedEntries = [];
        console.log('FOUND:', worklogLoaded);
        if (worklogLoaded.length > 0) {
            const worklogTbody = document.getElementById('worklog_body');
            const tbodyRows = worklogTbody.querySelectorAll(':scope > tr');
            tbodyRows.forEach(row => {
                console.log('Processing row:', row);
                const worklogCheck = row.querySelector('.tc-row.visi-parent .headercheckbox.tbl-bg-mode input');
                console.log('Checkbox in row:', worklogCheck);
                if (worklogCheck) {
                    console.log('Found checkbox in row:', worklogCheck);
                    worklogCheck.addEventListener('change', function () {
                        const user = row.querySelectorAll('td')[2].querySelector('.d_w .d_w.cur-ptr a').innerText.trim();
                        const timeRaw = row.querySelectorAll('td')[3].querySelector('.d_w a').innerText.trim().match(/\d+/g);
                        const date = row.querySelectorAll('td')[6].querySelector('.d_w').innerText.trim();

                        let data = { id: worklogCheck.value, user: user, minutes: Number(timeRaw[0]) * 60 + Number(timeRaw[1]), end_date: date };
                        if (this.checked) {
                            console.log('Adding row to selectedEntries', data);
                            selectedEntries.push(data);
                        } else {
                            console.log('Removing row from selectedEntries', data);
                            selectedEntries = selectedEntries.filter(item => item.id !== data.id);
                        }
                        console.log('Current selectedEntries:', selectedEntries);
                    });
                }
            });
        }

        if (deleteButton) {
            deleteButton.addEventListener('click', function () {
                const confirmButton = document.getElementById('submitButton');
                confirmButton.addEventListener('click', function (event) {
                    chrome.storage.local.get(['time_entries'], function (result) {
                        let existing_entries = result.time_entries || [];
                        selectedEntries.forEach(selected => {
                            const index = existing_entries.findIndex(entry =>
                                entry.user === selected.user &&
                                entry.minutes === selected.minutes &&
                                entry.end_date === selected.end_date
                            );
                            if (index !== -1) {
                                existing_entries.splice(index, 1);
                                console.log('Deleting entry from storage:', selected);
                            }
                        });
                        
                        chrome.storage.local.set({ time_entries: existing_entries }, function () {
                            console.log('Updated time_entries after deletion:', existing_entries);
                        });
                    });
                    startObserving(); 
                });
            });
        }

    }
    function startObserving() {
        if (window.location.hash == '#worklogs') {
            const observer = new MutationObserver((mutations, obs) => {
                const worklogLoaded = document.querySelectorAll('.tc-row.visi-parent');
                    const deleteButton = document.getElementById('worklog_btn_delete');
                if (worklogLoaded.length > 0) {
                    console.log('STARTOBSERVING:Worklog and delete button found, attaching listener.');
                    attachListener(worklogLoaded, deleteButton);
                    console.log('Observer disconnected after attaching listener.');
                    obs.disconnect();
                }
            });

            observer.observe(document.documentElement || document, {
                childList: true,
                subtree: true,
            });
        }
    }
    startObserving();
})();