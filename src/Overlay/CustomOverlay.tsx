/**
 * @file 地图自定义覆盖物组件
 * @author hedongran
 * @email hdr01@126.com
 */

import { Component, MapChildrenProps } from '../common';
import { Options } from '../common/WrapperHOC';
import shallowEqual from 'shallowequal';
import CustomOverlayDom from './CustomOverlayDom';

interface CustomOverlayProps extends MapChildrenProps {
    /** 标注点的坐标 */
    position: BMapGL.Point;
    /** 坐标体系，可选百度经纬度坐标或百度墨卡托坐标 */
    coordType?: 'bd09ll' | 'bd09mc';
    /** 自动聚焦视野 */
    autoViewport?: boolean;
    /** `autoViewport`打开时生效，配置视野的参数 */
    viewportOptions?: BMapGL.ViewportOptions;
    /** 标注的像素偏移 */
    offset?: BMapGL.Size;
};

/**
 * 在地图上通过传入DOM添加自定义覆盖物
 * @visibleName CustomOverlay 自定义覆盖物
 */
export default class CustomOverlay extends Component<CustomOverlayProps> {

    overlay: BMapGL.Overlay;
    options: Options = [
        'offset'
    ];

    constructor(props: CustomOverlayProps) {
        super(props);
    }

    componentDidUpdate(prevProps: CustomOverlayProps) {
        if (!shallowEqual(this.props, prevProps)) {
            this.initialize();
        }
    }

    componentDidMount() {
        this.initialize();
    }

    componentWillUnmount() {
        this.destroy();
    }

    destroy() {
        if(this.overlay){
            this.props.map.removeOverlay(this.overlay);
            // @ts-ignore
            this.overlay = null;
        }
    }

    initialize() {
        let map = this.props.map;

        this.destroy();

        let options = this.getOptions();
        options.html = this.props.children;
        let position = this.parsePosition(this.props.position);
        // @ts-ignore
        this.instance = this.overlay = new CustomOverlayDom(position, options);
        map.addOverlay(this.overlay);

        if (this.props.autoViewport) {
            map.setViewport([position], this.props.viewportOptions || {});
        }
    }

    parsePosition(position: BMapGL.Point): BMapGL.Point {
        const isMC = this.props.coordType === 'bd09mc';
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
    }

    render(){
        return null;
    }

}
