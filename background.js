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
var contexts = ["link"];
for (var i = 0; i < contexts.length; i++) {
    var context = contexts[i];
    var title = "Edit in File Manager";
    var id = chrome.contextMenus.create({
        "title": title,
        "contexts": [context],
        "onclick": editInCourseFiles
    });
    console.log("'" + context + "' item:" + id);
}
