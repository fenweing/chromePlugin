(function () {
    console.log("exec content js");
    var addNewItem = document.getElementById('add-new-item');
    console.log("get popup DOM in content js:" + addNewItem);
    var outDom = document.getElementById('xtpj');
    console.log("get outDom DOM in content js:" + outDom);

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        // console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
        console.log("收到popup消息：" + request.value);
        if (request.cmd == 'getOutHtml') {
            var outHtml = document.getElementsByTagName('html')[0].outerHTML;
            if (outHtml == null || outHtml == '') {
                alert("获取页面html为空！");
                return;
            }
            var url = window.location.href;
            sendResponse({
                html: outHtml,
                url: url
            });
        }
    });
})();
