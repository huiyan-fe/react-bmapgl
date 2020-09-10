/**
 * @file 地图各子组件的高阶组件，用来处理绑定事件、属性等公共操作
 * @author hedongran
 * @email hdr01@126.com
 */

import shallowEqual from 'shallowequal';
import Component from './Component';

export type MapInstance = (
    BMapGL.Map | BMapGL.Overlay | BMapGL.Autocomplete |
    BMapGLLib.DrawingManager | BMapGLLib.DistanceTool
);
export type Events = string[];
export type Options = string[];
export type Methods = {
    [x: string]: string[]
};

export function registerEvents(component: Component, instance: MapInstance, eventsMap?: Events) {
    if (eventsMap && instance && instance.addEventListener) {
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

export function unregisterEvents(component: Component, instance: MapInstance) {
    if (component.registeredEvents && instance && instance.removeEventListener) {
        Object.keys(component.registeredEvents).forEach(key => {
            instance.removeEventListener(key, component.registeredEvents[key]);
        });
        component.registeredEvents = null;
    }
}

export function toggleMethods(component: Component, instance: MapInstance, methodsMap: Methods, prevProps?: {}) {
    if (methodsMap && instance) {
        Object.keys(methodsMap).forEach(key => {
            // 当在 componentDidMount 和 componentDidUpdate 时分别执行
            if ((prevProps === undefined && component.props[key] !== undefined)
                || (prevProps !== undefined && !shallowEqual(component.props[key], prevProps[key]))
            ) {
                if (component.props[key]) {
                    instance && instance[methodsMap[key][0]](); 
                } else {
                    instance && instance[methodsMap[key][1]]();
                }
            }
        });
    }
}

/**
 * 给子组件绑定需要切换的属性对应的方法
 * @param {Component} component 子组件
 * @param {Methods} methodsMap 属性和对应的2个切换方法
 * @return 修改过后的子组件
 */
function wrapMethods<Comp>(component: Comp, methodsMap?: Methods): Comp {
    const getInstance = component['prototype'].getInstance;
    const componentDidMount = component['prototype'].componentDidMount;
    const componentDidUpdate = component['prototype'].componentDidUpdate;
    if (!getInstance) {
        return component;
    }
    if (methodsMap && Object.keys(methodsMap).length > 0) {
        component['prototype'].componentDidMount = function () {
            if (componentDidMount) {
                componentDidMount.call(this);
            }
            toggleMethods(this, getInstance(this), methodsMap);
        };
        component['prototype'].componentDidUpdate = function (prevProps: {}, prevState: {}) {
            toggleMethods(this, getInstance(this), methodsMap, prevProps);
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
function wrapEvents<Comp>(component: Comp, eventsMap?: Events): Comp {
    const getInstance = component['prototype'].getInstance;
    const componentDidUpdate = component['prototype'].componentDidUpdate;
    const componentDidMount = component['prototype'].componentDidMount;
    const componentWillUnmount = component['prototype'].componentWillUnmount;
    if (eventsMap && eventsMap.length > 0) {
        component['prototype'].componentDidMount = function () {
            if (componentDidMount) {
                componentDidMount.call(this);
            }
            registerEvents(this, getInstance(this), eventsMap);
        };
        component['prototype'].componentDidUpdate = function (prevProps: {}, prevState: {}) {
            if (!shallowEqual(this.props, prevProps)) {
                unregisterEvents(this, getInstance(this));
            }
            if (componentDidUpdate) {
                componentDidUpdate.call(this, prevProps, prevState);
            }
            if (!shallowEqual(this.props, prevProps)) {
                registerEvents(this, getInstance(this), eventsMap);
            }
        };
        component['prototype'].componentWillUnmount = function () {
            unregisterEvents(this, getInstance(this));
            if (componentWillUnmount) {
                componentWillUnmount.call(this);
            }
        };
    }
    return component;
}

export default function Wrapper<Comp>(Component: Comp, eventsMap?: Events, methodsMap?: Methods): Comp {
    let component = wrapMethods(Component, methodsMap);
    component = wrapEvents(component, eventsMap);
    return component;
}
