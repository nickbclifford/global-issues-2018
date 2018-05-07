const UNIT_NAMES = ['GB', 'TB', 'PB', 'EB', 'ZB'];

export function numberToUnitString(num: number) {
	if (num === 0 || Number.isNaN(num)) {
		return '0 GB';
	}

	if (num < 1) {
		return `${roundToDigits(num, 2)} GB`;
	}

	const exponent = Math.floor(Math.log10(num));
	const unitIndex = Math.floor(exponent / 3);

	return `${roundToDigits(num / (10 ** (unitIndex * 3)), 2)} ${UNIT_NAMES[unitIndex]}`;
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
