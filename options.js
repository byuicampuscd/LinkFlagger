//EXAMPLE OPTIONS PAGE FROM DEVELOPER.CHROME.COM

 // Saves options to chrome.storage
function save_options() {
  var htmltoggle = document.getElementById('htmltoggle').checked;
  var linktoggle = document.getElementById('linktoggle').checked;
  chrome.storage.sync.set({
    htmlsetting: htmltoggle,
    linksetting: htmltoggle
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    htmlsetting: true,
    linksetting: true
  }, function(items) {
    document.getElementById('htmltoggle').value = items.htmlsetting;
    document.getElementById('linktoggle').checked = items.linksetting;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);



// Actual settings, do not delete!
document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#alltoggle').addEventListener('change', allHandler);

    // THE "ENABLE ALL" SWITCH TURNS ON/OFF ALL FEATURES
    function allHandler() {
        $("input:checkbox").prop('checked', $(this).prop("checked"));
    }

});
//
//document.addEventListener('DOMContentLoaded', function () {
//    document.querySelector('#alltoggle').addEventListener('change', allHandler);
//    document.querySelector('#htmltoggle').addEventListener('change', htmlHandler);
//    document.querySelector('#linktoggle').addEventListener('change', linkHandler);
//
//
//    function allHandler() {
//        //Do Something...maybe another function showAlert(), for instance
//        if (alltoggle.checked) {
//            alert("all-toggle checked!");
//        }
//
//    }
//
//    function htmlHandler() {
//        //Do Something...maybe another function showAlert(), for instance
//        if (htmltoggle.checked) {
//            alert("html-toggle checked!");
//        }
//
//    }
//
//    function linkHandler() {
//        //Do Something...maybe another function showAlert(), for instance
//        if (linktoggle.checked) {
//            alert("link-toggle checked!");
//        }
//
//    }
//
//
//
//});
