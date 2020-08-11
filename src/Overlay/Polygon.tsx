/**
 * @file 多边形覆盖物
 * @author hedongran
 * @email hdr01@126.com
 */

import Graphy, { GraphyProps } from './Graphy';
import shallowEqual from 'shallowequal';

interface PolygonProps extends GraphyProps {
    /** 多边形的坐标数组 */
    path: BMapGL.Point[];
    /** 描边的颜色，同CSS颜色 */
    strokeColor?: string;
    /** 描边的宽度，单位为像素 */
    strokeWeight?: number;
    /** 描边的透明度，范围`0-1` */
    strokeOpacity?: number;
    /** 描边的样式，为实线、虚线、或者点状线 */
    strokeStyle?: 'solid' | 'dashed' | 'dotted';
    /** 面填充颜色，同CSS颜色 */
    fillColor?: string;
    /** 面填充的透明度，范围`0-1` */
    fillOpacity?: number;
    /** 可通过`map.clearOverlays()`方法移除 */
    enableMassClear?: boolean;
    /** 开启可编辑模式 */
    enableEditing?: boolean;
};

/**
 * 在地图上绘制简单的多边形
 * @visibleName Polygon 多边形
 */
export default class Polygon extends Graphy<PolygonProps> {

    overlay: BMapGL.Polygon;
    options = [
        'strokeColor',
        'strokeWeight',
        'strokeOpacity',
        'strokeStyle',
        'fillColor',
        'fillOpacity',
        'enableMassClear',
        'enableEditing',
    ];

    constructor(props: PolygonProps) {
        super(props);
    }

    onDataUpdate(prevProps: PolygonProps) {
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

    getOverlay(): BMapGL.Polygon {
        var path = this.props.path;

        path = path.map((point: BMapGL.Point) => {
            return new BMapGL.Point(point.lng, point.lat);
        });

        return new BMapGL.Polygon(path, this.getOptions());
    }

    render() {
        return null;
    }
}

