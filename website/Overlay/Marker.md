```jsx
import Map from '@/Map'

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
          onClick={e => {console.log(e)}}
          enableDragging
        />
      </Map>
    )
  }
}

<Example />
```