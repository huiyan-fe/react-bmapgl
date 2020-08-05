import React, { Component } from 'react'

interface IProps {
    name: string;
    value?: number;
}

/**
 * inner test tsx 很强
 */
export default class Test extends Component<IProps> {

    static defaultProps = {
        name: 'name',
        value: 123
    }

    render() {
        return (
            <div>
                {this.props.name}: {this.props.value}
            </div>
        )
    }
}
