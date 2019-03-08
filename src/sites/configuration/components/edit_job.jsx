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
		else if (param.type.startsWith('int') || param.type.startsWith('float')) {
			// TODO make a proper float box
			valueInput = <InputBox { ...props } type='number' />;
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

		const { param, type } = this.props;
		if (param.optional) return true;

		if (type == 'text') {
			let error = false;

			if (Array.isArray(value.value)) error = value.value.length < 1;
			else error = !value.value;

			this.setState({ error });
		} else {
			// test if input is a number
			if (!value.value) {
				this.setState({ error: true });
			} else {
				value.value = parseInt(value.value);
				this.setState({ error: false });
			}
		}

		const { error } = this.state;
		return !error;

	}

	render({ param, type = 'text' }, { input, error }) {
		const classes = classNames({
			'form-control': true,
			'is-invalid': error
		});

		return (
			<input
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

		const { param } = this.props;

		if (param.optional) return true;

		this.setState({
			error: value.value == null || value.value == undefined
		});

		const { error } = this.state;

		return !error;
	}

	render({ param, value }, { error, input }) {
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
