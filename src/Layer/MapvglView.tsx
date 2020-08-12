/**
 * @file mapvgl的view图层管理类
 * @author hedongran
 * @email hdr01@126.com
 */

// @ts-ignore
import {View, BloomEffect, BrightEffect, BlurEffect} from 'mapvgl';
import React, { ReactElement, ReactNode } from 'react';
import { Component, MapChildrenProps } from '../common';

interface MapvglViewProps extends MapChildrenProps {
    /** 后处理效果数组 */
    effects?: string[];
}

export interface MapVGLViewChildrenProps {
    /** mapvgl的图层管理器实例，来自父元素`<MapvglView>`的继承 */
    view: MapVGLView;
}
export interface MapVGLView {
    addLayer(x: MapVGLLayer): void;
    removeLayer(x: MapVGLLayer): void;
}
export interface MapVGLLayer {
    setData(x: string[]): void;
    setOptions(x: object): void;
}

export default class MapvglView extends Component<MapvglViewProps> {

    mapvglView: any;
    map: any;
    
    componentDidMount() {
        this.initialize();
        this.forceUpdate();
    }

    componentWillUnmount() {
        if (this.mapvglView) {
            this.mapvglView.destroy();
            this.mapvglView = null;
        }
    }

    componentDidUpdate(prevProps: MapvglViewProps) {
        if (!this.map || !this.mapvglView) {
            this.initialize();
        }
    }

    initialize() {
        let map = this.props.map;
        if (!map) {
            return;
        }
        this.map = map;

        if (!this.mapvglView) {
            let effects: any[] = [];
            let simpleEffects = this.props.effects;
            if (simpleEffects && simpleEffects.length) {
                simpleEffects.forEach(name => {
                    if (name === 'bloom') {
                        effects.push(new BloomEffect());
                    } else if (name === 'bright') {
                        effects.push(new BrightEffect());
                    } else if (name === 'blur') {
                        effects.push(new BlurEffect());
                    }
                });
            }
            this.mapvglView = new View({
                effects,
                map
            });
        }
    }

    /**
     * 在子元素props中附上view和map字段
     * @return {string|Element} children with props
     * @memberof MapvglView
     */
    renderChildren(children: ReactElement | ReactElement[]): ReactNode {
        if (!children || !this.map || !this.mapvglView) {
            return;
        }

        return React.Children.map(children, (child: ReactElement) => {
            if (!child) {
                return;
            }

            if (typeof child.type === 'string' || typeof child.type === 'number') {
                return child;
            } else {
                return React.cloneElement(child, {
                    map: this.map,
                    view: this.mapvglView
                });
            }
        });
    }

    render() {
        return (
            <div title="mapvgl view">
                {this.renderChildren(this.props.children as ReactElement)}
            </div>
        );
    }

}
