function LocalUpload()
{
    var _alias = false;
}

LocalUpload.prototype.alias = function () {
    this._alias = true;
    return this;
};

LocalUpload.prototype.setPath = function (path) {
    this.path = path;
    return this;
};

LocalUpload.prototype.setFileName = function (filename) {
    this.filename = filename;
    return this;
};

LocalUpload.prototype.setFile = function (file) {
    this.file = file;
    return this;
};

LocalUpload.prototype.getFile = function () {
    return this.file;
};

LocalUpload.prototype.setUrl = function (url) {
    this.url = url;
    return this;
};

LocalUpload.prototype.exec = function (callback,progress,params) {

    let $this = this;
    let local = new Local($this.url);

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

        if (progress) {
            params.progress = function (percent) {
                progress(percent,i,$this.file[i]);
            };
        }

        params.success = function (data) {
            callback(data,i,$this.file[i]);
        };

        local.upload(this.file[i] , file_name , params);
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
