/**
 * @file 文本标注
 * @author hedongran
 * @email hdr01@126.com
 */

import { Component, MapChildrenProps } from '../common';
import { default as Wrapper, Events, Options, Methods } from '../common/WrapperHOC';
import shallowEqual from 'shallowequal';

export interface LabelProps extends MapChildrenProps {
    /** 坐标体系，可选百度经纬度坐标或百度墨卡托坐标 */
    coordType?: 'bd09ll' | 'bd09mc';
    /** 文本标注的坐标 */
    position: BMapGL.Point;
    /** 设置文本标注的内容 */
    text: string;
    /** 文本标注的像素偏移 */
    offset?: BMapGL.Size;
    /** 设置文本标注的样式 */
    style?: {[name: string]: React.ReactText};
    /** 鼠标左键单击事件的回调函数 */
    onClick?(e: Event): void;
    /** 鼠标左键双击事件的回调函数 */
    onDbclick?(e: Event): void;
    /** 鼠标右键单击事件的回调函数 */
    onRightclick?(e: Event): void;
    /** 鼠标指针移入Marker事件的回调函数 */
    onMouseover?(e: Event): void;
    /** 鼠标指针移出Marker事件的回调函数 */
    onMouseout?(e: Event): void;
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
];

const methodsMap: Methods = {
    enableMassClear: ['enableMassClear', 'disableMassClear']
};

class Label extends Component<LabelProps> {

    static defaultProps: LabelProps | object;
    label: BMapGL.Label;
    options: Options = [
        'position',
        'offset',
        'enableMassClear',
    ];

    constructor(props: LabelProps) {
        super(props);
    }

    componentDidUpdate(prevProps: LabelProps) {
        let {position, offset, text, style} = this.props;
        let {position: prePosition, offset: preOffset, text: preText, style: preStyle} = prevProps;

        let isDataChanged: boolean = position && !shallowEqual(position, prePosition);
        let isOffsetChanged: boolean = !!(offset && !shallowEqual(offset, preOffset));
        let isTextChanged: boolean = !shallowEqual(text, preText);
        let isStyleChanged: boolean = !!(style && !shallowEqual(style, preStyle));
        let point = this.parsePosition(position);

        if (isDataChanged) {
            this.label.setPosition(point);
        }
        if (isOffsetChanged) {
            this.label.setOffset(offset!);
        }
        if (isTextChanged) {
            this.label.setContent(text);
        }
        if (isStyleChanged) {
            this.label.setStyle(style!);
        }
    }

    componentDidMount() {
        this.initialize();
    }

    componentWillUnmount() {
        this.destroy();
    }

    destroy() {
        if (this.label) {
            this.props.map.removeOverlay(this.label);
            // @ts-ignore
            this.label = null;
        }
    }

    initialize() {
        let map = this.props.map;
        if (!map) {
            return;
        }

        this.destroy();

        let options = this.getOptions();
        let position = this.parsePosition(this.props.position);
        options.position = position;
        this.instance = this.label = new BMapGL.Label(this.props.text || '', options);
        map.addOverlay(this.label);
        if (this.props.style) {
            this.label.setStyle(this.props.style);
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
Label.defaultProps = {
    style: {color: 'red'}
};

/**
 * 
 * @visibleName Label 文本标注
 */
export default Wrapper(Label, eventsMap, methodsMap);
