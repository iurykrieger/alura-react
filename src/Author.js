import React, { Component } from 'react';
import CustomInput from './components/CustomInput';
import CustomSubmitButton from './components/CustomSubmitButton';
import PubSub from 'pubsub-js';
import ErrorHandler from './ErrorHandler';

export default class Author extends Component {
	render() {
		return (
			<div id="main">
				<div className="header">
					<h1>Cadastro de Autores</h1>
				</div>
				<div className="content" id="content">
					<AuthorBox />
				</div>
			</div>
		);
	}
}

class AuthorBox extends Component {
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
		PubSub.publish('clean-error', {});
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
			.then(response => new ErrorHandler().handle(response))
			.then(response => response.json())
			.then(response => {
				PubSub.publish('new-author-list', response);
				this.setState({ nome: '', email: '', senha: '' });
			})
			.catch(error => new ErrorHandler().publish(error));
	}

	onChange(inputName, event) {
		this.setState({ [inputName]: event.target.value });
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
						onChange={this.onChange.bind(this, 'nome')}
					/>
					<CustomInput
						label="Email"
						id="email"
						type="email"
						value={this.state.email}
						onChange={this.onChange.bind(this, 'email')}
					/>
					<CustomInput
						label="Senha"
						id="senha"
						type="password"
						value={this.state.senha}
						onChange={this.onChange.bind(this, 'senha')}
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

		PubSub.subscribe('new-author-list', (channel, newAuthorList) => {
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
