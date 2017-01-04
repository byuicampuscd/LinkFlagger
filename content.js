// ==LINK FLAGGER==================================================
// @name        LinkFlagger 2.0
// @version     0.0
// @author      A. Didymus Benson
// @description Highlights brainhoney and box links and images.
// ================================================================


// SETTINGS CHECKERS
var htmlON;
chrome.storage.sync.get("htmlsetting", function (result) {
    htmlON = result.htmlsetting;
    console.log(result.htmlsetting);
     tryhtml(htmlON);
});

var linksON;
chrome.storage.sync.get("linksetting", function (result) {
    linksON = result.linksetting;
    console.log(result.linksetting);
    trylinks(linksON);
});


//SCRIPT INJECTORS
function tryhtml(htmlON){
if (htmlON) {
    var h = document.createElement('script');
    h.src = chrome.extension.getURL('htmlscript.js');
    h.onload = function () {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(h);

}
}

function trylinks(linksON){
if (linksON) {
    var l = document.createElement('script');
    l.src = chrome.extension.getURL('linkscript.js');
    l.onload = function () {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(l);

}
}

var s = document.createElement('script');
s.src = chrome.extension.getURL('egg.js');
s.onload = function () {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);
