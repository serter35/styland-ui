"use strict";

/**
 * İstekleri oauth access token aracılığı ile mi yapılacak ?
 * Vue Uygulamalar İçin: true
 * Laravel Paneller İçin: false
 * @type {Boolean}
 */
export const oauth_token_header        = false;

/**
 * Styland Bileşenleri Single Page App Modunda mı çalışsın ?
 * Vue Paneller İçin: true
 * Laraval Uygulamalar İçin: false
 * @type {Boolean}
 */
export const spa_compatible_components  = true;


/**
 * Giriş Yapmış Kullanıcı Token Bilgileri Local Storage'de hangi isimle saklansın ?
 * Vue Uygulamalar İçin: 'example_tokens'
 * Laraval Uygulamalar İçin: ''
 * @type {string}
 */
export const oauth_token_key            = '';


/**
 * Uzak Sunucu yada İstek Yapılacak URL Bilgileri
 * eg. http://server.example.com
 * @type {string}
 */
export const api_url                    = '';


/**
 * Bearer Auth Tipi. client ve password olmak üzere iki opsiyonu vardır.
 * Vue Uygulamalar İçin: 'password'
 * Laraval Uygulamalar İçin: ''
 * @type {string}
 */
export const api_grant_type             = '';


/**
 * Bearer Client Numarası. Password için çift sayılı rakamlar girilmeli
 * Vue Uygulamalar İçin: 2
 * Laraval Uygulamalar İçin: 0
 * @type {number}
 */
export const api_client_id              = 0;


/**
 * Bearer Gizli Anahtarı. Bu anahtara 'php artisan passport:install diyerek ulaşabiliriz'
 * Vue Uygulamalar İçin: 'secret_word <- passport'
 * Laraval Uygulamalar İçin: ''
 * @type {string}
 */
export const api_client_secret          = '';


/**
 * Giriş işlemi başarılı yapmış kullanıcı bilgilerinin çekileceği adres. (Authorization: access_token)
 * İki aşamalı giriş işleminin sonuncusu olan kullanıcı bilgileri çekilme aşamasıdır.
 * Laravel projeler için: ''
 * Vue Projeler için: '/get-auth-user'
 * @type {string}
 */
export const api_auth_user_path         = '';


export const login_template_props       = {
    /**
     * Giriş işleminin yapılacağı adres. Api (vue) projeler için giriş işleminin birinci kısmıdır.
     * Mpa (Laravel) projeler için session ve redirect işlemlerinin gerçekleşeği adımdır.
     * eg. '/login' - Send Method Type: POST
     */
    'login_path'          : '',

    /**
     * Şifre Yenileme adresi
     */
    'password_reset_path' : ''
};