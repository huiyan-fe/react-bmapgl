/**
 * @file 地图3D控件
 * @author hedongran
 * @email hdr01@126.com
 */

import Control, { ControlProps } from './Control';

/**
 * 地图3D控件，可以控制地图的旋转、倾斜，默认位于地图右下角
 * @visibleName NavigationControl 3D控件
 */
export default class NavigationControl extends Control<ControlProps> {

    control: BMapGL.NavigationControl3D;

    constructor(props: ControlProps) {
        super(props);
    }

    getControl(): BMapGL.NavigationControl3D {
        return new BMapGL.NavigationControl3D(this.getOptions());
    }

    render() {
        return null;
    }
}

