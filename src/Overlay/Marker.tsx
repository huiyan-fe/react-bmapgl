/**
 * @file 地图标注组件
 * @author hedongran
 * @email hdr01@126.com
 */

import { Component } from '../common';
import { default as Wrapper, Events, Options, Methods } from '../common/WrapperHOC';
import shallowequal from 'shallowequal';
import { MercatorProjection } from '../utils';

const defaultIconUrl = '//huiyan.baidu.com/cms/react-bmap/markers_new2x_fbb9e99.png';

let icons = {
    'simple_red': new BMapGL.Icon(defaultIconUrl , new BMapGL.Size(42 / 2, 66 / 2), {
        imageOffset: new BMapGL.Size(454 / 2, 378 / 2),
        imageSize: new BMapGL.Size(600 / 2, 600 / 2)
    }),
    'simple_blue': new BMapGL.Icon(defaultIconUrl , new BMapGL.Size(42 / 2, 66 / 2), {
        imageOffset: new BMapGL.Size(454 / 2, 450 / 2),
        imageSize: new BMapGL.Size(600 / 2, 600 / 2)
    }),
    'loc_red': new BMapGL.Icon(defaultIconUrl , new BMapGL.Size(46 / 2, 70 / 2), {
        imageOffset: new BMapGL.Size(400 / 2, 378 / 2),
        imageSize: new BMapGL.Size(600 / 2, 600 / 2)
    }),
    'loc_blue': new BMapGL.Icon(defaultIconUrl , new BMapGL.Size(46 / 2, 70 / 2), {
        imageOffset: new BMapGL.Size(400 / 2, 450 / 2),
        imageSize: new BMapGL.Size(600 / 2, 600 / 2)
    }),
    'start': new BMapGL.Icon(defaultIconUrl , new BMapGL.Size(50 / 2, 80 / 2), {
        imageOffset: new BMapGL.Size(400 / 2, 278 / 2),
        imageSize: new BMapGL.Size(600 / 2, 600 / 2)
    }),
    'end': new BMapGL.Icon(defaultIconUrl , new BMapGL.Size(50 / 2, 80 / 2), {
        imageOffset: new BMapGL.Size(450 / 2, 278 / 2),
        imageSize: new BMapGL.Size(600 / 2, 600 / 2)
    }),
    'location': new BMapGL.Icon(defaultIconUrl , new BMapGL.Size(28 / 2, 40 / 2), {
        imageOffset: new BMapGL.Size(248 / 2, 466 / 2),
        imageSize: new BMapGL.Size(600 / 2, 600 / 2)
    }),
}

for (let i = 1; i <= 10; i++) {
    icons['red' + i] = new BMapGL.Icon(defaultIconUrl , new BMapGL.Size(42 / 2, 66 / 2), {
        imageOffset: new BMapGL.Size(42 / 2 * (i - 1), 0),
        imageSize: new BMapGL.Size(600 / 2, 600 / 2)
    });
}

for (let i = 1; i <= 10; i++) {
    icons['blue' + i] = new BMapGL.Icon(defaultIconUrl , new BMapGL.Size(42 / 2, 66 / 2), {
        imageOffset: new BMapGL.Size(42 / 2 * (i - 1), 132 / 2),
        imageSize: new BMapGL.Size(600 / 2, 600 / 2)
    });
}

type IconString = 'simple_red' | 'simple_blue' | 'loc_red' | 'loc_blue' | 'start' | 'end' | 'location'
    | 'red1' | 'red2' | 'red3' | 'red4' | 'red5' | 'red6' | 'red7' | 'red8' | 'red9' | 'red10'
    | 'blue1' | 'blue2' | 'blue3' | 'blue4' | 'blue5' | 'blue6' | 'blue7' | 'blue8' | 'blue9' | 'blue10'
