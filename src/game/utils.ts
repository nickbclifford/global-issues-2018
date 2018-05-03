const UNIT_NAMES = ['GB', 'TB', 'PB', 'EB', 'ZB'];

export function numberToUnitString(num: number) {
	if (num === 0 || Number.isNaN(num)) {
		return '0 GB';
	}

	const exponent = Math.floor(Math.log10(num));
	const unitIndex = Math.floor(exponent / 3);

	return `${roundToDigits(num / (10 ** (unitIndex * 3)), 2)} ${UNIT_NAMES[unitIndex]}`;
}

export function roundToDigits(num: number, digits: number) {
	const powerOfTen = 10 ** digits;
	return Math.round(num * powerOfTen) / powerOfTen;
}
