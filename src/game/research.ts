import { Game } from './game';

export interface Research {
	title: string;
	description: string;
	costData: number;
	costMoney: number;
	onResearch(game: Game): void;
}

export const availableResearch: { [id: string]: Research } = {
	clicker: {
		title: 'Automatic Data Harvester',
		description:
			'After manually collecting data for a while, you\'ve figured out some patterns ' +
			'behind your users\' usage data that might make it easier for you to collect said data. ' +
			'In fact, you might be able to automate the process!',
		costData: 20,
		costMoney: 100,
		onResearch(game) {
			game.autoClickerTime = 2500;
		}
	}
};
