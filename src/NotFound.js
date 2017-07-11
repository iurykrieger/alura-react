import React, { Component } from 'react';

export default class NotFound extends Component {
	render() {
		return (
			<div id="main">
				<div className="header">
					<h1>Página não encontrada!</h1>
				</div>
				<div className="content" id="content">
					<h1>
						Não foi possível encontrar <code>{this.props.location.pathname}</code>
					</h1>
				</div>
			</div>
		);
	}
}
