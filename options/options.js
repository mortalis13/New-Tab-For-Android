
const DEFAULT_URL = '';

function saveOptions(e) {
  browser.storage.local.set({
    new_tab_url: document.querySelector("#new_tab_url").value
  });
  document.querySelector("#message").innerHTML = 'Options saved';
  e.preventDefault();
}

function restoreOptions() {
  var storageItem = browser.storage.local.get('new_tab_url');
  storageItem.then(res => {
    document.querySelector("#new_tab_url").value = res.new_tab_url || DEFAULT_URL;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("#options-form").addEventListener("submit", saveOptions);
