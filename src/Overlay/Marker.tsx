/**
 * @file 地图标注组件
 * @author hedongran
 * @email hdr01@126.com
 */
// @ts-nocheck
import React from 'react';
import { render } from 'react-dom';
import { Component } from '../common';
import { default as Wrapper, Events, Options, Methods } from '../common/WrapperHOC';

const defaultIconUrl = '//huiyan.baidu.com/cms/react-bmap/markers_new2x_fbb9e99.png';

let icons = {
    'simple_red': new BMapGL.Icon(defaultIconUrl , new BMapGL.Size(42 / 2, 66 / 2), {
        imageOffset: new BMapGL.Size(-454 / 2, -378 / 2),
        anchor: new BMapGL.Size(42 / 2 / 2, 66 / 2),
        imageSize: new BMapGL.Size(600 / 2, 600 / 2)
    }),
    'simple_blue': new BMapGL.Icon(defaultIconUrl , new BMapGL.Size(42 / 2, 66 / 2), {
        imageOffset: new BMapGL.Size(-454 / 2, -450 / 2),
        anchor: new BMapGL.Size(42 / 2 / 2, 66 / 2),
        imageSize: new BMapGL.Size(600 / 2, 600 / 2)
    }),
    'loc_red': new BMapGL.Icon(defaultIconUrl , new BMapGL.Size(46 / 2, 70 / 2), {
        imageOffset: new BMapGL.Size(-400 / 2, -378 / 2),
        anchor: new BMapGL.Size(46 / 2 / 2, 70 / 2),
        imageSize: new BMapGL.Size(600 / 2, 600 / 2)
    }),
    'loc_blue': new BMapGL.Icon(defaultIconUrl , new BMapGL.Size(46 / 2, 70 / 2), {
        imageOffset: new BMapGL.Size(-400 / 2, -450 / 2),
        anchor: new BMapGL.Size(46 / 2 / 2, 70 / 2),
        imageSize: new BMapGL.Size(600 / 2, 600 / 2)
    }),
    'start': new BMapGL.Icon(defaultIconUrl , new BMapGL.Size(50 / 2, 80 / 2), {
        imageOffset: new BMapGL.Size(-400 / 2, -278 / 2),
        anchor: new BMapGL.Size(50 / 2 / 2, 80 / 2),
        imageSize: new BMapGL.Size(600 / 2, 600 / 2)
    }),
    'end': new BMapGL.Icon(defaultIconUrl , new BMapGL.Size(50 / 2, 80 / 2), {
        imageOffset: new BMapGL.Size(-450 / 2, -278 / 2),
        anchor: new BMapGL.Size(50 / 2 / 2, 80 / 2),
        imageSize: new BMapGL.Size(600 / 2, 600 / 2)
    }),
    'location': new BMapGL.Icon(defaultIconUrl , new BMapGL.Size(28 / 2, 40 / 2), {
        imageOffset: new BMapGL.Size(-248 / 2, -466 / 2),
        anchor: new BMapGL.Size(28 / 2 / 2, 40 / 2),
        imageSize: new BMapGL.Size(600 / 2, 600 / 2)
    }),
}

for (let i = 1; i <= 10; i++) {
    icons['red' + i] = new BMapGL.Icon(defaultIconUrl , new BMapGL.Size(42 / 2, 66 / 2), {
        imageOffset: new BMapGL.Size(0 - 42 / 2 * (i - 1), 0),
        anchor: new BMapGL.Size(42 / 2 / 2, 66 / 2),
        imageSize: new BMapGL.Size(600 / 2, 600 / 2)
    });
}

for (let i = 1; i <= 10; i++) {
    icons['blue' + i] = new BMapGL.Icon(defaultIconUrl , new BMapGL.Size(42 / 2, 66 / 2), {
        imageOffset: new BMapGL.Size(0 - 42 / 2 * (i - 1), - 132 / 2),
        anchor: new BMapGL.Size(42 / 2 / 2, 66 / 2),
        imageSize: new BMapGL.Size(600 / 2, 600 / 2)
    });
}

interface MarkerProps {
    /** 坐标体系，可选百度经纬度坐标或百度墨卡托坐标 */
    coordType: 'bd09ll' | 'bd09mc'
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

    static defaultProps: MarkerProps;
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
        'shadow',
        'title'
    ];

    constructor(props: MarkerProps) {
        super(props);
    }

    componentDidUpdate(prevProps: MarkerProps) {
        this.initialize();
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
            this.marker = null;
        }
    }

    initialize() {

        let map = this.props.map;
        let type = this.props.type;
        if (type == 'order_tip' || !map) {
            return;
        }

        this.destroy();

        let icon;
        let propsIcon = this.props.icon;

        if (propsIcon && propsIcon instanceof BMapGL.Icon) {
            icon = propsIcon;
        } else {
            if (propsIcon && icons[propsIcon]) {
                icon = icons[propsIcon];
            } else {
                icon = icons.simple_red;
            }
        }

        let position;
        if (this.props.coordType === 'bd09mc') {
            let projection = map.getMapType().getProjection();
            position = projection.pointToLngLat(new BMapGL.Pixel(this.props.position.lng, this.props.position.lat));
        } else {
            position = new BMapGL.Point(this.props.position.lng, this.props.position.lat);
        }

        if ('children' in this.props) {
            this.contentDom = document.createElement('div');
            const child = this.props.children;
            render(<div>{child}</div>, this.contentDom)
            this.marker = new CustomOverlay(position, this.contentDom, {
                zIndex: this.props.zIndex,
                pane: this.props.pane,
                offset: this.props.offset
            });
            map.addOverlay(this.marker);
        } else {
            let options = this.getOptions(this.options);
            options.icon = icon;
            this.marker = new BMapGL.Marker(position, options);
            if (this.props.isTop) {
                this.marker.setTop(true);
            }
            this.bindEvent(this.marker, this.events);

            map.addOverlay(this.marker);
            this.bindToggleMeghods(this.marker, this.toggleMethods);
        }

        if (this.props.autoViewport) {
            map.setViewport([position],this.props.ViewportOptions);
        }

        this.instance = this.marker;
    }

    render(){
        return null;
    }

}

/**
 * defaultProps属性要放在外面，不然生成API文档时，没有默认值
 */
Marker.defaultProps = {
    
};

/**
 * 在地图上绘制简单的标注点
 */
export default Wrapper(Marker, eventsMap, methodsMap);
