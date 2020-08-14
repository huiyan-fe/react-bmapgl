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
            this.overlay.setPath(this.parsePath(path));
        }
        if (autoViewport && (isDataChanged || isViewportChanged)) {
            let path = this.overlay.getPath();
            let viewport = this.props.map.getViewport(path);
            this.props.map.setViewport(viewport, this.props.viewportOptions || {});
        }
    }

    getOverlay(): BMapGL.Polyline {
        let path = this.parsePath(this.props.path);
        return new BMapGL.Polyline(path, this.getOptions());
    }

    parsePath(path: BMapGL.Point[]): BMapGL.Point[] {
        const isMC = this.props.coordType === 'bd09mc';
        let out: BMapGL.Point[] = path.map((position: BMapGL.Point) => {
            let point: BMapGL.Point;
            if (position instanceof Array) {
                point = new BMapGL.Point(position[0], position[1]);
            } else if (position instanceof BMapGL.Point) {
                point = position;
            } else {
                point = new BMapGL.Point(position!.lng, position!.lat);
            }
    
            if (isMC) {
                point = BMapGL.Projection.convertMC2LL(point);
            }
            return point;
        });
        
        return out;
    }

    render() {
        return null;
    }
}

