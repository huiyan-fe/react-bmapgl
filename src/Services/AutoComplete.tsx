/**
 * @file 结果提示、自动完成类
 * @author hedongran [hdr01@126.com]
 */

import React, { CSSProperties, Fragment } from 'react';
import { Component } from '../common';
import { default as Wrapper, Events, Methods, Options } from '../common/WrapperHOC';

export interface AutoCompleteProps {
    /** 挂载的元素ID，若传值为空，则会自动生成一个input元素 */
    input?: string | HTMLElement;
    /** 设定返回结果的所属范围。例如“北京市” */
    location?: string;
    /** 挂载元素的样式 */
    style?: CSSProperties;
    /** 键盘或者鼠标移动，某条记录高亮之后，触发回调函数 */
    onHighlight?(e: Event): void;
    /** 回车选中某条记录后触发回调函数 */
    onConfirm?(e: Event): void;
    /** 在input框中输入字符后，发起列表检索，完成后的回调函数 */
    onSearchComplete?(e: Event): void;
}

const eventsMap: Events = [
    'confirm',
    'highlight'
];

const methodsMap: Methods = {
};

class AutoComplete extends Component<AutoCompleteProps> {

    private el = React.createRef<HTMLInputElement>();
    static defaultProps: AutoCompleteProps | object;
    ac: BMapGL.Autocomplete;
    options: Options = [
        'location',
        'onSearchComplete',
        'input',
        'types'
    ];

    constructor(props: AutoCompleteProps) {
        super(props);
    }

    componentDidMount() {
        this.initialize();
    }

    componentWillUnmount() {
        this.destroy();
    }

    destroy() {
        if (this.ac) {
            this.ac.dispose();
            // @ts-ignore
            this.instance = this.ac = undefined;
        }
    }

    initialize() {
        this.destroy();

        let opts = this.getOptions();
        if (!opts.input) {
            opts.input = this.el.current; 
        }
        this.ac = this.instance = new BMapGL.Autocomplete(opts);
    }

    render() {
        return (
            <Fragment>
                {!this.props.input && <input
                    className="react-bmapgl-autocomplete"
                    ref={this.el}
                    style={this.props.style}
                />}
            </Fragment>
        );
    }
}

AutoComplete.defaultProps = {
};

/**
 * Autocomplete是结果提示、自动完成类，不依赖地图进行展示，是仅调用地图API的服务。
 * @visibleName AutoComplete 结果提示
 */
export default Wrapper(AutoComplete, eventsMap, methodsMap);
