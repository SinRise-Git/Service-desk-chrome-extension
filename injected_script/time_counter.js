(() => {
    function attachListener(addTimeCheckbox) {
        if (addTimeCheckbox.found) return;
        addTimeCheckbox.found = true;

        addTimeCheckbox.addEventListener('change', function () {
            if (!this.checked) return;

            const saveButton = document.getElementById('js-event-ViewWorkOrderResolution-4');
            if (!saveButton) return;

            let dataHour = 0
            let dataMin = 0

            const divHour = document.getElementById('timespenthrs');
            const divMin = document.getElementById('timespentmins');

            if (divHour) {
                divHour.addEventListener('change', function () {
                    dataHour = Number(divMin.value);
                })
            }

            if (divMin) {
                divMin.addEventListener('change', function () {
                    dataMin = Number(divMin.value);
                })
            }

            saveButton.addEventListener('click', function (event) {
                const isValidHour = Number.isInteger(dataHour) && dataHour >= 0;
                const isValidMin = Number.isInteger(dataMin) && dataMin >= 0;

                if (isValidHour && isValidMin) {
                    console.log('Save button clicked');
                    console.log('Time spent:', dataHour, 'hours and', dataMin, 'minutes');
                    startObserving();
                }
           });
      })
    }
            
    function startObserving() {
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
    startObserving();
})();

