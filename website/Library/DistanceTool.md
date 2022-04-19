## Demo
由于测距工具在完成一次测量之后会自动关闭，所以如果需要再次开启测距功能，需要先通过`ref`手动获取实例，并在需要开启时执行`distancetool.open()`来再次开启测距功能。

### 基础展示
```jsx
import { Map } from 'react-bmapgl'

class Example extends React.Component {

  componentDidUpdate() {
    this.openTool();
  }

  /**
   * 再次开启测距功能
   */
  openTool() {
    if (this.distancetool) {
      this.distancetool.open();
    }
  }

  bindRef(ref) {
    if (ref && ref.distancetool) {
      this.distancetool = ref.distancetool;
    }
  }

  render() {
    return (
      <Map
        center={new BMapGL.Point(116.404449, 39.914889)}
        zoom={12}
        tilt={40}
        enableScrollWheelZoom
      >
        <DistanceTool
          ref={this.bindRef}
          onDrawend={e => {console.log(e)}}
        />
      </Map>
    )
  }
}

<Example />
```