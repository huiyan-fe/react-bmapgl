## Demo

### 基础展示
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
        <Label
          position={new BMapGL.Point(116.40, 39.91)}
          text="欢迎使用百度地图GL版"
        />
      </Map>
    )
  }
}

<Example />
```