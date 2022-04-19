## Demo

### 简单文本
如果信息窗口中需要展示的只是简单的文本信息，可以通过`text`属性直接传入文本，快速生成文本信息窗口。
```jsx
import { Map } from 'react-bmapgl'

class Example extends React.Component {
  render() {
    return (
      <Map
        center={new BMapGL.Point(116.404449, 39.914889)}
        zoom={12}
        tilt={40}
      >
        <InfoWindow
          position={new BMapGL.Point(116.40, 39.91)}
          title="标题"
          text="快速文本信息窗口"
          onClickclose={e => {console.log(e)}}
        />
      </Map>
    )
  }
}

<Example />
```

### 复杂文本
如果信息窗口中想要展示自定义的信息，有复杂的DOM结构，则可以将其直接作为`<InfoWindow>`标签的`children`内容传入。请注意，通过`children`传入的内容优先级会大于`text`，如果同时设置这两个属性，`children`的内容将会覆盖`text`的内容。
```jsx
import { Map } from 'react-bmapgl'

class Example extends React.Component {
  render() {
    return (
      <Map
        center={new BMapGL.Point(116.404449, 39.914889)}
        zoom={12}
        tilt={40}
      >
        <InfoWindow
          position={new BMapGL.Point(116.40, 39.91)}
          height={80}
          title="复杂文本信息窗口"
        >
          <table border="1" width="20">
            <tr><td>这</td><td>是</td><td>一</td><td>个</td><td>表</td><td>格</td></tr>
            <tr><td>支</td><td>持</td><td>传</td><td>入</td><td>DOM</td><td>哦</td></tr>
          </table>
        </InfoWindow>
      </Map>
    )
  }
}

<Example />
```