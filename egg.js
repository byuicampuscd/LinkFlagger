if (document.title == "Login - Brigham Young University - Idaho") {
    if (window.addEventListener) {
        var kkeys = [],
            konami = "38,38,40,40,37,39,37,39,66,65";
        window.addEventListener("keydown", function (e) {
            kkeys.push(e.keyCode);
            if (kkeys.toString().indexOf(konami) >= 0) {
                $('body').append("<style>.cat{position:fixed; right:100%; bottom:-275px;  animation: party 8s forwards;}  @keyframes party { 100% {right:10%;}}</style><img class='cat' src='https://i.imgur.com/Cii6SuE.gif'>");
                kkeys = [];
            }
        }, true);
    }
}
