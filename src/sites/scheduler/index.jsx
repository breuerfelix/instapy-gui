import { h, render, Component } from 'preact';
import { ItemsHandler } from 'components/items_handler';
import Schedule from './schedule';

const Scheduler = () => (
	<ItemsHandler
		ident='scheduler'
		editComponent={ Schedule }
	/>
);

export default Scheduler;