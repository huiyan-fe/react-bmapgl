/**
 * @file 控件基类
 * @author hedongran
 * @email hdr01@126.com
 */

import { Component } from '../common';
import shallowEqual from 'shallowequal';

export interface ControlProps {
    /** 地图实例，来自父元素`<Map>`的继承 */
    map: BMapGL.Map;
    /** 控件的位置 */
    anchor: BMapGL.ControlAnchor;
    /** 控件的相对像素偏移量 */
    offset: BMapGL.Size;
}

export default class Control<P extends ControlProps, S = {}, SS = any> extends Component<P, S, SS> {
    
    static defaultProps: ControlProps | object;
    control: BMapGL.Control;
    options: string[] = [
        'anchor',
        'offset'
    ];

    constructor(props: P) {
        super(props);
    }

    componentDidUpdate(prevProps: P) {
        let {anchor, offset} = this.props;
        let {anchor: preAnchor, offset: preOffset} = prevProps;

        let isAnchorChanged: boolean = !shallowEqual(anchor, preAnchor);
        let isOffsetChanged: boolean = !shallowEqual(offset, preOffset);
        if (isAnchorChanged) {
            this.control.setAnchor(anchor);
        }
        if (isOffsetChanged) {
            this.control.setOffset(offset);
        }
    }

    componentDidMount() {
        this.initialize();
    }

    componentWillUnmount() {
        this.destroy();
    }

    destroy() {
        if (this.control) {
            this.props.map.removeControl(this.control);
            // @ts-ignore
            this.control = null;
        }
    }

    initialize() {
        let map = this.props.map;
        if (!map) {
            return;
        }

        this.destroy();

        this.control = this.getControl();
        map.addControl(this.control);
    }

    getControl(): BMapGL.Control {
        throw new Error('Method getControl not implemented.');
    }

}
