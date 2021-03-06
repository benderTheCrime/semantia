
// System Modules
import System from 'systemjs';

System.transpiler = 'babel';

let testCases = {};

class Semantia {
    static testCase() {
        const [ fn, obj ] = this._handleTestCaseArguments.apply(this, arguments);

        // Define number of runs against a function
        let callCount = obj.callCount || 1,
            args = this._handleArguments(obj, callCount),
            expected = this._handleExpected(obj);

        // TODO parse function name out of function, pass to warning, use for test case
        testCases[ 1 ] = { fn, obj, callCount, arguments: args, expected };

        // TODO remove this
        this.results(fn);


        // TODO register test case

        // TODO Pull out the function, check to see what calls it makes
        // TODO Otherwise call through
    }
    static run() {
        let results = [];

        for (let key in testCases) {
            let obj = testCases[ key ];
            while (obj.arguments.length) {
                let args = obj.arguments.pop(),
                    value;

                // TODO wrap this in a promise block
                try {

                    // TODO context
                    value = obj.fn.apply(null, args);
                } catch(e) {

                    // TODO handle test error
                    console.log(e);
                }

                results.push(
                    evalFn(obj.obj.arguments, args, obj.expected.type, obj.expected.value, value)
                );

                // TODO build test results
                // TODO validate test, return all test cases, check broken count
            }
            // TODO response
        }
        return results;
    }
    static results(fn) {
        let results = this.run();

        console.log(`
            Test:   ${fn.name}
            Runs:   ${results.length}
            Result: ${!results.some(v => v.finalResult === false) ? 'passed' : 'failed'}
        `);
    }
    static _handleTestCaseArguments() {
        let arr = [],
            fn,
            obj;

        if (
            typeof (fn = arguments[ 0 ]) === 'function' &&
            typeof (obj = arguments[ 1 ]) === 'object'
        ) {
            arr = [ fn, obj ];
        } else if (
            typeof (obj = arguments[ 0 ]) === 'object' &&
            typeof obj.calls === 'function'
        ) {
            fn = obj.calls;

            delete obj.calls;
            arr = [ fn, obj ];
        }

        return arr;
    }
    static _handleArguments(obj, callCount) {
        let args = _objPropertyOrWarn(obj, 'arguments'),
            arr = [];

        if (args) {
            for (let i = 0; i < +callCount; ++i) {
                let callArr = [];

                for (let value of args) {
                    let type = value.type;

                    if (type) {
                        switch (type) {
                            case 'number':
                                callArr.push(_generateNumericArgument({
                                    order: value.order
                                }));
                                break;
                            default:
                                break;
                        }
                    } else {
                        // TODO counter case
                    }


                }
                arr.push(callArr);
            }
        } else {
            // TODO counter case
        }

        return arr;
    }
    static _handleExpected(obj) {
        if (!(typeof obj.expected.type === 'string' && typeof obj.expected.value === 'string')) {
            throw new Error();
        } else {
            return {
                type: obj.expected.type,
                value: obj.expected.value
            };
        }
    }
}

function _generateNumericArguments({ order, callCount }) {

    // Always test zero!!!
    let arr = [];

    while (callCount - 1 > arr.length) {
        arr.push(_generateNumericArgument({ order }));
    }

    return arr;
}

function _generateNumericArgument({ order }) {
    let rnd = Math.random() * order + 1;

    // TODO investigate using global.crypto to generate random numbers. Not
    // using it now because it does not give control over number order
    return Math.floor(rnd);
}

function _objPropertyOrWarn(obj, prop) {
    if (obj.hasOwnProperty(prop)) {
        return obj[ prop ];
    } else {
        console.warn(`Object has no property "${prop}"`);
    }

    return false;
}

// TODO use streams

// TODO the runner by default is spun up by the bin script
class Runner {
    constructor(pattern) {
        let me = this;

        // TODO handles the stream of files
        return new Promise(function(resolve) {
            glob(pattern, (err, files) => resolve(files));
        }).then(function(files) {
            let proms = [];

            for (let file of files) {
                let prom = System.import(file);

                prom.then(f => console.log(f));
                proms.push(prom);
            }

            return Promise.all(proms);
        });
    }
}

function evalFn(argumentsArr, args, type, expression, value) {

    let argString = '',
        result = {};
    for (let i = 0; i < args.length; ++i) {
        let arg = args[ i ];
        argString += `var ${argumentsArr[ i ].name} = ${arg}; `;
    }

    // TODO return expected value && value
    try {
        result.arguments = args;
        result.expectedType = type;
        result.expectedValue = eval(
            `${argString} var semantiaValue = ${expression}; semantiaValue;`
        );
        result.finalResult = eval(`
            ${argString} var semantiaValue = ${expression};
            semantiaValue === ${value} && typeof semantiaValue === '${type}';
        `);
    } catch(e) {}

    return result;
}

export default Semantia;
export { Runner };

// function _generateNumericArguments({ order, signed, callCount }) {
//     if ([ 8, 16, 32 ].indexOf(+order) === -1) {
//         if (order > 32) {
//             order = 32;
//         } else if (order > 16) {
//             order = 16;
//         } else {
//             order = 8;
//         }
//     }
//
//     let arr = global[ `${signed ? 'Int' : 'Uint'}${order}Array` ](callCount);
//
//
//
//
//
//     // TODO investigate using global.crypto to generate random numbers. Not
//     // using it now because it does not give control over number order
//     return global.cry
// }

// TODO work on runner
// TODO dont run tests until they are all registered
// TODO time
// TODO call functions with context
// TODO mocks
// TODO arguments/expected per type
// TODO schemas
// TODO nested test cases
// TODO what happens if call count length does not match expected?
// TODO compound conditions for generating arguments