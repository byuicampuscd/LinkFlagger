/*eslint-env browser*/
/*global chrome*/
// ==LINK FLAGGER==================================================
// @name        LinkFlagger 2.0
// @version     0.0
// @author      A. Didymus Benson, Zachary Williams
// @description Highlights brainhoney and box links and images.
// ================================================================
console.log('Injected');
// SETTINGS CHECKERS
var htmlON;
chrome.storage.sync.get("htmlsetting", function(result) {
  htmlON = result.htmlsetting;
  tryhtml(htmlON);
});

var linksON;
chrome.storage.sync.get("linksetting", function(result) {
  linksON = result.linksetting;
  trylinks(linksON);
});

var highlightON;
chrome.storage.sync.get("highlightsetting", function(result) {
  highlightON = result.highlightsetting;
  tryhighlight(highlightON);
});

//SCRIPT INJECTORS
function tryhtml(htmlON) {
  if (htmlON) {
    var h = document.createElement('script');
    h.src = chrome.extension.getURL('htmlscript.js');
    h.onload = function() {
      this.remove();
    };
    (document.head || document.documentElement).appendChild(h);
  }
}

function trylinks(linksON) {
  if (linksON) {
    var l = document.createElement('script');
    l.src = chrome.extension.getURL('linkscript.js');
    l.onload = function() {
      this.remove();
    };
    (document.head || document.documentElement).appendChild(l);
  }
}

function tryhighlight(highlightON) {
  console.log(highlightON);
  if (highlightON) {
    var c = document.createElement('script');
    c.src = chrome.extension.getURL('highlightscript.js');
    c.onload = function() {
      this.remove();
    };
    (document.head || document.documentElement).appendChild(c);
  }
}

var s = document.createElement('script');
s.src = chrome.extension.getURL('egg.js');
s.onload = function() {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);

/****************************** EDIT HTML OF LINKS **************************************/
/* Determines link type and what action to take */
var editFiles = function(url, pageurl) {
  if (url.includes('enforced')) {
    var ou = url.split('/enforced/')[1].split('-')[0];
    chrome.runtime.sendMessage({
      url: "https://byui.brightspace.com/d2l/lp/manageFiles/main.d2l?ou=" + ou,
      directory: url,
      greeting: "newTab"
    });
  } else if (url.includes('ou=') || url.includes('/content/')) {
    chrome.runtime.sendMessage({
      url: url,
      directory: url,
      greeting: "newTab"
    });
  }
}

/* */
function navToEditor(url) {
  if (!url.includes('enforced') && !url.includes('EditFile')) {
    $(document).ready(() => {
      $('span:contains("Edit HTML")').click();
    });
    return;
  } else {
    var split = url.split('/enforced/')[1].replace(/%20/g, ' ').split('/');
    split[split.length - 1] = split[split.length - 1].split('?')[0];

    function waitForElement(element, innerFrame, callback) {
      console.log(element);
      var el;
      var loop = setInterval(() => {
        if (innerFrame) {
          console.log($('iframe[title="Edit File"]').get(0).contentDocument.querySelectorAll(element));
          el = $('iframe[title="Edit File"]').get(0).contentDocument.querySelectorAll(element);
        } else {
          el = element;
        }
        if (el.length > 0) {
            clearInterval(loop);
            callback();
        }
      }, 100);
    }

    function resizeWindow() {
      waitForElement($('iframe[title="Edit File"]'), false, () => {
        console.log('first');
        waitForElement('iframe[title="Content"]', true, () => {
          console.log('second');
          $('.ddial_o').css({
            left: '70px',
            top: '35px',
            width: '93.5vw',
            height: '92vh'
          });
          $('.ddial_c').css({
            height: '77vh'
          });
          waitForElement('.d2l-htmleditor-iframecontainer', true, () => {
            console.log('third');
            $('iframe[title="Edit File"]').get(0).contentDocument.querySelector('.d2l-htmleditor-iframecontainer').style.height = '65.4vh';
          });
        });
      });
    }

    function scrollDown(fileName) {
      // Is the file already visible? If not, repeat
      var checkForFile = setInterval(() => {
        if ($('span:contains(' + fileName + ')').length > 0) {
          var event = new MouseEvent('click', {
            bubbles: false,
            cancelable: false,
            view: window
          });
          document.querySelector('a[title*="Actions for ' + fileName + '"]').dispatchEvent(event);
          $('span:contains("Edit File")').click();
          resizeWindow();
          clearInterval(checkForFile);
        } else {
          $('#z_m > div:nth-child(2) > div.dsl_p_m_f > div').scrollTop($("#z_m > div:nth-child(2) > div.dsl_p_m_f > div")[0].scrollHeight);
        }
      }, 100);
    }

    split.forEach((dir) => {
      if (!dir.includes('.html')) {
        $('span:contains(' + dir + ')').click();
      } else {
        // Scroll down
        $('#z_m > div:nth-child(2) > div.dsl_p_m_f > div').ready(() => {
          scrollDown(dir);
        });
      }

    });
  }
}

/* Listens for a context menu click */
chrome.extension.onMessage.addListener(function(message, sender, callback) {
  if (message.functiontoInvoke == "editFiles") {
    editFiles(message.linkUrl, message.pageUrl);
  }
  if (message.functiontoInvoke == "navToEditor") {
    console.log(message.linkUrl);
    navToEditor(message.linkUrl);
  }
  if (message.functiontoInvoke == "clickEditHTML") {
    console.log(message.linkUrl);
    clickEditHTML();
  }
});
