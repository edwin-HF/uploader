function Local(url)
{
    this.url = url;
}

Local.prototype.upload = function (file,path,params) {

    let $this = this;

    let formData = new FormData();
    formData.append('file',file);
    formData.append('path',path);

    $.ajax(
        {
            url: $this.url,
            type: 'post',
            async: true,
            dataType: 'json',
            processData: false,
            contentType: false,
            data: formData,
            xhr: function () {
                let myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    // 检查上传的文件是否存在
                    myXhr.upload.addEventListener(
                        'progress',
                        function (e) {
                            let loaded = e.loaded;
                            let total = e.total;
                            let percent = Math.floor(100 * loaded / total);
                            if (params.progress) {
                                params.progress(percent);
                            }
                        },
                        false
                    );
                }

                return myXhr;
            },
            success: function (data) {
                if (params.success) {
                    params.success(data);
                }
            },
            error: function () {
                if (params.error) {
                    params.error();
                }
            }
        }
    );

}
