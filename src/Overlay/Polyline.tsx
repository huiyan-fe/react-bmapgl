/**
 * @file 折线覆盖物
 * @author hedongran
 * @email hdr01@126.com
 */

import Graphy, { GraphyProps } from './Graphy';
import shallowEqual from 'shallowequal';

interface PolylineProps extends Omit<Omit<GraphyProps, 'fillColor'>, 'fillOpacity'> {
    /** 折线的坐标数组 */
    path: BMapGL.Point[];
    /** 折线的颜色，同CSS颜色 */
    strokeColor?: string;
    /** 折线的宽度，单位为像素 */
    strokeWeight?: number;
    /** 线的透明度，范围`0-1` */
    strokeOpacity?: number;
    /** 设置线为实线、虚线、或者点状线 */
    strokeStyle?: 'solid' | 'dashed' | 'dotted';
    /** 可通过`map.clearOverlays()`方法移除 */
    enableMassClear?: boolean;
    /** 开启可编辑模式 */
    enableEditing?: boolean;
};

/**
 * 在地图上绘制简单的折线
 * @visibleName Polyline 折线
 */
export default class Polyline extends Graphy<PolylineProps> {

    overlay: BMapGL.Polyline;
    options = [
        'strokeColor',
        'strokeWeight',
        'strokeOpacity',
        'strokeStyle',
        'dashArray',
        'enableMassClear',
        'enableEditing',
    ];

    constructor(props: PolylineProps) {
        super(props);
    }

    onDataUpdate(prevProps: PolylineProps) {
        let {path, autoViewport} = this.props;
        let {path: prePath, autoViewport: preViewport} = prevProps;

        let isDataChanged: boolean = path && !shallowEqual(path, prePath);
        let isViewportChanged: boolean = !shallowEqual(autoViewport, preViewport);
        if (isDataChanged) {
            this.overlay.setPath(path);
        }
        if (autoViewport && (isDataChanged || isViewportChanged)) {
            let path = this.overlay.getPath();
            let viewport = this.props.map.getViewport(path);
            this.props.map.setViewport(viewport, this.props.viewportOptions || {});
        }
    }

    getOverlay(): BMapGL.Polyline {
        let path = this.props.path;

        path = path.map((point: BMapGL.Point) => {
            return new BMapGL.Point(point.lng, point.lat);
        });

        return new BMapGL.Polyline(path, this.getOptions());
    }

    render() {
        return null;
    }
}

