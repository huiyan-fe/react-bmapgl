## Demo

### 基础示例
```jsx static
import { Map, MapApiLoaderHOC } from 'react-bmapgl'

class Example extends React.Component {
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

export default MapApiLoaderHOC({ak: '您的密钥'})(Example)
```

### 装饰符写法
如果您使用到了es7的装饰符`@`写法，可以更简单的来使用
```jsx static
import { Map, MapApiLoaderHOC } from 'react-bmapgl'

@MapApiLoaderHOC({ak: '您的密钥'})
export default class Example extends React.Component {
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
```