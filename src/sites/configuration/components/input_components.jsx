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

class RangeBoxSmall extends Component {
	render({is_range, classes, param, onValueChange, onMaximumChange, onMinimumChange, value, maximum, minimum, type=null, step=null}) {
		if (is_range){
			return(
				<div className='row'>
					<input
						step={ step }
						type={ type }
						className={ classes }
						placeholder={ param.placeholder }
						value={ minimum }
						onChange={ onMinimumChange }
						style='width:auto'
					/>
					<h3
					className='col-md-1'
					> - </h3>
					<input
						step={ step }
						type={ type }
						className={ classes }
						placeholder={ param.placeholder }
						value={ maximum }
						onChange={ onMaximumChange }
						style='width:auto'
					/>
				</div>
			);
		}

		return(
			<input
				step={ step }
				type={ type }
				className={ classes }
				placeholder={ param.placeholder }
				value={ value }
				onChange={ onValueChange }
				style='width:auto'
			/>
		);


	}
}


export class RangeBox extends Box {
	state = {
		'is_range': false,
		'single': null,
		'min': null,
		'max': null
	}

	componentWillMount() {
		super.componentWillMount();
		const { input } = this.state;

		if (typeof input == 'number') {
			this.setState({ is_range: false, single: input, min: null, max: null });
			return
		}

		this.setState({ ...this.state, ...input })
	}

	is_not_defined = (input) => {
		return input == '' || input == null || input == undefined
	}

	no_value = (params, value) => {
		if(value) {
			const index = params.indexOf(value);
			if (index > -1) {
				params.splice(index, 1);
			}
		}
	}

	validate = () => {
		const { step, param, value, params } = this.props;
		const {is_range, single, max, min} = this.state;
		let parse_function = step == '1' ? parseInt : parseFloat;

		if (is_range) {
			if (this.is_not_defined(max) || this.is_not_defined(min)) {
				if (param.optional){
					this.setState({ input: null });
				} else {
					this.setState({ error: true })
				}
			} else if (parse_function(min)>=parse_function(max)) {
				if (param.optional){
					this.setState({ input: null });
				} else {
					this.setState({ error: true })
				}
			} else {
				this.setState({ error: false, input: {is_range:is_range, max:parse_function(max), min:parse_function(min)} })
			}
		} else {
			if ((this.is_not_defined(single) || single == param.defaultValue) && param.optional) {

			} else {
				this.setState({ error: false, input: { is_range:is_range, single:parse_function(single) } });
			}
		}

		const value2 = this.setValue();
		if (!value2) return true;

		const { error } = this.state;
		return !error;
	}


	render({ param, type=null, step = null }, { input, error, is_range, min, max, single }) {

		const classes = classNames({
			'form-control': true,
			'is-invalid': error
		});

		return (
			<div className='row'>
				<input
					type="checkbox"
					checked={is_range}
					onChange={ linkState(this, 'is_range')}
					id="is_range" name="is_range"
				/> {/* TODO having a cont id is a bad idea - find another way */}

				<label for="is_range" className='col-md-2'>Pick from range</label>
				<RangeBoxSmall
					is_range={is_range}
					param={param}
					classes={classes}
					type={type}
					step={step}
					value={single}
					maximum={max}
					minimum={min}
					onValueChange={linkState(this, 'single')}
					onMaximumChange={linkState(this, 'max')}
					onMinimumChange={linkState(this, 'min')}
					/>
			</div>
		);
	}
}

const inputComponents = {
	default: { element: InputBox, props: {} },
	str: { element: InputBox, props: {} },
	secret: { element: InputBox, props: { type: 'password' } },
	int: {
		element: RangeBox,
		props: { type: 'number', step: '1' }
	},
	float: {
		element: InputBox, // TODO figure out how to change this
		props: { type: 'number', step: '0.01' }
	},
	bool: { element: BooleanBox, props: {} },
	list: { element: ListBox, props: {} }
};

export default inputComponents;
