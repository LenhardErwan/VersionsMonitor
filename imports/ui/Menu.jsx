import React from 'react';

export default class Menu extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			input_filter: '',
		};

		this.handleInputChange = this.handleInputChange.bind(this);
	}

	handleInputChange(event) {
		this.setState({
			input_filter: event.target.value,
		});
		this.props.setFilter(event.target.value);
	}

	render() {
		return (
			<header>
				<div className={`ui icon input ${this.props.loaded ? '' : 'loading'}`}>
					<input
						type='text'
						placeholder='Search...'
						onChange={this.handleInputChange}
						value={this.state.input_filter}
					/>
					<i className='search icon'></i>
				</div>
			</header>
		);
	}
}
