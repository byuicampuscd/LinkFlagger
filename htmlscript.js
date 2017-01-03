

// TODO: Decide if this can be simplified, then do it.
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
    }
}

//Not sure what these variables are for, so...
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
    var checkExist = setInterval(function () {
        if ($('iframe[src*="/d2l/tools/blank.html"]').length) {
            clearInterval(checkExist);
            var sourceiframe = document.querySelector('iframe[src*="/d2l/tools/blank.html"]');
            sourceiframe.onload = function () {

                var minibody = sourceiframe.contentWindow.document.querySelectorAll("*"); // Only elements from the editing frame

                var sourcecodeelement = sourceiframe.contentWindow.document.querySelector("textarea[class='d2l-htmleditor-dialog-textarea']");
                var sourcecode = sourcecodeelement.innerHTML;

                // Make human readable
                sourcecode = sourcecode.replace(/&gt;/g, '>');
                sourcecode = sourcecode.replace(/&lt;/g, '<');

                // Make Changes
                sourcecode = sourcecode.replace(/<title>(.*?)</g, "<title>" + pagetitle + "<"); // Sync page title

                sourcecode = sourcecode.replace(/&ldquo;/g, "\"");
                sourcecode = sourcecode.replace(/&rdquo;/g, "\"");
                sourcecode = sourcecode.replace(/&lsquo;/g, "\'");
                sourcecode = sourcecode.replace(/&rsquo;/g, "\'");
                sourcecode = sourcecode.replace(/&ndash;/g, " - ");
                sourcecode = sourcecode.replace(/&mdash;/g, "-");

                sourcecode = sourcecode.replace(/<p><\/p>/g, ""); // get rid of empty paragraphs
                sourcecode = sourcecode.replace(/<h1><\/h1>/g, ""); // get rid of empty headers
                sourcecode = sourcecode.replace(/<h2><\/h2>/g, ""); // get rid of empty headers
                sourcecode = sourcecode.replace(/<h3><\/h3>/g, ""); // get rid of empty headers
                sourcecode = sourcecode.replace(/<h4><\/h4>/g, ""); // get rid of empty headers
                sourcecode = sourcecode.replace(/<h5><\/h5>/g, ""); // get rid of empty headers
                sourcecode = sourcecode.replace(/<h6><\/h6>/g, ""); // get rid of empty headers
                sourcecode = sourcecode.replace(/<a><\/a>/g, ""); // get rid of empty links
                sourcecode = sourcecode.replace(/<span><\/span>/g, ""); // get rid of empty links

                // Return to origional syntax
                sourcecode = sourcecode.replace(/>/g, '&gt;');
                sourcecode = sourcecode.replace(/</g, '&lt;');

                // Set modified code to the page
                sourcecodeelement.innerHTML = sourcecode;

                // Notify user to save changes
                $(minibody).filter("[class*='d2l-checkbox-container']").after('<p><em><strong style="color: #FF0000;">LinkFlagger:</strong> Changes have been made to this source code, please Save it.</em></p>');
            };
        }
    }, 100);
}


