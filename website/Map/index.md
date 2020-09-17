## Demo

### 基础地图
```jsx
class Example extends React.Component {
  render() {
    return (
      <Map
        style={{ height: 450 }}
        center={new BMapGL.Point(116.404449, 39.914889)}
        zoom={12}
        heading={0}
        tilt={40}
        onClick={e => console.log(e)}
        enableScrollWheelZoom
      />
    )
  }
}

<Example />
```

### 多个实例
```jsx
class Example extends React.Component {
  render() {
    return (
      <div style={{display: 'flex', justifyContent: 'space-around'}}>
        <Map
          style={{ height: 300, width: '48%' }}
          center={new BMapGL.Point(116.404449, 39.914889)}
          zoom={12}
        />
        <Map
          style={{ height: 300, width: '48%' }}
          center={new BMapGL.Point(116.404449, 39.914889)}
          zoom={12}
        />
      </div>
    )
  }
}

<Example />
```

### 个性化地图
```jsx
import whitestyle from '../static/whitestyle'

class Example extends React.Component {
  render() {
    return (
      <Map
        center={new BMapGL.Point(116.404449, 39.914889)}
        zoom={12}
        mapStyleV2={{styleJson: whitestyle}}
      />
    )
  }
}

<Example />
```

### 事件说明
该组件库中所有事件函数并非按照`JSX`的单词分割标准来做的驼峰处理，只是单纯的将`on`后面的第一个字母大写。这一点需要注意！  
比如标准右键点击事件为`onRightClick`，在本组件库中应写为`onRightclick`。  
再比如标准鼠标移动事件为`onMouseMove`，在本组件库中应写为`onMousemove`。  
切记！
