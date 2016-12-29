/* TODO: Add message listener from background that
 * sends the title of current page here for switch
 * statement below
 */

var s = document.createElement('script');
/* TODO: SWITCH STATEMENT BASED ON BRIGHTSPACE URL
 * TO INJECT SMALLSER, MORE SPECIFIC SCRIPTS
 * Add any new scripts to "web_accessible_resources"
 * in manifest.json
 */
s.src = chrome.extension.getURL('script.js');
s.onload = function() {
    this.remove();
};

(document.head || document.documentElement).appendChild(s);
