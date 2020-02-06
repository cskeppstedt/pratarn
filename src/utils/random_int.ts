export type IRandomInt = (maxInclusive: number) => number;

const randomInt: IRandomInt = (maxInclusive: number) => Math.floor(Math.random() * (maxInclusive + 1));

export default randomInt;
