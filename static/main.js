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
        addNewItem: $('#add-new-item'),
        titleInput: $('#titleInput'),
        serverUrl: $('#serverUrlInput'),
        indexPageBtn: $('#indexPageBtn'),
        transmissionTrackerBtn: $('#transmissionTrackerBtn'),
        transmissionPageBtn: $('#transmissionPageBtn'),
        ariaTrackerBtn: $('#ariaTrackerBtn'),
        init: function () {
            //打开添加文本框
            // Tasks.$addNewItem.addEventListener('click', function () {
            Tasks.addNewItem.click(function (e) {
                sendMessageToContentScript({cmd: 'getOutHtml', value: 'getOutHtml'}, function (response) {
                    try {
                        var url = response.url;
                        var htmlValue = response.html;
                        var title = Tasks.titleInput.val();
                        let serverUrl = Tasks.serverUrl.val();
                        if (serverUrl == null || serverUrl == '') {
                            serverUrl = config.addHtmlUrl;
                        }
                        $.ajax({
                                url: serverUrl,
                                data: JSON.stringify({
                                    html: htmlValue,
                                    url: url,
                                    title: title
                                }),
                                type: "POST",
                                success: function (data) {
                                    console.log("addOutHtml请求返回：" + data);
                                    var responseMessage = "";
                                    if (data == null || data == "") {
                                        responseMessage = "服务器返回为空！"
                                    } else {
                                        var success = data.success;
                                        if (success) {
                                            responseMessage = "添加成功";
                                        } else {
                                            responseMessage = "添加出错：" + data.message;
                                        }
                                    }
                                    sendMessageToContentScript({
                                        cmd: 'responseMessage',
                                        value: responseMessage
                                    }, function (response) {
                                    });
                                },
                                contentType: "application/json"
                            }
                        );
                    } catch (e) {
                        console.error("处理html数据出错！" + e);
                        sendMessageToContentScript({
                            cmd: 'responseMessage',
                            value: "处理html数据出错！" + e.toString()
                        }, function (response) {
                        });
                    }
                });
            });
            Tasks.indexPageBtn.click(function (e) {
                sendMessageToContentScript({
                    cmd: 'newTab',
                    value: config.indexPageUrl
                }, function (response) {
                });
            });
            Tasks.transmissionTrackerBtn.click(function (e) {
                sendMessageToContentScript({
                    cmd: 'newTab',
                    value: config.transmissionTrackerUrl
                }, function (response) {
                });
            });
            Tasks.transmissionPageBtn.click(function (e) {
                sendMessageToContentScript({
                    cmd: 'newTab',
                    value: config.transmissionPageUrl
                }, function (response) {
                });
            });
            Tasks.ariaTrackerBtn.click(function (e) {
                sendMessageToContentScript({
                    cmd: 'newTab',
                    value: config.ariaTrackerUrl
                }, function (response) {
                });
            });
        }
    };
    Tasks.init();
})();
