/**
 * @file 全景图层
 * @author hedongran [hdr01@126.com]
 */

import { MapContext } from '../Map/Map';
import { Component, MapChildrenProps } from '../common';

interface PanoramaLayerProps extends MapChildrenProps {
};

/**
 * 该组件用于展示全景蓝色路网图层，注意，该组件只展示蓝色路网，不包括进入全景图功能
 * @visibleName PanoramaLayer 全景图层
 */
export default class PanoramaLayer extends Component<PanoramaLayerProps> {

    static contextType = MapContext;
    tilelayer: BMapGL.TileLayer;

    constructor(props: PanoramaLayerProps) {
        super(props);
    }

    componentDidMount() {
        this.initialize();
    }

    componentDidUpdate(prevProps: PanoramaLayerProps) {
        this.initialize();
    }

    componentWillUnmount() {
        this.destroy();
    }

    destroy() {
        if (this.tilelayer) {
            this.map.removeTileLayer(this.tilelayer);
            // @ts-ignore
            this.tilelayer = undefined;
        }
    }

    initialize() {
        let map = this.map = this.getMap();
        if (!map) {
            return;
        }

        this.destroy();

        let tstyle = 'pl';
        let udtVersion = '20190102';
        let tilelayer = this.tilelayer = new BMapGL.TileLayer({
            transparentPng: true
        });
        tilelayer.zIndex = 110;
        // point为图块坐标，level为图块的级别，当地图需要显示特定级别的特定位置的图块时就会自动调用此方法，并提供这两个参数。
        tilelayer.getTilesUrl = function (point, level) {
            if (!point || level < 0) {
                return '';
            }
            let row = point.x;
            let col = point.y;
            let url = '//mapsv0.bdimg.com/tile/?udt=' + udtVersion
                        + '&qt=tile&styles=' + tstyle + '&x=' + row + '&y=' + col + '&z=' + level;
            return url;
        };

        map.addTileLayer(this.tilelayer);
    }

    render() {
        return null;
    }

}
