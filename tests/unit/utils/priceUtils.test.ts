import { describe, it, expect } from '@jest/globals';
import { parseCurrency } from '../../../src/utils/priceUtils';

describe('parseCurrency', () => {
  it('should parse Brazilian currency format correctly', () => {
    expect(parseCurrency('1.000,50')).toBe(1000.50);
    expect(parseCurrency('100,50')).toBe(100.50);
    expect(parseCurrency('10,00')).toBe(10);
  });

  it('should handle numbers directly', () => {
    expect(parseCurrency(100)).toBe(100);
    expect(parseCurrency(100.50)).toBe(100.50);
  });

  it('should handle null and undefined', () => {
    expect(parseCurrency(null)).toBe(0);
    expect(parseCurrency(undefined)).toBe(0);
  });

  it('should handle empty string', () => {
    expect(parseCurrency('')).toBe(0);
  });

  it('should handle invalid formats by returning 0', () => {
    expect(parseCurrency('invalid')).toBe(0);
    expect(parseCurrency('abc')).toBe(0);
  });

  it('should handle numbers without decimal separator', () => {
    expect(parseCurrency('1000')).toBe(1000);
  });

  it('should handle numbers with only decimal part', () => {
    expect(parseCurrency(',50')).toBe(0.50);
  });
});
