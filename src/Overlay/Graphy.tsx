/**
 * @file 图形基类
 * @author hedongran
 * @email hdr01@126.com
 */

import { Component, MapChildrenProps } from '../common';
import { default as Wrapper, Events, Options, Methods } from '../common/WrapperHOC';
import shallowEqual from 'shallowequal';

export interface GraphyProps extends MapChildrenProps {
    /** 坐标体系，可选百度经纬度坐标或百度墨卡托坐标 */
    coordType?: 'bd09ll' | 'bd09mc';
    /** 自动聚焦视野 */
    autoViewport?: boolean;
    /** `autoViewport`打开时生效，配置视野的参数 */
    viewportOptions?: BMapGL.ViewportOptions;
    /** 描边或线颜色，同CSS颜色 */
    strokeColor?: string;
    /** 描边或线的宽度，单位为像素 */
    strokeWeight?: number;
    /** 描边或线的透明度，范围`0-1` */
    strokeOpacity?: number;
    /** 描边或线样式，可为实线、虚线、或者点状线 */
    strokeStyle?: 'solid' | 'dashed' | 'dotted';
    /** 填充颜色，同CSS颜色 */
    fillColor?: string;
    /** 填充的透明度，范围`0-1` */
    fillOpacity?: number;
    /** 鼠标左键单击事件的回调函数 */
    onClick?(e: Event): void;
    /** 鼠标左键双击事件的回调函数 */
    onDblclick?(e: Event): void;
    /** 鼠标右键单击事件的回调函数 */
    onRightclick?(e: Event): void;
    /** 鼠标指针移入覆盖物事件的回调函数 */
    onMouseover?(e: Event): void;
    /** 鼠标指针移出覆盖物事件的回调函数 */
    onMouseout?(e: Event): void;
    /** 鼠标指针在覆盖物上移动事件的回调函数 */
    onMousemove?(e: Event): void;
};

const eventsMap: Events = [
    'click',
    'dblclick',
    'rightclick',
    'mousedown',
    'mouseup',
    'mouseout',
    'mouseover',
    'mousemove',
    'remove',
    'lineupdate'
];

const methodsMap: Methods = {
    enableMassClear: ['enableMassClear', 'disableMassClear'],
    enableEditing: ['enableEditing', 'disableEditing'],
};

class Graphy<P extends GraphyProps, S = {}, SS = any> extends Component<P, S, SS> {

    static defaultProps: GraphyProps | object;
    overlay: BMapGL.Overlay;
    options: Options = [
        'strokeColor',
        'strokeWeight',
        'strokeOpacity',
        'strokeStyle',
        'fillColor',
        'fillOpacity',
        'enableMassClear',
        'enableEditing',
        'enableClicking'
    ];

    constructor(props: P) {
        super(props);
    }

    componentDidUpdate(prevProps: P) {
        let {strokeColor, strokeWeight, strokeOpacity, strokeStyle, fillColor, fillOpacity} = this.props;
        let {
            strokeColor: preStrokeColor,
            strokeWeight: preStrokeWeight,
            strokeOpacity: preStrokeOpacity,
            strokeStyle: preStrokeStyle,
            fillColor: preFillColor,
            fillOpacity: preFillOpacity
        } = prevProps;

        let isStrokeColorChanged: boolean = !shallowEqual(strokeColor, preStrokeColor);
        let isStrokeWeightChanged: boolean = !shallowEqual(strokeWeight, preStrokeWeight);
        let isStrokeOpacityChanged: boolean = !shallowEqual(strokeOpacity, preStrokeOpacity);
        let isStrokeStyleChanged: boolean = !shallowEqual(strokeStyle, preStrokeStyle);
        let isFillColorChanged: boolean = !shallowEqual(fillColor, preFillColor);
        let isFillOpacityChanged: boolean = !shallowEqual(fillOpacity, preFillOpacity);

        if (isStrokeColorChanged || isStrokeWeightChanged || isStrokeOpacityChanged || isStrokeStyleChanged
            || isFillColorChanged || isFillOpacityChanged) {
            this.overlay.setOptions(this.getOptions());
        }

        this.onDataUpdate(prevProps);
    }

    componentDidMount() {
        this.initialize();
    }

    componentWillUnmount() {
        this.destroy();
    }

    destroy() {
        if (this.overlay) {
            this.props.map.removeOverlay(this.overlay);
            // @ts-ignore
            this.overlay = null;
        }
    }

    initialize() {
        let map = this.props.map;
        if (!map) {
            return;
        }

        this.destroy();

        this.instance = this.overlay = this.getOverlay();
        map.addOverlay(this.overlay);

        let viewport: BMapGL.Viewport;
        if (this.overlay instanceof BMapGL.Polyline || this.overlay instanceof BMapGL.Polygon) {
            let path = this.overlay.getPath();
            viewport = map.getViewport(path);
        } else if (this.overlay instanceof BMapGL.Circle) {
            let bounds = this.overlay.getBounds();
            viewport = map.getViewport(bounds);
        }
        if (viewport! && this.props.autoViewport) {
            map.setViewport(viewport!, this.props.viewportOptions || {});
        }
    }

    getOverlay(): BMapGL.Overlay {
        throw new Error('Method getOverlay not implemented.');
    }

    onDataUpdate(prevProps: P) {
        throw new Error('Method onDataUpdate not implemented.');
    }
}

export default Wrapper(Graphy, eventsMap, methodsMap);
