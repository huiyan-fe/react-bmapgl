/**
 * @file 地图类型控件
 * @author hedongran
 * @email hdr01@126.com
 */

import Control, { ControlProps } from './Control';

/**
 * 地图类型控件
 * @visibleName MapTypeControl 地图类型控件
 */
export default class MapTypeControl extends Control<ControlProps> {

    control: BMapGL.MapTypeControl;

    constructor(props: ControlProps) {
        super(props);
    }

    getControl(): BMapGL.MapTypeControl {
        return new BMapGL.MapTypeControl(this.getOptions());
    }

    render() {
        return null;
    }
}

