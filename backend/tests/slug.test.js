import { describe, it, expect } from 'vitest';
import { generateSlug } from '../utils/slug.js';

describe('slug utility', () => {
    it('converts title to lowercase hyphenated slug', () => {
        expect(generateSlug('Hello World')).toBe('hello-world');
    });

    it('removes special characters', () => {
        expect(generateSlug('React & Node.js: A Guide!')).toBe('react-nodejs-a-guide');
    });

    it('trims whitespace and collapses multiple hyphens', () => {
        expect(generateSlug('  Multiple   Spaces  ')).toBe('multiple-spaces');
    });
});
