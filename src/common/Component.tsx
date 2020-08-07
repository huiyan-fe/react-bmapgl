import { PureComponent } from 'react'
import { MapInstance, Options } from './WrapperHOC';

interface InstanceOptions {
    [x: string]: any;
}

export default class Component<P = {}, S = {}, SS = any> extends PureComponent<P, S, SS> {

    registeredEvents?: any;
    instance: MapInstance;
    options: Options = [];

    getInstance(component: Component): MapInstance {
        return component.instance;
    }

    getOptions(): InstanceOptions {
        let options = {};
        this.options.map((key: string) => {
            if (this.props[key] !== undefined) {
                options[key] = this.props[key];
            }
        });
        return options;
    }

}
