```jsx
class Example extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      center: new BMapGL.Point(116.404449, 39.914889),
      zoom: 12,
    }
  }

  render() {
    return (
      <>
        <Map
          // style={{ height: 450 }}
          // zoom={this.state.zoom}
          // center={this.state.center}
          // enableScrollWheelZoom
        />
      </>
    )
  }
}

<Example />
```