interface MarkerProps {
    /** 标注点的坐标 */
    position: BMapGL.Point;
    /** 标注的Icon图标 */
    icon: BMapGL.Icon | IconString;
    /** 地图实例，来自父元素`<Map>`的继承 */
    map: BMapGL.Map;
    /** 坐标体系，可选百度经纬度坐标或百度墨卡托坐标 */
    coordType?: 'bd09ll' | 'bd09mc';
    /** 自动聚焦视野 */
    autoViewport?: boolean;
    /** `autoViewport`打开时生效，配置视野的参数 */
    viewportOptions?: BMapGL.ViewportOptions;
};

const eventsMap: Events = [
    'click',
    'dblclick',
    'mousedown',
    'mouseup',
    'mouseout',
    'mouseover',
    'remove',
    'infowindowclose',
    'infowindowopen',
    'dragstart',
    'dragging',
    'dragend',
    'rightclick'
];

const methodsMap: Methods = {
    enableMassClear: ['enableMassClear', 'disableMassClear'],
    enableDragging: ['enableDragging', 'disableDragging']
};

class Marker extends Component<MarkerProps> {

    static defaultProps: MarkerProps | object;
    marker: BMapGL.Marker;
    options: Options = [
        'offset',
        'icon',
        'enableMassClear',
        'enableDragging',
        'enableClicking',
        'raiseOnDrag',
        'draggingCursor',
        'rotation',
        'title'
    ];

    constructor(props: MarkerProps) {
        super(props);
    }

    componentDidUpdate(prevProps: MarkerProps) {
        let {position, icon, autoViewport} = this.props;
        let {position: prePosition, icon: preIcon, autoViewport: preViewport} = prevProps;

        let isDataChanged: boolean = position && !shallowequal(position, prePosition);
        let isIconChanged: boolean = !!(icon && !shallowequal(icon, preIcon));
        let isViewportChanged: boolean = !shallowequal(autoViewport, preViewport);
        let point = this.parsePosition(position);

        if (isDataChanged) {
            this.marker.setPosition(point);
        }
        if (autoViewport && (isDataChanged || isViewportChanged)) {
            this.props.map.setViewport([point], this.props.viewportOptions || {});
        }
        if (isIconChanged) {
            let renderIcon: BMapGL.Icon = this.parseIcon(icon);
            this.marker.setIcon(renderIcon);
        }
    }

    componentDidMount() {
        this.initialize();
    }

    componentWillUnmount() {
        this.destroy();
    }

    destroy() {
        if(this.marker){
            this.props.map.removeOverlay(this.marker);
            // @ts-ignore
            this.marker = null;
        }
    }

    initialize() {

        let map = this.props.map;

        this.destroy();

        let icon = this.parseIcon(this.props.icon);
        let position = this.parsePosition(this.props.position);
        let options = this.getOptions();
        options.icon = icon;

        this.instance = this.marker = new BMapGL.Marker(position, options);
        map.addOverlay(this.marker);

        if (this.props.autoViewport) {
            map.setViewport([position], this.props.viewportOptions || {});
        }
    }

    parsePosition(position: BMapGL.Point): BMapGL.Point {
        let point: BMapGL.Point;
        let isMC = this.props.coordType === 'bd09mc';

        if (position instanceof Array) {
            point = new BMapGL.Point(position[0], position[1]);
        } else if (position instanceof BMapGL.Point) {
            point = position;
        } else {
            point = new BMapGL.Point(position!.lng, position!.lat);
        }

        if (isMC) {
            point = MercatorProjection.convertMC2LL(point);
        }
        return point;
    }

    parseIcon(icon: BMapGL.Icon | IconString): BMapGL.Icon {
        let renderIcon: BMapGL.Icon;

        if (icon && icon instanceof BMapGL.Icon) {
            renderIcon = icon;
        } else {
            if (icon && icons[icon]) {
                renderIcon = icons[icon];
            } else {
                renderIcon = icons.simple_red;
            }
        }
        return renderIcon;
    }

    render(){
        return null;
    }

}

/**
 * defaultProps属性要放在外面，不然生成API文档时，没有默认值
 */
Marker.defaultProps = {
    icon: 'simple_red'
};

/**
 * 在地图上绘制简单的标注点
 * @visibleName Marker 点标注
 */
export default Wrapper(Marker, eventsMap, methodsMap);
