var linkUrl;

function editInCourseFiles(info, tab) {
    console.log("info: " + JSON.stringify(info));
    console.log("link url: " + JSON.stringify(info.linkUrl));
    console.log("page url: " + JSON.stringify(info.pageUrl));

    linkUrl = info.linkUrl;
    //Add all you functional Logic here
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            "functiontoInvoke": "editFiles",
            "linkUrl": JSON.stringify(info.linkUrl),
            "pageUrl": JSON.stringify(info.pageUrl)
        });
    });
}

// Create one test item for each context type.
chrome.contextMenus.create({
    title: 'Edit File in Course',
    contexts: ['link'],
    onclick: editInCourseFiles,
    targetUrlPatterns: [
    'https://*.brightspace.com/d2l/le/content/*',
    'https://*.brightspace.com/d2l/common/dialogs/quickLink/*',
    'https://*.brightspace.com/d2l/common/viewFile.d2lfile/*',
    'https://*.brightspace.com/content/enforced/*'
  ]
});

var temp_url = '';
var newTabId = 0;
chrome.extension.onMessage.addListener(function (message, sender, callback) {
    if (message.greeting == "newTab") {
        temp_url = message.directory.replace(/"/g, '');
        console.log(temp_url);
        chrome.tabs.create({
            url: message.url.replace(/"/g, '')
        }, (tab) => {
          newTabId = tab.id;
          chrome.tabs.sendMessage(tab.id, {
              "functiontoInvoke": "navToEditor",
              "linkUrl": temp_url
          });
        });
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(newTabId, tab.id, tab.status);
  if (tab.id === newTabId && tab.status === 'complete') {
    console.log('It lives');
    chrome.tabs.sendMessage(tab.id, {
        "functiontoInvoke": "navToEditor",
        "linkUrl": temp_url
    });
  }
});
