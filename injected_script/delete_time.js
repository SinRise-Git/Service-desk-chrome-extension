(() => {
    let selectedEntries = []; 

    if (window.location.href.includes('#worklogs')) {
        const observer = new MutationObserver((mutations, obs) => {
            const worklogLoaded = document.getElementById('worklog_body');
            const deleteButton = document.getElementById('worklog_btn_delete');

            if (worklogLoaded && deleteButton && worklogLoaded.querySelectorAll('tr').length > 0) {
                attacthDeleteTimeListener(worklogLoaded, deleteButton);
            }
        });

        observer.observe(document.documentElement || document, {
            childList: true,
            subtree: true,
        });

        function attacthDeleteTimeListener(worklogLoaded, deleteButton) {
            const tbodyRows = worklogLoaded.querySelectorAll(':scope > tr');

            tbodyRows.forEach(row => {
                if (row.dataset.observed) return;
                row.dataset.observed = 'true';

                const worklogCheck = row.querySelector('.tc-row.visi-parent .headercheckbox.tbl-bg-mode input');
                if (!worklogCheck) return;

                worklogCheck.addEventListener('change', function () {

                    const user   = row.querySelectorAll('td')[2].querySelector('.d_w .d_w.cur-ptr a').innerText.trim();
                    const timeRaw = row.querySelectorAll('td')[3].querySelector('.d_w a').innerText.trim().match(/\d+/g);
                    const date   = row.querySelectorAll('td')[6].querySelector('.d_w').innerText.trim();

                    const data = {
                        id: worklogCheck.value,
                        user,
                        minutes: Number(timeRaw[0]) * 60 + Number(timeRaw[1]),
                        end_date: date
                    };

                    if (this.checked) {
                        selectedEntries.push(data);
                    } else {
                        selectedEntries = selectedEntries.filter(item => item.id !== data.id);
                    }
                });
            });

            if (!deleteButton.dataset.observed) {
                deleteButton.dataset.observed = 'true';
                
                deleteButton.addEventListener('click', function () {
                    const confirmButton = document.getElementById('submitButton');
                    const taskId = document.getElementById('requestId').innerText;

                    confirmButton.addEventListener('click', function () {
                        chrome.storage.local.get(['time_entries'], function (result) {
                            const existing_entries = result.time_entries || [];
                            const time = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`


                            selectedEntries.forEach(selected => {
                                const index = existing_entries.findIndex(entry =>
                                    entry.taskId === taskId &&
                                    entry.user === selected.user &&
                                    entry.minutes === selected.minutes &&
                                    entry.time === time
                                );
                                if (index !== -1) existing_entries.splice(index, 1);
                            });

                            chrome.storage.local.set({ time_entries: existing_entries });
                        });
                    });
                });
            }
        }
    }
})();
