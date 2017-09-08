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
  if (url.includes('enforced')) {
    var ou = url.split('/enforced/')[1].split('-')[0];
    chrome.runtime.sendMessage({url: "https://byui.brightspace.com/d2l/lp/manageFiles/main.d2l?ou=" + ou + "&editFlag", directory: url, greeting:"newTab"});
  } else if (url.includes('ou=') || url.includes('/content/')) {
    chrome.runtime.sendMessage({url: url, directory: url, greeting:"newTab"});
  }
  console.log(url, pageurl);
}


/* Listens for a context menu click */
chrome.extension.onMessage.addListener(function (message, sender, callback) {
    if (message.functiontoInvoke == "editFiles") {
        editFiles(message.linkUrl, message.pageUrl);
    }
    if (message.functiontoInvoke == "navToEditor"){
        console.log(message.linkUrl);
        navToEditor(message.linkUrl);
    }
    if (message.functiontoInvoke == "clickEditHTML"){
        console.log(message.linkUrl);
        clickEditHTML();
    }
});


function navToEditor(url){
  if (!url.includes('enforced') && !url.includes('EditFile')) {
    $(document).ready(() => {
      $('span:contains("Edit HTML")').click();
    });
    return;
  }
  if (url) {
    var split = url.split('/enforced/')[1].replace(/%20/g, ' ').split('/');
    console.log(split);
    split[split.length - 1] = split[split.length - 1].split('?')[0];
    console.log(split[split.length -1]);

    function waitFor(selector, callback) {
      var original;
        var loop = setInterval(() => {
          if ($(selector).length > 0) {
            clearInterval(loop);
            callback();
          }
        }, 100);
    }

    function waitForInnerFrame(callback) {
      var coop = setInterval(() => {
        if ($('iframe[title="Edit File"]').get(0).contentDocument.querySelectorAll('iframe[title="Content"]').length > 0) {
          clearInterval(coop);
          callback();
        }
      }, 100);
    }

    function resizeInnerWindow(callback) {
      var woop = setInterval(() => {
        if ($('iframe[title="Edit File"]').get(0).contentDocument.querySelectorAll('.d2l-htmleditor-iframecontainer').length > 0) {
          clearInterval(woop);
          callback();
        }
        console.log('searching');
      }, 100);
    }

    function resizeWindow() {
      console.log('resizing');
      waitFor('iframe[title="Edit File"]', () => {
        console.log('loaded1');
        waitForInnerFrame(() => {
          console.log('loaded2');
          $('.ddial_o').css({left: '70px', top: '35px', width: '93.5vw', height: '92vh'});
          $('.ddial_c').css({height: '77vh'});
          resizeInnerWindow(() => {
            $('iframe[title="Edit File"]').get(0).contentDocument.querySelector('.d2l-htmleditor-iframecontainer').style.height = '65.4vh';
          });
        });
      });
    }

    function scrollDown(fileName) {
      if ($('span:contains(' + fileName + ')').length > 0) {
        var event = new MouseEvent('click', {
          bubbles: false,
          cancelable: false,
          view: window
        });
        document.querySelector('a[title*="Actions for ' + fileName + '"]').dispatchEvent(event);
        $('span:contains("Edit File")').click();
        resizeWindow();
        return;
      } else {
        setTimeout(() => {
          $('#z_m > div:nth-child(2) > div.dsl_p_m_f > div').scrollTop($("#z_m > div:nth-child(2) > div.dsl_p_m_f > div")[0].scrollHeight);
          scrollDown(fileName);
        }, 200)
      }
    }

    console.log(split.length);
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

    // Scroll to bottom to load all files


    /**/
    // Click edit on right file
    console.log(url);
  } else {
    // For content view pages
    console.log('Content Page');

  }
}
