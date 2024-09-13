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
        <PanoramaControl offset={new BMapGL.Size(30, 30)} anchor={BMAP_ANCHOR_BOTTOM_RIGHT} />
      </Map>
    )
  }
}

<Example />
```