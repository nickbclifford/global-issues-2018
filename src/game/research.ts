import { Game } from './game';

export interface Research {
	title: string;
	description: string;
	costData: number;
	costMoney: number;
	prereqs?: string[];
	onResearch(game: Game): void;
}

export const availableResearch: { [id: string]: Research } = {
	moreData: {
		title: 'More Data',
			description:
				'With newer analytics software, you think you might be able to collect more in-depth data ' +
			'regarding your users, but first, you need to hire a data scientist to sort through it all.',
			costData: 10,
			costMoney: 25,
			onResearch(game) {
			game.dataPerClick = 2.5;
		}
	},
	clicker: {
		title: 'Automatic Data Harvester',
		description:
			'After manually collecting data for a while, you\'ve figured out some patterns ' +
			'behind your users\' usage that might make it easier for you to collect said data. ' +
			'In fact, you might be able to automate the process!',
		costData: 20,
		costMoney: 100,
		onResearch(game) {
			game.autoClickerTime = 2500;
		}
	},
	clicker2: {
		title: 'Parallel Data Harvester',
		description:
			'Your automatic data harvesting process is working great; however, you recently realized ' +
			'that spreading your harvesting program over multiple servers will help you collect more data. ' +
			'Now you just need to develop it...',
		costData: 100,
		costMoney: 1000,
		prereqs: ['clicker'],
		onResearch(game) {
			game.autoClickerTime = 1000;
		}
	}
};
