import {login_template_props} from "../../../styland.env";

$(document).ready(function () {
    $('#forgot').on('click', function (event) {
        $('#form-side-inner').css({
            'transform': 'translateX(-100%)'
        })
    });
    $('#return-login').on('click', function (event) {
        event.preventDefault();
        $('#form-side-inner').css({
            'transform': 'translateX(0)'
        })

    });

    $('#login-form > form').on('submit', function (e) {
        e.preventDefault();
        var formData = $(this).serialize();
        axios.post(login_template_props.login_path, formData).then(response => {
            if (response.status === 200) {
                $('#form-title').snackbar({
                    position: "top right", status: "success", timeout: 1500, message: "Giriş başarılı... Sayfa yönlendirmesi yapılıyor."
                });
                setTimeout(() => {
                    location.href = response.data.url;
                }, 1500)
            }
        }).catch(error => {
            const errors = error.response.data.errors;
            const status = error.response.status;
            if (status === 422)  {
                for (let key in errors) {
                    $('#form-title').snackbar({
                        position: "top right", status: "danger", timeout: 4000, message: errors[key][0]
                    });
                }
            } else if (status === 500) {
                $('#form-title').snackbar({
                    position: "top right", status: "danger", timeout: 4000, message: "Sistem Hatası! Daha sonra tekrar deneyiniz."
                });
            } else if (status === 403) {
                $('#form-title').snackbar({
                    position: "top right", status: "danger", timeout: 4000, message: "Kullanıcı Bilgileriniz atalı!"
                });
            } else if (status === 404) {
                $('#form-title').snackbar({
                    position: "top right", status: "danger", timeout: 4000, message: "İstek Yaptığınız Sayfa Bulunamadı!"
                });
            } else if (status === 401) {
                $('#form-title').snackbar({
                    position: "top right", status: "danger", timeout: 4000, message: "İstek Yapılan Sayfaya Ulaşma Yetkiniz Yok!"
                });
            }
        })
    });

    $('#password-form > form').on('submit', function (e) {
        e.preventDefault();
        var formData = $(this).serialize();
        axios.post(login_template_props.password_reset_path, formData).then(response => {
            if (response.status === 200) {
                $('#form-title').snackbar({
                    position: "top right", status: "success", timeout: 1500, message: "Giriş başarılı... Sayfa yönlendirmesi yapılıyor."
                });
                setTimeout(() => {
                    location.href = response.data.url;
                }, 1500)
            }
        }).catch(error => {
            const errors = error.response.data.errors;
            const status = error.response.status;
            if (status === 422)  {
                for (let key in errors) {
                    $('#form-title').snackbar({
                        position: "top right", status: "danger", timeout: 4000, message: errors[key][0]
                    });
                }
            } else if (status === 500) {
                $('#form-title').snackbar({
                    position: "top right", status: "danger", timeout: 4000, message: "Sistem Hatası! Daha sonra tekrar deneyiniz."
                });
            } else if (status === 403) {
                $('#form-title').snackbar({
                    position: "top right", status: "danger", timeout: 4000, message: "Kullanıcı bilgileriniz hatalı!"
                });
            }
        })
    });
    
});
