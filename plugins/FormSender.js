(function ($) {
    $.fn.formLand = function (options) {
        let settings = $.extend({
            method  : 'POST',
            tinymce : [],
            url     : '',
            clear   : true,
            successCallback: function (response) {
                console.log(response);
            },
            errorCallback: function (error) {
                console.log(error.response)
            }
        }, options);
        let rounded = 0;

        function thenFn(response) {
            $('#form-load-wrap').css('display', 'none');
            rounded = 0;
            if (settings.clear === true) {
                $("input, textarea").each(function() {
                    $(this).val('');
                });
            }
            settings.successCallback(response)
        }
        function catchFn(error) {
            $('#form-load-wrap').css('display', 'none');
            rounded = 0;
            settings.errorCallback(error)
        }
        function progressFn(progress) {
            if (rounded < 100) {
                $('#form-load-wrap').css('display', 'flex');
                const l = progress.loaded;
                const t = progress.total;
                const result = l / t * 100;
                rounded = Math.round(result);
                $('#load-number').text(rounded)
                $('#form-load-wrap').find('.load-text').css({'background': 'linear-gradient(90deg, #0071bc 0%, #0071bc ' + rounded + '%, #ffffff ' + rounded + '%, #ffffff 100%)'})
            }
        }

        let event = (settings.method === "GET" || settings.method === "DELETE") ? 'click' : 'submit';
        this.on(event, function(e) {
            let formData = undefined;
            if (event === "submit") {
                if(settings.tinymce.length > 0) {
                    settings.tinymce.forEach(elName => {
                        $('#' + elName).html(tinymce.get(elName).getContent());
                    });
                }
                e.preventDefault();
                formData = new FormData;
                let exceptFileInput = $(this).serializeArray();
                exceptFileInput.forEach(item => {
                    formData.append(item.name, item.value);
                });
                let onlyFileInput = this.find('input[type="file"]');
                let files         = new Object();
                onlyFileInput.each(function () {
                    files = $(this)[0].files;
                    for (let key in files) {
                        let index = parseInt(key);
                        if (Number.isInteger(index)) {
                            let formKey = $(this).attr('name') + (index + 1);
                            formData.append(formKey, files[key]);
                        }
                    }
                });
            }
            axios({
                method: settings.method,
                url   : settings.url,
                data  : formData,
                onUploadProgress: progressFn,
            }).then(thenFn)
              .catch(catchFn);
        }.bind(this));
    }
}(jQuery));