

let testCases = {};

class Semantia {
    static testCase() {
        const [ fn, obj ] = this._handleTestCaseArguments.call(this, arguments);
        let args = this._handleArguments(obj),
            expected,

            // Define number of runs against a function
            callCount = obj.calls || obj.callCount || 1;

        // TODO parse function name out of function, pass to warning, use for test case
        testCases[ 1 ] = { fn, obj, callCount, args, expected };

        console.log('IN');

        // TODO remove this
        this.run();


        // TODO register test case

        // TODO Pull out the function, check to see what calls it makes
        // TODO Otherwise call through
    }
    static run() {
        for (let key in testCases) {
            let obj = testCases[ key ];
            while (args.length) {
                let value;

                try {

                    // TODO context
                    value = obj.fn.call(null, args.shift());
                } catch(e) {
                    // TODO handle test error
                }

                // TODO validate test, return all test cases, check broken count
                console.log('CALLED');
            }
            // TODO response
        }

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
        let args = this._objPropertyOrWarn(obj.arguments),
            arr = [];

        if (args) {
            let callArr = [];

            for (let key in args) {
                let value = args[ key ],
                    type;

                if (type = value.type) {
                    switch (type) {
                        case 'number':
                            callArr = this._generateNumericArguments({
                                order: value.order,
                                callCount
                            });
                            break;
                        default:
                            break;
                    }
                } else {
                    // TODO counter case
                }

                arr.push(callArr);
            }
        } else {
            // TODO counter case
        }

        return arr;
    }
}

function _generateNumericArguments({ order, callCount }) {
    let arr = [ 0 ];

    // Always test zero!!!

    while (callCount - 1 > arr.length) {
        let arg = _generateNumericArgument({ order });

        arr.push(arg);
    }

    return arr;
}

function _generateNumericArgument({ order }) {

    // TODO investigate using global.crypto to generate random numbers. Not
    // using it now because it does not give control over number order
    return Math.ceil(Math.random() * order);
}

function _objPropertyOrWarn(obj, prop) {
    if (obj.hasOwnProperty(prop)) {
        return prop;
    } else {
        console.warn(`Object has no property "${prop}"`);
    }

    return false;
}

class Runner {}

export default Semantia;

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

// TODO dont run tests until they are all registered
// TODO call functions with context
// TODO mocks
// TODO arguments/expected per type
// TODO schemas
// TODO nested test cases
// TODO what happens if call count length does not match expected?