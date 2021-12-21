/*
This is a modified version of the file https://github.com/converge/instapy-dashboard/blob/master/src/components/UserStatistics/index.jsx
*/
import { h } from 'preact';
import React, { Component } from 'react';
import { SocketService } from 'services';
import { Stretch } from 'styled-loaders';


// chart
import ReactChartkick, { LineChart } from 'react-chartkick';
import { Chart } from 'preact-chartjs-2';

export default class AccountStatistics extends Component {
	state = {
		userStats: [],
		updatedUserStats: [],
		loading: true
	}

	compareRowsByDateDesc =(a, b) => {
		return new Date(b) - new Date(a);
	}

	updateUserStatistics = data => {
		const { userStats } = this.state;
		this.setState({
			userStats: userStats
				.concat(data.data)
				.map((value,index,self) => {
					const second_value = self.find(inner_value => value.day == inner_value.day);
					if (value.created_at > second_value.created_at){
						value.remove = true;
					} else if (value.created_at < second_value.created_at){
						second_value.remove = true;
					}
					return value;
				})
				// Should save the earlier created
				.filter(value => !value.remove)
				.sort((a, b) => this.compareRowsByDateDesc(a.day,b.day))
		});
		this.calculateProgress();
	}

	componentDidMount = () => {
		const { match } = this.props;

		SocketService.register('get-user-statistics', this.updateUserStatistics);
		SocketService.send({
			handler: 'get-user-statistics',
			action: 'get',
			username: Buffer.from(match.params.id, 'base64').toString('latin1')
		});
	}

	calculateProgress = () => {
		this.setState(prevState => {
			let newFollowers = 0;
			const last_index = prevState.userStats.length - 1;
			return {
				updatedUserStats: prevState.userStats.map((stats, index, self) => {
					if (index === last_index) {
						// if first record, there isnt data to compare
						return { ...stats, newFollowers: '...' };
					} else {
						// newFollowers = current day followers - previous day followers
						// ex. yesterday: 100 followers, today 200, result: +100
						newFollowers = stats.followers - self[index+1].followers;
						if (newFollowers > 0) {
							newFollowers = `+${newFollowers}`;
						} else if (newFollowers < 0) {
							newFollowers = `${newFollowers}`;
						}
						return {
							...stats,
							newFollowers: newFollowers,
						};
					}
				})
			};
		});
		// disable loading animation when data available
		this.setState({
			loading: false
		});
	}

	render({ classes }, { updatedUserStats, loading }) {
		let rows = [];
		if (updatedUserStats.length !== 0) {
			rows = updatedUserStats;
		}


		ReactChartkick.addAdapter(Chart);
		let followersFollowingChartData = [{ name: 'Followers', data: {} }, { name: 'Following', data: {} }];
		let newFollowersChartData = [{ name: 'New Followers', data: {} }];
		rows.forEach((item) => {
			followersFollowingChartData[0]['data'][item.day] = item.followers;
			followersFollowingChartData[1]['data'][item.day] = item.following;
			newFollowersChartData[0]['data'][item.day] = item.newFollowers;
		}
		);

		return (
			<div className='card' style="background-color:white;display: 'grid';justifyContent: 'center';margin-right:10%;margin-left:10%;padding-top: 25px;padding-bottom: 25px">
				<h1 style="width:100%;text-align: center">User Statistics</h1>
				<div >
					<LineChart curve={ false } data={ followersFollowingChartData } style="padding-top: 10px" />
					<LineChart curve={ false } data={ newFollowersChartData }  style="padding-top: 10px"/>
				</div>
				<div style="width: '100%';marginTop: theme.spacing.unit * 3;overflowX: 'auto'">
					<table style="width:100%;padding-top: 20px">
						<tr>
							<th style="text-align:center">New Followers</th>
							<th style="text-align:center">Followers</th>
							<th style="text-align:center">Following</th>
							<th style="text-align:center">Total Posts</th>
							<th style="text-align:center">Created</th>
						</tr>
						{rows.sort(this.compareRowsByDateDesc).map(row => {
							return (
								<tr key={ row.id }>
									<th style="text-align:center">{row.newFollowers}</th>
									<th style="text-align:center">{row.followers}</th>
									<th style="text-align:center">{row.following}</th>
									<th style="text-align:center">{row.total_posts}</th>
									<th style="text-align:center">{row.day}</th>
								</tr>
							);
						})}
					</table>
					{ loading &&
						<Stretch/>
					}
				</div>
			</div>
		);
	}
}
