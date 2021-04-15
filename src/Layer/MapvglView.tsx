/**
 * @file mapvgl的view图层管理类
 * @author hedongran
 * @email hdr01@126.com
 */

// @ts-ignore
import {View, BloomEffect, BrightEffect, BlurEffect} from 'mapvgl';
import React, { ReactElement, ReactNode, Fragment } from 'react';
import { Component, MapChildrenProps } from '../common';
import { MapContext } from '../Map';

interface MapvglViewProps extends MapChildrenProps {
    /** 后处理效果数组 */
    effects?: ('bloom' | 'bright' | 'blur')[];
}

export interface MapVGLViewChildrenProps {
    /** *mapvgl的图层管理器实例，来自父元素`<MapvglView>`的继承，无需手动传入 */
    view: MapVGL.View;
}

export interface ViewContextProps {
    map?: BMapGL.Map;
    view?: MapVGL.View;
};

export const ViewContext = React.createContext<ViewContextProps>({
    // We provide a default function for Context without provider
    view: undefined
});

/**
 * 该组件将MapVGL的图层管理器使用`react`进行了一层封装。所有`<MapvglLayer>`组件需要作为该组件的子组件，文档参考[MapVGL图层管理器](https://mapv.baidu.com/gl/docs/View.html)
 * @visibleName MapvglView MapVGL图层管理器
 */
export default class MapvglView extends Component<MapvglViewProps> {

    static contextType = MapContext;
    view: MapVGL.View;

    constructor(props: MapvglViewProps) {
        super(props);
    }

    componentDidMount() {
        this.initialize();
        this.forceUpdate();
    }

    componentWillUnmount() {
        if (this.view) {
            this.view.destroy();
            // @ts-ignore
            this.view = null;
        }
    }

    componentDidUpdate(prevProps: MapvglViewProps) {
        if (!this.map || !this.view) {
            this.initialize();
        }
    }

    initialize() {
        let map = this.map = this.getMap();
        if (!map || this.view) {
            return;
        }

        if (!this.view) {
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
            this.view = new View({
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
        if (!children || !this.map || !this.view) {
            return;
        }

        return React.Children.map(children, (child: ReactElement) => {
            if (!child) {
                return;
            }

            if (typeof child.type === 'string') {
                return child;
            } else {
                return React.cloneElement(child, {
                    map: this.map,
                    view: this.view
                });
            }
        });
    }

    render() {
        return (
            <Fragment>

                <ViewContext.Provider value={{
                    map: this.map,
                    view: this.view
                }}>
                    {this.renderChildren(this.props.children as ReactElement)}
                </ViewContext.Provider>
            </Fragment>
        );
    }

}
