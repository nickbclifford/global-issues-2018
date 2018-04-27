const UNIT_NAMES = ['GB', 'TB', 'PB', 'EB', 'ZB'];

export function numberToUnitString(num: number) {
	if (num === 0) {
		return '0 GB';
	}

	const exponent = Math.floor(Math.log10(num));
	const unitIndex = Math.floor(exponent / 3);

	return `${(num / (10 ** (unitIndex * 3))).toFixed(2)} ${UNIT_NAMES[unitIndex]}`;
}
