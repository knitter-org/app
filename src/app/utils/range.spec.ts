import { rangeInclusive } from './range';

describe('range', () => {
  it('should return an array with the range number values', () => {
    expect(rangeInclusive(0, 3)).toEqual([0, 1, 2]);
  });
  it('should return an empty array on equal numbers', () => {
    expect(rangeInclusive(3, 3)).toEqual([]);
  });
});
