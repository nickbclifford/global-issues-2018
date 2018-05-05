import { Game } from './game';
import { isInRange } from './utils';

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
			game.money += 3000;
			game.gigsData += 800;
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
			'A new open source big data processing software suite just came out! It was designed to meet the needs ' +
			'of both businesses and enthusiasts. After implementing it, you realized that it actually made your ' +
			'own harvesting software a little faster! Exciting!',
		precondition(game) {
			return game.autoClickerTime !== 0;
		},
		trigger(game) {
			game.autoClickerTime /= 1.2;
		}
	}
};
