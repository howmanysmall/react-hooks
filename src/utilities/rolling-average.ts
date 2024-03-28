//!native
//!nonstrict
//!optimize 2

const maxSamples = 60;
export interface RollingAverageSamples extends Array<number> {
	index?: number;
}

export function getSamples(): RollingAverageSamples {
	return new Array(maxSamples) as RollingAverageSamples;
}

export function addSample(samples: RollingAverageSamples, value: number) {
	const index = samples.index;
	samples[index ?? 0] = value;
	samples.index = index === undefined ? 1 : (index + 1) % maxSamples;
}

export function getAverage(samples: RollingAverageSamples) {
	const length = samples.size();
	let sum = 0;
	for (const index of $range(0, length - 1)) sum += samples[index];
	return sum / length;
}
