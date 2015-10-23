// Semantia Modules
import { default as semantia } from     '../../lib/index';
import { default as number } from       '../number';

semantia.testCase(number.double, {
    arguments: {
        0: {
            type: 'number',
            order: 1,
            signed: true
        }
    },
    calls: 100,
    expected: '2 * {{arguments[ 0 ]}'
});