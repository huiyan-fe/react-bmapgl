import { PureComponent } from 'react'
import { MapInstance, Options } from './WrapperHOC';

interface InstanceOptions {
    [x: string]: any;
}

export default class Component<P = {}, S = {}, SS = any> extends PureComponent<P, S, SS> {

    registeredEvents?: any;
    map: BMapGL.Map;
    instance: MapInstance;
    options: Options = [];

    getMap() {
        // @ts-ignore
        return this.props.map || this.context.map;
    }

    getInstance(component: Component): MapInstance {
        return component.instance;
    }

    getOptions(props: P = this.props): InstanceOptions {
        let options = {};
        this.options.map((key: string) => {
            if (props[key] !== undefined) {
                options[key] = props[key];
            }
        });
        return options;
    }

}
