## 数据说明
传入数据为数组类型，数组内的数据格式`ArcData`遵循以下ts规范：
```ts static
type ArcData = {
  from: {
    city?: string;
    name?: string;
    point?: BMapGL.Point;
  },
  to: {
    city?: string;
    name?: string;
    point?: BMapGL.Point;
  },
  color?: string;
};
```
其中，`from`为起点，`to`为终点。在起终点内，可直接通过`city`传入城市名，来获取城市的坐标和显示的文字，或者通过`name`与`point`一起传入，分别指定显示的文字和点的坐标位置。另外，可在数据中额外传入`color`字段来控制该段线顶点、线和箭头的颜色。

## Demo

### 基础展示
```jsx
import { Map } from 'react-bmapgl'

class Example extends React.Component {
  render() {
    return (
      <Map
        center={new BMapGL.Point(116.404449, 39.914889)}
        zoom={5}
        enableScrollWheelZoom
      >
        <Arc
          autoViewport
          showStartPoint
          showEndPoint
          enableAnimation
          data={[
            {
              from: {
                city: '北京'
              },
              to: {
                city: '南京'
              }
            },
            {
              color: '#392',
              from: {
                city: '北京',
              },
              to: {
                name: '哈哈',
                point: {
                  lng: 101.45934,
                  lat: 39.135305
                }
              }
            },
            {
              from: {
                city: '北京'
              },
              to: {
                city: '成都'
              }
            },
            {
              from: {
                city: '北京'
              },
              to: {
                city: '广州'
              }
            }
          ]}
        />
      </Map>
    )
  }
}

<Example />
```

### 自定义属性
```jsx
import { Map } from 'react-bmapgl'

class Example extends React.Component {
  render() {
    return (
      <Map
        center={new BMapGL.Point(116.404449, 39.914889)}
        zoom={5}
        enableScrollWheelZoom
      >
        <Arc
          autoViewport
          lineOptions={{
            width: 5,
            color: 'rgba(250, 50, 20, 0.7)'
          }}
          arrowOptions={{
            styleOptions: {
              color: 'rgba(250, 50, 20, 0.7)'
            }
          }}
          pointOptions={{
            size: 20,
            color: 'rgba(250, 50, 20, 0.7)',
            shape: 'square'
          }}
          textOptions={{
            fontFamily: 'Kaiti SC',
            color: '#f00',
            offset: [0, -20]
          }}
          animationOptions={{
            width: 2,
            color: () => 'rgba(250, 250, 20, 0.7)',
            interval: 0.1
          }}
          data={[
            {
              from: {
                city: '北京'
              },
              to: {
                city: '南京'
              }
            },
            {
              color: '#392',
              from: {
                city: '北京',
              },
              to: {
                name: '哈哈',
                point: {
                  lng: 101.45934,
                  lat: 39.135305
                }
              }
            },
            {
              from: {
                city: '北京'
              },
              to: {
                city: '成都'
              }
            },
            {
              from: {
                city: '北京'
              },
              to: {
                city: '广州'
              }
            }
          ]}
        />
      </Map>
    )
  }
}

<Example />
```