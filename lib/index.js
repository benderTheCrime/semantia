
// System Modules
// import System from 'systemjs';

// System.transpiler = 'babel';

CONST ASCII = 'abcdefghijklmnopqrstvwxyz_$%#&!@? '.split('');
let testCases = {};

class Semantia {
    static testCase() {
        const [ fn, obj ] = this._handleTestCaseArguments.apply(this, arguments);

        // Define number of runs against a function
        let callCount = obj.callCount || 1,
            args = this._handleArguments(obj, callCount),
            expected = this._handleExpected(obj),
            testCase = { fn, obj, callCount, arguments: args, expected };

        // TODO parse function name out of function, pass to warning, use for test case
        let key = `${fn.name}|${fn.prototype.constructor.name}`;
        if (!testCases.hasOwnProperty(key)) {
            testCases[ key ] = [ testCase ];
        } else {
            testCases[ key ].push(testCase);
        }


        // TODO remove this
        // this.results(fn);

        // TODO register test case

        // TODO Pull out the function, check to see what calls it makes
        // TODO Otherwise call through
    }

    static testCases(fn, ...args) {
        for (let arg of args) {
            this.testCase(fn, arg);
        }
    }

    static run(obj) {
        let proms = [];

        while (obj.arguments.length) {
            let args = obj.arguments.pop(),
                prom = new Promise(function(resolve) {
                    const value = obj.fn.apply(obj.fn, args);

                    resolve(value);
                }).then(function(value) {
                    return evalFn(
                        obj.obj.arguments,
                        args,
                        obj.expected.type,
                        obj.expected.value,
                        value
                    );
                }).catch(console.log);

            proms.push(prom);

            // TODO build test results
            // TODO validate test, return all test cases, check broken count
        }

        // TODO response
        return Promise.all(proms);
    }
    static result(obj) {
        return this.run(obj).then(function(value) {
            return value;
        });

        // console.log(`
        //     Test:   ${fn.name}
        //     Runs:   ${results.length}
        //     Result: ${!results.some(v => v.finalResult === false) ? 'passed' : 'failed'}
        // `);

    }
    static results() {
        let proms = [];

        for (let key in testCases) {
            for (let testCase of testCases[ key ]) {
                let prom = this.result(testCase).then(function() {
                    console.log(`Ran testCase for ${testCase.fn.name}`);
                });

                proms.push(prom);


            }
        }

        return Promise.all(proms).then(function() {

            // TODO accumulated run count
            // TODO all pass fail count
            let results = {
                counts: {
                    pass: 0,
                    fail: 0,
                    skipped: 0
                }
            };

            return results;
        });
    }
    static exposeResults() {
        let startTime = +new Date();

        return this.results().then(function(results) {
            let endTime = +new Date(),
                elapsed = (endTime - startTime);

            // TODO show accumulated run count
            // TODO show all pass fail count
            console.log(
                'ELAPSED', `ran ${
                    results.length
                } tests in ${
                    elapsed > 100 ? `${elapsed / 1000}` : `${elapsed}m`
                }s`
            );
        });
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
            typeof (obj = arguments[ 0 ]) === 'object'
        ) {
            throw new SyntaxError('First "testCase" argument must be a function');
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
                                callArr.push(generateNumericArgument({
                                    order: value.order
                                }));
                                break;
                            case 'string':
                                callArr.push(generateStringArgument());
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
        if (
            !(
                typeof obj.expected.type === 'string' &&
                typeof obj.expected.value === 'string'
            )
        ) {
            throw new Error();
        } else {
            return {
                type: obj.expected.type,
                value: obj.expected.value
            };
        }
    }
}

// TODO the runner by default is spun up by the bin script
class Runner {
    constructor(files) {
        const CWD = process.cwd();

        for (let file of files) {
            require(`${CWD}/${file}`);
        }

        Semantia.exposeResults();
    }
}

function generateNumericArguments({ order, callCount }) {

    // Always test zero!!!
    let arr = [];

    while (callCount - 1 > arr.length) {
        arr.push(generateNumericArgument({ order }));
    }

    return arr;
}

function generateNumericArgument({ order }) {
    let rnd = Math.random() * order + 1;

    // TODO investigate using global.crypto to generate random numbers. Not
    // using it now because it does not give control over number order
    return Math.floor(rnd);
}

function generateStringArgument({ mustHave, includes, length }) {
    // TODO "must have"
    // TODO length
    // TODO inclusion characters, use generate numeric

    let str = '',
        preStr = '',
        postStr = '',
        remainingLength = length;

    if (mustHave) {
        let mustHaveStr = mustHave.toString();

        str += mustHaveStr;
        remainingLength -= mustHaveStr.length;
    }

    if (remainingLength) {
        let preLength = 0,
            postLength = 0,
            i = 0,
            halfRemainingLength;

        if (remainingLength % 2 === 0) {
            preLength += 1;
            remainingLength -= 1;
            halfRemainingLength = remainingLength / 2;
        }

        if (halfRemainingLength) {
            postLength = preLength += halfRemainingLength;
        }
        while (i < preLength) {
            preStr = ASCII [
                generateNumericArgument({ order: ASCII.length })
            ];
            i++;
        }

        i = 0;

        while (i < postLength) {
            postStr = ASCII [
                generateNumericArgument({ order: ASCII.length })
            ];
        }
    }

    return `${preStr}${str}${postStr}`;
}

function objPropertyOrWarn(obj, prop) {
    if (obj.hasOwnProperty(prop)) {
        return obj[ prop ];
    } else {
        console.warn(`Object has no property "${prop}"`);
    }

    return false;
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

// TODO string manipulation
// TODO specify values explicitly
// TODO object manipulation // TODO schemas

// TODO better error handling
// TODO fix counts

// TODO mocks
// TODO hookup yargs

// TODO arguments/expected per type

// TODO what happens if call count length does not match expected?
// TODO compound conditions for generating arguments