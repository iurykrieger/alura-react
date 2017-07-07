import React, { Component } from 'react';
import CustomInput from './components/CustomInput';
import CustomSubmitButton from './components/CustomSubmitButton';
import PubSub from 'pubsub-js';

export default class AuthorBox extends Component {
	render() {
		return (
			<div>
				<AuthorForm />
				<AuthorTable />
			</div>
		);
	}
}

class AuthorForm extends Component {
	constructor() {
		super();
		this.state = { nome: '', email: '', senha: '' };
	}

	sendForm(event) {
		event.preventDefault();
		fetch('http://cdc-react.herokuapp.com/api/autores', {
			headers: {
				Accept: 'application/json',
				'Content-type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({
				nome: this.state.nome,
				email: this.state.email,
				senha: this.state.senha
			})
		})
			.then(response => response.json())
			.then(response => PubSub.publish('new-author-list', response))
			.catch(error => console.log(error));
	}

	setNome(event) {
		this.setState({ nome: event.target.value });
	}

	setEmail(event) {
		this.setState({ email: event.target.value });
	}

	setSenha(event) {
		this.setState({ senha: event.target.value });
	}

	render() {
		return (
			<div className="pure-form pure-form-aligned">
				<form
					className="pure-form pure-form-aligned"
					onSubmit={this.sendForm.bind(this)}
					method="post"
				>
					<CustomInput
						label="Nome"
						id="nome"
						type="text"
						value={this.state.nome}
						onChange={this.setNome.bind(this)}
					/>
					<CustomInput
						label="Email"
						id="email"
						type="email"
						value={this.state.email}
						onChange={this.setEmail.bind(this)}
					/>
					<CustomInput
						label="Senha"
						id="senha"
						type="password"
						value={this.state.senha}
						onChange={this.setSenha.bind(this)}
					/>
					<CustomSubmitButton label="Salvar" />
					<br />
				</form>
			</div>
		);
	}
}

class AuthorTable extends Component {
	constructor() {
		super();
		this.state = { authorList: [] };
	}

	componentDidMount() {
		fetch('http://cdc-react.herokuapp.com/api/autores')
			.then(response => response.json())
			.then(response => this.setState({ authorList: response }))
			.catch(error => console.log(error));

		PubSub.subscribe('new-author-list', (topic, newAuthorList) => {
			this.setState({ authorList: newAuthorList });
		});
	}

	render() {
		return (
			<div>
				<table className="pure-table">
					<thead>
						<tr>
							<th>Nome</th>
							<th>Email</th>
						</tr>
					</thead>
					<tbody>
						{this.state.authorList.map(author =>
							<tr key={author.id}>
								<td>
									{author.nome}
								</td>
								<td>
									{author.email}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		);
	}
}
