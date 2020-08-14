图层管理器`View`可以用来操作不同的MapVGL图层，可能您会在业务中需要调用它，和`<Map>`组件类似，您可以用下面两种方法来调用

#### 组件外
如果你在业务中需要操作`view`对象，需要访问实例的话，可以通过`<MapvglView>`组件实例的`view`属性访问到它。
```jsx static
<MapvglView ref={ref => {this.view = ref.view}} />
```

#### 子组件内
如果你要开发`Map`的子组件，想要在子组件中获得`map`对象，可以直接在`<Map>`包裹的子组件中调用`this.props.map`即可。
```jsx static
// in your component
<MapvglView>
  <MapvglLayer />
</MapvglView>

// in <MapvglLayer />
let view = this.props.view