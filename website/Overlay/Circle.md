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
        <Circle
          center={new BMapGL.Point(116.40, 39.91)}
          radius={5000}
          strokeColor="#f00"
          strokeWeight={2}
          fillColor="#ff0"
          fillOpacity={0.3}
        />
      </Map>
    )
  }
}

<Example />
```