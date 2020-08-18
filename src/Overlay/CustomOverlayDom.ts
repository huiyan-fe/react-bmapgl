/**
 * @file 自定义覆盖物的DOM生成类
 * @author hedongran
 * @email hdr01@126.com
 */

import {render} from 'react-dom';

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
}
CustomOverlayDom.prototype = new BMapGL.Overlay();

CustomOverlayDom.prototype.initialize = function(map: BMapGL.Map){
    this._map = map;
    this._div = document.createElement("div");
    this._div.style.position = "absolute";
    this._div.style.zIndex = BMapGL.Overlay.getZIndex(this._point.lat);
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

CustomOverlayDom.prototype.draw = function(){
    let map = this._map;
    let pixel = map.pointToOverlayPixel(this._point);

    let offset = {width: 0, height: 0};
    if (this._options && this._options.offset) {
        offset = this._options.offset;
    }
    this._div.style.left = pixel.x - this._div.offsetWidth / 2 + offset.width + 'px';
    this._div.style.top = pixel.y - this._div.offsetHeight + offset.height + 'px';
}

export default CustomOverlayDom;