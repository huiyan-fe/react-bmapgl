/**
 * @file 地图自定义覆盖物组件
 * @author hedongran
 * @email hdr01@126.com
 */



import { Component, MapChildrenProps } from '../common';
import { Options } from '../common/WrapperHOC';
import shallowEqual from 'shallowequal';
import { MapContext } from '../Map/Map';
import { render, unmountComponentAtNode } from 'react-dom';

// 确保 BMapGL 类型可用
declare const BMapGL: any;

interface CustomOverlayProps extends MapChildrenProps {
    /** 标注点的坐标 */
    position: BMapGL.Point;
    /** 坐标体系，可选百度经纬度坐标或百度墨卡托坐标 */
    coordType?: 'bd09ll' | 'bd09mc';
    /** 自动聚焦视野 */
    autoViewport?: boolean;
    /** 标注的偏移值 */
    offset?: BMapGL.Size;
    /** 元素的zIndex属性 */
    zIndex?: number;
    /** 标注的偏移单位，可选米或者像素 */
    unit?: 'm' | 'px';
    /** 是否阻止事件冒泡 */
    stopPropagation?: boolean;
    children: React.ReactElement;
};

/**
 * 在地图上通过传入DOM添加自定义覆盖物
 * @visibleName CustomOverlay 自定义覆盖物
 */
export default class CustomOverlay extends Component<CustomOverlayProps> {
    static contextType = MapContext;
    
    private overlay: any;
    private container: HTMLDivElement | null = null;
    
    options: Options = ['zIndex', 'offset', 'unit'];

    constructor(props: CustomOverlayProps) {
        super(props);
        this.initialize = this.initialize.bind(this);
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
        if (this.overlay && this.map && !this.map._destroyed) {
            if (this.container) {
                unmountComponentAtNode(this.container);
            }
            this.map.removeOverlay(this.overlay);
            this.overlay = null;
            this.container = null;
        }
    }

    createOverlay() {
        const CustomOverlay = function(this: any) {
            this._container = null;
            this._position = null;
            this._offset = null;
            this._zIndex = 0;
            this._unit = 'px';
        };

        CustomOverlay.prototype = new BMapGL.Overlay();

        CustomOverlay.prototype.initialize = (map: BMapGL.Map) => {
            this.container = document.createElement('div');
            this.container.style.position = 'absolute';
            this.container.style.zIndex = (this.props.zIndex || 0).toString();
            
            if (this.props.children) {
                render(this.props.children, this.container);
            }
            
            const pane = map.getPanes().floatPane;
            if (pane) {
                pane.appendChild(this.container);
            }

            this.container.addEventListener('mousedown', (e: MouseEvent) => {
                e.stopPropagation();
            });
            this.container.addEventListener('click', (e: MouseEvent) => {
                e.stopPropagation();
            });
            this.container.addEventListener('dblclick', (e: MouseEvent) => {
                e.stopPropagation();
            });
            this.container.addEventListener('mousemove', (e: MouseEvent) => {
                e.stopPropagation();
            });

            return this.container;
        };

        CustomOverlay.prototype.draw = () => {
            if (!this.container || !this.overlay) return;

            const position = this.parsePosition(this.props.position);
            const pixel = this.map.pointToOverlayPixel(position);
            const offset = this.props.offset || new BMapGL.Size(0, 0);

            let offsetX = offset.width;
            let offsetY = offset.height;

            if (this.props.unit === 'm') {
                offsetX /= this.map.getZoomUnits();
                offsetY /= this.map.getZoomUnits();
            }

            this.container.style.left = `${pixel.x}px`;
            this.container.style.top = `${pixel.y}px`;
            this.container.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        };

        return new (CustomOverlay as any)();
    }

    initialize() {
        const map = this.map = this.getMap();
        if (!map) return;

        this.destroy();

        this.overlay = this.createOverlay();
        map.addOverlay(this.overlay);

        if (this.props.autoViewport) {
            const position = this.parsePosition(this.props.position);
            map.setCenter(position);
        }
    }

    parsePosition(position: BMapGL.Point): BMapGL.Point {
        const isMC = this.props.coordType === 'bd09mc';
        let point: BMapGL.Point;

        if (Array.isArray(position)) {
            point = new BMapGL.Point(position[0], position[1]);
        } else if (position instanceof BMapGL.Point) {
            point = position;
        } else {
            point = new BMapGL.Point(position.lng, position.lat);
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
