### 为什么我使用的时候报`BMapGL not defined`的错误？
可能因为该组件库默认没有引用地图的JSAPI文件，需要手动在你的`index.html`模板页面头部加载百度地图JavaScript API代码
```html
<script type="text/javascript" src="//api.map.baidu.com/api?type=webgl&v=1.0&ak=您的密钥"></script>
```
或者可能是您想用异步加载JSAPI，却忘了将导出的组件用`MapApiLoaderHOC`高阶组件进行加工。

<br/>

### 为什么我设置的一些事件没有触发？
请检查设置的事件名是否准确。  
该组件库中所有事件函数并非按照`JSX`的单词分割标准来做的驼峰处理，只是单纯的将`on`后面的第一个字母大写。 比如标准右键点击事件为`onRightClick`，在本组件库中应写为`onRightclick`；再比如标准鼠标移动事件为`onMouseMove`，在本组件库中应写为`onMousemove`。如果不确定事件的名称，以API中列出来的名称为准。
