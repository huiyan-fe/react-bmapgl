/**
 * @file 地图自定义覆盖物组件
 * @author hedongran
 * @email hdr01@126.com
 */

import { Component, MapChildrenProps } from '../common';
import { Options } from '../common/WrapperHOC';
import shallowEqual from 'shallowequal';
import CustomOverlayDom from './CustomOverlayDom';
import { MapContext } from '../Map/Map';

export interface CustomOverlayProps extends MapChildrenProps {
    /** 坐标点 */
    point: BMapGL.Point;
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
    /** 坐标体系 */
    coordType?: 'bd09ll' | 'bd09mc';
    /** 自动聚焦视野 */
    autoViewport?: boolean;
    /** 子元素 */
    children?: React.ReactElement;
}

/**
 * 在地图上通过传入DOM添加自定义覆盖物
 * @visibleName CustomOverlay 自定义覆盖物
 */
export default class CustomOverlay extends Component<CustomOverlayProps> {

    static contextType = MapContext;
    overlay: BMapGL.Overlay | null = null;
    options: Options = [
        'anchors',
        'offsetX',
        'offsetY',
        'rotation',
        'rotationInit',
        'minZoom',
        'maxZoom',
        'properties',
        'fixBottom',
        'useTranslate',
        'autoFollowHeadingChanged',
        'visible',
        'zIndex'
    ];

    constructor(props: CustomOverlayProps) {
        super(props);
    }

    componentDidUpdate(prevProps: CustomOverlayProps) {
        if (this.overlay) {
            // 使用类型断言，因为我们知道这些方法存在
            const overlay = this.overlay as any;

            // 检查点位变化
            if (!shallowEqual(this.props.point, prevProps.point)) {
                overlay.setPoint(this.props.point);
            }

            // 检查旋转角变化
            if (this.props.rotation !== prevProps.rotation) {
                overlay.setRotation(this.props.rotation);
            }

            // 检查旋转原点变化
            if (this.props.rotationInit !== prevProps.rotationInit) {
                overlay.setRotationOrigin(this.props.rotationInit);
            }

            // 检查属性变化
            if (!shallowEqual(this.props.properties, prevProps.properties)) {
                overlay.setProperties(this.props.properties);
            }

            // 其他属性变化时才需要重新创建
            type UpdateKeys = keyof CustomOverlayProps;
            const updateKeys: UpdateKeys[] = [
                'anchors',
                'offsetX',
                'offsetY',
                'minZoom',
                'maxZoom',
                'fixBottom',
                'useTranslate',
                'autoFollowHeadingChanged',
                'visible',
                'zIndex',
                'children'
            ];

            const needRecreate = updateKeys.some(key => 
                !shallowEqual(this.props[key], prevProps[key])
            );

            if (needRecreate) {
                this.initialize();
            }
        }
    }

    componentDidMount() {
        this.initialize();
    }

    componentWillUnmount() {
        this.destroy();
    }

    destroy() {
        if (this.overlay && this.map) {
            this.map.removeOverlay(this.overlay);
            this.overlay = null;
        }
    }

    initialize() {
        const map = this.map = this.getMap();
        if (!map) return;

        this.destroy();

        let point = this.props.point;
        if (this.props.coordType === 'bd09mc') {
            point = BMapGL.Projection.convertMC2LL(point);
        }

        // @ts-ignore
        this.overlay = new CustomOverlayDom(point, {
            ...this.getOptions(),
            html: this.props.children as React.ReactElement
        });

        map.addOverlay(this.overlay);

        if (this.props.autoViewport) {
            map.setCenter(point);
        }
    }

    render() {
        return null;
    }

}