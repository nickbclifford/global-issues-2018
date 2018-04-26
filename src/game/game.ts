import { availableResearch } from './research';

export class Game {

	gigsData = 0;
	money = 0;

	dataPerClick = 1;
	moneyPerGig = 5;

	private intervalId?: number;

	researchedIds: string[] = [];

	// TODO: the rest lol

	// core mechanics

	click() {
		this.gigsData += this.dataPerClick;
	}

	sellAllData() {
		this.money += this.moneyPerGig * this.gigsData;
		this.gigsData = 0;
	}

	// auto clicker stuff

	set autoClickerTime(value: number) {
		clearInterval(this.intervalId);
		console.log(value); // tslint:disable-line
		this.intervalId = setInterval(() => this.click(), value);
	}

	// research

	researchItem(id: string) {
		if (this.researchedIds.indexOf(id) > -1) {
			throw new Error('Item already researched!');
		}

		const item = availableResearch[id];

		this.spendData(item.costData);
		this.spendMoney(item.costMoney);

		item.onResearch(this);

		this.researchedIds.push(id);
	}

	// spending checkers

	private spendData(cost: number) {
		if (cost > this.gigsData) {
			throw new Error('Insufficient data!');
		}

		this.gigsData -= cost;
	}

	private spendMoney(cost: number) {
		if (cost > this.money) {
			throw new Error('Insufficient funds!');
		}

		this.money -= cost;
	}

}
