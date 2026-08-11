import { describe, it, expect } from '@jest/globals';
import { formatCurrency } from '../../../src/utils/formatCurrency';

describe('formatCurrency', () => {
  it('should format valid numbers correctly', () => {
    expect(formatCurrency(100)).toMatch(/R\$\s*100,00/);
    expect(formatCurrency(1000.5)).toMatch(/R\$\s*1\.000,50/);
    expect(formatCurrency(9999.99)).toMatch(/R\$\s*9\.999,99/);
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toMatch(/R\$\s*0,00/);
  });

  it('should handle undefined', () => {
    expect(formatCurrency(undefined)).toMatch(/R\$\s*0,00/);
  });

  it('should handle NaN', () => {
    expect(formatCurrency(NaN)).toMatch(/R\$\s*0,00/);
  });

  it('should handle negative numbers', () => {
    expect(formatCurrency(-100)).toMatch(/-?R\$\s*100,00/);
  });

  it('should handle decimal numbers correctly', () => {
    expect(formatCurrency(10.5)).toMatch(/R\$\s*10,50/);
    expect(formatCurrency(0.01)).toMatch(/R\$\s*0,01/);
  });
});
