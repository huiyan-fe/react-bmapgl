/**
 * @file 圆形覆盖物
 * @author hedongran
 * @email hdr01@126.com
 */

import Graphy, { GraphyProps } from './Graphy';
import shallowEqual from 'shallowequal';

interface CircleProps extends GraphyProps {
    /** 圆形的坐标数组 */
    center: BMapGL.Point;
    /** 圆形的半径，单位为米 */
    radius: number;
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
 * 在地图上绘制简单的圆形
 * @visibleName Circle 圆形
 */
export default class Circle extends Graphy<CircleProps> {

    overlay: BMapGL.Circle;
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

    constructor(props: CircleProps) {
        super(props);
    }

    onDataUpdate(prevProps: CircleProps) {
        let {center, radius, autoViewport} = this.props;
        let {center: preCenter, radius: preRadius, autoViewport: preViewport} = prevProps;

        let isCenterChanged: boolean = center && !shallowEqual(center, preCenter);
        let isRadiusChanged: boolean = !!(radius && !shallowEqual(radius, preRadius));
        let isViewportChanged: boolean = !shallowEqual(autoViewport, preViewport);
        if (isCenterChanged) {
            this.overlay.setCenter(this.parseCenter(center));
        }
        if (isRadiusChanged) {
            this.overlay.setRadius(radius);
        }
        if (autoViewport && (isCenterChanged || isRadiusChanged || isViewportChanged)) {
            let bounds = this.overlay.getBounds();
            let viewport = this.props.map.getViewport(bounds, this.props.viewportOptions || {});
            this.props.map.setViewport(viewport);
        }
    }

    getOverlay(): BMapGL.Circle {
        let {center, radius} = this.props;
        return new BMapGL.Circle(this.parseCenter(center), radius, this.getOptions());
    }

    parseCenter(center: BMapGL.Point): BMapGL.Point {
        const isMC = this.props.coordType === 'bd09mc';
        let point: BMapGL.Point;

        if (center instanceof Array) {
            point = new BMapGL.Point(center[0], center[1]);
        } else if (center instanceof BMapGL.Point) {
            point = center;
        } else {
            point = new BMapGL.Point(center!.lng, center!.lat);
        }

        if (isMC) {
            point = BMapGL.Projection.convertMC2LL(point);
        }
        return point;
    }

    render() {
        return null;
    }
}
