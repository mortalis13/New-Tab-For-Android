
var NOTIFY_TITLE = 'New Tab Add-on';


function initializePageAction(tab) {
  browser.pageAction.show(tab.id);
}

browser.tabs.query({}).then((tabs) => {
  for (let tab of tabs) {
    initializePageAction(tab);
  }
});

browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  initializePageAction(tab);
});

browser.tabs.onCreated.addListener((tab) => {
  initializePageAction(tab);
});

browser.pageAction.onClicked.addListener(() => {
  browser.storage.local.get("new_tab_url").then(res => {
    let url = res.new_tab_url;
    
    browser.tabs.create({url: url})
    .then(() => console.log("New Tab opened"))
    .catch(error => {
      console.error('Open new tab error:', error);
      notifyMsg('create-new-tab', NOTIFY_TITLE, ">> " + error);
    });
    
  });
  
});
