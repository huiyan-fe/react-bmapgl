## Demo

### 默认输入框
如果不传入`input`参数，将会自动生成一个`<input>`输入框，可以通过类名`react-bmapgl-autocomplete`或直接设置`style`属性来控制样式。
```jsx
class Example extends React.Component {
  render() {
    return (
      <AutoComplete
        onHighlight={e => {console.log(e)}}
        onConfirm={e => {console.log(e)}}
        onSearchComplete={e => {console.log(e)}}
      />
    )
  }
}

<Example />
```

### 自定义输入框
通过`input`参数传入自定义的输入框，完成联动。
```jsx
class Example extends React.Component {

  render() {
    return (
      <div>
        <input id="ac" />
        <AutoComplete
          input="ac"
          location="北京"
        />
      </div>
    )
  }
}

<Example />
```