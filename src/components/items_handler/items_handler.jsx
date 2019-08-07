
import { h, Component } from 'preact';
import { raiseError } from 'core';
import AddCard from '../add_card';
import { withRouter } from 'react-router-dom';
import { AddItemModal } from 'modals';
import { ConfigService } from 'services';
import ItemCard from './item';

class ItemsHandler extends Component {
	state = { items: [] }

	componentWillMount() { this.refreshItems(); }

	refreshItems = async () => {
		const items = await ConfigService.getItems(this.props.ident);
		this.setState({ items: [ ...items ] });
	}

	addItem = async item => {
		// await here, so the item will be registered once we change the route
		const { ident } = this.props;
		item = await ConfigService.updateItem(ident, {
			action: 'add',
			data: item
		});

		if (item.error) raiseError(item.error);

		const { items } = this.state;
		const { newItemHook } = this.props;
		if (newItemHook) item = newItemHook(item);
		items.push(item);
		this.setState({ items: [ ...items ] });
	}

	deleteItem = async item => {
		if (!confirm('Do you really want to delete this item ?')) return;

		const { ident } = this.props;
		const res = await ConfigService.updateItem(ident, {
			action: 'delete',
			data: item
		});

		if (res.error) raiseError(res.error);

		const { items } = this.state;
		const idx = items.findIndex(x => x.ident == item.ident);

		if (idx == -1) raiseError('Could not locate item!');

		items.splice(idx, 1);
		this.setState({ items: [ ...items ] });
	}

	updateItem = async item => {
		const { ident } = this.props;
		const res = await ConfigService.updateItem(ident, {
			action: 'update',
			data: item
		});

		if (res.error) {
			this.refreshItems();
			raiseError(res.error);
		}

		// TODO update item from backend
	}

	editItem = async item => {
		const { ident } = this.props;
		const res = await ConfigService.updateItem(ident, {
			action: 'edit',
			data: item
		});

		if (res.error) raiseError(res.error);

		// update item
		const { items } = this.state;
		const set = items.find(x => x.ident == item.oldIdent);
		set.ident = item.ident;
		set.name = item.name;
		set.description = item.description;
		this.setState({ items: [ ...items ] });
	}

	render({ ident, action, editComponent }, { items }) {
		const itemComponents = items.map(item =>
			h(ItemCard, {
				key: item.ident,
				item,
				action,
				deleteItem: this.deleteItem,
				updateItem: this.updateItem,
				modal: this.modal,
				editComponent,
			})
		);

		return (
			<div>
				{ itemComponents }
				<AddCard target={ ident } />
				<AddItemModal
					ident={ ident }
					items={ items }
					add={ this.addItem }
					edit={ this.editItem }
					ref={ modal => this.modal = modal }
				/>
			</div>
		);
	}
}

export default withRouter(ItemsHandler);
