// @ts-ignore
import {LineLayer, LineFlowLayer, PointLayer, TextLayer, View, utilCity, OdCurve} from 'mapvgl';
import shallowEqual from 'shallowequal';
import {Component, MapChildrenProps} from '../common';

interface ArcData {
    from: {
        city?: string;
        name?: string;
        point?: BMapGL.Point;
    };
    to: {
        city?: string;
        name?: string;
        point?: BMapGL.Point;
    };
    color?: string;
}

interface ArcProps extends MapChildrenProps {
    /** 起点、终点的坐标或城市名数据 */
    data: ArcData[];
    /** 开启动画效果 */
    enableAnimation?: boolean;
    /** 是否显示起点标注 */
    showStartPoint?: boolean;
    /** 是否显示终点标注 */
    showEndPoint?: boolean;
    /** 坐标体系，可选百度经纬度坐标或百度墨卡托坐标 */
    coordType?: 'bd09ll' | 'bd09mc';
    /** 自动聚焦视野 */
    autoViewport?: boolean;
    /** `autoViewport`打开时生效，配置视野的参数 */
    viewportOptions?: BMapGL.ViewportOptions;
    /** 线的样式配置，详情参考 [MapVGL线图层文档](https://mapv.baidu.com/gl/docs/LineLayer.html) */
    lineOptions?: MapVGL.LayerOptions;
    /** 箭头的样式配置，详情参考 [MapVGL线图层文档](https://mapv.baidu.com/gl/docs/LineLayer.html) */
    arrowOptions?: MapVGL.LayerOptions;
    /** 动画的样式配置，详情参考 [MapVGL线图层文档](https://mapv.baidu.com/gl/docs/LineLayer.html) */
    animationOptions?: MapVGL.LayerOptions;
    /** 起终点的样式配置，详情参考 [MapVGL点图层文档](https://mapv.baidu.com/gl/docs/PointLayer.html) */
    pointOptions?: MapVGL.LayerOptions;
    /** 文字的样式配置，详情参考 [MapVGL文字图层文档](https://mapv.baidu.com/gl/docs/TextLayer.html) */
    textOptions?: MapVGL.LayerOptions;
}

const DEFAULT_COLOR = 'rgba(60, 50, 200, 0.9)';

/**
 * 根据起终点地名或者坐标，自动生成2D弧线，可用于OD等场景的效果展示
 * @visibleName Arc 2D弧线
 */
export default class Arc extends Component<ArcProps> {

    private _createLayer: boolean = false;
    view: MapVGL.View;
    linelayer: MapVGL.Layer;
    arrowlayer: MapVGL.Layer;
    colorarrowlayer: MapVGL.Layer;
    flowlayer: MapVGL.Layer;
    pointlayer: MapVGL.Layer;
    textlayer: MapVGL.Layer;
    static defaultProps: ArcProps | object = {
        enableAnimation: true,
        showStartPoint: true,
        showEndPoint: true
    };

    constructor(props: ArcProps) {
        super(props);
    }

    componentDidMount() {
        this.initialize();
    }

    componentDidUpdate(prevProps: ArcProps) {
        if (!shallowEqual(this.props, prevProps)) {
            this.initialize();
        }
    }

    componentWillUnmount() {
        this.destroy();
    }

    destroy() {
        this._createLayer = false;
        this.view.destroy();
        // @ts-ignore
        this.view = undefined;
        // @ts-ignore
        this.linelayer = undefined;
        // @ts-ignore
        this.arrowlayer = undefined;
        // @ts-ignore
        this.colorarrowlayer = undefined;
        // @ts-ignore
        this.flowlayer = undefined;
        // @ts-ignore
        this.pointlayer = undefined;
        // @ts-ignore
        this.textlayer = undefined;
    }

