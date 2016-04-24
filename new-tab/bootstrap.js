const { classes: Cc, interfaces: Ci, utils: Cu } = Components;
Cu.import('resource://gre/modules/Services.jsm');

var button;
var iconURL = "chrome://new-tab/content/icon.png";

function loadIntoWindow(window) {
      button = window.NativeWindow.pageactions.add({
		  title: "New Tab",
		  icon: window.resolveGeckoURI(iconURL),
		  clickCallback: function() {
			addTab(window)
		  },
		  longClickCallback: function() {
			closeTab(window)
		  }
    });
}

function addTab(window){
	window.BrowserApp.addTab("about:home")
}

function closeTab(window){
	window.BrowserApp.closeTab(window.BrowserApp.selectedTab)
}

function unloadFromWindow(window) {
  if (!window) return;
  window.NativeWindow.pageactions.remove(button);
}

var windowListener = {
  onOpenWindow: function(aWindow) {
    let domWindow = aWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
    domWindow.addEventListener("UIReady", function onLoad() {
      domWindow.removeEventListener("UIReady", onLoad, false);
      loadIntoWindow(domWindow);
    }, false);
  },
 
  onCloseWindow: function(aWindow) {},
  onWindowTitleChange: function(aWindow, aTitle) {}
};

function startup(aData, aReason) {
  let windows = Services.wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
    let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
    loadIntoWindow(domWindow);
  }
  Services.wm.addListener(windowListener);
}

function shutdown(aData, aReason) {
  if (aReason == APP_SHUTDOWN) return;
  Services.wm.removeListener(windowListener);
  let windows = Services.wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
    let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
    unloadFromWindow(domWindow);
  }
}
