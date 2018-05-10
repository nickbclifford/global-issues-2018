// imports types for $ and Bootstrap plugins
/// <reference types="jquery" />
/// <reference types="bootstrap" />

import { allEvents } from './event';
import { availableResearch } from './research';
import {
	arrayIncludes,
	numberToUnits,
	numToUnitString,
	padToTwoDigits,
	roundToDigits,
	ValueWithUnit
} from './utils';

type $Stat = Record<'value' | 'unit', JQuery>;
type BigNumberStats = 'data' | 'money' | 'data-per-click' | 'data-per-sec' | 'money-per-gig';

export class Game {

	private $researchItems = $('#research-items');
	researchedIds: string[] = [];
	private $eventLog = $('#event-log');
	triggeredEvents: string[] = [];

	private $bigNumberStats!: Record<BigNumberStats, $Stat>;

	private _data = 0;
	private _money = 0;
	private _dataPerClick = 1;
	private _moneyPerGig = 5;
	private _autoClickerTime = 0;

	private intervalId?: number;

	constructor() {
		const builtStats = {} as any;
		for (const id of ['data', 'money', 'data-per-click', 'data-per-sec', 'money-per-gig']) {
			builtStats[id] = {
				value: $(`#${id} span.value`),
				unit: $(`#${id} span.unit`)
			};
		}

		this.$bigNumberStats = builtStats;

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

			if (typeof selected === 'undefined' || arrayIncludes(this.triggeredEvents, selected)) {
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
		$dataBtn
			.on('click', () => this.click())
			.on('keypress', e => {
				if (e.keyCode === 13) {
					e.preventDefault();
				}
			});

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
			const $item = $(`
				<div class="research-item" id="${researchId}">
					<h3>${item.title}</h3>
					<p>${item.description}</p>
					<h5><strong>Data Consumed: </strong>${numToUnitString(item.costData)}</h5>
					<h5><strong>Money Used: </strong>$${roundToDigits(item.costMoney, 2)}</h5>
				</div>
			`);

			if (item.prereqs) {
				$item.append(`
					<h5><strong>Prerequisite Research: </strong>${item.prereqs.map(i => availableResearch[i].title).join(', ')}</h5>
				`);
			}

			this.$researchItems.append($item);
		}

		this.checkClickHandlers();
	}

	// accessors

	get data() {
		return this._data;
	}

	set data(value: number) {
		this._data = value;

		this.updateBigNumberStat('data', numberToUnits(value));
		this.checkClickHandlers();
	}

	get money() {
		return this._money;
	}

	set money(value: number) {
		this._money = value;

		if (value >= 250_000) {
			window.location.href = window.location.origin + '/success';
		}

		this.updateBigNumberStat('money', { value, unit: '$' });
		this.checkClickHandlers();
	}

	get dataPerClick() {
		return this._dataPerClick;
	}

	set dataPerClick(value: number) {
		this._dataPerClick = value;

		this.updateBigNumberStat('data-per-click', numberToUnits(value));
	}

	get moneyPerGig() {
		return this._moneyPerGig;
	}

	set moneyPerGig(value: number) {
		this._moneyPerGig = value;

		this.updateBigNumberStat('money-per-gig', { value, unit: '$' });
	}

	// core mechanics

	click() {
		this.data += this.dataPerClick;
	}

	private percentDataInfo(percent: number) {
		const amount = this.data * (percent / 100);

		return {
			amount,
			profit: this.moneyPerGig * amount
		};
	}

	sellPercentData(percent: number) {
		if (this.data === 0) {
			return;
		}

		const { amount, profit } = this.percentDataInfo(percent);

		this.money += profit;
		this.data -= amount;
	}

	// auto clicker stuff

	get autoClickerTime() {
		return this._autoClickerTime;
	}

	set autoClickerTime(value: number) {
		this._autoClickerTime = value;

		clearInterval(this.intervalId);

		if (value === 0) {
			this.updateBigNumberStat('data-per-sec', { value: 0, unit: 'GB' });
			return;
		}

		this.updateBigNumberStat('data-per-sec', numberToUnits(this.dataPerClick / (value / 1000)));
		this.intervalId = setInterval(() => this.click(), value);
	}

	// research

	researchItem(id: string) {
		if (arrayIncludes(this.researchedIds, id)) {
			throw new Error('Item already researched!');
		}

		const item = availableResearch[id];

		if (item.prereqs && !item.prereqs!.every(p => arrayIncludes(this.researchedIds, p))) {
			throw new Error('Missing prerequisite to research!');
		}

		if (item.costData > this.data) {
			throw new Error('Insufficient data!');
		}
		if (item.costMoney > this.money) {
			throw new Error('Insufficient funds!');
		}

		this.data -= item.costData;
		this.money -= item.costMoney;

		item.onResearch(this);

		this.researchedIds.push(id);

		if (this.researchedIds.length === Object.keys(availableResearch).length) {
			$('#research').append(`
				<p>No research remaining!</p>
			`);
		}
	}

	private checkClickHandlers() {
		for (const itemEl of this.$researchItems.children().toArray()) {
			const $item = $(itemEl);
			const researchId = $item.attr('id')!;
			const itemObj = availableResearch[researchId];

			if (itemObj.costData > this.data ||
				itemObj.costMoney > this.money ||
				(itemObj.prereqs && !itemObj.prereqs!.every(p => arrayIncludes(this.researchedIds, p)))) {
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

	private updateBigNumberStat(stat: BigNumberStats, { value, unit }: ValueWithUnit) {
		const $stat = this.$bigNumberStats[stat];

		$stat.value.text(value);
		$stat.unit.text(unit);
	}

}
