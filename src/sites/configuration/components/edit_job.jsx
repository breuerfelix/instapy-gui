import { h, render, Component } from 'preact';
import { translate } from 'services';
import linkState from 'linkstate';
import classNames from 'classnames';
import $ from 'jquery';

export default class EditJob extends Component {
	validate = () => {
		// TODO remove this, just for debug until we know when its optional
		return true;
		/*
		if (!this.configs) return false;

		var oneFail = false;
		for (let config of this.configs) {
			if (config.validate()) continue;

			oneFail = true;
			continue;
		}

		return !oneFail;
		*/
	}

	render({ job, action }) {
		this.configs = [];

		const configs = action.params.map(param => {
			let values = job.params.find(par => par.name == param.name);
			// values are not set
			if (!values) {
				values = {
					position: param.position,
					name: param.name,
					value: param.defaultValue
				};

				job.params.push(values);
			}

			return (
				<ConfigItem
					ref={ conf => this.configs.push(conf) }
					key={ param.position }
					param={ param }
					values={ values }
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
		if (!this.valueInput) return false;

		return this.valueInput.validate();
	}

	render({ param, values }) {
		// enable popover
		$('[data-toggle="popover"]').popover();

		const css = {
			cursor: 'pointer',
			color: 'black',
			outline: 0,
			border: 'none'
		};

		let valueInput = null;
		if (!param.type) {
			// default if there is no given type
			valueInput = <InputBox ref={ inp => this.valueInput = inp } param={ param } values={ values } />;
		}
		else if (param.type.startsWith('str')) {
			valueInput = <InputBox ref={ inp => this.valueInput = inp } param={ param } values={ values } />;
		}
		else if (param.type.startsWith('int') || param.type.startsWith('float')) {
			// TODO make a proper float box
			valueInput = <InputBox ref={ inp => this.valueInput = inp } param={ param } values={ values } type='number' />;
		}
		else if (param.type.startsWith('bool')) {
			valueInput = <BooleanBox ref={ inp => this.valueInput = inp } param={ param } values={ values } />;
		}
		else if (param.type.startsWith('list')) {
			// TODO make a proper list view
			valueInput = <InputBox ref={ inp => this.valueInput = inp } param={ param } values={ values } />;
		}

		return (
			<div className="form-group row">
				<label className="col-md-4 col-form-label">
					{ translate(param.name) }
				</label>
				<div className="col-md-8">
					{ valueInput }
				</div>
			</div>
		);
	}
}

class InputBox extends Component {
	state = {
		error: false
	}

	validate = () => {
		const { type = 'text', values } = this.props;

		// TODO maybe not test if paramter is optional or just test type

		if (type == 'text') {
			let error = false;

			if (Array.isArray(values.value)) error = values.value.length < 1;
			else error = !values.value;

			this.setState({ error });
		} else {
			// test if input is a number
			if (!values.value) {
				this.setState({ error: true });
			} else {
				values.value = parseInt(values.value);
				this.setState({ error: false });
			}
		}

		const { error } = this.state;
		return !error;
	}

	render({ param, values, type = 'text' }, { error }) {
		const classes = classNames({
			'form-control': true,
			'is-invalid': error
		});

		return (
			<input
				type={ type }
				className={ classes }
				placeholder={ param.placeholder }
				value={ values.value }
				onChange={ e => values.value = e.target.value }
			/>
		);
	}

}

class BooleanBox extends Component {
	state = {
		error: false
	}

	validate = () => {
		const { values } = this.props;

		this.setState({
			error: values.value == null || values.value == undefined
		});

		const { error } = this.state;

		return !error;
	}

	render({ param, values }, { error }) {
		const classes = classNames({
			'form-control': true,
			'is-invalid': error
		});

		return (
			<select className={ classes } value={ values.value } onChange={ e => values.value = e.target.value }>
				<option value='true'>{ translate('true') }</option>
				<option value='false'>{ translate('false') }</option>
			</select>
		);
	}
}