    initialize() {

        const map = this.map = this.getMap();

        if (!map) {
            return;
        }

        if (!this._createLayer) {
            this.createLayers();
        }

        const lineData: MapVGL.GeoJSON[] = [];
        const pointData: MapVGL.GeoJSON[] = [];
        const arrowMap: Map<string | undefined, MapVGL.GeoJSON[]> = new Map();

        if (this.props.data) {
            const points: BMapGL.Point[] = [];
            const curve = new OdCurve();

            this.props.data.forEach((item: ArcData) => {
                let start = item.from.point || utilCity.getCenterByCityName(item.from.city);
                let end = item.to.point || utilCity.getCenterByCityName(item.to.city);
                start = new BMapGL.Point(start.lng, start.lat);
                end = new BMapGL.Point(end.lng, end.lat);
                curve.setOptions({
                    points: [start, end]
                });
                const curveModelData = curve.getPoints();

                if (this.props.coordType === 'bd09mc') {
                    points.push(BMapGL.Projection.convertMC2LL(start));
                    points.push(BMapGL.Projection.convertMC2LL(end));
                } else {
                    points.push(start);
                    points.push(end);
                }

                lineData.push({
                    geometry: {
                        type: 'LineString',
                        coordinates: curveModelData
                    },
                    color: item.color
                });

                const arrowData = arrowMap.get(item.color) || [];
                arrowData.push({
                    geometry: {
                        type: 'LineString',
                        coordinates: curveModelData
                    }
                });
                arrowMap.set(item.color, arrowData);

                if (this.props.showEndPoint !== false) {
                    pointData.push({
                        geometry: {
                            type: 'Point',
                            coordinates: [end.lng, end.lat]
                        },
                        color: item.color,
                        properties: {
                            text: item.to.name || item.to.city
                        }
                    });
                }

                if (this.props.showStartPoint !== false) {
                    pointData.push({
                        geometry: {
                            type: 'Point',
                            coordinates: [start.lng, start.lat]
                        },
                        color: item.color,
                        properties: {
                            text: item.from.name || item.from.city
                        }
                    });
                }

                if (points.length > 0) {
                    if (this.props.autoViewport === true) {
                        map.setViewport(points, this.props.viewportOptions || {});
                    }
                }
            });
        }

        this.linelayer.setData(lineData);
        if (this.props.lineOptions) {
            this.linelayer.setOptions(this.props.lineOptions);
        }

        this.pointlayer.setData(pointData);
        if (this.props.pointOptions) {
            this.pointlayer.setOptions(this.props.pointOptions);
        }

        this.textlayer.setData(pointData);
        if (this.props.textOptions) {
            this.textlayer.setOptions(this.props.textOptions);
        }

        // 如果data中指定了颜色，则单独new一个箭头颜色匹配的LineLayer
        Array.from(arrowMap.keys()).forEach(color => {
            if (color === undefined) {
                this.arrowlayer.setData(arrowMap.get(undefined)!);
                this.props.arrowOptions && this.arrowlayer.setOptions(this.props.arrowOptions);
            } else {
                this.props.arrowOptions && this.colorarrowlayer.setOptions({
                    ...this.props.arrowOptions,
                    color: 'rgba(255, 255, 255, 0)',
                    styleOptions: {
                        color: color
                    }
                });
                this.colorarrowlayer.setData(arrowMap.get(color)!);
            }
        });

        if (this.props.enableAnimation) {
            this.flowlayer.setData(lineData);
            this.props.animationOptions && this.flowlayer.setOptions(this.props.animationOptions);
        }
    }

    createLayers() {
        this._createLayer = true;
        const map = this.map;

        const view = this.view = new View({
            map
        });

        const linelayer = this.linelayer = new LineLayer({
            blend: 'lighter',
            color: DEFAULT_COLOR,
            width: 4
        });
        view.addLayer(linelayer);

        const arrowlayer = this.arrowlayer = new LineLayer({
            blend: 'lighter',
            width: 10,
            style: 'arrow',
            color: 'rgba(255, 255, 255, 0)',
            styleOptions: {
                color: DEFAULT_COLOR
            }
        });
        view.addLayer(arrowlayer);

        const colorarrowlayer = this.colorarrowlayer = new LineLayer({
            blend: 'lighter',
            width: 10,
            style: 'arrow',
            color: 'rgba(255, 255, 255, 0)',
            styleOptions: {
                color: DEFAULT_COLOR
            }
        });
        this.view.addLayer(colorarrowlayer);

        const pointlayer = this.pointlayer = new PointLayer({
            blend: 'lighter',
            depthTest: false,
            color: DEFAULT_COLOR,
            size: 10
        });
        view.addLayer(pointlayer);

        const textlayer = this.textlayer = new TextLayer({
            offset: [0, 15],
            depthTest: false,
            color: '#333'
        });
        view.addLayer(textlayer);

        const flowlayer = this.flowlayer = new LineLayer({
            blend: 'lighter',
            color: () => 'rgb(240, 200, 200)',
            width: 2,
            animation: true,
            interval: 0.4,
            duration: 1,
            trailLength: 0.8
        });
        view.addLayer(flowlayer);
    }

    render() {
        return null;
    }
}
