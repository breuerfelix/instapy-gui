/*
This is a modified version of the file https://github.com/converge/instapy-dashboard/blob/master/src/components/Statistics/index.jsx
*/
import { h } from 'preact';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { SocketService } from 'services';
import { Stretch } from 'styled-loaders';


export default class UserDbData extends Component {
	state = {
		allActivities: [],
		loading: true,
		view_name: undefined,
		all_usernames: []
	}

	compareRowsByDateDesc =(a, b) => {
		return new Date(b) - new Date(a);
	}

	updateActivities = data => {
		const { allActivities } = this.state;

		const new_activities = allActivities.concat(data.data).map((value,index,self) => {
			const i = self.findIndex(inner_value => value.day_filter == inner_value.day_filter && value.name == inner_value.name);
			if (i==index){
				return value;
			} else {
				value.likes += self[i].likes;
				value.comments += self[i].comments;
				value.follows += self[i].follows;
				value.unfollows += self[i].unfollows;
				value.server_calls += self[i].server_calls;
				self[i].remove = true;
				return value;
			}
		})
			.filter(value => !value.remove)
			.sort((a, b) => this.compareRowsByDateDesc(a.day_filter,b.day_filter));

		this.setState({
			allActivities: new_activities,
			loading: false
		});
	}

	updateUsernames = data => {
		this.setState(prevState => {
			prevState.all_usernames = prevState.all_usernames.concat(data.data).filter((value, index, self) => self.indexOf(value) === index).sort();
			return prevState;
		});
	}

	componentDidMount() {
		SocketService.register('get-activities', this.updateActivities);
		SocketService.register('get-usernames', this.updateUsernames);
		SocketService.send({
			handler: 'get-activities',
			action: 'get'
		});
		SocketService.send({
			handler: 'get-usernames',
			action: 'get'
		});
	}

	componentWillUnmount(){
		SocketService.unregister('get-activities', this.updateActivities);
		SocketService.register('get-usernames', this.updateUsernames);
	}

	render({ match }, { loading, allActivities, all_usernames, view_name }) {
		const options = all_usernames.map((data) => <option style="text-align:center" key={ data } value={ data }>{data}</option>);
		options.unshift(<option style="text-align:center" key={ undefined } value={ undefined }>All</option>);

		return (
			<div className='card' style="display: 'grid';justifyContent: 'center'">
				<h1 style="text-align: center">Statistics</h1>
				<div style="width: '100%';marginTop: theme.spacing.unit * 3;overflowX: 'auto'">
					{
						loading?
							<div>
								<Stretch/>
								<div
									style="display: block;margin: 15px auto;text-align: center">
							Getting data from connected clients.<br/>
							You need to connect atleast one client, and it should have data from atleast 1 run.
								</div>
							</div>
							:
							<div>
								<select style="width: 100%;margin-top:20px" onChange={ e => {this.setState({ view_name: e.target.value });} }>
									{options}
								</select>
								<table style="width:100%;margin-top:20px">
									<tr style="width: 100%;margin-top:20px">
										<th style="text-align:center">profile</th>
										<th style="text-align:center">likes</th>
										<th style="text-align:center">comments</th>
										<th style="text-align:center">follows</th>
										<th style="text-align:center">unfollows</th>
										<th style="text-align:center">server calls</th>
										<th style="text-align:center">created</th>
									</tr>
									{allActivities.filter(row => view_name !== 'All' || row.name !== view_name).map(row => {
										return (
											<tr key={ row.rowid }>
												<th style="text-align:center" component="th" scope="row">
													<Link to={ `${match.url}/userStatistics/${Buffer.from(row.name).toString('base64')}` }
														style="marginLeft: 18;textDecoration: 'None'">
														{row.name}
													</Link>
												</th>
												<th style="text-align:center">{row.likes}</th>
												<th style="text-align:center">{row.comments}</th>
												<th style="text-align:center">{row.follows}</th>
												<th style="text-align:center">{row.unfollows}</th>
												<th style="text-align:center">{row.server_calls}</th>
												<th style="text-align:center">{row.day_filter}</th>
											</tr>
										);
									})}
								</table>
							</div>
					}
				</div>
			</div>
		);
	}
}
