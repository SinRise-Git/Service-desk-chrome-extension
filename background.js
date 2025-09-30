let show_hylle = true;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.storage.local.get(['show_hylle'], function(result) {
    console.log("Initial load from storage:", result.show_hylle);
    show_hylle = result.show_hylle;
  });
  if (changeInfo.status === 'complete' && tab.url && show_hylle) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    }).catch(err => {
      console.log('Script injection failed:', err);
    });
  }
});