// imports types for $
/// <reference types="jquery" />

import { allEvents } from './event';
import { availableResearch } from './research';
import { numberToUnitString } from './utils';

export class Game {

	researchedIds: string[] = [];
	triggeredEvents: string[] = [];

	private _gigsData = 0;
	private _money = 0;

	private _dataPerClick = 1;
	private _moneyPerGig = 5;

	private intervalId?: number;

	constructor() {
		// Event triggering loop
		setInterval(() => {
			// Get all events that meet their preconditions
			const allowedEvents = Object.keys(allEvents).filter(k => allEvents[k].precondition(this));

			// Randomly select and trigger an event
			const selected = allowedEvents[Math.floor(Math.random() * allowedEvents.length)];

			if (typeof selected !== 'string' || this.triggeredEvents.indexOf(selected) > -1) {
				return;
				// throw new Error('Event already triggered!');
			}

			allEvents[selected].trigger(this);
			this.triggeredEvents.push(selected);
		}, 20 * 1000);
	}

	// accessors

	get gigsData() {
		return this._gigsData;
	}

	set gigsData(value: number) {
		this._gigsData = value;

		$('#data span').text(numberToUnitString(value));
	}

	get money() {
		return this._money;
	}

	set money(value: number) {
		this._money = value;

		$('#money span').text(value.toFixed(2));
	}

	get dataPerClick() {
		return this._dataPerClick;
	}

	set dataPerClick(value: number) {
		this._dataPerClick = value;

		$('#data-per-click span').text(numberToUnitString(value));
	}

	get moneyPerGig() {
		return this._moneyPerGig;
	}

	set moneyPerGig(value: number) {
		this._moneyPerGig = value;

		$('#money-per-gig span').text(value.toFixed(2));
	}

	// core mechanics

	click() {
		this.gigsData += this.dataPerClick;
	}

	sellAllData() {
		if (this.gigsData === 0) {
			return;
		}

		this.money += this.moneyPerGig * this.gigsData;
		this.gigsData = 0;
	}

	// auto clicker stuff

	set autoClickerTime(value: number) {
		clearInterval(this.intervalId);
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
