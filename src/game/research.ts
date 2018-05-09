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
		prereqs: ['money1', 'data2'],
		onResearch(game) {
			game.moneyPerGig = 25;
		}
	},
	clicker3: {
		title: 'Global Data Harvester',
		description:
			'You really like the performance boost given by spreading your data collection processes over multiple ' +
			'servers, but you feel like you could go further. Perhaps you could spread your servers around the world ' +
			'to make sure each user has a fast connection to your platform. That would make your program even more efficient.',
		costData: 750,
		costMoney: 10000,
		prereqs: ['clicker2', 'data2'],
		onResearch(game) {
			game.autoClickerTime = 450;
		}
	},
	data3: {
		title: 'Image Analysis',
		description:
			'You\'ve been analyzing the contents of people\'s text posts and status updates for a while now. ' +
			'However, it recently occurred to you that with machine learning, you can now properly analyze the content ' +
			'of pictures posted by your users and collect even more data.',
		costData: 1250,
		costMoney: 7500,
		prereqs: ['data2'],
		onResearch(game) {
			game.dataPerClick = 10;
		}
	},
	money3: {
		title: 'Individual Profile Refinement',
		description:
			'Your advertisers have been loving the user profiles you\'ve built for them, but they want more data. ' +
			'They think the profiles you\'re building aren\'t detailed enough. They want you to incorporate even ' +
			'<em>more</em> data into each profile, but with the incentive of <em>heavy</em> compensation. Are you in?',
		costData: 2000,
		costMoney: 15000,
		prereqs: ['money2'],
		onResearch(game) {
			game.moneyPerGig = 50;
		}
	},
	data4: {
		title: 'Mass Data Collection',
		description:
			'A lot of your users seem to be concentrated in urban areas. What if you were able to generate data ' +
			'based on each city as a whole? You could generate even more data than you are right now.',
		costData: 3000,
		costMoney: 30000,
		prereqs: ['data3'],
		onResearch(game) {
			game.dataPerClick = 20;
		}
	}
};
