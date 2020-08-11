/**
 * @file 缩放控件
 * @author hedongran
 * @email hdr01@126.com
 */

import Control, { ControlProps } from './Control';

/**
 * 缩放控件
 * @visibleName ZoomControl 缩放控件
 */
export default class ZoomControl extends Control<ControlProps> {

    control: BMapGL.ZoomControl;

    constructor(props: ControlProps) {
        super(props);
    }

    getControl(): BMapGL.ZoomControl {
        return new BMapGL.ZoomControl(this.getOptions());
    }

    render() {
        return null;
    }
}

