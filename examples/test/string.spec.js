// Semantia Modules
import { default as semantia } from     '../../lib/index';
import { default as string } from       '../string';

semantia.testCase(string.upper, {
    arguments: [
        {
            name: 'string',
            type: 'string',
            mustHave: ':',
            includes: 'abcde',
            length: 20
        }
    ],
    callCount: 100,
    expected: {
        type: 'string',
        value: 'string.toUpperCase()'
    }
}).testCase(string.lower, {
    arguments: [
        {
            value: 'test'
        }
    ],
    callCount: 3000,
    expected: {
        value: 'test'
    }
});