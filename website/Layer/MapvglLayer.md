## Demo

### 基础展示
```jsx
import { Map, MapvglView, MapvglLayer } from 'react-bmapgl'
import { point } from '../static/mock-data'

class Example extends React.Component {
  render() {
    return (
      <Map
        center={new BMapGL.Point(105.403119, 38.028658)}
        zoom={4}
      >
        <MapvglView effects={['bloom']}>
          <MapvglLayer
            type="PointLayer"
            data={point}
            options={{
              blend: 'lighter',
              size: 20,
              color: 'rgb(255, 53, 0, 0.5)'
            }}
          />
        </MapvglView>
      </Map>
    )
  }
}

<Example />
```