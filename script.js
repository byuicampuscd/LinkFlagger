// ==UserScript==
// @name        LinkFlagger
// @version     60
// @author      Grant Johnson
// @description Highlights brainhoney and box links and images.
// @include     *brightspace.com*
// @require     http://code.jquery.com/jquery-latest.js
// @run-at document-end
// ==/UserScript==
window.addEventListener("load", function () {

    if (document.title == "Login - Brigham Young University - Idaho") {
        swspoilers(); // Log in page easter egg
    }

    // Clean or flag
    var ciframe = document.querySelectorAll("iframe");
    if (ciframe.length > 0) {
        var dctitle = document.querySelector("h1[class*='d2l-page-title']"); // Get the page title.
        if (dctitle === null) {
            dctitle = "no title"; // if element is null, set a fake value
        } else {
            dctitle = dctitle.textContent; // if element exsists, reuse variable to title
        }
        if (dctitle == "Edit HTML File") {

            fixIssues(); // Fix issues if on edit page
        } else if (ciframe[0].className.indexOf('d2l-iframe') === 0) {
            flagCode(); // Otherwise flag page
        }
    }

    var bs, is, brs, divs, bolds, spans, as, empty, altimg, body, emdivs, baddiv, youtube, equila;

    function fixIssues() {
        $(".d2l-htmleditor-group:last").after('<a type="button" roll="button" class="d2l-button vui-button" id="fixstuff" style="vertical-align: top;"><strong>BETA:</strong> Fix issues. <em>Can interfere with formating</em></a>'); // Generate button
        document.getElementById("fixstuff").addEventListener("click", function () {
            cleanCode(); // actualy clean the code
            cleanCode(); // Run again for good measure
            cleanCode(); // Why the heck not
            cleanCode(); // 4th time might be the charm?
            openhtmleditor(); // open the HTML editor and fix a bunch of stuff
            $("a[id*='fixstuff']").html('<strong style="color: #00cc00;">Issues fixed!</strong>'); // set the button to notify user that it ran.
        });
    }

    function cleanCode() {
        body = ciframe[0].contentWindow.document.querySelectorAll("*");
        $(body).filter("[style*='bold']").contents().wrap('<strong/>'); // wrap bolds with strongs
        $(body).filter("[style*='bold']").removeAttr("style"); // wrap bolds with strongs
        $(body).filter("div:empty[id!='main'][id!='header'][id!='article']").contents().unwrap(); // remove empty divs
        $(body).filter("div[id!='main'][id!='header'][id!='article']").contents().unwrap().wrap('<p/>'); // wrap divs with text in ps
        $(body).filter("img:not([alt])").attr("alt", "Course Image"); // set images without an alt tag to have an empty one
        $(body).filter("b").contents().unwrap().wrap('<strong/>'); //  wrap b tags with strongs
        $(body).filter("i").contents().unwrap().wrap('<em/>'); // wrap i tags with em tags
        $(body).filter("span:not([style])").contents().unwrap();
        $(body).filter("a:not([target='_blank'])").attr("target", "_blank");
        $(body).filter("strong:empty, em:empty, br, b:empty").remove();
        $(body).filter("iframe[src*='youtube.com/embed/']").attr("height", "500px");
        $(body).filter("iframe[src*='youtube.com/embed/']").attr("width", "100%");
        $(body).filter("iframe[src*='content.byui.edu/file/']").attr("height", "500px");
        $(body).filter("iframe[src*='content.byui.edu/file/']").attr("width", "100%");
        $(body).filter("a[href*='d2l/']").filter('a[href*="/calendar/"]').contents().unwrap();
        $(body).filter("a[href*='d2l/']").filter('a[href*="/home/"]').contents().unwrap();
    }

    function openhtmleditor() {
        document.querySelector('a[title*="HTML Source Editor"]').click();
        var pagetitle = document.querySelector('input[id*="topicTitle"]').getAttribute("value"); // Get activity title
        var checkExist = setInterval(function() {
            if ($('iframe[src*="/d2l/tools/blank.html"]').length) {
                clearInterval(checkExist);
                var sourceiframe = document.querySelector('iframe[src*="/d2l/tools/blank.html"]');
                sourceiframe.onload = function() {

                    var minibody = sourceiframe.contentWindow.document.querySelectorAll("*"); // Only elements from the editing frame

                    var sourcecodeelement = sourceiframe.contentWindow.document.querySelector("textarea[class='d2l-htmleditor-dialog-textarea']");
                    var sourcecode = sourcecodeelement.innerHTML;

                    // Make human readable
                    sourcecode = sourcecode.replace(/&gt;/g , '>');
                    sourcecode = sourcecode.replace(/&lt;/g , '<');

                    // Make Changes
                    sourcecode = sourcecode.replace(/<title>(.*?)</g, "<title>" + pagetitle + "<"); // Sync page title

                    sourcecode = sourcecode.replace(/&ldquo;/g, "\"");
                    sourcecode = sourcecode.replace(/&rdquo;/g, "\"");
                    sourcecode = sourcecode.replace(/&lsquo;/g, "\'");
                    sourcecode = sourcecode.replace(/&rsquo;/g, "\'");
                    sourcecode = sourcecode.replace(/&ndash;/g, " - ");
                    sourcecode = sourcecode.replace(/&mdash;/g, "-");

                    sourcecode = sourcecode.replace(/<p><\/p>/g, "");   // get rid of empty paragraphs
                    sourcecode = sourcecode.replace(/<h1><\/h1>/g, ""); // get rid of empty headers
                    sourcecode = sourcecode.replace(/<h2><\/h2>/g, ""); // get rid of empty headers
                    sourcecode = sourcecode.replace(/<h3><\/h3>/g, ""); // get rid of empty headers
                    sourcecode = sourcecode.replace(/<h4><\/h4>/g, ""); // get rid of empty headers
                    sourcecode = sourcecode.replace(/<h5><\/h5>/g, ""); // get rid of empty headers
                    sourcecode = sourcecode.replace(/<h6><\/h6>/g, ""); // get rid of empty headers
                    sourcecode = sourcecode.replace(/<a><\/a>/g, "");   // get rid of empty links
                    sourcecode = sourcecode.replace(/<span><\/span>/g, "");   // get rid of empty links

                    // Return to origional syntax
                    sourcecode = sourcecode.replace(/>/g , '&gt;');
                    sourcecode = sourcecode.replace(/</g , '&lt;');

                    // Set modified code to the page
                    sourcecodeelement.innerHTML = sourcecode;

                    // Notify user to save changes
                    $(minibody).filter("[class*='d2l-checkbox-container']").after('<p><em><strong style="color: #FF0000;">LinkFlagger:</strong> Changes have been made to this source code, please Save it.</em></p>');
                };
            }
        }, 100);
    }



    function flagCode() {
        body = ciframe[0].contentWindow.document.querySelectorAll("*"); // grabs all the elements from the iframe.

        // Set the vars once
        var bhlink  = $(body).filter("a[href*='brainhoney.com']");   // If link element contains link from brainhoney
        var boxlink = $(body).filter("a[href*='box.com']");          // If link element contains link from box
        var benlink = $(body).filter("a[href*='courses.byui.edu']"); // If link element is from benjamin server
        var bolds   = $(body).filter("[style*='bold']");             // If element has bold styling
        var badtar  = $(body).filter("a:not([target='_blank'])");    // If link has incorect target
        var alimage = $(body).filter("img:not([alt])");              // Images with no alt attribute
        var bhimage = $(body).filter("img[src*='brainhoney']");      // Images from BrainHoney
        var emlink  = $(body).filter("a:empty");                     // Empty Links.
        var dynlink = $(body).filter("a[href*='d2l/']").filter("a[href*='/home'], a[href*='/viewContent'], a[href*='/calendar']");      // Links that do not update when cloned


        //Flag elements
        $([bhlink, boxlink, benlink, dynlink]).each( function() {
            $(this).css({
                "color"      : "#d9432f","outline"    : "3px solid #d9432f","background" : "repeating-linear-gradient(135deg, #ffcdd2, #ffcdd2 5px, #ffffff 5px, #ffffff 10px)"});
        });
        $(bolds  ).css({"outline" : "3px solid #689F38", "background" : "repeating-linear-gradient( 45deg, #DCEDC8, #DCEDC8 5px, #ffffff 5px, #ffffff 10px)"});
        $(badtar ).css({"border"  : "3px solid #ffb700", "background" : "repeating-linear-gradient(135deg, #FFE0B2, #FFE0B2 5px, #ffffff 5px, #ffffff 10px)"});
        $(emlink ).css({"border"  : "3px solid #0057e7"});
        $(bhimage).css({"border"  : "5px solid #d9432f"});
        $(alimage).css({"outline" : "5px solid #176ced"});

        // Set titles
        seterrortitles(bhlink  , 'This is an iLearn 2.0 link, ');
        seterrortitles(boxlink , 'This a Box link, ');
        seterrortitles(benlink , 'This is a Benjamin link, ');
        seterrortitles(bolds   , 'Embeded font-weight, ');
        seterrortitles(badtar  , 'This link does not open in a new window, ');
        seterrortitles(emlink  , 'This link has an empty href or text, ');
        seterrortitles(bhimage , 'This image is from BrainHoney, ');
        seterrortitles(alimage , 'This Image has no alt text, ');
        seterrortitles(dynlink , 'This link is a Static IL3 link and WILL NOT update when coppied, ');

        // Flag filepath and page title
        flagflepath(document.querySelector("div[class*='d2l-fileviewer-text']"), document.querySelector("ol[class*='vui-breadcrumbs']")); // Checks File path
        flagpgtitle(document.querySelector("h1[class*='d2l-page-title']"), ciframe[0].contentWindow.document.querySelector("title"));     // Checks the titles
    }

    function flagflepath(flepath, pathdiv) {
        if (!flepath.getAttribute('data-location').includes('%20Files')) {
            $(pathdiv).css({
                "border"     : "3px solid #d9432f",
                "background" : "repeating-linear-gradient(45deg, #ffcdd2, #ffcdd2 5px, #ffffff 5px, #ffffff 10px)"
            });
            $(pathdiv).attr("title", "Error: The filepath doesn\'t have the words \'Course Files\' or \'Content Files\'.");
        }
    }

    function flagpgtitle(dctitle, httitle) {
        if ($(body).filter("title").length === 0) {
            $(dctitle).css({
                "border"     : "3px solid #176ced",
                "background" : "repeating-linear-gradient(135deg, #BBDEFB, #BBDEFB 5px, #ffffff 5px, #ffffff 10px)"
            });
            $(dctitle).attr("title", "Error: No Title Found");
        } else if (dctitle.textContent != httitle.textContent) {
            $(dctitle).css({
                "border"     : "3px solid #176ced",
                "background" : "repeating-linear-gradient(135deg, #BBDEFB, #BBDEFB 5px, #ffffff 5px, #ffffff 10px)"
            });
            $(dctitle).attr("title", "Error: The HTML title \"" + httitle.textContent + "\" does not match the document title \"" + dctitle.textContent + "\"");
        }
    }

    function seterrortitles(elements, titletext) {
        var newtitle = '';
        var curtitle = '';
        for (i = 0; i < elements.length; i++) {
            if (elements[i] !== undefined) {
                if (elements[i].title.indexOf('Issues') === 0) {
                    curtitle = '';
                    curtitle = elements[i].getAttribute('title');
                    newtitle = curtitle + titletext;
                } else {
                    newtitle = 'Issues: ' + titletext;
                }
                elements[i].setAttribute('title', newtitle);
            }
        }
    }

    function swspoilers() {
        $(document.querySelector("h1[class*='d2l-login-portal-heading']")).html('<h1 style="font-size: 24px; text-align: center; color: #ff0000"><span style="font-weight:bold">"OMG, like I-Learn 3 is just the worst.... I-Learn 2 was perfect!!!!"</span></h1><br><img width="100%" src="http://i.imgur.com/UlQYs6T.gif">');
    }
});
