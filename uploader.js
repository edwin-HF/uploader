/**
 * @author Edwin Fan
 * edwin.fan@foxmail.com
 */
window.rootPathUploader = (function (src) {
    src = document.scripts[document.scripts.length - 1].src;
    return src.substring(0, src.lastIndexOf("/") + 1);
})();

(function ($) {

    $.fn.extend(
        {
            uploader:function (uploader,callback) {

                let $this = $(this);

                registerHandler(uploader,function (handler) {
                    obtainFile(
                        $this,
                        function (files,$element) {
                            handler.setFile(files);
                            callback(handler,$element);
                        }
                    );
                })

            },
            setConfig:function (config) {
                this.config = config;
                return this;
            },
        }
    );

    $.extend(
        {
            uploadFile:function (uploader,file,callback) {

                registerHandler(uploader,function (handler) {
                    let checkLoad = setInterval(
                        function () {
                            if (handler) {
                                clearInterval(checkLoad);
                                handler.setFile(file);
                                callback(handler);
                            }
                        },
                        500
                    );
                })

            }
        }
    );

    function obtainFile($this,callback)
    {

        $this.after('<input type="file" multiple style="display: none"/>');

        $this.click(
            function () {
                $(this).next().click();
            }
        );

        $this.next().change(
            function () {
                callback($(this)[0].files,$(this).prev());
            }
        );
    }

    function registerHandler(uploader, callback) {

        switch (uploader) {
            case 'ali':
                $.getScript(rootPathUploader + "vendor/aliyun-oss-sdk.min.js", function () {
                    $.getScript(rootPathUploader + "plugs/ali-oss.js",function () {
                        let handler = new AliOss();
                        callback(handler);
                    });
                });
                break;

            case 'qiniu':
                $.getScript(rootPathUploader + "vendor/qiniu.min.js", function () {
                    $.getScript(rootPathUploader + "plugs/qiniu.js",function () {
                        let handler = new QiNiu();
                        handler.setHandle(qiniu);
                        callback(handler);
                    });
                });
                break;
            case 'local':
                $.getScript(rootPathUploader + "vendor/local.js", function () {
                    $.getScript(rootPathUploader + "plugs/local-upload.js",function () {
                        let handler = new LocalUpload();
                        callback(handler)
                    });
                });
                break;
        }
    }


})($);
