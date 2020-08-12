import React from 'react';
import { Component, MapChildrenProps } from '../common';
import { requireScript, requireCss } from '../utils';
import { default as Wrapper, Events, Options, Methods } from '../common/WrapperHOC';

export interface DrawingManagerProps extends BMapGL.DrawingManagerOptions, MapChildrenProps {
    onOverlaycomplete(e: Event): void;
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
    strokeColor: '#5E87DB', // 边线颜色。
    fillColor: '#5E87DB', // 填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight: 2, // 边线的宽度，以像素为单位。
    strokeOpacity: 1, // 边线透明度，取值范围0 - 1。
    fillOpacity: 0.2 // 填充的透明度，取值范围0 - 1。
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

const opts = {
    enableDrawingTool: true, // 是否显示工具栏
    enableCalculate: true, // 绘制是否进行测距(画线时候)、测面(画圆、多边形、矩形)
    drawingToolOptions: {
        enableTips: true,
        customContainer: 'selectbox_Drawing',
        hasCustomStyle: true,
        offset: new BMapGL.Size(5, 5), // 偏离值
        scale: 0.8, // 工具栏缩放比例
        drawingModes: [
            'marker',
            'polyline',
            'rectangle',
            'polygon',
            'circle',
        ]
    },
    enableSorption: true, // 是否开启边界吸附功能
    sorptionDistance: 20, // 边界吸附距离
    enableGpc: true, // 是否开启延边裁剪功能
    enbaleLimit: true,  // 是否开启超限提示
    limitOptions: {
        area: 50000000, // 面积超限值
        distance: 30000
    },
    circleOptions: drawOptions, // 圆的样式
    polylineOptions: drawOptions, // 线的样式
    polygonOptions: drawOptions, // 多边形的样式
    rectangleOptions: drawOptions, // 矩形的样式
    labelOptions: labelOptions // label的样式
}

class DrawingManager extends Component<DrawingManagerProps> {

    static defaultProps: DrawingManagerProps | object;
    drawingmanager: BMapGL.DrawingManager;
    options: Options = [

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
            this.drawingmanager = null;
        }
    }

    initialize() {
        let map = this.props.map;

        this.destroy();

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
                });
        }
    }

    render() {
        return (
            <div className="huiyan-drawmanager" ref="drawmanager" id="selectbox_Drawing" style={{
                position: 'absolute',
                left: 20,
                top: 20,
                width: 350
            }} />
        );
    }
}

DrawingManager.defaultProps= {
    circleOptions: drawOptions, // 圆的样式
    polylineOptions: drawOptions, // 线的样式
    polygonOptions: drawOptions, // 多边形的样式
    rectangleOptions: drawOptions, // 矩形的样式
    labelOptions: labelOptions // label的样式
};

export default Wrapper(DrawingManager, eventsMap, methodsMap);
