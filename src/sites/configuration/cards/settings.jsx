import { h, render, Component } from 'preact';
import { ItemsHandler } from 'components/items_handler';
import { instapyAction } from 'config';

const newItemHook = item => ({ ...item, params: [] });

const Settings = () => (
	<ItemsHandler
		ident='settings'
		newItemHook={ newItemHook }
		action={ instapyAction }
	/>
);

export default Settings;