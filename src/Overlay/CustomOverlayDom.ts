/**
 * @file 自定义覆盖物的DOM生成类
 * @author hedongran
 * @email hdr01@126.com
 */

import {render, unmountComponentAtNode} from 'react-dom';

interface CustomOverlayOptions {
    html: React.ReactElement;
    offset?: BMapGL.Size;
    onClick(e: Event): void;
}

/**
 * 自定义覆盖物的DOM生成类
 * @param point 定位点坐标
 * @param options 传入参数，如offset等
 */
function CustomOverlayDom(this: any, point: BMapGL.Point, options: CustomOverlayOptions) {
    this._point = new BMapGL.Point(point.lng, point.lat);
    this._options = options || {};
    this._html = options.html || '';

    // 这里不用 CustomOverlayDom.prototype = new BMapGL.Overlay() 继承原型链上的方法
    // 因为在异步加载的场景下，上面的语句调用了BMapGL会导致`BMapGL not defined`的报错
    // 所以这里用一个魔改的trick方法来继承 BMapGL.Overlay 原型链上的方法
    // 注意，这样写需要在if判断中剔除要覆盖的函数
    const extend = new BMapGL.Overlay();
    for (const key in extend) {
        if (key !== 'initialize' && key !== 'draw' && key !== 'destroy') {
            this.__proto__[key] = extend[key];
        }
    }
}

CustomOverlayDom.prototype.initialize = function(map: BMapGL.Map){
    this._map = map;
    this._div = document.createElement("div");
    this._div.style.position = "absolute";
    this._div.style.zIndex = BMapGL.Overlay.getZIndex(this._options.zIndex || this._point.lat);
    render(this._html, this._div);
    this._div.onmousedown = function(event: Event){
        event = event || window.event;
        if (event.preventDefault){
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
        return false;
    }
    map.getPanes().floatShadow!.appendChild(this._div);
    return this._div;
}

CustomOverlayDom.prototype.destroy = function(){
    unmountComponentAtNode(this._div);
}

CustomOverlayDom.prototype.draw = function(){
    let map = this._map;
    let pixel = map.pointToOverlayPixel(this._point);

    let offset = {width: 0, height: 0};
    if (this._options && this._options.offset) {
        offset = this._options.offset;
    }
    let offW = offset.width;
    let offH = offset.height;
    if (this._options && this._options.unit && this._options.unit === 'm') {
        offW /= map.getZoomUnits();
        offH /= map.getZoomUnits();
    }
    this._div.style.left = pixel.x + offW + 'px';
    this._div.style.top = pixel.y + offH + 'px';
    this._div.style.transform = 'translate(-50%, -100%)';
}

export default CustomOverlayDom;