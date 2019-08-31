import { h, Component } from 'preact';
import { translate } from 'services';
import linkState from 'linkstate';
import classNames from 'classnames';
import TagsInput from 'react-tagsinput';

class Box extends Component {
	state = {
		error: false,
		input: null
	}

	componentWillMount() {
		const { param, value } = this.props;
		if (value) {
			this.setState({ input: value.value });
			return;
		}

		let input = param.defaultValue;

		this.setState({ input });
	}

	setValue = () => {
		let { value, param, params } = this.props;

		// setting the input to the job
		const { input } = this.state;

		if (
			(input == '' || input == null || input == undefined || input == param.defaultValue)
			&& param.optional
		) {
			if (value) {
				// remove value from array so it uses default value
				const index = params.indexOf(value);
				if (index > -1) {
					params.splice(index, 1);
				}
			}

			return null;
		}

		if (value) {
			value.value = input;
			return value;
		}

		// create new value object
		value = {
			name: param.name,
			value: input
		};

		params.push(value);

		return value;
	}
}

export class InputBox extends Box {
	validate = () => {
		const value = this.setValue();
		// value is default value
		if (!value) return true;

		const { step, type = 'text' } = this.props;

		if (type == 'number') {
			// test if input is a number
			if (!value.value) {
				this.setState({ error: true });
			} else {
				value.value = step == '1' ? parseInt(value.value) : parseFloat(value.value);
				this.setState({ error: false, input: value.value });
			}
		} else {
			let error = false;

			if (Array.isArray(value.value)) error = value.value.length < 1;
			else error = !value.value;

			this.setState({ error });
		}

		const { error } = this.state;
		return !error;
	}

	render({ param, type = 'text', step = null }, { input, error }) {
		const classes = classNames({
			'form-control': true,
			'is-invalid': error
		});

		return (
			<input
				step={ step }
				type={ type }
				className={ classes }
				placeholder={ param.placeholder }
				value={ input }
				onChange={ linkState(this, 'input') }
			/>
		);
	}
}

export class ListBox extends Box {
	state = {
		tempInput: ''
	}

	componentWillMount() {
		super.componentWillMount();
		const { param, value } = this.props;
		if (value && value.value) {
			// convert to array if it is comma seperated
			if (!Array.isArray(value.value)) value.value = value.value.split(',');

			this.setState({ input: value.value });
			return;
		}

		let input = param.defaultValue || [];
		// convert to array if it is comma seperated
		if (!Array.isArray(input)) input = input.split(',');

		this.setState({ input });
	}

	validate = () => {
		// if the user forgot to press enter / tab just push the remaining content
		const { tempInput, input } = this.state;
		if (tempInput) this.setState({ input: [ ...input, tempInput ], tempInput: '' });

		const value = this.setValue();
		// value is default value
		if (!value) return true;

		let error = false;

		if (Array.isArray(value.value)) error = value.value.length < 1;
		else error = !value.value;

		this.setState({ error });
		return !error;
	}

	pasteSplit = (data) => {
		// copied from https://stackoverflow.com/a/42008826/3575969
		const separators = [',', ';', '\\(', '\\)', '\\*', '/', ':', '\\?', '\n', '\r'];
		return data.split(new RegExp(separators.join('|'))).map(d => d.trim());
	}

	render({ param }, { input, error, tempInput }) {
		const classes = classNames('react-tagsinput', {
			'is-invalid': error
		});

		return (
			<TagsInput
				className={ classes }
				addKeys={ [ 9, 13 ] } // enter, tab
				value={ input }
				onChange={ input => this.setState({ input }) }
				inputProps={{
					className: 'react-tagsinput-input',
					placeholder: param.placeholder
				}}
				inputValue={ tempInput }
				pasteSplit={ this.pasteSplit }
				addOnPaste={ true }
				onChangeInput={ tempInput => this.setState({ tempInput }) }
			/>
		);
	}
}

export class BooleanBox extends Box {
	validate = () => {
		const value = this.setValue();
		// value is default value
		if (!value) return true;

		// parse to boolean
		if (value.value === 'true') value.value = true;
		else if (value.value === 'false') value.value = false;

		this.setState({
			error: value.value == null || value.value == undefined
		});

		const { error } = this.state;

		return !error;
	}

	render(props, { error, input }) {
		const classes = classNames({
			'form-control': true,
			'is-invalid': error
		});

		return (
			<select className={ classes } value={ input } onChange={ linkState(this, 'input') }>
				<option value='true'>{ translate('true') }</option>
				<option value='false'>{ translate('false') }</option>
			</select>
		);
	}
}

const inputComponents = {
	default: { element: InputBox, props: {} },
	str: { element: InputBox, props: {} },
	secret: { element: InputBox, props: { type: 'password' } },
	int: {
		element: InputBox,
		props: { type: 'number', step: '1' }
	},
	float: {
		element: InputBox,
		props: { type: 'number', step: '0.01' }
	},
	bool: { element: BooleanBox, props: {} },
	list: { element: ListBox, props: {} }
};

export default inputComponents;
