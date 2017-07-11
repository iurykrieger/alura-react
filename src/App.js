import React, { Component } from 'react';
import './css/pure-min.css';
import './css/side-menu.css';
import Author from './Author';
import Home from './Home';
import Book from './Book';
import NotFound from './NotFound';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

class App extends Component {
	render() {
		return (
			<Router>
				<div id="layout">
					<a href="#menu" id="menuLink" className="menu-link">
						<span />
					</a>
					<div id="menu">
						<div className="pure-menu">
							<a className="pure-menu-heading" href="#">
								Company
							</a>

							<ul className="pure-menu-list">
								<li className="pure-menu-item">
									<Link className="pure-menu-link" to="/">
										Home
									</Link>
								</li>
								<li className="pure-menu-item">
									<Link className="pure-menu-link" to="/author">
										Autor
									</Link>
								</li>
								<li className="pure-menu-item">
									<Link className="pure-menu-link" to="/book">
										Livro
									</Link>
								</li>
							</ul>
						</div>
					</div>

					<Switch>
						<Route exact path="/" component={Home} />
						<Route path="/author" component={Author} />
						<Route path="/book" component={Book} />
						<Route component={NotFound} />
					</Switch>
				</div>
			</Router>
		);
	}
}

export default App;
