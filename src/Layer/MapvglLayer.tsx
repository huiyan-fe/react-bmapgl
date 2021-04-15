/**
 * @file mapvgl可视化图层
 * @author hedongran
 * @email hdr01@126.com
 */

// @ts-ignore
import * as mapvgl from 'mapvgl';
// @ts-ignore
import * as mapvglThree from 'mapvgl/dist/mapvgl.threelayers.min';
import { Component, MapChildrenProps } from '../common';
import { MapVGLViewChildrenProps, ViewContext } from './MapvglView';

interface MapvglLayerProps extends MapChildrenProps, MapVGLViewChildrenProps {
    /** 绘制图层的构造函数名称，注意`区分大小写` */
    type: string;
    /** 绘制图层的参数，详情参考MapVGL各图层的文档 */
    options: MapVGL.LayerOptions;
    /** MapVGL绘制使用的GeoJSON数据 */
    data: MapVGL.GeoJSON[];
    /** 坐标体系，可选百度经纬度坐标或百度墨卡托坐标 */
    coordType?: 'bd09ll' | 'bd09mc';
    /** 自动聚焦视野 */
    autoViewport?: boolean;
    /** `autoViewport`打开时生效，配置视野的参数 */
    viewportOptions?: BMapGL.ViewportOptions;
};

/**
 * 该组件将MapVGL的图层使用`react`进行了一层封装。具体关于MapVGL有哪些图层，以及图层的属性，请查阅[MapVGL文档](https://mapv.baidu.com/gl/docs/)
 * @visibleName MapvglLayer MapVGL图层
 */
export default class MapvglLayer extends Component<MapvglLayerProps> {

    private _createLayer: boolean = false;
    static contextType = ViewContext;
    view: MapVGL.View;
    layer: MapVGL.Layer;

    constructor(props: MapvglLayerProps) {
        super(props);
    }

    componentDidMount() {
        this.initialize();
    }

    componentWillUnmount() {
        this.destroy();
    }

    componentDidUpdate(prevProps: MapvglLayerProps) {
        let {type, data, options, autoViewport} = this.props;
        let {type: preType, data: preData, options: preOptions, autoViewport: preViewport} = prevProps;
        if (!this.map || !this.layer) {
            this.initialize();
            return;
        }
        if (type !== preType) {
            this.destroy();
            this.initialize();
            return;
        }
        if (JSON.stringify(preOptions) !== JSON.stringify(options)) {
            this.layer.setOptions(options);
        }
        if (JSON.stringify(preData) !== JSON.stringify(data)) {
            this.layer.setData(data);
        }
        if (autoViewport && (JSON.stringify(preData) !== JSON.stringify(data) || autoViewport !== preViewport)) {
            this.setViewport();
        }
    }

    destroy() {
        if (this.layer && this.view) {
            this._createLayer = false;
            this.view.removeLayer(this.layer);
            this.layer!.destroy();
            // @ts-ignore
            this.layer = null;
        }
    }

    initialize() {
        let map = this.map = this.getMap();
        let view = this.view = this.props.view || this.context.view;
        if (!map || !view) {
            return;
        }

        if (!this._createLayer) {
            this.createLayers();
        }
        this.layer.setData(this.props.data);

        if (this.props.autoViewport) {
            this.setViewport();
        }
    }

    setViewport() {
        const isMC = this.props.coordType === 'bd09mc';
        let getPoint = (coordinate: number[]): BMapGL.Point => {
            let p = new BMapGL.Point(coordinate[0], coordinate[1]);
            return isMC ? BMapGL.Projection.convertMC2LL(p) : p;
        }

        let points: BMapGL.Point[] = [];
        this.props.data.forEach((data: MapVGL.GeoJSON) => {
            if (data.geometry.type === 'Point') {
                points.push(getPoint(data.geometry.coordinates));
            } else if (data.geometry.type === 'LineString') {
                data.geometry.coordinates.forEach((item: number[]) => {
                    points.push(getPoint(item));
                });
            } else if (data.geometry.type === 'Polygon') {
                data.geometry.coordinates[0].forEach((item: number[]) => {
                    points.push(getPoint(item));
                });
            } else if (data.geometry.type === 'MultiPolygon') {
                data.geometry.coordinates.forEach((polygon: number[][][]) => {
                    polygon[0].forEach((item: number[]) => {
                        points.push(getPoint(item));
                    });
                });
            }
        });
        if (points.length > 0) {
            this.map.setViewport(points, this.props.viewportOptions || {});
        }
    }

    createLayers() {
        if (mapvgl[this.props.type] || mapvglThree[this.props.type]) {
            this._createLayer = true;
            const Constructor = mapvgl[this.props.type] ? mapvgl : mapvglThree;
            this.layer = new Constructor[this.props.type](this.props.options);
            this.view.addLayer(this.layer);
        } else {
            console.error(`mapvgl doesn't have layer ${this.props.type}!`)
        }
    }

    render() {
        return null;
    }

}
