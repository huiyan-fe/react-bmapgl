自定义覆盖物默认情况下，是以传入DOM的底部中间位置为定位点在地图上展示的，这样能满足大多数场景，如果需要有偏移的展示，可以通过传入`offset`属性来解决。

## Demo

### 基础展示
```jsx
import { Map } from 'react-bmapgl'

function DOM() {
  return <div className="custom" style={{width: 40, height: 40, background: 'rgba(222, 0, 0, 0.8)'}}>
    <span style={{color: '#fff'}}>DOM</span>
  </div>
}

class Example extends React.Component {
  render() {
    return (
      <Map
        center={new BMapGL.Point(116.404449, 39.914889)}
        zoom={12}
        tilt={40}
      >
        <CustomOverlay position={new BMapGL.Point(116.35, 39.88)}>
          <DOM />
        </CustomOverlay>
      </Map>
    )
  }
}

<Example />
```