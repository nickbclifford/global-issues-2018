import { Game } from './game';
import { arrayIncludes, isInRange } from './utils';

export interface Event {
	title: string;
	description: string;
	precondition(game: Game): boolean;
	trigger(game: Game): void;
}

function noOp(game: Game) { } // tslint:disable-line

export const allEvents: { [id: string]: Event } = {
	grant1: {
		title: 'Startup Grant',
		description:
			'Your efforts to integrate big data into your plan have been noticed by some large data firms. ' +
			'They really want to promote the usage of big data, so they\'ve given you some grants ' +
			'and larger datasets to encourage your development.',
		precondition(game) {
			return isInRange(game.researchedIds.length, 3, 5);
		},
		trigger(game) {
			game.money += 2000;
			game.data += 800;
		}
	},
	conference: {
		title: 'Big Data Conferences',
		description:
			'Big data conferences are springing up all over the world. In the interest of expanding your ' +
			'knowledge on the subject and possibly finding some new talent, you attended one near your company HQ.',
		precondition(game) {
			return isInRange(game.researchedIds.length, 1, 3);
		},
		trigger: noOp
	},
	software: {
		title: 'New Processing Software',
		description:
			'A new big data processing software suite was just released! It was designed to meet the needs ' +
			'of both businesses and enthusiasts. After implementing it, you realized that it actually made your ' +
			'own harvesting software a little faster. Exciting!',
		precondition(game) {
			return game.autoClickerTime !== 0;
		},
		trigger(game) {
			game.autoClickerTime /= 1.1;
		}
	},
	openGov: {
		title: 'Open Government',
		description:
			'Governments around the world have started to implement open governance policies. They now ' +
			'share sets of governance data, such as crime, traffic, and policy-making data, with the public. ' +
			'This is exciting news for the big data world!',
		precondition(game) {
			return game.researchedIds.length >= 4;
		},
		trigger: noOp
	},
	privacy1: {
		title: 'Public Privacy',
		description:
			'Some recent data leaks from other companies have placed privacy back into the public eye. ' +
			'Luckily, you haven\'t had any leaks yourself, but you might want to be careful with what you ' +
			'do with people\'s data...',
		precondition(game) {
			return arrayIncludes(game.researchedIds, 'money2');
		},
		trigger: noOp
	},
	govContract: {
		title: 'Government Contract',
		description:
			'The US government has taken note of your impressive data handling capabilities and wants to enter ' +
			'an agreement with your company. They will allow you access to some of their supercomputing power ' +
			'in exchange for you processing some of their data. Sounds good to you!',
		precondition(game) {
			return arrayIncludes(game.triggeredEvents, 'openGov');
		},
		trigger(game) {
			game.autoClickerTime /= 1.25;
		}
	},
	privacy2: {
		title: '#DeleteBookface',
		description:
			'Uh oh! People have realized the amount of data you\'ve been collecting on them and selling is infringing ' +
			'their basic right to privacy. A movement has started to boycott your social network. You\'re losing business! ' +
			'Time to do some damage control.',
		precondition(game) {
			return arrayIncludes(game.triggeredEvents, 'privacy1') && game.dataPerClick >= 10 && game.moneyPerGig >= 50;
		},
		trigger(game) {
			game.dataPerClick /= 2;
			game.moneyPerGig /= 2;
		}
	}
};
