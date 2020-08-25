/**
 * @file 地图测距工具库
 * @author hedongran
 * @email hdr01@126.com
 */

import { Component, MapChildrenProps } from '../common';
import { requireScript } from '../utils';
import { default as Wrapper, registerEvents, toggleMethods, Events, Options, Methods } from '../common/WrapperHOC';

export interface DistanceToolProps extends BMapGL.DistanceToolOptions, MapChildrenProps {
    /** 默认是否开启测距模式 */
    defaultOpen?: boolean;
    /** 测距过程中，提示框文字 */
    followText?: string;
    /** 测距结果所用的单位制，可接受的属性为`metric`表示米制和`us`表示美国传统单位 */
    unit?: 'metric' | 'us';
    /** 折线颜色 */
    lineColor?: string;
    /** 折线线宽 */
    lineStroke?: number;
    /** 折线透明度 */
    opacity?: number;
    /** 折线样式 */
    lineStyle?: 'solid' | 'dashed' | 'dotted';
    /** 测距时，每次双击底图结束当前测距折线时，派发事件的接口 */
    onDrawend?(e: Event, info: object): void;
    /** 测距过程中，每次点击底图添加节点时，派发事件的接口 */
    onAddpoint?(e: Event, info: object): void;
    /** 测距结束后，点击线段上最后一个节点旁的关闭按钮时，派发事件的接口 */
    onRemovepolyline?(e: Event, info: object): void;
}

const eventsMap: Events = [
    'drawend',
    'addpoint',
    'removepolyline'
];

const methodsMap: Methods = {
};

class DistanceTool extends Component<DistanceToolProps> {

    static defaultProps: DistanceToolProps | object;
    distancetool: BMapGLLib.DistanceTool;
    options: Options = [
        'tips',
        'followText',
        'unit',
        'lineColor',
        'lineStroke',
        'opacity',
        'lineStyle',
        'cursor',
        'secIcon',
        'closeIcon'
    ];

    constructor(props: DistanceToolProps) {
        super(props);
    }

    componentDidMount() {
        this.initialize();
    }

    componentWillUnmount() {
        this.destroy();
    }

    destroy() {
        if (this.distancetool) {
            this.distancetool.close();
            // @ts-ignore
            this.instance = this.distancetool = undefined;
        }
    }

    initialize() {
        let map = this.props.map;

        this.destroy();

        let opts = this.getOptions();

        // 如果 BMapGLLib 已经加载过，会执行下面的
        if (window.BMapGLLib && BMapGLLib.DistanceTool) {
            this.instance = this.distancetool = new BMapGLLib.DistanceTool(map, opts);
            if (this.props.defaultOpen) {
                this.distancetool.open();
            }
        }

        // 如果第一次加载，会执行下面的
        if (!window.BMapGLLib || !BMapGLLib.DistanceTool) {
            requireScript('//localhost/baidu/github/BMapGLLib/DistanceTool/src/DistanceTool.js')
                .then(() => {
                    this.instance = this.distancetool = new BMapGLLib.DistanceTool(map, opts);
                    // 因为是异步加载，所以不会自动注册事件和执行方法，需要手动注册和执行
                    registerEvents(this, this.getInstance(this), eventsMap);
                    toggleMethods(this, this.getInstance(this), methodsMap);
                    if (this.props.defaultOpen) {
                        this.distancetool.open();
                    }
                });
        }
    }

    render() {
        return null;
    }
}

DistanceTool.defaultProps= {
    defaultOpen: true
};

/**
 * 用来在地图上测量地理距离，单击添加拐点，双击结束测量。该组件属于不属于原生JSAPI，属于开源工具库[BMapGLLib](https://github.com/huiyan-fe/BMapGLLib)
 * @visibleName DistanceTool 地图测距工具
 */
export default Wrapper(DistanceTool, eventsMap, methodsMap);
