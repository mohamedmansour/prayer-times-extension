var bkg = chrome.extension.getBackgroundPage();
  
/**
 *  Displays version on the screen.
 */
document.getElementById("myBody").onload = function() {
  document.getElementById('version').innerHTML = 'Prayer Times Updated to ' + bkg.settings.version + '!';
};

/**
 * View options screen.
 */
document.getElementById("myHref").onclick = function() {
  bkg.controller.openSingletonPage(chrome.extension.getURL('options.html'));
};

document.getElementById("btnClose").onclick = function() {window.close();}
document.getElementById("myFrm").onsubmit = function() {return false;};
