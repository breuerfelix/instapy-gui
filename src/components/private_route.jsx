import { h } from 'preact';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'core';

const PrivateRoute = ({ token, component: Component, ...rest }) => (
	<Route { ...rest } render={ (props) => (
		token ? <Component { ...props } />
			: <Redirect to='/login' />
	) } />
);

export default connect('token')(PrivateRoute);