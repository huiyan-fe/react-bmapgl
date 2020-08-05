import React, { ReactNode, ReactElement, CSSProperties } from 'react';
import { isString } from '../utils';
import { Component } from '../common';
import { default as Wrapper, Events, Options, Methods } from '@/common/WrapperHOC';

export interface MapProps {
    /** 中心点坐标 */
    center: BMapGL.Point & string;
    /** 缩放级别 */
    zoom: BMapGL.ZoomType;
    /** 个性化地图样式 */
    mapStyleV2?: BMapGL.MapStyleV2;
    /** 地图容器的class类名 */
    className?: string;
    /** 地图容器父元素的style样式 */
    style?: CSSProperties;
};

const eventsMap: Events = [
    'click',
    'dblclick',
    'rightclick',
    'rightdblclick',
    'maptypechange',
    'mousemove',
    'mouseover',
    'mouseout',
    'movestart',
    'moving',
    'moveend',
    'zoomstart',
    'zoomend',
    'addoverlay',
    'addcontrol',
    'removecontrol',
    'removeoverlay',
    'clearoverlays',
    'dragstart',
    'dragging',
    'dragend',
    'addtilelayer',
    'removetilelayer',
    'load',
    'resize',
    'hotspotclick',
    'hotspotover',
    'hotspotout',
    'tilesloaded',
    'touchstart',
    'touchmove',
    'touchend',
    'longpress'
];

const methodsMap: Methods = {
    enableScrollWheelZoom: ['enableScrollWheelZoom', 'disableScrollWheelZoom'],
    enableDragging: ['enableDragging', 'disableDragging'],
    enableDoubleClickZoom: ['enableDoubleClickZoom', 'disableDoubleClickZoom'],
    enableKeyboard: ['enableKeyboard', 'disableKeyboard'],
    enableInertialDragging: ['enableInertialDragging', 'disableInertialDragging'],
    enableContinuousZoom: ['enableContinuousZoom', 'disableContinuousZoom'],
    enablePinchToZoom: ['enablePinchToZoom', 'disablePinchToZoom'],
    enableAutoResize: ['enableAutoResize', 'disableAutoResize']
};

class Map extends Component<MapProps, {}> {

    private el = React.createRef<HTMLDivElement>();
    map: BMapGL.Map;
    options: Options = [
        'minZoom',
        'maxZoom',
        'mapType'
    ];

    static defaultProps: MapProps;

    constructor(props: MapProps) {
        super(props);
    }

    componentDidMount() {
        this.initMap();
        this.forceUpdate();
    }

    componentDidUpdate(prevProps: MapProps) {
        let preCenter = prevProps.center;
        let center = this.props.center;

        if (isString(center)) { // 可以传入城市名
            if (preCenter != center) {
                this.map.centerAndZoom(center);
            }
        } else {
            let isCenterChanged = preCenter && center && (preCenter.lng != center.lng || preCenter.lat != center.lat);
            let isZoomChanged = prevProps.zoom !== this.props.zoom && this.props.zoom;
            let centerPoint = new BMapGL.Point(center.lng, center.lat);
            if (isCenterChanged && isZoomChanged) {
                this.map.centerAndZoom(centerPoint, this.props.zoom);
            } else if (isCenterChanged) {
                this.map.setCenter(centerPoint);
            } else if (isZoomChanged) {
                this.map.setZoom(this.props.zoom);
            }
        }
    }

    initMap(): void {
        // 创建Map实例
        var options = this.getOptions();
        var map = new BMapGL.Map(this.el.current!, options as BMapGL.MapOptions);

        this.map = map;
        this.instance = map;

        var zoom = this.props.zoom;

        if (isString(this.props.center)) { // 可以传入城市名
            map.centerAndZoom(this.props.center);
        } else { // 正常传入经纬度坐标
            var center = new BMapGL.Point(this.props.center.lng, this.props.center.lat);
            map.centerAndZoom(center, zoom);  // 初始化地图,设置中心点坐标和地图级别
        }

        if (this.props.mapStyleV2) {
            map.setMapStyleV2(this.props.mapStyleV2);
        }

    }

    renderChildren(children: ReactElement | ReactElement[], map: BMapGL.Map): ReactNode {
        if (!children || !map) return;

        return React.Children.map(children, (child: ReactElement) => {
            if (!child) {
                return null;
            }
            const isElement: boolean = (typeof child.type !== 'string' && typeof child.type !== 'number');
            if (child.props.children) {
                return React.cloneElement(child,
                isElement ? {map} : {},
                this.renderChildren(child.props.children, map));
            }
            return React.cloneElement(child, isElement ? {map} : {});
        });
    }

    render() {
        return (
            <div style={this.props.style}>
                <div ref={this.el} className={this.props.className} style={{height: '100%'}}>
                    加载地图中...
                </div>
                {this.renderChildren(this.props.children as ReactElement, this.map)}
            </div>
        );
    }
}

/**
 * defaultProps属性要放在外面，不然生成API文档时，没有默认值
 */
Map.defaultProps = {
    // @ts-ignore
    center: {lng: 116.404449, lat: 39.914889},
    zoom: 12,
    style: {
        position: 'relative',
        height: '350px'
    },
};

export default Wrapper(Map, eventsMap, methodsMap);
