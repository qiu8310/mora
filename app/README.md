## UI.Utils

[http://angular-ui.github.io/ui-utils/](http://angular-ui.github.io/ui-utils/)




## 知识点

### _loyout.scss

NOTE：在 DOM 上加上 transform 会影响其子元素的 position: fixed 定位，本来 fixed 的 dom 元素应该相对于 html 的，但用了 transform 后，它的 fixed 定位就失效，和 absolute 一样

```scss
#main {
  transition: 250ms cubic-bezier(0.1, .57, .1, 1) .1s;
  //transform: translateZ(0px);
}
```