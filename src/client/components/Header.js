import React, { Component } from 'react';
import LogOutComponent from './LogOutComponent';
import styled from 'styled-components';
import { colors } from '../../theme';

const Container = styled.div`
	display: flex;
	height: 100px;
	justify-content: space-between;
	margin: 0 auto;
	width: 85%;
`;

const H1 = styled.h1`
	color: #00b1d2;
	margin: auto;
	text-align: center;
	width: 50%;
`;

const ButtonsContainer = styled.div`
	display: flex;
	justify-content: ${(props) =>
		props.type === 'logout' ? 'flex-start' : 'flex-end'};
	margin: auto;
	width: 25%;
`;

const Button = styled.div`
	background-color: ${(props) =>
		props.type === 'board' ? colors.green : colors.secondary};
	border-radius: 15px;
	cursor: pointer;
	font-weight: bold;
	height: 35px;
	margin-left: 10px;
	padding: 15px 20px 0 20px;
	text-align: center;
	// width: 90px;
`;

export default class Header extends Component {
	render() {
		const { givenName, familyName } = this.props.profileObj;

		return (
			<Container>
				<ButtonsContainer type="logout">
					<LogOutComponent
						responseGoogleLogout={this.props.responseGoogleLogout}
					/>
				</ButtonsContainer>
				<H1>{`Hello ${givenName} ${familyName}!`}</H1>
				<ButtonsContainer>
					<Button type="content" onClick={this.props.createBoard}>
						+ Content
					</Button>
					<Button type="board" onClick={this.props.createBoard}>
						+ Board
					</Button>
				</ButtonsContainer>
			</Container>
		);
	}
}
