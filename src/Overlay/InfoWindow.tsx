/**
 * @file 信息窗口
 * @author hedongran
 * @email hdr01@126.com
 */

import { Component, MapChildrenProps } from '../common';
import { default as Wrapper, Events, Options, Methods } from '../common/WrapperHOC';
import { render, unmountComponentAtNode } from 'react-dom';
import { MapContext } from '../Map';

export interface InfoWindowProps extends MapChildrenProps {
    /** 坐标体系，可选百度经纬度坐标或百度墨卡托坐标 */
    coordType?: 'bd09ll' | 'bd09mc';
    /** 信息窗口的坐标 */
    position: BMapGL.Point;
    /** 设置信息窗口的标题 */
    title?: string;
    /** 快速设置信息窗口的内容文本 */
    text?: string;
    /** 信息窗口的像素偏移 */
    offset?: BMapGL.Size;
    /** 是否在调用`Map.clearOverlays()`时清除此覆盖物 */
    enableMassClear?: boolean;
    /** 信息窗口宽度 */
    width?: number;
    /** 信息窗口高度 */
    height?: number;
    /** 信息窗口关闭事件的回调函数 */
    onClose?(e: Event): void;
    /** 信息窗口开启事件的回调函数 */
    onOpen?(e: Event): void;
    /** 鼠标点击信息窗口关闭按钮事件的回调函数 */
    onClickclose?(e: Event): void;
};

const eventsMap: Events = [
    'close',
    'open',
    'maximize',
    'restore',
    'clickclose'
];

const methodsMap: Methods = {
    enableMaximize: ['enableMaximize', 'disableMaximize'],
    enableAutoPan: ['enableAutoPan', 'disableAutoPan'],
    enableCloseOnClick: ['enableCloseOnClick', 'disableCloseOnClick']
};

class InfoWindow extends Component<InfoWindowProps> {

    static contextType = MapContext;
    static defaultProps: InfoWindowProps | object;
    infoWindow: BMapGL.InfoWindow;
    content?: HTMLDivElement;
    options: Options = [
        'width',
        'height',
        'maxWidth',
        'offset',
        'title',
        'enableMassClear'
    ];

    constructor(props: InfoWindowProps) {
        super(props);
    }

    componentDidUpdate(prevProps: InfoWindowProps) {
        this.initialize();
    }

    componentDidMount() {
        this.initialize();
    }

    componentWillUnmount() {
        this.destroy();
    }

    destroy() {
        if (this.content) {
            unmountComponentAtNode(this.content);
        }
        if (this.infoWindow) {
            this.map.closeInfoWindow();
            // @ts-ignore
            this.instance = this.infoWindow = undefined;
        }
    }

    initialize() {
        let map = this.map = this.getMap();
        if (!map) {
            return;
        }

        this.destroy();

        let options = this.getOptions();
        let position = this.parsePosition(this.props.position);
        this.instance = this.infoWindow = new BMapGL.InfoWindow(this.props.text || '', options);
        map.openInfoWindow(this.infoWindow, position);

        if (this.props.children !== undefined) {
            const content = this.content = document.createElement('div');
            // @ts-ignore
            render(this.props.children, content);
            this.infoWindow.setContent(content);
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

    render() {
        return null;
    }
}

/**
 * defaultProps属性要放在外面，不然生成API文档时，没有默认值
 */
InfoWindow.defaultProps = {
};

/**
 * 在地图上创建信息窗口，用于展示弹窗信息
 * @visibleName InfoWindow 信息窗口
 */
export default Wrapper(InfoWindow, eventsMap, methodsMap);
