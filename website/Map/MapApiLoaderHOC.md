## Demo

### 基础示例
```jsx
import Map from 'react-bmapgl/Map'

class Example extends React.Component {
  render() {
    return (
      <Map
        style={{ height: 450 }}
        center={new BMapGL.Point(116.404449, 39.914889)}
        zoom={12}
        heading={0}
        tilt={40}
        onClick={e => console.log(e)}
        enableScrollWheelZoom
      />
    )
  }
}

function AsyncMap() {
    return MapApiLoaderHOC({ak: '您的密钥'})(Example)
}
// 

<AsyncMap />
```