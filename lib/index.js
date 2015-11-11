
// System Modules
// import System from 'systemjs';

// System.transpiler = 'babel';

const ASCII = 'abcdefghijklmnopqrstvwxyz_$%#&!@:? '.split('');
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

        // TODO Pull out the function, check to see what calls it makes
        // TODO Otherwise call through

        return this;
    }

    static testCases(fn, ...args) {
        for (let arg of args) {
            this.testCase(fn, arg);
        }

        return this;
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
        let args = objPropertyOrWarn(obj, 'arguments'),
            arr = [];

        if (args) {
            for (let i = 0; i < +callCount; ++i) {
                let callArr = [];

                for (let value of args) {
                    let type = value.type,
                        val = value.value || value.val;

                    if (val) {
                        callArr.push(
                            `${value.type === 'string' ? `"${val}"` : val}`
                        );
                    } else if (type) {
                        switch (type) {
                            case 'number':
                                callArr.push(generateNumericArgument({
                                    order: value.order
                                }));
                                break;
                            case 'string':
                                callArr.push(`"${generateStringArgument({
                                    mustHave: value.mustHave,
                                    length: value.length,
                                    include: value.include
                                })}"`);
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
        if (!obj.expected.hasOwnProperty('value')) {
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

        this.exposeResults();
    }
    run(obj) {
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
        }

        // TODO response
        return Promise.all(proms);
    }
    result(obj) {
        return this.run(obj).then(function(value) {
            return value;
        });
    }
    results() {
        let proms = [];

        for (let key in testCases) {
            for (let testCase of testCases[ key ]) {
                let prom = this.result(testCase).then(function(result) {
                    console.log(`Ran test case for ${testCase.fn.name}`);

                    return result;
                });

                proms.push(prom);


            }
        }

        return Promise.all(proms).then(function(results) {
            let testResults = {
                counts: {
                    pass: 0,
                    fail: 0,
                    skipped: 0,
                    total: 0
                }
            };

            for (let result of results) {
                for (let runResult of result) {
                    testResults.counts[
                        `${
                            !result.some(
                                v => v.finalResult === false
                            ).length ? 'pass' : 'fail'
                        }`
                    ] += 1;
                    testResults.counts.total += 1;
                }
            }

            return testResults;
        }).catch(function(e) {
            console.log(e);
        })
    }
    exposeResults() {
        let startTime = +new Date();

        return this.results().then(function(results) {
            let endTime = +new Date(),
                elapsed = (endTime - startTime);

            console.log(
                `Ran ${
                    results.counts.total
                } tests in ${
                    elapsed > 100 ? `${elapsed / 1000}` : `${elapsed}m`
                }s (${
                    Object.keys(testCases).length
                } individual tests):
                    Passed:     ${results.counts.pass}
                    Failed:     ${results.counts.fail}
                    Skipped:    0
                `
            );
        });
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
    const CHAR_POOL = includes ? includes : ASCII;
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
            preStr = CHAR_POOL[
                generateNumericArgument({ order: CHAR_POOL.length })
            ];
            i++;
        }

        i = 0;

        while (i < postLength) {
            postStr = CHAR_POOL[
                generateNumericArgument({ order: CHAR_POOL.length })
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

    if (
        (type === 'string' || typeof value === 'string') &&
        value.charAt(0) !== '"' &&
        value.slice(-1)[ 0 ] !== '\''
    ) {
        value = `"${value}"`;
    }

    try {
        result.arguments = args;
        result.expectedType = type;
        result.expectedValue = eval(`
            ${argString}
            var semantiaValue;
            try {
                semantiaValue = ${expression};
            } catch(e) {
                semantiaValue = "${expression}";
            }
            semantiaValue;
        `);
        result.finalResult = eval(`
            ${argString}
            var semantiaValue;
            try {
                semantiaValue = ${expression};
            } catch(e) {
                semantiaValue = "${expression}";
            }
            semantiaValue === ${value} && (
                !${type} || typeof semantiaValue === '${type}'
            );
        `);
    } catch(e) {
        result.finalResult = false;
    }

    return result;
}

export default Semantia;
export { Runner };

// TODO institute max and min in numbers

// TODO better error handling

// TODO individual test outputs

// TODO object manipulation // TODO schemas

// TODO mocks
// TODO hookup yargs
    // help

// TODO arguments/expected per type
// TODO signed integers
// TODO logic to skip

// TODO what happens if call count length does not match expected?
// TODO compound conditions for generating arguments