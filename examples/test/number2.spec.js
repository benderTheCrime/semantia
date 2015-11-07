// Semantia Modules
import { default as semantia } from     '../../lib/index';
import { default as number } from       '../number';

semantia.testCases(number.triple, {
    arguments: [
        {
            name: 'number',
            type: 'number',
            order: 10,
            signed: true
        }
    ],
    callCount: 100,
    expected: {
        type: 'number',
        value: '3 * number'
    }
}, {
    arguments: [
        {
            name: 'number',
            type: 'number',
            order: 10,
            signed: true
        }
    ],
    callCount: 100,
    expected: {
        type: 'number',
        value: '3 * number'
    }
});