import { availableResearch } from './research';

export class Game {

	gigsData = 0;
	money = 0;

	dataPerClick = 0;
	moneyPerGig = 0;

	researchedIds: string[] = [];

	// TODO: the rest lol

	researchItem(id: string) {
		const item = availableResearch[id];

		this.gigsData -= item.costData;
		this.money -= item.costMoney;

		item.onResearch(this);
	}

}
