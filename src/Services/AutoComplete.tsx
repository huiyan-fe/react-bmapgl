/**
 * @file 结果提示、自动完成类
 * @author hedongran [hdr01@126.com]
 */

import React, { CSSProperties, Fragment } from 'react';
import { Component } from '../common';
import { default as Wrapper, registerEvents, Events, Methods, Options } from '../common/WrapperHOC';

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
    private initTimer: ReturnType<typeof setTimeout> | null = null;
    private initRetryCount = 0;
    private static readonly INIT_RETRY_MAX = 20;
    private static readonly INIT_RETRY_DELAY = 50;
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
        // 当使用内部 input（未传 props.input）时，可能处于 Modal/Portal 中，
        // DOM 尚未挂载完成导致 ref 为 null，百度 API adjustPosition 会报错。
        // 延迟到下一帧再初始化，确保容器已渲染。
        if (!this.props.input) {
            this.initTimer = setTimeout(() => this.initialize(), 0);
        } else {
            this.initialize();
        }
    }

    componentWillUnmount() {
        if (this.initTimer) {
            clearTimeout(this.initTimer);
            this.initTimer = null;
        }
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

        const opts = this.getOptions();
        if (!opts.input) {
            opts.input = this.el.current;
        }
        // 若 input 仍为 null（如 Modal 尚未完成挂载），避免传入百度 API 导致 adjustPosition 报错；支持短时重试
        if (!opts.input) {
            if (this.initRetryCount < AutoComplete.INIT_RETRY_MAX) {
                this.initRetryCount += 1;
                if (this.initTimer) clearTimeout(this.initTimer);
                this.initTimer = setTimeout(() => this.initialize(), AutoComplete.INIT_RETRY_DELAY);
            }
            return;
        }
        this.initRetryCount = 0;
        this.initTimer = null;
        this.ac = this.instance = new BMapGL.Autocomplete(opts);
        // 延迟初始化时 Wrapper 的 componentDidMount 中 getInstance() 为 undefined，需在此补绑事件
        registerEvents(this, this.ac, eventsMap);
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
