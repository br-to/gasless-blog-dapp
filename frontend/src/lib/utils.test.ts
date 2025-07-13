import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('utils', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      expect(cn('px-2 py-1', 'px-3')).toBe('py-1 px-3');
    });

    it('handles conditional classes', () => {
      expect(cn('base-class', true && 'conditional-class')).toBe(
        'base-class conditional-class'
      );
      expect(cn('base-class', false && 'conditional-class')).toBe('base-class');
    });

    it('handles empty inputs', () => {
      expect(cn()).toBe('');
      expect(cn('', undefined, null)).toBe('');
    });

    it('handles objects', () => {
      expect(
        cn({
          'class-1': true,
          'class-2': false,
          'class-3': true,
        })
      ).toBe('class-1 class-3');
    });

    it('handles arrays', () => {
      expect(cn(['class-1', 'class-2'])).toBe('class-1 class-2');
    });

    it('deduplicates and merges tailwind classes', () => {
      expect(cn('p-4 p-2')).toBe('p-2');
      expect(cn('text-red-500 text-blue-500')).toBe('text-blue-500');
    });
  });
});
