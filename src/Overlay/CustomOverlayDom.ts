/**
 * @file 自定义覆盖物的DOM生成类
 * @author hedongran
 * @email hdr01@126.com
 */

import {render, unmountComponentAtNode} from 'react-dom';

interface CustomOverlayOptions {
    /** React 内容 */
    html: React.ReactElement;
    /** 锚点，左上角为[0,0],取值范围[0,1], 默认[0.5,1] */
    anchors?: [number, number];
    /** x轴偏移量，单位像素 */
    offsetX?: number;
    /** y轴偏移量，单位像素 */
    offsetY?: number;
    /** 旋转角 */
    rotation?: number;
    /** 初始化旋转角 */
    rotationInit?: number;
    /** 显示最小等级 */
    minZoom?: number;
    /** 显示最大等级 */
    maxZoom?: number;
    /** 自定义属性 */
    properties?: any;
    /** 是否固定在div底部, 默认false */
    fixBottom?: boolean;
    /** 是否使用translate3d进行优化 */
    useTranslate?: boolean;
    /** 是否跟随地图旋转 */
    autoFollowHeadingChanged?: boolean;
    /** 是否显示 */
    visible?: boolean;
    /** 层级 */
    zIndex?: number;
}

/**
 * 自定义覆盖物的DOM生成类
 * @param point 定位点坐标
 * @param options 传入参数，如offset等
 */
function CustomOverlayDom(this: any, point: BMapGL.Point, options: CustomOverlayOptions) {
    this._point = new BMapGL.Point(point.lng, point.lat);
    this._options = options || {};

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

    // 添加更新方法
    this.setPoint = function(point: BMapGL.Point, noReCreate?: boolean) {
        this._point = new BMapGL.Point(point.lng, point.lat);
        this.draw();
    };

    this.setRotation = function(rotation: number) {
        this._options.rotation = rotation;
        if (this._div) {
            this._div.style.transform = `rotate(${rotation}deg)`;
        }
    };

    this.setRotationOrigin = function(origin: string) {
        if (this._div) {
            this._div.style.transformOrigin = origin;
        }
    };

    this.getRotation = function(): number {
        return this._options.rotation || 0;
    };

    this.getPoint = function(): BMapGL.Point {
        return this._point;
    };

    this.setProperties = function(properties: any) {
        this._options.properties = properties;
    };

    this.getProperties = function(): any {
        return this._options.properties;
    };
}

CustomOverlayDom.prototype.initialize = function(map: BMapGL.Map) {
    this._map = map;
    this._div = document.createElement("div");
    this._div.style.position = "absolute";
    
    // 设置层级
    this._div.style.zIndex = String(this._options.zIndex || BMapGL.Overlay.getZIndex(this._point.lat));
    
    // 设置可见性
    if (this._options.visible === false) {
        this._div.style.display = 'none';
    }

    // 设置旋转
    if (typeof this._options.rotation === 'number') {
        this._div.style.transform = `rotate(${this._options.rotation}deg)`;
    }

    // 设置 translate3d
    if (this._options.useTranslate) {
        this._div.style.transform = this._div.style.transform ? 
            this._div.style.transform + ' translate3d(0,0,0)' : 
            'translate3d(0,0,0)';
    }

    render(this._options.html, this._div);

    const pane = this._options.fixBottom ? 
        map.getPanes().floatShadow : 
        map.getPanes().floatPane;
    pane!.appendChild(this._div);
    
    return this._div;
}

CustomOverlayDom.prototype.draw = function() {
    let map = this._map;
    let pixel = map.pointToOverlayPixel(this._point);

    // 检查缩放级别
    const zoom = map.getZoom();
    if ((this._options.minZoom && zoom < this._options.minZoom) ||
        (this._options.maxZoom && zoom > this._options.maxZoom)) {
        this._div.style.display = 'none';
        return;
    }

    // 计算偏移
    const anchors = this._options.anchors || [0.5, 1];
    const offsetX = this._options.offsetX || 0;
    const offsetY = this._options.offsetY || 0;

    // 计算位置
    const left = pixel.x - (this._div.offsetWidth * anchors[0]) + offsetX;
    const top = pixel.y - (this._div.offsetHeight * anchors[1]) + offsetY;

    this._div.style.left = `${left}px`;
    this._div.style.top = `${top}px`;

    // 处理地图旋转
    if (this._options.autoFollowHeadingChanged) {
        const heading = map.getHeading();
        this._div.style.transform = `rotate(${heading}deg)`;
    }
}

CustomOverlayDom.prototype.destroy = function() {
    unmountComponentAtNode(this._div);
}

export default CustomOverlayDom;