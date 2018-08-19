export const statusHandler = function({data, status}) {
    this.data       = data;
    this.status     = status;

    this.message    = "";
    this.errorBag   = "";
    this.statusType = "";

    if (this.status >= 200 && this.status < 300) {
        this.statusType = "success";
        if (this.status === 200) {
            this.message = "İşlem başarıyla tamamlandı.";
        } else if (this.status === 201) {
            this.message = "Kayıt başarıyla oluşturuldu.";
        } else if (this.status === 202) {
            this.message = "İşlem kabul edildi."
        }
    } else if (this.status >= 300 && this.status < 400) {
        this.statusType = "warning";
    } else if (this.status >= 400 && this.status < 500) {
        this.statusType = "danger";
        if (this.status === 403 || this.status == 401) {
            this.message = "Hata! Bu işlemi yapabilmek için yetkiniz yetersiz.";
        } else if (this.status === 404) {
            this.message = "Hata! Sayfa yada bilgi bulunamadı."
        } else if (this.status === 405) {
            this.message = "Hata! İzin verilmeyen bir method uygulanıyor."
        } else if (this.status === 422) {
            this.message  = "Hata! Form bilgilerinizde sorun var."
            this.errorBag = this.data.errors;
        }
    } else if (this.status >= 500 && this.status < 511) {
        this.statusType = "danger";
        if (this.status >= 500) {
            this.message = "Hata! Sunucudan kaynaklı bir sorun var.";
        }
    }
}

statusHandler.prototype.get = function(elName, snackbar = true, created = null, beforeCreate = null) {
    if (beforeCreate != null) {
        beforeCreate(this.message, this.data, this.statusType, this.status);
    }

    if (snackbar === true) {
        if (typeof this.errorBag === "object") {
            for (let key in this.errorBag) {
                $(elName).snackbar({status: this.statusType, message: this.errorBag[key]});
            }
        } else if (typeof this.data === "string") {
            $(elName).snackbar({status: this.statusType, message: this.data});
        } else if (typeof this.data.message === "string") {
            $(elName).snackbar({status: this.statusType, message: this.data.message});
        } else {
            $(elName).snackbar({status: this.statusType, message: this.message});
        }
    }

    if (created != null) {
        created(this.message, this.data, this.statusType, this.status);
    }

    if (process.env.NODE_ENV !== "production") {
        console.log(this.message, this.data, this.statusType, this.status);
    }
    return {
        'message'   : this.message,
        'data'      : this.data,
        'statusType': this.statusType,
        'status'    : this.status
    }
}

