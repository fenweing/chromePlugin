(function () {
    var outDom = document.getElementById('xtpj');
    console.log("get outDom DOM in content js:" + outDom);

    function sendMessageToContentScript(message, callback) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
                if (callback) callback(response);
            });
        });
    }


    var Tasks = {
        show: function (obj) {
            obj.className = '';
            return this;
        },
        hide: function (obj) {
            obj.className = 'hide';
            return this;
        },
        $addNewItem: document.getElementById('add-new-item'),
        titleInput: $('#titleInput'),
        serverUrl: $('#serverUrlInput'),
        init: function () {
            //打开添加文本框
            Tasks.$addNewItem.addEventListener('click', function () {
                sendMessageToContentScript({cmd: 'getOutHtml', value: 'getOutHtml'}, function (response) {
                    console.log('来自content的回复：' + response);
                    var url = response.url;
                    var htmlValue = response.html;
                    var title = Tasks.titleInput.val();
                    let serverUrl = Tasks.serverUrl.val();
                    var url = "http://localhost:8081/addOutHtml";
                    if (serverUrl != null || serverUrl != '') {
                        url = serverUrl;
                    }
                    $.ajax({
                            url: url,
                            data: JSON.stringify({
                                html: htmlValue,
                                url: url,
                                title: title
                            }),
                            type: "POST",
                            success: function (data) {
                                console.log("addOutHtml请求返回：" + data);
                            },
                            contentType: "application/json"
                        }
                    );
                });
            }, true);
        }
    };
    Tasks.init();
})();
