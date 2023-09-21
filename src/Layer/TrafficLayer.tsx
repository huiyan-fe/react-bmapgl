/**
 * @file 交通路况图层
 * @author hedongran [hdr01@126.com]
 */

import { MapContext } from '../Map/Map';
import { Component, MapChildrenProps } from '../common';

interface TrafficLayerProps extends MapChildrenProps {
};

/**
 * 该组件用于展示交通路况的矢量图层
 * @visibleName TrafficLayer 交通路况图层
 */
export default class TrafficLayer extends Component<TrafficLayerProps> {

    private _showLayer: boolean = false;
    static contextType = MapContext;

    constructor(props: TrafficLayerProps) {
        super(props);
    }

    componentDidMount() {
        this.initialize();
    }

    componentDidUpdate(prevProps: TrafficLayerProps) {
        this.initialize();
    }

    componentWillUnmount() {
        if (this._showLayer && this.map && !this.map._destroyed) {
            this.map.setTrafficOff();
            this._showLayer = false;
        }
    }

    initialize() {
        let map = this.map = this.getMap();
        if (!map) {
            return;
        }

        if (!this._showLayer) {
            map.setTrafficOn();
            this._showLayer = true;
        }
    }

    render() {
        return null;
    }

}
