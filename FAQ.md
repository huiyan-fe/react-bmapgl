### 为什么我使用的时候报`BMapGL not defined`的错误？
因为该组件库默认没有引用地图的JSAPI文件，需要手动在你的`index.html`模板页面头部加载百度地图JavaScript API代码
```html
<script type="text/javascript" src="//api.map.baidu.com/api?type=webgl&v=1.0&ak=您的密钥"></script>
```
