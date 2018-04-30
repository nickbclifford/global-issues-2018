import { Game } from './game';

export interface Event {
	title: string;
	description: string;
	precondition(game: Game): boolean;
	trigger(game: Game): void;
}

export const allEvents: { [id: string]: Event } = {
	test: {
		title: 'Test Event',
		description: 'A test event to be triggered.',
		precondition(game) {
			return game.dataPerClick >= 100;
		},
		trigger(game) {
			game.dataPerClick = 10;
		}
	}
};
