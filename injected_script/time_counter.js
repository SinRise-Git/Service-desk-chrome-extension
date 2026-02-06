(() => {
    if (window.location.href.includes('#resolution') || window.location.href.includes('#worklogs')) {
        const observer = new MutationObserver((mutations, obs) => {
            const resolotionSubmitButton = document.getElementById('js-event-ViewWorkOrderResolution-4');
            const checkbox = document.getElementById('timeSpentId');
            const iframe = document.getElementById('worklogs_popup-frame');

            if (resolotionSubmitButton && checkbox) {
                if (!resolotionSubmitButton.getAttribute('found')) {
                    resolotionSubmitButton.setAttribute('found', true);
                    checkbox.addEventListener('click', (e) => {
                        if (e.target.checked) {
                            observerTaskDetails('document', document);
                        }
                    })
                }
            }

            if (iframe) {
                iframe.onload = () => {
                    try {
                        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                        if (iframeDocument) {
                            observerTaskDetails('iframe', iframeDocument);
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
            }

        });

        observer.observe(document.documentElement || document, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
        });

        async function observerTaskDetails(type, parent) {
            let saveItem = [];
            let isEdit = false
            let submitButton = false;
            let taskCreator = null;
            let taskOwner = null;
            let timeSpentHours = 0
            let timeSpentMinutes = 0
            const taskId = document.getElementById('requestId').innerText;

            const no_undefined = (oldval, newval) => {
                return newval !== undefined && newval !== '' ? newval : oldval;
            }

            if (type === 'document') {
                submitButton = parent.getElementById('js-event-ViewWorkOrderResolution-4');
            } else if (type === 'iframe') {
                submitButton = parent.querySelector('.btn.btn-primary');
                isEdit = document.querySelector('.disp-c.fw.pl15.sb.pt10.pb10').innerText.includes('Rediger arbeidslogg') ? true : false;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const newTaskOwner = type === "document" ? parent.querySelector("#owner_control .select2-container.form-control.sel2-mul-break a.select2-choice span.select2-chosen")?.innerText : parent.querySelector('.select2-container.form-control.sel2-mul-break .select2-choice #select2-chosen-2')?.innerText;
                const newTimeSpentHours = parent.querySelector('.input-group.addon-nofill #timespenthrs')?.value;
                const newTimeSpentMinutes = parent.querySelector('.input-group.addon-nofill #timespentmins')?.value;

                taskOwner = no_undefined(taskOwner, newTaskOwner);
                timeSpentHours = no_undefined(timeSpentHours, newTimeSpentHours);
                timeSpentMinutes = no_undefined(timeSpentMinutes, newTimeSpentMinutes);

                if (type === 'document') {
                    const checkBox = parent.getElementById('timeSpentId')
                    if (!checkBox.checked) obs.disconnect();
                } else if (type === 'iframe' && !saveItem.length) {
                    saveItem = [taskId, taskOwner, timeSpentHours, timeSpentMinutes];
                }

                if (!submitButton.dataset.addedListener) {
                    submitButton.dataset.addedListener = 'true';

                    chrome.storage.local.get(['user_name'], function (result) {
                        if (result.user_name) {
                            taskCreator = result.user_name;
                        } else {
                            chrome.storage.local.set({ user_name: taskOwner }, () => {
                                console.log("Stored username:", taskOwner);
                            });
                            taskCreator = taskOwner;
                        }
                    });

                    submitButton.addEventListener('click', function () {
                        const setTaskOwner = taskOwner
                        const isValidHour = /^[0-9]+$/.test(Number(timeSpentHours)) && timeSpentHours.trim() != '';
                        const isValidMin = /^[0-9]+$/.test(Number(timeSpentMinutes)) && timeSpentMinutes.trim() != '';
                        console.log('Submit button clicked:', { isValidHour, isValidMin, taskOwner, taskCreator });
                        if (submitButton && isValidHour && isValidMin && taskOwner === taskCreator) {
                            let time = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`
                            chrome.storage.local.get(['time_entries'], function (result) {
                                const existing_time_entries = result.time_entries || [];

                                if (isEdit) {
                                    const index = existing_time_entries.findIndex(entry =>
                                        entry.taskId === saveItem[0] &&
                                        entry.user === saveItem[1] &&
                                        entry.minutes === (Number(saveItem[2]) * 60 + Number(saveItem[3]))
                                    );


                                    if (index !== -1) {
                                        time = existing_time_entries[index].time;
                                        existing_time_entries.splice(index, 1);
                                    }
                                }

                                const data = {
                                    taskId: taskId,
                                    minutes: Number(timeSpentMinutes) + Number(timeSpentHours) * 60,
                                    time: time,
                                    user: setTaskOwner
                                };

                                existing_time_entries.push(data);
                                chrome.storage.local.set({ time_entries: existing_time_entries }, function () {
                                    console.log('Updated time_entries in storage:', existing_time_entries);
                                    obs.disconnect();
                                });
                            });
                        };
                    });
                }
            });

            observer.observe(parent.documentElement || parent, {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true
            });
        }
    }
})();
