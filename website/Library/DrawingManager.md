默认情况下，该工具将会挂载到一个新的DOM上，该元素的`className`为`react-bmapgl-drawingmanager`，可为该DOM编写CSS样式，或者通过`style`属性直接传入样式。

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
        enableScrollWheelZoom
      >
        <DrawingManager
          enableLimit
          enableCalculate
          onOverlaycomplete={(e, info) => {console.log(e, info)}}
        />
      </Map>
    )
  }
}

<Example />
```