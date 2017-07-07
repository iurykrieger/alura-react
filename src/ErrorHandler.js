import PubSub from 'pubsub-js';

export default class ErrorHandler {
	publish(error) {
		error
			.json()
			.then(error =>
				error.errors.forEach(error => PubSub.publish('validation-error', error))
			);
	}

	handle(response) {
		if (!response.ok) throw response;
		return response;
	}
}
