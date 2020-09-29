import React, { Component } from 'react';

class Counter extends Component {
    // constructor() {
    //     super();
    //     this.handleIncrement = this.handleIncrement.bind(this);
    // }

    // renderTages() {
    //     if (this.state.tages.length === 0) return <p>please add tages</p>;
    //     return (
    //         <ul>
    //             {this.state.tages.map((tag) => (
    //                 <li key={tag}>{tag}</li>
    //             ))}
    //         </ul>
    //     );
    // }
    render() {
        return (
            <div>
                <span className={this.getBadgeClasses()}>
                    {this.formatCount()}
                </span>
                <button
                    onClick={() => this.props.onIncrement(this.props.counter)}
                    className='btn btn-secondary btn-sm'
                >
                    increment
                </button>
                <button
                    className='btn btn-danger btn-sm m-2'
                    onClick={() => this.props.onDelete(this.props.counter.id)}
                >
                    delete
                </button>
                {/* {this.state.tages.length === 0 && 'no Tages!'}
                {this.renderTages()} */}
            </div>
        );
    }

    getBadgeClasses() {
        let classes = 'badge m-2 badge-';
        classes += this.props.counter.value === 0 ? 'warning' : 'primary';
        return classes;
    }

    formatCount() {
        const { value: value } = this.props.counter;
        return value === 0 ? 'Zero' : value;
    }
}

export default Counter;
