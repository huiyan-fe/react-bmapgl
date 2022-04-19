# React-BMapGL
[![npm version](https://img.shields.io/npm/v/react-bmapgl.svg)](https://www.npmjs.com/package/react-bmapgl)
[![Package Quality](http://npm.packagequality.com/shield/react-bmapgl.svg)](http://packagequality.com/#?package=react-bmapgl)
[![Download](https://img.shields.io/npm/dm/react-bmapgl.svg)](https://www.npmjs.com/package/react-bmapgl)
[![License](https://img.shields.io/github/license/huiyan-fe/react-bmapgl.svg)](https://github.com/huiyan-fe/react-bmapgl)

基于百度地图JavaScript GL版API封装的React组件库。如果想要使用旧版的2D地图的话，使用[react-bmap](https://github.com/huiyan-fe/react-bmap)。如果您对使用地图API完全陌生，建议使用这个库之前先了解[百度地图JavaScript GL API](http://lbsyun.baidu.com/index.php?title=jspopularGL)，了解一些地图的基本概念，并申请开发者`ak`。

<br />

## 文档示例
官方地址：http://huiyan.baidu.com/github/react-bmapgl/

备用地址：https://huiyan-fe.github.io/react-bmapgl/

<br />

## 开始使用

### 引入脚本
首先，需要在你的`index.html`模板页面头部加载百度地图JavaScript API代码，密钥可去[百度地图开放平台官网](http://lbsyun.baidu.com/apiconsole/key)申请
```html
<script type="text/javascript" src="//api.map.baidu.com/api?type=webgl&v=1.0&ak=您的密钥"></script>
```
然后，使用npm方式安装react组件库，然后通过es模块加载
```bash
npm install react-bmapgl --save
```

### Hello World
```jsx static
import React from 'react';
import ReactDOM from 'react-dom';
import {Map, Marker, NavigationControl, InfoWindow} from 'react-bmapgl';

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

### 获取`map`实例
如果你在业务中需要操作`map`对象，需要`BMapGL.Map`实例的话，可以通过`<Map>`组件实例的`map`属性访问到它。
```jsx static
<Map ref={ref => {this.map = ref.map}} />
```
如果你要开发`Map`的子组件，想要在子组件中获得`map`对象，可以直接在`<Map>`包裹的子组件中调用`this.props.map`即可。
```jsx static
function App() {
    return <Map>
        <MapComponent />
    </Map>
}

function MapComponent(props) {
    console.log(props.map);
}
```

<br />

## 异步加载与按需导入

### 异步加载
通常，如果您的业务场景总需要使用到地图，或者需要创建多个地图实例，我们会建议您在`index.html`模板中加入JSAPI的scirpt标签，因为这种方式对后续开发没有任何限制。  
但是在某些业务场景下，可能并不一定会使用到地图，且用到的地图功能、组件也相对简单，我们也提供了`MapApiLoaderHOC`高阶组件，实现异步加载的方式。
```jsx static
class App extends React.Component {
  render() {
    return (
      <Map
        style={{ height: 450 }}
        center={new BMapGL.Point(116.404449, 39.914889)}
        zoom={12}
      />
    )
  }
}

export default MapApiLoaderHOC({ak: '您的密钥'})(App)
```

### 按需导入
常用的导入方法会直接把整个包导入进来
```jsx static
import { Map, Marker, MapvglView, MapvglLayer } from 'react-bmapgl'
```
如果希望引入的包体积小一点，所有组件都支持`lodash`风格进行按需导入
```jsx static
import Map from 'react-bmapgl/dist/Map'
import Marker from 'react-bmapgl/dist/Overlay/Marker'
```

<br />

## 本地开发

### 设计思想
React-BMapGL只是利用了React组件的生命周期，来调用对应的百度地图JavaScript API的方法，比如在`componentDidMount`的时候在地图上添加覆盖物，`componentWillUnmount`的时候移除覆盖物，`componentDidUpdate`的时候更新覆盖物，React对应的`render`渲染函数模块返回的是null。所以这里面地图相关的DOM并不是react渲染的，真正创建地图之类的还是使用百度地图JavaScript API，React-BMapGL只是利用了React组件的写法来封装百度地图JavaScript API，使我们在使用React的时候能更方便的使用百度地图JavaScript API。

### Typescript支持
本项目开发使用`Typescript`编写，声明文件为`@types/bmapgl`，如果需要修改，需要给[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)提PR。如果需要安装声明文件依赖，执行安装命令
```bash
npm install @types/bmapgl -D
```

### 常用命令
```bash
npm install         # 安装依赖

npm start           # 开始运行文档网站
npm run build:doc   # 文档网站构建编译

npm run build       # 组件库编译，输出 js 和 .d.ts 文件

npm publish         # 发布新npm包
```

### 发布npm包
修改`package.json`版本号后，直接执行`npm publish`

<br />

## 许可证
[MIT LICENSE](./LICENSE)
