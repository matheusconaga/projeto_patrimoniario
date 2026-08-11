import { describe, it, expect } from '@jest/globals';
import { formatarData, formatISODateForInput } from '../../../src/utils/dataUtils';

describe('formatarData', () => {
  it('should format ISO date strings correctly', () => {
    expect(formatarData('2024-01-15T10:30:00.000Z')).toMatch(/\d{2}\/\d{2}\/\d{4} - \d{2}:\d{2}:\d{2}/);
  });

  it('should format Date objects correctly', () => {
    const date = new Date('2024-01-15T10:30:00.000Z');
    expect(formatarData(date)).toMatch(/\d{2}\/\d{2}\/\d{4} - \d{2}:\d{2}:\d{2}/);
  });

  it('should format Firestore timestamps correctly', () => {
    const timestamp = { seconds: 1705319400, nanoseconds: 0 };
    expect(formatarData(timestamp)).toMatch(/\d{2}\/\d{2}\/\d{4} - \d{2}:\d{2}:\d{2}/);
  });

  it('should return "-" for undefined', () => {
    expect(formatarData(undefined)).toBe('-');
  });

  it('should return "-" for invalid dates', () => {
    expect(formatarData('invalid-date')).toBe('-');
  });

  it('should return "-" for empty string', () => {
    expect(formatarData('')).toBe('-');
  });
});

describe('formatISODateForInput', () => {
  it('should format ISO string for datetime-local input', () => {
    expect(formatISODateForInput('2024-01-15T10:30:00.000Z')).toBe('2024-01-15T07:30');
  });

  it('should handle empty string', () => {
    expect(formatISODateForInput('')).toBe('');
  });

  it('should return empty string for invalid date', () => {
    expect(formatISODateForInput('invalid-date')).toBe('');
  });

  it('should handle different date formats', () => {
    expect(formatISODateForInput('2024-12-31T23:59:59.000Z')).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/);
  });
});
