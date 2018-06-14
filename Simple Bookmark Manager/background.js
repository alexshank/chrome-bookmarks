/* 
 * when the extension icon is clicked, open
 * the index.html page in a new tab and
 * run the separate script file
 */
chrome.browserAction.onClicked.addListener(function(activeTab){
  chrome.tabs.create({ url: 'index.html' });
});