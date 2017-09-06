function editInCourseFiles(info, tab) {
    console.log("info: " + JSON.stringify(info));
    console.log("link url: " + JSON.stringify(info.linkUrl));
    console.log("page url: " + JSON.stringify(info.linkUrl));

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
    'https://*.brightspace.com/d2l/common/viewFile.d2lfile/*'
  ]
});
