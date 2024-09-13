/**
 * @file 地图全景控件
 * @author zhangdongliang
 * @email zdl_1024@163.com
 */

import Control, { ControlProps } from './Control';

/**
 * 地图全景控件，默认位于地图右下角
 * @visibleName PanoramaControl 地图全景控件
 */
export default class PanoramaControl extends Control<ControlProps> {

    control: BMapGL.PanoramaControl;

    constructor(props: ControlProps) {
        super(props);
    }

    getControl(): BMapGL.PanoramaControl {
        const defaultOptions: BMapGL.PanoramaControlOptions = {
            offset: new BMapGL.Size(30, 30),
            anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
        };
        const control = new BMapGL.PanoramaControl(this.getOptions());
        control.setOffset(this.getOptions().offset || defaultOptions.offset);
        control.setAnchor(this.getOptions().anchor || defaultOptions.anchor);
        return control;
    }

    render() {
        return null;
    }
}
