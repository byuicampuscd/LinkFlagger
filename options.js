// Saves options to chrome.storage
function save_options() {
    var alltoggle = document.getElementById('alltoggle').checked;
    var htmltoggle = document.getElementById('htmltoggle').checked;
    var linktoggle = document.getElementById('linktoggle').checked;
    chrome.storage.sync.set({
        allsetting: alltoggle,
        htmlsetting: htmltoggle,
        linksetting: linktoggle
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {

    chrome.storage.sync.get({
        allsetting: true,
        htmlsetting: true,
        linksetting: true
    }, function (items) {
        document.getElementById('alltoggle').checked = items.allsetting;
        document.getElementById('htmltoggle').checked = items.htmlsetting;
        document.getElementById('linktoggle').checked = items.linksetting;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);


document.addEventListener('DOMContentLoaded', function () {

    //ALL-TOGGLE STUFF
    $('.tool').change(function () {
         //TURN OFF ALL-SWITCH IF ANY OF THE 'TOOLS' IS OFF
        if (false == $(this).prop("checked")) {
            $("#alltoggle").prop('checked', $(this).prop("checked"));
        }
        //TURN ON ALL-SWITCH IF ALL OF THE 'TOOLS' ARE ON
        if ($('.tool:checked').length == $('.tool').length) {
            $("#alltoggle").prop('checked', true);
        }
    });

    document.querySelector('#alltoggle').addEventListener('change', allHandler);
    //Only enable all if it is checked (not unchecked)
    function allHandler() {
        if ($(this).is(':checked')) {
            $("input:checkbox").prop('checked', $(this).prop("checked"));
        }
    }
});
