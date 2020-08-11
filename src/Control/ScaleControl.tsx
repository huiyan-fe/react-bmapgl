/**
 * @file 比例尺控件
 * @author hedongran
 * @email hdr01@126.com
 */

import Control, { ControlProps } from './Control';

/**
 * 比例尺控件
 * @visibleName ScaleControl 比例尺控件
 */
export default class ScaleControl extends Control<ControlProps> {

    control: BMapGL.ScaleControl;

    constructor(props: ControlProps) {
        super(props);
    }

    getControl(): BMapGL.ScaleControl {
        return new BMapGL.ScaleControl(this.getOptions());
    }

    render() {
        return null;
    }
}

