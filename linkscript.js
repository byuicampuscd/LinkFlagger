var ciframe = document.querySelectorAll("iframe");
if (ciframe[0].className.indexOf('d2l-iframe') === 0) {
        flagCode(); // Otherwise flag page
    }


function flagCode() {
    body = ciframe[0].contentWindow.document.querySelectorAll("*"); // grabs all the elements from the iframe.

    // Set the vars once
    var bhlink = $(body).filter("a[href*='brainhoney.com']"); // If link element contains link from brainhoney
    var boxlink = $(body).filter("a[href*='box.com']"); // If link element contains link from box
    var benlink = $(body).filter("a[href*='courses.byui.edu']"); // If link element is from benjamin server
    var bolds = $(body).filter("[style*='bold']"); // If element has bold styling
    var badtar = $(body).filter("a:not([target='_blank'])"); // If link has incorect target
    var alimage = $(body).filter("img:not([alt])"); // Images with no alt attribute
    var bhimage = $(body).filter("img[src*='brainhoney']"); // Images from BrainHoney
    var emlink = $(body).filter("a:empty"); // Empty Links.
    var dynlink = $(body).filter("a[href*='d2l/']").filter("a[href*='/home'], a[href*='/viewContent'], a[href*='/calendar']"); // Links that do not update when cloned


    //Flag elements
    $([bhlink, boxlink, benlink, dynlink]).each(function () {
        $(this).css({
            "color": "#d9432f",
            "outline": "3px solid #d9432f",
            "background": "repeating-linear-gradient(135deg, #ffcdd2, #ffcdd2 5px, #ffffff 5px, #ffffff 10px)"
        });
    });
    $(bolds).css({
        "outline": "3px solid #689F38",
        "background": "repeating-linear-gradient( 45deg, #DCEDC8, #DCEDC8 5px, #ffffff 5px, #ffffff 10px)"
    });
    $(badtar).css({
        "border": "3px solid #ffb700",
        "background": "repeating-linear-gradient(135deg, #FFE0B2, #FFE0B2 5px, #ffffff 5px, #ffffff 10px)"
    });
    $(emlink).css({
        "border": "3px solid #0057e7"
    });
    $(bhimage).css({
        "border": "5px solid #d9432f"
    });
    $(alimage).css({
        "outline": "5px solid #176ced"
    });

    // Set titles
    seterrortitles(bhlink, 'This is an iLearn 2.0 link, ');
    seterrortitles(boxlink, 'This a Box link, ');
    seterrortitles(benlink, 'This is a Benjamin link, ');
    seterrortitles(bolds, 'Embeded font-weight, ');
    seterrortitles(badtar, 'This link does not open in a new window, ');
    seterrortitles(emlink, 'This link has an empty href or text, ');
    seterrortitles(bhimage, 'This image is from BrainHoney, ');
    seterrortitles(alimage, 'This Image has no alt text, ');
    seterrortitles(dynlink, 'This link is a Static IL3 link and WILL NOT update when coppied, ');

    // Flag filepath and page title
    flagflepath(document.querySelector("div[class*='d2l-fileviewer-text']"), document.querySelector("ol[class*='vui-breadcrumbs']")); // Checks File path
    flagpgtitle(document.querySelector("h1[class*='d2l-page-title']"), ciframe[0].contentWindow.document.querySelector("title")); // Checks the titles
}

function flagflepath(flepath, pathdiv) {
    if (!flepath.getAttribute('data-location').includes('%20Files')) {
        $(pathdiv).css({
            "border": "3px solid #d9432f",
            "background": "repeating-linear-gradient(45deg, #ffcdd2, #ffcdd2 5px, #ffffff 5px, #ffffff 10px)"
        });
        $(pathdiv).attr("title", "Error: The filepath doesn\'t have the words \'Course Files\' or \'Content Files\'.");
    }
}

function flagpgtitle(dctitle, httitle) {
    if ($(body).filter("title").length === 0) {
        $(dctitle).css({
            "border": "3px solid #176ced",
            "background": "repeating-linear-gradient(135deg, #BBDEFB, #BBDEFB 5px, #ffffff 5px, #ffffff 10px)"
        });
        $(dctitle).attr("title", "Error: No Title Found");
    } else if (dctitle.textContent != httitle.textContent) {
        $(dctitle).css({
            "border": "3px solid #176ced",
            "background": "repeating-linear-gradient(135deg, #BBDEFB, #BBDEFB 5px, #ffffff 5px, #ffffff 10px)"
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
