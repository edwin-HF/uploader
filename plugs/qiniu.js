function QiNiu()
{
    var _alias = false;
}

QiNiu.prototype.setHandle = function (handle) {
    this.handle = handle;
    return this;
};

QiNiu.prototype.setToken = function (token) {
    this.token = token;
    return this;
};

QiNiu.prototype.setExtra = function (extra) {
    this.extra = extra;
    return this;
};

QiNiu.prototype.alias = function () {
    this._alias = true;
    return this;
};

QiNiu.prototype.setPath = function (path) {
    this.path = path;
    return this;
};

QiNiu.prototype.setConfig = function (config) {
    this.config = config;
    return this;
};

QiNiu.prototype.setFileName = function (filename) {
    this.filename = filename;
    return this;
};

QiNiu.prototype.setFile = function (file) {
    this.file = file;
    return this;
};

QiNiu.prototype.getFile = function () {
    return this.file;
};

QiNiu.prototype.ajaxConfig = function (path,params) {
    let data  = $.extend({},params);
    let $this = this;
    $.ajax(
        {
            url : path,
            method : 'GET',
            data : data,
            async : false,
            success:function (token) {
                $this.setToken(token);
            }
        }
    );
    return this;
};

QiNiu.prototype.exec = function (callback,progress,params) {

    let $this = this;

    for (let i = 0;i < this.file.length;i++) {
        let file_name = this.filename;

        if (!file_name) {
            file_name = this.file[i]['name'];
            if ($this._alias) {
                file_name = randomUuid() + '.' + fileExtensionName(this.file[i].name);
            }
        } else {
            if (this.file.length > 1) {
                file_name = i + '_' + file_name;
            }
        }

        if (this.path) {
            file_name = this.path + '/' + file_name;
        }

        params = $.extend({},params);

        let observable = $this.handle.upload(
            this.file[i],
            file_name,
            $this.token,
            $.extend({},this.extra),
            params,
        );

        observable.subscribe(
            {

                // 上传进度条 res{total, loaded, percent}
                next: function (res) {

                    if (progress) {
                        let rate = parseInt(res.total.percent);
                        progress(rate,i,$this.file[i]);
                    }
                },
                error: function (err) {
                    callback(false,i,$this.file[i]);
                },
                complete: function (res) {
                    console.log(res);
                    callback(file_name,i,$this.file[i]);
                }
            }
        );
    }

};

function randomUuid()
{

    let s = [];

    let hexDigits = "0123456789abcdef";

    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }

    s[14] = "4";
    // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    return s.join("");
}

function fileExtensionName(filename)
{

    let index = filename.lastIndexOf(".");
    return filename.substr(index + 1);
}
