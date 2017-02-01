# LinkFlagger
This extension was created to provide customizable tools for work in Brightspace. 
Each tool is controlled by a script that can be enabled or disabled as needed.

## Using LinkFlagger

To choose which scripts are enabled, simply click the extension icon and 
check which scripts you wish to have enabled. 

![Popup Options Menu](http://i.imgur.com/e0oomJM.png)

If you wish to repurpose this extension for another website outside of Brightspace,
simply modify the "matches" field in the manifest under "content_scripts".

## Adding a script to LinkFlagger

If you wish to add a tool to LinkFlagger, there are a few steps you need to take 
to ensure that it will run properly. After you have written your script:

### Add the file to the manifest under "Web_accessible_resources" 

```javascript
    "web_accessible_resources": [
        "htmlscript.js",
        "linkscript.js",
        "egg.js",
        "YOURSCRIPT.JS"
    ],
```

### Add an enable/disable option to the options.html popup

Place the following elements in the options.html file at any point after another `<hr>` tag. 
If you add it just before the div called "status" it will be the last tool in the menu.

```html
    <div class="item">
        <span>TOOL NAME</span>
        <label class="switch" for="TOOLNAME-toggle">
        <input type="checkbox" id="TOOLNAME-toggle" class="tool">
        <div class="slider round"></div>
        </label>
    </div>
    <hr>
```
### Add a listener for the enable/disable button in options.js

Now that the options menu has an on/off switch for your tool, add the appropriate code to 
save the setting. See the highlighted lines below:

![Basically anywhere you see the name of any of the other tools is where the name of your tool will go](http://i.imgur.com/e0nid24.png)

### Add the script to content.js

Once you've added the script to the manifest and options, the last step to make it functional
is to check for it in your saved settings and enable the tool when the setting is selected.
Do this by adding the following code to the appropraite places in content.js:

```javascript
// Add this under "Settings Checkers"
var toolNameON;
chrome.storage.sync.get("TOOLNAMEsetting", function (result) {
    toolNameON = result.TOOLNAMEsetting;
    console.log(result.TOOLNAMEsetting);
    tryTOOLNAME(toolNameON);
});

// Add this under "Script Injectors"
function tryTOOLNAME(toolNameON){
if (toolNameON) {
    var x = document.createElement('script');
    x.src = chrome.extension.getURL('htmlscript.js');
    x.onload = function () {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(x);
}
}
```
Note that "var x" can be any variable name, although the existing standard is to use the first 
letter of the tool you are adding.

