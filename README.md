# React-BMapGL

基于百度地图JavaScript GL版API封装的React组件库。如果想要使用旧版的2D地图的话，使用[react-bmap](https://github.com/huiyan-fe/react-bmap)。如果您对使用地图API完全陌生，建议使用这个库之前先了解[百度地图JavaScript GL Api](http://lbsyun.baidu.com/index.php?title=jspopularGL)，了解一些地图的基本概念，并申请开发者`ak`。

React-BMapGL只是利用了React组件的生命周期，来调用对应的百度地图JavaScript Api的方法，比如在`componentDidMount`和`componentDidUpdate`的时候在地图上添加覆盖物，`componentWillUnmount`的时候移除覆盖物，React对应的`render`渲染函数模块返回的是null。所以这里面地图相关的dom并不是react渲染的，真正创建地图之类的还是使用百度地图JavaScript Api，React-BMapGL只是利用了React组件的写法来封装百度地图JavaScript Api，使我们在使用React的时候能更方便的使用百度地图JavaScript Api。

## 文档示例

https://huiyan-fe.github.io/react-bmapgl/

## 开始使用

在你的`index.html`模板页面头部加载百度地图JavaScript Api代码，密钥可去[百度地图开放平台官网](http://lbsyun.baidu.com/apiconsole/key)申请
```html
<script type="text/javascript" src="http://api.map.baidu.com/api?type=webgl&v=1.0&ak=您的密钥"></script>
```
使用npm方式安装使用，然后通过es模块加载
```bash
npm install react-bmapgl --save
```

## Hello World
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
// import {Map, Marker, NavigationControl, InfoWindow} from 'react-bmapgl';

class App extends React.Component {
    render() {
        return <Map center={{lng: 116.402544, lat: 39.928216}} zoom="11">
            <Marker position={{lng: 116.402544, lat: 39.928216}} />
            <NavigationControl /> 
            <InfoWindow position={{lng: 116.402544, lat: 39.928216}} text="内容" title="标题"/>
        </Map>
    }
}
ReactDOM.render(<App />, document.getElementById('container'));

```

## 获取`map`实例
如果你在业务中需要操作`map`对象，需要`BMapGL.Map`实例的话，可以通过`<Map>`组件实例的`map`属性访问到它。
```javascript
<Map ref={ref => {this.map = ref.map}} />
```

## Typescript支持
本项目开发使用`Typescript`编写，声明文件为`@types/bmapgl`，如果需要修改，需要给[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/46449/files)提PR。

## 许可证
[MIT LICENSE](./LICENSE)
