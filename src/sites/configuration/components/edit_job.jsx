import { h, Component } from 'preact';
import { translate } from 'services';
import $ from 'jquery';
import inputConfig from './input_components';

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

		const comps = inputConfig;

		for (const key of Object.keys(comps)) {
			if (!param.type) break;
			if (param.type.startsWith(key)) {
				valueInput = h(comps[key].element, { ...comps[key].props, ...props });
				break;
			}
		}

		// use default
		if (!valueInput) valueInput = h(comps.default.element, { ...props });

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