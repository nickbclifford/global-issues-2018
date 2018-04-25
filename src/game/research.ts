import { Game } from './game';

export interface Research {
	title: string;
	description: string;
	costData: number;
	costMoney: number;
	onResearch(game: Game): void;
}

export const availableResearch: { [id: string]: Research } = {
	test: {
		title: 'Test Research',
		description: 'A test research item for testing.',
		costData: 5,
		costMoney: 5,
		onResearch(game) {
			game.money += 100;
		}
	}
};