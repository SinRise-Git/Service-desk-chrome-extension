const steder = {
  Nord: [
    "Brannstasjonen",
    "Haugland skole",
    "Ravnagner sykehjem (Helsestasjon, Omsorgsbolig, Sone Midtre)",
    "Ravnanger ungdomsskole",
    "Tveit skole",
    "Tveit barnehage",
    "Hanøy skole",
    "Hanøy barnehage",
    "Ramsøy barnehage",
    "Davanger skole",
    "Træet skole",
    "Fromereide eldresenter",
    "Fauskanger barne- og ungdomsskole",
  ],
  Sør: [
    "Rådhuset",
    "Senteret",
    "Holmedalen PLO",
    "Energigården",
    "Kleppestø sykehjem",
    "Fenring legesenter",
    "Rasmussenhuset",
    "Kleppestø barneskole",
    "Kleppestø barnehage",
    "Kleppestø ungdomsskole",
    "Kleppe skole",
    "Kleppestø senter",
    "Kleppegrennd",
    "Juvik boliger",
    "IT-avdelingen",
    "Fagopplæring i Askøy kommune",
    "Askøy kulturskole",
    "Askøy læring- og integreringssenter",
    "Ergo-, fysioterapi og servicetjenesten"
  ],
  Vest: [
    "Strusshamn skole",
    "Shoddien",
    "Strusshamn helsestasjon",
    "Flagget omsorgsbolig",
    "Flagget arbeidslag",
    "Follese skole",
    "Hetlevik skole"
  ],
  Øst: [
    "Florvåg skole",
    "Flimmerne",
    "Florvåg barnehage",
    "Florvåg helsestasjon",
    "Bakavågen",
    "Erdal barneskole",
    "Erdal ungdomsskole",
    "Furulyområdet",
    "Strømssnes boliger",
    "Hop skole",
    "Ask barnehage"
  ]
};

chrome.storage.local.set({ steder });

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete') return;

  const url = tab.url || tab.pendingUrl;
  if (!url?.startsWith('https://servicedesk.askoy.kommune.no/')) return;

  chrome.storage.local.get(['show_hylle'], (result) => {
    const files = [
      'injected_script/delete_time.js',
      'injected_script/add_hylle.js',
      'injected_script/time_counter.js'
    ];

    if (result.show_hylle) {
      files.push('injected_script/inject_hylle.js');
    }

    chrome.scripting.executeScript({
      target: { tabId },
      files
    }).catch(err => {
      console.error('Script injection failed:', err, url);
    });
  });
});
