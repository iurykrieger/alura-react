import React, { Component } from 'react';
import CustomInput from './components/CustomInput';
import CustomSubmitButton from './components/CustomSubmitButton';
import PubSub from 'pubsub-js';
import ErrorHandler from './ErrorHandler';

export default class Book extends Component {
	render() {
		return (
			<div id="main">
				<div className="header">
					<h1>Cadastro de Livros</h1>
				</div>
				<div className="content" id="content">
					<BookBox />
				</div>
			</div>
		);
	}
}

class BookBox extends Component {
	render() {
		return (
			<div>
				<BookForm />
				<BookTable />
			</div>
		);
	}
}

class BookForm extends Component {
	constructor() {
		super();
		this.state = { titulo: '', preco: '', autorId: '', autorList: [] };
	}

	componentDidMount() {
		fetch('http://cdc-react.herokuapp.com/api/autores')
			.then(response => response.json())
			.then(response => this.setState({ autorList: response }))
			.catch(error => console.log(error));

		PubSub.subscribe('new-author-list', (channel, newAuthorList) => {
			this.setState({ autorList: newAuthorList });
		});
	}

	sendForm(event) {
		event.preventDefault();
		PubSub.publish('clean-error', {});
		fetch('http://cdc-react.herokuapp.com/api/livros', {
			headers: {
				Accept: 'application/json',
				'Content-type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({
				titulo: this.state.titulo,
				preco: this.state.preco,
				autorId: this.state.autorId
			})
		})
			.then(response => new ErrorHandler().handle(response))
			.then(response => response.json())
			.then(response => {
				PubSub.publish('new-book-list', response);
				this.setState({ titulo: '', preco: '', autorId: '' });
			})
			.catch(error => new ErrorHandler().publish(error));
	}

	setTitulo(event) {
		this.setState({ titulo: event.target.value });
	}

	setPreco(event) {
		this.setState({ preco: event.target.value });
	}

	setAutorId(event) {
		this.setState({ autorId: event.target.value });
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
						label="Título"
						id="titulo"
						type="text"
						value={this.state.titulo}
						onChange={this.setTitulo.bind(this)}
					/>
					<CustomInput
						label="Preço"
						id="preco"
						type="number"
						value={this.state.preco}
						onChange={this.setPreco.bind(this)}
					/>
					<div className="pure-control-group">
						<label htmlFor="autorId">Autor</label>
						<select
							name="autorId"
							id="autorId"
							value={this.state.autorId}
							onChange={this.setAutorId.bind(this)}
						>
							<option value="">-- Selecione um autor --</option>
							{this.state.autorList.map(autor =>
								<option value={autor.id}>
									{autor.nome}
								</option>
							)}
						</select>
					</div>
					<CustomSubmitButton label="Salvar" />
					<br />
				</form>
			</div>
		);
	}
}

class BookTable extends Component {
	constructor() {
		super();
		this.state = { bookList: [] };
	}

	componentDidMount() {
		fetch('http://cdc-react.herokuapp.com/api/livros')
			.then(response => response.json())
			.then(response => this.setState({ bookList: response }))
			.catch(error => console.log(error));

		PubSub.subscribe('new-book-list', (channel, newBookList) => {
			this.setState({ bookList: newBookList });
		});
	}

	render() {
		return (
			<div>
				<table className="pure-table">
					<thead>
						<tr>
							<th>Título</th>
							<th>Preço</th>
							<th>Autor</th>
						</tr>
					</thead>
					<tbody>
						{this.state.bookList.map(book =>
							<tr key={book.id}>
								<td>
									{book.titulo}
								</td>
								<td>
									{book.preco}
								</td>
								<td>
									{book.autor.nome}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		);
	}
}
