/**
 * @file 地图各子组件的高阶组件，用来处理绑定事件、属性等公共操作
 * @author hedongran
 * @email hdr01@126.com
 */

import React from 'react';
import shallowequal from 'shallowequal';
import Component from './Component';

export type MapInstance = BMapGL.Map | BMapGL.Overlay;
export type Events = string[];
export type Options = string[];
export type Methods = {
    [x: string]: string[]
};

function registerEvents(component: Component, instance: MapInstance, eventsMap?: Events) {
    if (eventsMap && instance.addEventListener) {
        component.registeredEvents = {};
        eventsMap.forEach((key: string) => {
            const methodName = `on${key.substr(0, 1).toUpperCase()}${key.substr(1)}`;
            if (component.props[methodName] && typeof component.props[methodName] === 'function') {
                instance.addEventListener(key, component.props[methodName]);
                component.registeredEvents[key] = component.props[methodName];
            }
        });
    }
}

function unregisterEvents(component: Component, instance: MapInstance) {
    if (component.registeredEvents && instance.removeEventListener) {
        Object.keys(component.registeredEvents).forEach(key => {
            instance.removeEventListener(key, component.registeredEvents[key]);
        });
        component.registeredEvents = null;
    }
}

/**
 * 给子组件绑定需要切换的属性对应的方法
 * @param {Component} component 子组件
 * @param {Methods} methodsMap 属性和对应的2个切换方法
 * @return 修改过后的子组件
 */
function wrapMethods<P>(component: React.ComponentClass<P>, methodsMap?: Methods): React.ComponentClass<P> {
    const getInstance = component.prototype.getInstance;
    const componentDidMount = component.prototype.componentDidMount;
    const componentDidUpdate = component.prototype.componentDidUpdate;
    if (!getInstance) {
        return component;
    }
    if (methodsMap && Object.keys(methodsMap).length > 0) {
        component.prototype.componentDidMount = function () {
            if (componentDidMount) {
                componentDidMount.call(this);
            }
            Object.keys(methodsMap).forEach(key => {
                if (this.props[key] !== undefined) {
                    const instance = getInstance(this);
                    if (this.props[key] && instance) {
                        instance[methodsMap[key][0]](); 
                    } else {
                        instance[methodsMap[key][1]]();
                    }
                }
            });
        };
        component.prototype.componentDidUpdate = function (prevProps: {}, prevState: {}) {
            Object.keys(methodsMap).forEach(key => {
                if (!shallowequal(this.props[key], prevProps[key])) {
                    const instance = getInstance(this);
                    if (this.props[key] && instance) {
                        instance[methodsMap[key][0]](); 
                    } else {
                        instance[methodsMap[key][1]]();
                    }
                }
            });
            if (componentDidUpdate) {
                componentDidUpdate.call(this, prevProps, prevState);
            }
        };
    }
    return component;
}

/**
 * 给子组件绑定对应需要的事件
 * @param {Component} component 子组件
 * @param {Events} eventsMap 事件名数组
 * @return 修改过后的子组件
 */
function wrapEvents<P>(component: React.ComponentClass<P>, eventsMap?: Events): React.ComponentClass<P> {
    const getInstance = component.prototype.getInstance;
    const componentDidUpdate = component.prototype.componentDidUpdate;
    const componentDidMount = component.prototype.componentDidMount;
    const componentWillUnmount = component.prototype.componentWillUnmount;
    if (eventsMap && eventsMap.length > 0) {
        component.prototype.componentDidMount = function () {
            if (componentDidMount) {
                componentDidMount.call(this);
            }
            registerEvents(this, getInstance(this), eventsMap);
        };
        component.prototype.componentDidUpdate = function (prevProps: {}, prevState: {}) {
            if (!shallowequal(this.props, prevProps)) {
                unregisterEvents(this, getInstance(this));
            }
            if (componentDidUpdate) {
                componentDidUpdate.call(this, prevProps, prevState);
            }
            if (!shallowequal(this.props, prevProps)) {
                registerEvents(this, getInstance(this), eventsMap);
            }
        };
        component.prototype.componentWillUnmount = function () {
            unregisterEvents(this, getInstance(this));
            if (componentWillUnmount) {
                componentWillUnmount.call(this);
            }
        };
    }
    return component;
}

export default function Wrapper<P>(Component: React.ComponentClass<P>, eventsMap?: Events, methodsMap?: Methods): React.ComponentClass<P> {
    let component = wrapMethods(Component, methodsMap);
    component = wrapEvents(component, eventsMap);
    return component;
}
