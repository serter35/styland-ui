## Modal Component 

#### Referans (Props)

| Name     | Required | Type    | Default |
|----------|----------|---------|---------|
| value    | true     | Boolean | false   |

#### Rehber

* ##### Value (Prop)
    Bu özellik modal bileşenin gizle/göster işleminin gerçekleştirilmesini sağlayan özelliktir.
    
````vue
    <modal :value="modalShow">
        <div class="mod-header" slot="header"></div>
        <div class="mod-body" slot="body"></div>
        <div class="mod-footer" slot="footer"></div>
    </modal>    
````
* ##### Input (Event)
    Bu olay modal bileşenin gizle/göster işleminin üst bileşene gönderilmesi sağlayacaktır.
    
````vue
    <modal :value="modalShow" @input="val => modalShow = val">
        <div class="mod-header" slot="header"></div>
        <div class="mod-body" slot="body"></div>
        <div class="mod-footer" slot="footer"></div>
    </modal>    
````

> Bileşenimiz VueJS'in "v-model" özelliği ile de kullanabiliriz. 
Aşağıda vereceğimiz bu kullanım kesinlikle çok daha pratik bir kullanımdır. 
Ancak alt yapısında aslında yukarıda detaylandırılan özellik ve olaylar kullanılacaktır. 

````vue
    <modal v-model="modalShow">
        <div class="mod-header" slot="header"></div>
        <div class="mod-body" slot="body"></div>
        <div class="mod-footer" slot="footer"></div>
    </modal>
````