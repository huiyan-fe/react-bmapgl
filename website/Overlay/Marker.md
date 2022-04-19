## Demo

### 简单示例
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
        <Marker
          position={new BMapGL.Point(116.404449, 39.914889)}
          enableDragging
        />
      </Map>
    )
  }
}

<Example />
```

### 绑定属性
通过将`position`属性和`icon`属性绑定在`state`中，每次`update`时`<Marker>`都会更新，如示例中点击标注查看效果。
```jsx
import { Map } from 'react-bmapgl'

class Example extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      position: new BMapGL.Point(116.404449, 39.914889),
      icon: 'loc_blue'
    }
    this.randomParams = this.randomParams.bind(this)
  }

  randomParams() {
    this.setState({
      position: new BMapGL.Point(116.404449 + Math.random() - 0.5, 39.914889 + Math.random() - 0.5),
      icon: `blue${Math.ceil(Math.random()*10)}`
    })
  }

  render() {
    return (
      <Map
        center={new BMapGL.Point(116.404449, 39.914889)}
        zoom={9}
      >
        <Marker
          position={this.state.position}
          icon={this.state.icon}
          onClick={this.randomParams}
          autoViewport
          viewportOptions={{
            zoomFactor: -12
          }}
        />
      </Map>
    )
  }
}

<Example />
```