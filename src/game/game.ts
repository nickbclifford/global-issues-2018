// imports types for $ and Bootstrap plugins
/// <reference types="jquery" />
/// <reference types="bootstrap" />

import { allEvents } from './event';
import { availableResearch } from './research';
import { numberToUnitString, padToTwoDigits, roundToDigits } from './utils';

export class Game {

	private $researchItems = $('#research-items');
	researchedIds: string[] = [];
	private $eventLog = $('#event-log');
	triggeredEvents: string[] = [];

	private _gigsData = 0;
	private $gigsData = $('#data span');
	private _money = 0;
	private $money = $('#money span');

	private _dataPerClick = 1;
	private $dataPerClick = $('#data-per-click span');
	private _moneyPerGig = 5;
	private $moneyPerGig = $('#money-per-gig span');

	private _autoClickerTime = 0;
	private $dataPerSec = $('#data-per-sec span');
	private intervalId?: number;

	constructor() {
		// event triggering loop
		setInterval(() => {
			// 50% chance of event happening every 20 seconds
			if (Math.random() > 0.5) {
				return;
			}

			// get all events that meet their preconditions
			const allowedEvents = Object.keys(allEvents).filter(k => allEvents[k].precondition(this));

			// randomly select and trigger an event
			const selected = allowedEvents[Math.floor(Math.random() * allowedEvents.length)];

			if (typeof selected === 'undefined' || this.triggeredEvents.indexOf(selected) > -1) {
				return;
			}

			const event = allEvents[selected];

			event.trigger(this);

			if (this.triggeredEvents.length < 1) {
				this.$eventLog.children('#no-events').hide();
			}

			this.triggeredEvents.push(selected);

			const now = new Date();
			const hours = now.getHours();
			const mins = now.getMinutes();
			const secs = now.getSeconds();
			this.$eventLog.append(`
				<div class="event" id="${selected}">
					<h4>${padToTwoDigits(hours)}:${padToTwoDigits(mins)}:${padToTwoDigits(secs)} - ${event.title}</h4>
					<p>${event.description}</p>
				</div>
			`);
		}, 20 * 1000);

		// bind buttons to actions
		const $dataBtn = $('#collect-data');
		$dataBtn.on('click', () => this.click());

		const $sellBtn = $('#sell-data');
		$sellBtn
			.on('click', () => this.sellPercentData(100))
			.tooltip({
				container: 'body',
				title: () => {
					const { profit } = this.percentDataInfo(100);
					return '$' + roundToDigits(profit, 2);
				}
			});

		const $sellHalfBtn = $('#sell-half-data');
		$sellHalfBtn
			.on('click', () => this.sellPercentData(50))
			.tooltip({
				container: 'body',
				title: () => {
					const { profit } = this.percentDataInfo(50);
					return '$' + roundToDigits(profit, 2);
				}
			});

		// draw available research
		for (const researchId of Object.keys(availableResearch)) {
			const item = availableResearch[researchId];
			this.$researchItems.append(`
				<div class="research-item" id="${researchId}">
					<h3>${item.title}</h3>
					<p>${item.description}</p>
					<h5><strong>Data Consumed: </strong>${numberToUnitString(item.costData)}</h5>
					<h5><strong>Money Used: </strong>$${roundToDigits(item.costMoney, 2)}</h5>
				</div>
			`);
		}

		this.checkClickHandlers();
	}

	// accessors

	get gigsData() {
		return this._gigsData;
	}

	set gigsData(value: number) {
		this._gigsData = value;

		this.$gigsData.text(numberToUnitString(value));
		this.checkClickHandlers();
	}

	get money() {
		return this._money;
	}

	set money(value: number) {
		this._money = value;

		this.$money.text(roundToDigits(value, 2));
		this.checkClickHandlers();
	}

	get dataPerClick() {
		return this._dataPerClick;
	}

	set dataPerClick(value: number) {
		this._dataPerClick = value;

		this.$dataPerClick.text(numberToUnitString(value));
	}

	get moneyPerGig() {
		return this._moneyPerGig;
	}

	set moneyPerGig(value: number) {
		this._moneyPerGig = value;

		this.$moneyPerGig.text(roundToDigits(value, 2));
	}

	// core mechanics

	click() {
		this.gigsData += this.dataPerClick;
	}

	percentDataInfo(percent: number) {
		const amount = this.gigsData * (percent / 100);

		return {
			amount,
			profit: this.moneyPerGig * amount
		};
	}

	sellPercentData(percent: number) {
		if (this.gigsData === 0) {
			return;
		}

		const { amount, profit } = this.percentDataInfo(percent);

		this.money += profit;
		this.gigsData -= amount;
	}

	// auto clicker stuff

	get autoClickerTime() {
		return this._autoClickerTime;
	}

	set autoClickerTime(value: number) {
		this._autoClickerTime = value;

		clearInterval(this.intervalId);

		if (value === 0) {
			this.$dataPerSec.text('0 GB');
			return;
		}

		this.$dataPerSec.text(numberToUnitString(this.dataPerClick / (value / 1000)));
		this.intervalId = setInterval(() => this.click(), value);
	}

	// research

	researchItem(id: string) {
		if (this.researchedIds.indexOf(id) > -1) {
			throw new Error('Item already researched!');
		}

		const item = availableResearch[id];

		if (item.prereqs && item.prereqs!.every(p => this.researchedIds.indexOf(p) <= -1)) {
			throw new Error('Missing prerequisite to research!');
		}

		if (item.costData > this.gigsData) {
			throw new Error('Insufficient data!');
		}
		if (item.costMoney > this.money) {
			throw new Error('Insufficient funds!');
		}

		this.gigsData -= item.costData;
		this.money -= item.costMoney;

		item.onResearch(this);

		this.researchedIds.push(id);
	}

	private checkClickHandlers() {
		for (const itemEl of this.$researchItems.children().toArray()) {
			const $item = $(itemEl);
			const researchId = $item.attr('id')!;
			const itemObj = availableResearch[researchId];

			if (itemObj.costData > this.gigsData ||
				itemObj.costMoney > this.money ||
				(itemObj.prereqs && itemObj.prereqs!.every(p => this.researchedIds.indexOf(p) <= -1))) {
				$item.off('click').on('click', () => {
					$item
						.animate({ backgroundColor: '#d98c8c' }, 150)
						.animate({ backgroundColor: 'transparent' });
				});
			} else {
				$item.off('click').on('click', () => {
					this.researchItem(researchId);
					$item.fadeOut();
				});
			}
		}
	}

}
