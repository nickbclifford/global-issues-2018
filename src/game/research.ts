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
	data1: {
		title: 'More Data',
		description:
			'With newer analytics software, you think you might be able to collect more in-depth data ' +
			'regarding your users, but you\'ll also need to hire a data scientist to sort through it all.',
		costData: 20,
		costMoney: 50,
		onResearch(game) {
			game.dataPerClick = 2.5;
		}
	},
	clicker1: {
		title: 'Automatic Data Harvester',
		description:
			'After manually collecting data for a while, you\'ve figured out some patterns ' +
			'behind your users\' usage that might make it easier for you to collect said data. ' +
			'In fact, you might be able to automate the process!',
		costData: 75,
		costMoney: 100,
		onResearch(game) {
			game.autoClickerTime = 1250;
		}
	},
	money1: {
		title: 'Better Marketing',
		description:
			'You\'ve noticed that despite all the detail in your data, advertising companies don\'t seem ' +
			'to be very drawn to it. Maybe if you hired a better marketing team, you could sell your data ' +
			'for a higher price.',
		costData: 50,
		costMoney: 750,
		onResearch(game) {
			game.moneyPerGig = 10;
		}
	},
	clicker2: {
		title: 'Parallel Data Harvester',
		description:
			'Your automatic data harvesting process is working great; however, you recently realized ' +
			'that spreading your harvesting program over multiple servers will help you collect more data. ' +
			'Now you just need to develop it...',
		costData: 200,
		costMoney: 1000,
		prereqs: ['clicker1'],
		onResearch(game) {
			game.autoClickerTime = 750;
		}
	},
	data2: {
		title: 'Deep Learning',
		description:
			'You\'ve attended several machine learning conferences lately and it occurred to you that ' +
			'if you started applying deep learning methods to your datasets, you could probably identify ' +
			'lots of new patterns. It would probably at least <em>double</em> your data output.',
		costData: 400,
		costMoney: 2000,
		prereqs: ['data1'],
		onResearch(game) {
			game.dataPerClick = 5;
		}
	},
	money2: {
		title: 'Profile Building',
		description:
			'Your revolutionary deep learning setup has not gone unnoticed by your advertisers. ' +
			'They want you to take the data you give them and build profiles of people and their interests so that ' +
			'ads can be better targeted to them. They\'ll pay you a lot more, so where\'s the harm in it?',
		costData: 1000,
		costMoney: 5000,
		prereqs: ['money1'],
		onResearch(game) {
			game.moneyPerGig = 25;
		}
	}
};
