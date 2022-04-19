/**
 * @file 城市控件
 * @author hedongran
 * @email hdr01@126.com
 */

import Control, { ControlProps } from './Control';

/**
 * 城市控件，默认位于地图左上角
 * @visibleName CityListControl 城市选择控件
 */
export default class CityListControl extends Control<ControlProps> {

    control: BMapGL.CityListControl;

    constructor(props: ControlProps) {
        super(props);
    }

    getControl(): BMapGL.CityListControl {
        return new BMapGL.CityListControl(this.getOptions());
    }

    render() {
        return null;
    }
}

