(function ($) {
    $.fn.fileUpload = function () {
        this.on('change', function (e) {
            var text = '';
            var files = e.target.files;
            if (files.length > 1) {
                for (var i = 0; i < files.length; i++) {
                    text = text + files[i].name;
                    i < files.length - 1 ? text += ', ' : '';
                }
            } else {
                text = files[0].name;
            }
            $(this).next('label').children('span').text(text);
        });
    }
}(jQuery))