import { h, render, Component } from 'preact';
import { translate } from 'services';
import linkState from 'linkstate';
import classNames from 'classnames';
import $ from 'jquery';

export default class EditJob extends Component {
	validate = () => {
		if (!this.configs) return false;

		let oneFail = false;
		for (let config of this.configs) {
			if (config.validate()) continue;

			oneFail = true;
			// dont break so all configs are able to validate
			continue;
		}

		return !oneFail;
	}

	render({ job, action }) {
		this.configs = [];

		const configs = action.params.map(param => {
			let value = job.params.find(par => par.name == param.name);

			return (
				<ConfigItem
					ref={ conf => this.configs.push(conf) }
					key={ param.name }
					param={ param }
					value={ value }
					params={ job.params }
				/>
			);
		});

		return (
			<form style={{ marginTop: '1rem' }}>
				{ configs }
			</form>
		);
	}
}

class ConfigItem extends Component {
	validate = () => {
		if (!this.valueInput) throw 'ConfigItem: no input box was found!';
		return this.valueInput.validate();
	}

	render({ param, value, params }) {
		// enable popover
		$('[data-toggle="popover"]').popover();

		let valueInput = null;
		const props = {
			ref: inp => this.valueInput = inp,
			param,
			value,
			params
		};

		if (!param.type) {
			// default if there is no given type
			valueInput = <InputBox { ...props } />;
		}
		else if (param.type.startsWith('str')) {
			valueInput = <InputBox { ...props } />;
		}
		else if (param.type.startsWith('int')) {
			// TODO make a proper float box
			valueInput = <InputBox { ...props } type='number' step='1' />;
		}
		else if (param.type.startsWith('float')) {
			// TODO make a proper float box
			valueInput = <InputBox { ...props } type='number' step='0.01' />;
		}
		else if (param.type.startsWith('bool')) {
			valueInput = <BooleanBox { ...props } />;
		}
		else if (param.type.startsWith('list')) {
			// TODO make a proper list view
			valueInput = <InputBox { ...props } />;
		} else if (param.type.startsWith('tuple')) {
			// TODO make a proper tuple view
			valueInput = <InputBox { ...props } />;
		}

		return (
			<div className='form-group row'>
				<label className='col-md-4 col-form-label'>
					{ translate(param.name) }
				</label>
				<div className='col-md-8'>
					{ valueInput }
				</div>
			</div>
		);
	}
}

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

		// TODO: remove if there is a proper list view
		if (Array.isArray(input)) input = input.join(',');

		this.setState({ input });
	}

	setValue = () => {
		let { value, param, params } = this.props;

		// setting the input to the job
		const { input } = this.state;

		if ((input == '' || input == null || input == undefined) && param.optional) {
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

		// value is default value no need to save it
		if (input == param.defaultValue) return value;

		// create new value object
		value = {
			name: param.name,
			value: input
		};

		params.push(value);

		return value;
	}
}

class InputBox extends Box {
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

class BooleanBox extends Box {
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
