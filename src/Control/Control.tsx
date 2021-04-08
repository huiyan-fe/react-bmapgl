/**
 * @file 控件基类
 * @author hedongran
 * @email hdr01@126.com
 */

import { Component, MapChildrenProps } from '../common';
import shallowEqual from 'shallowequal';
import { MapContext } from '../Map';

export interface ControlProps extends MapChildrenProps {
    /** 控件的位置，可传下面4个参数： <br/>
     * BMAP\_ANCHOR\_TOP\_LEFT: 左上 <br/>
     * BMAP\_ANCHOR\_TOP\_RIGHT: 右上 <br/>
     * BMAP\_ANCHOR\_BOTTOM\_LEFT: 左下 <br/>
     * BMAP\_ANCHOR\_BOTTOM\_RIGHT: 右下 <br/>
     */
    anchor?: BMapGL.ControlAnchor;
    /** 控件的相对像素偏移量 */
    offset?: BMapGL.Size;
}

export default class Control<P extends ControlProps, S = {}, SS = any> extends Component<P, S, SS> {
    
    static defaultProps: ControlProps | object;
    static contextType = MapContext;
    control: BMapGL.Control;
    options: string[] = [
        'anchor',
        'offset'
    ];

    constructor(props: P) {
        super(props);
    }

    componentDidUpdate(prevProps: P) {
        if (!this.map) {
            this.initialize();
            return;
        }
        let {anchor, offset} = this.props;
        let {anchor: preAnchor, offset: preOffset} = prevProps;

        let isAnchorChanged: boolean = !shallowEqual(anchor, preAnchor);
        let isOffsetChanged: boolean = !shallowEqual(offset, preOffset);
        if (anchor && isAnchorChanged) {
            this.control.setAnchor(anchor!);
        }
        if (offset && isOffsetChanged) {
            this.control.setOffset(offset!);
        }
    }

    componentDidMount() {
        this.initialize();
    }

    componentWillUnmount() {
        this.destroy();
    }

    destroy() {
        if (this.control && this.map) {
            this.map.removeControl(this.control);
            // @ts-ignore
            this.control = null;
        }
    }

    initialize() {
        let map = this.map = this.getMap();
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
