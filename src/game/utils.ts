const UNIT_NAMES = ['GB', 'TB', 'PB', 'EB', 'ZB'];

export interface ValueWithUnit {
	value: number;
	unit: string;
}

export function numberToUnits(num: number): ValueWithUnit {
	if (num === 0 || Number.isNaN(num)) {
		return { value: 0, unit: 'GB' };
	}

	if (num < 1) {
		return { value: roundToDigits(num, 2), unit: 'GB' };
	}

	const exponent = Math.floor(Math.log10(num));
	const unitIndex = Math.floor(exponent / 3);

	return {
		value: roundToDigits(num / (10 ** (unitIndex * 3)), 2),
		unit: UNIT_NAMES[unitIndex]
	};
}

export function numToUnitString(num: number) {
	const { value, unit } = numberToUnits(num);
	return `${value} ${unit}`;
}

export function roundToDigits(num: number, digits: number) {
	const powerOfTen = 10 ** digits;
	return Math.round(num * powerOfTen) / powerOfTen;
}

export function isInRange(num: number, lower: number, upper: number) {
	return num <= upper && num >= lower;
}

export function padToTwoDigits(num: number) {
	return num < 10 ? '0' + num : num.toString();
}

export function arrayIncludes<T>(arr: T[], elem: T) {
	return arr.indexOf(elem) !== -1;
}
