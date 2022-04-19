## Demo

### 基础展示
城市控件只有当地图宽度大于`400px`且高度大于`350px`时才会展示出来。

```jsx
import { Map } from 'react-bmapgl'

class Example extends React.Component {
  render() {
    return (
      <Map
        style={{height: 400}}
        center={new BMapGL.Point(116.404449, 39.914889)}
        zoom={12}
        tilt={40}
      >
        <CityListControl />
      </Map>
    )
  }
}

<Example />
```