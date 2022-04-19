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
        <Polyline
          path={[
            new BMapGL.Point(116.35, 39.88),
            new BMapGL.Point(116.40, 39.92),
            new BMapGL.Point(116.33, 40.01),
          ]}
          strokeColor="#f00"
          strokeWeight={10}
        />
      </Map>
    )
  }
}

<Example />
```