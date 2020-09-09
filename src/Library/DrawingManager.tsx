/**
 * @file 鼠标绘制工具库
 * @author hedongran
 * @email hdr01@126.com
 */

import React, { CSSProperties } from 'react';
import { Component, MapChildrenProps } from '../common';
import { requireScript, requireCss } from '../utils';
import { default as Wrapper, registerEvents, toggleMethods, Events, Options, Methods } from '../common/WrapperHOC';

export interface DrawingManagerProps extends BMapGL.DrawingManagerOptions, MapChildrenProps {
    /** 是否开启绘制模式，默认不开启 */
    isOpen?: boolean;
    /** 当前的绘制模式, 默认是绘制点 */
    drawingMode?: BMapGL.DrawingType;
    /** 是否添加绘制工具栏控件，默认添加 */
    enableDrawingTool?: boolean;
    /** 绘制是否进行测距(画线时候)、测面积(画圆、多边形、矩形) */
    enableCalculate?: boolean;
    /** 绘制线和多边形时，是否开启鼠标吸附功能 */
    enableSorption?: boolean;
    /** 绘制多边形时，是否开启重叠部分裁剪功能 */
    enableGpc?: boolean;
    /** 是否开启限制绘制图形距离、面积功能，该功能依赖`enableCalculate`值为`true` */
    enableLimit?: boolean;
    /** 设置鼠标吸附的像素距离，开启`enableSorption`后生效 */
    sorptionDistance?: number;
    /** 设置图形距离、面积限制的实际值，开启`enableLimit`后生效 */
    limitOptions?: BMapGL.DrawingLimitOptions;
    /** 绘制工具栏控件的属性，`enableDrawingTool`值为`true`或默认时生效 */
    drawingToolOptions?: BMapGL.DrawingToolOptions;
    /** Marker的绘制样式与属性 */
    markerOptions?: BMapGL.MarkerOptions;
    /** Circle的绘制样式与属性 */
    circleOptions?: BMapGL.CircleOptions;
    /** Polyline的绘制样式与属性 */
    polylineOptions?: BMapGL.PolylineOptions;
    /** Polygon的绘制样式与属性 */
    polygonOptions?: BMapGL.PolygonOptions;
    /** Rectangle的绘制样式与属性 */
    rectangleOptions?: BMapGL.PolygonOptions;
    /** 跟随鼠标的提示label的绘制样式与属性 */
    labelOptions?: CSSProperties;
    /** 绘制完成时的回调函数 */
    onOverlaycomplete?(e: Event, info: object): void;
    /** 挂载元素的样式 */
    style?: CSSProperties;
}

const eventsMap: Events = [
    'overlaycomplete'
];

const methodsMap: Methods = {
    enableCalculate: ['enableCalculate', 'disableCalculate'],
    enableSorption: ['enableSorption', 'disableSorption'],
    enableGpc: ['enableGpc', 'disableGpc']
};

const drawOptions = {
    strokeColor: '#5E87DB',
    fillColor: '#5E87DB',
    strokeWeight: 2,
    strokeOpacity: 1,
    fillOpacity: 0.2
};
const labelOptions = {
    borderRadius: '2px',
    background: '#FFFBCC',
    border: '1px solid #E1E1E1',
    color: '#703A04',
    fontSize: '12px',
    letterSpacing: '0',
    padding: '5px'
};

class DrawingManager extends Component<DrawingManagerProps> {

    private el = React.createRef<HTMLDivElement>();
    static defaultProps: DrawingManagerProps | object;
    drawingmanager: BMapGLLib.DrawingManager;
    options: Options = [
        'isOpen',
        'enableDrawingTool',
        'enableCalculate',
        'enableSorption',
        'enableGpc',
        'enableLimit',
        'sorptionDistance',
        'limitOptions',
        'drawingToolOptions',
        'markerOptions',
        'circleOptions',
        'polylineOptions',
        'polygonOptions',
        'rectangleOptions',
        'labelOptions'
    ];

    constructor(props: DrawingManagerProps) {
        super(props);
    }

    componentDidMount() {
        this.initialize();
    }

    componentWillUnmount() {
        this.destroy();
    }

    destroy() {
        if (this.drawingmanager) {
            this.drawingmanager.close();
            // @ts-ignore
            this.instance = this.drawingmanager = undefined;
        }
    }

    initialize() {
        let map = this.props.map;

        this.destroy();

        let opts = this.getOptions();
        let drawStyles = ['circleOptions', 'polylineOptions', 'polygonOptions', 'rectangleOptions'];
        for (let i = 0; i < drawStyles.length; i++) {
            const styl = drawStyles[i];
            if (!opts[styl]) {
                opts[styl] = drawOptions; 
            }
        }
        if (!opts.labelOptions) {
           opts.labelOptions = labelOptions; 
        }
        opts.drawingToolOptions.customContainer = this.el.current;

        // 如果 BMapGLLib 已经加载过，会执行下面的
        if (window.BMapGLLib && BMapGLLib.DrawingManager) {
            this.instance = this.drawingmanager = new BMapGLLib.DrawingManager(map, opts);
        }

        // 如果第一次加载，会执行下面的
        if (!window.BMapGLLib || !BMapGLLib.DrawingManager) {
            requireCss('//mapopen.bj.bcebos.com/github/BMapGLLib/DrawingManager/src/DrawingManager.min.css')
                .then(() => {});

            requireScript('//mapopen.bj.bcebos.com/github/BMapGLLib/DrawingManager/src/DrawingManager.min.js')
                .then(() => {
                    this.instance = this.drawingmanager = new BMapGLLib.DrawingManager(map, opts);
                    // 因为是异步加载，所以不会自动注册事件和执行方法，需要手动注册和执行
                    registerEvents(this, this.getInstance(this), eventsMap);
                    toggleMethods(this, this.getInstance(this), methodsMap);
                });
        }
    }

    render() {
        return (
            <div
                className="react-bmapgl-drawingmanager"
                ref={this.el}
                style={this.props.style}
            />
        );
    }
}

DrawingManager.defaultProps = {
    isOpen: false,
    enableDrawingTool: true,
    enableCalculate: false,
    enableSorption: false,
    enableGpc: false,
    enableLimit: false,
    sorptionDistance: 20,
    limitOptions: {
        area: 50000000,
        distance: 30000
    },
    drawingToolOptions: {},
    style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 360
    }
};

/**
 * 用来在地图上通过鼠标绘制覆盖物，该组件属于不属于原生JSAPI，属于开源工具库[BMapGLLib](https://github.com/huiyan-fe/BMapGLLib)
 * @visibleName DrawingManager 鼠标绘制工具
 */
export default Wrapper(DrawingManager, eventsMap, methodsMap);
