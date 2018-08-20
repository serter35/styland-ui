### Image (VueJS Bileşeni)

#### Referans (Props)

| Name      | Required | Type    | Default |
|-----------|----------|---------|---------|
| source  | true    | String | undefined   |
| lazy  | false    | Boolean | true   |
| progress  | false    | Boolean | false   |

#### Rehber

* ##### Source 
    Bu özellik html'deki image src attribute gibi düşünülebilir. 
    Bu yüzden bu özellik string url'i olmalıdır.    
````html
    <sv-image source="http://localhost:8000/image/b.jpg" />   
````

* ##### Lazy 
    Lazy özelliği ön tanımlı olarak çalışır halde gelmektedir.
    Kapatmak için "false" değeri girilmelidir.
    Lazy olayını bilmeyenler için kısaca açıklamak gerekirse, fotoğraf ekranda görünür olduğu anda yüklenmesini
    sağlayacaktır. Tabiki bu durumda sitenizin açılış performansına ciddi katkı sağlayacaktır.
    Örnek kullanımda biz bu özelliği nasıl kapatabileceğinizi göstereceğiz.

````html
    <sv-image source="http://localhost:8000/image/b.jpg" :lazy="false" />   
````    

> Dikkat ederseniz başına iki nokta koyarak bu özelliği kullanıyoruz. 
Bu işlem VueJS'de "binding" işlemi olarak karşınıza çıkacaktır. 
Detaylı bilgiye aşağıdaki linkten ulaşabilirsiniz.

https://vuejs.org/v2/guide/syntax.html#v-bind-Shorthand

* ##### Progress 
    Bu özellik ön tanımlı olarak kapalı olarak gelmektedir. Açmak için "true" değeri girilmelidir.
    Bu özelliğimiz fotoğrafın yükleme esnasında yüzdesel olarak ne kadar yüklendiği bilgisini vermeye imkan verir.
    Örnek kullanım aşağıdaki gibidir. Ancak kullanmadan önce aşağıdaki bilgilendirme kısımlarını okumayı lütfen unutmayınız.
 ````vue
        <sv-image 
            :progress="true" 
            source="http://localhost:8000/image/b?ext=jpg" 
            style="height: 500px; background-color: ghostwhite; margin-bottom: 500px" 
        />
 ````      
 
 > Bu özelliğin doğru bir şekilde kullanılabilmesi için sunucu kısmında CORS ayarlarınız düzgün bir şekilde yapıldığından lütfen emin olun.
 Ayrıca istek yaptığınız linkin geri bildirimi içerisinde Content-Length başlığınında bulunması gerektiğini unutmayınız.