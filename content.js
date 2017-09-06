/*eslint-env browser*/
/*global chrome*/
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
  tryhtml(htmlON);
});

var linksON;
chrome.storage.sync.get("linksetting", function (result) {
  linksON = result.linksetting;
  trylinks(linksON);
});


//SCRIPT INJECTORS
function tryhtml(htmlON) {
  if (htmlON) {
    var h = document.createElement('script');
    h.src = chrome.extension.getURL('htmlscript.js');
    h.onload = function () {
      this.remove();
    };
    (document.head || document.documentElement).appendChild(h);

  }
}

function trylinks(linksON) {
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



/****************************** EDIT HTML OF LINKS **************************************/
/* Does the heavy lifting */
var editFiles = function (url, pageurl) {

    getOU(linkUrl) {
      var ou;
      if (linkUrl.includes('ou=')) {
        ou = linkUrl.split('ou=')[1].split('&')[0].replace('"', '');
      } else if (linkUrl.includes('enforced')) {
        ou = linkUrl.split('/enforced/')[1].split('-')[0];
      } else {
        ou = linkUrl.split('/content/')[1].split('/')[0];
      }
      console.log(ou);
    }

    var courseOU = getOU(url);
    console.log(url, pageurl);

    window.open("https://byui.brightspace.com/d2l/lp/manageFiles/main.d2l?ou=" + courseOU, "_blank");
}

/* Listens for a context menu click */
chrome.extension.onMessage.addListener(function (message, sender, callback) {
    if (message.functiontoInvoke == "editFiles") {
        editFiles(message.linkUrl, message.pageUrl);
    }
});
