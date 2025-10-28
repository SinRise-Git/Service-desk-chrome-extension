chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete') return;
  if (!tab.url) return;

  chrome.storage.local.get(['show_hylle'], function(result) {
    const show_hylle = (typeof result.show_hylle === 'boolean') ? result.show_hylle : true; 
    if (!show_hylle) return;

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: [
        'injected_script/inject_hylle.js',
        'injected_script/time_counter.js',
        'injected_script/delete_time.js',
        'injected_script/add_hylle.js',
        'injected_script/test.js'
      ]
    }).catch(err => {
      console.error('Script injection failed:', err);
    });
  });
});
