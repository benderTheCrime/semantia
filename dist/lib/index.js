
// System Modules
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _systemjs = require('systemjs');

var _systemjs2 = _interopRequireDefault(_systemjs);

_systemjs2['default'].transpiler = 'babel';

var testCases = {};

var Semantia = (function () {
    function Semantia() {
        _classCallCheck(this, Semantia);
    }

    _createClass(Semantia, null, [{
        key: 'testCase',
        value: function testCase() {
            var _handleTestCaseArguments$apply = this._handleTestCaseArguments.apply(this, arguments);

            var _handleTestCaseArguments$apply2 = _slicedToArray(_handleTestCaseArguments$apply, 2);

            var fn = _handleTestCaseArguments$apply2[0];
            var obj = _handleTestCaseArguments$apply2[1];

            // Define number of runs against a function
            var callCount = obj.callCount || 1,
                args = this._handleArguments(obj, callCount),
                expected = this._handleExpected(obj);

            // TODO parse function name out of function, pass to warning, use for test case
            testCases[1] = { fn: fn, obj: obj, callCount: callCount, arguments: args, expected: expected };

            // TODO remove this
            this.results(fn);

            // TODO register test case

            // TODO Pull out the function, check to see what calls it makes
            // TODO Otherwise call through
        }
    }, {
        key: 'run',
        value: function run() {
            var results = [];

            for (var key in testCases) {
                var obj = testCases[key];
                while (obj.arguments.length) {
                    var args = obj.arguments.pop(),
                        value = undefined;

                    // TODO wrap this in a promise block
                    try {

                        // TODO context
                        value = obj.fn.apply(null, args);
                    } catch (e) {

                        // TODO handle test error
                        console.log(e);
                    }

                    results.push(evalFn(obj.obj.arguments, args, obj.expected.type, obj.expected.value, value));

                    // TODO build test results
                    // TODO validate test, return all test cases, check broken count
                }
                // TODO response
            }
            return results;
        }
    }, {
        key: 'results',
        value: function results(fn) {
            var results = this.run();

            console.log('\n            Test:   ' + fn.name + '\n            Runs:   ' + results.length + '\n            Result: ' + (!results.some(function (v) {
                return v.finalResult === false;
            }) ? 'passed' : 'failed') + '\n        ');
        }
    }, {
        key: '_handleTestCaseArguments',
        value: function _handleTestCaseArguments() {
            var arr = [],
                fn = undefined,
                obj = undefined;

            if (typeof (fn = arguments[0]) === 'function' && typeof (obj = arguments[1]) === 'object') {
                arr = [fn, obj];
            } else if (typeof (obj = arguments[0]) === 'object' && typeof obj.calls === 'function') {
                fn = obj.calls;

                delete obj.calls;
                arr = [fn, obj];
            }

            return arr;
        }
    }, {
        key: '_handleArguments',
        value: function _handleArguments(obj, callCount) {
            var args = _objPropertyOrWarn(obj, 'arguments'),
                arr = [];

            if (args) {
                for (var i = 0; i < +callCount; ++i) {
                    var callArr = [];

                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = args[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var value = _step.value;

                            var type = value.type;

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
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator['return']) {
                                _iterator['return']();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    arr.push(callArr);
                }
            } else {
                // TODO counter case
            }

            return arr;
        }
    }, {
        key: '_handleExpected',
        value: function _handleExpected(obj) {
            if (!(typeof obj.expected.type === 'string' && typeof obj.expected.value === 'string')) {
                throw new Error();
            } else {
                return {
                    type: obj.expected.type,
                    value: obj.expected.value
                };
            }
        }
    }]);

    return Semantia;
})();

function _generateNumericArguments(_ref) {
    var order = _ref.order;
    var callCount = _ref.callCount;

    // Always test zero!!!
    var arr = [];

    while (callCount - 1 > arr.length) {
        arr.push(_generateNumericArgument({ order: order }));
    }

    return arr;
}

function _generateNumericArgument(_ref2) {
    var order = _ref2.order;

    var rnd = Math.random() * order + 1;

    // TODO investigate using global.crypto to generate random numbers. Not
    // using it now because it does not give control over number order
    return Math.floor(rnd);
}

function _objPropertyOrWarn(obj, prop) {
    if (obj.hasOwnProperty(prop)) {
        return obj[prop];
    } else {
        console.warn('Object has no property "' + prop + '"');
    }

    return false;
}

// TODO use streams

// TODO the runner by default is spun up by the bin script

var Runner = function Runner(pattern) {
    _classCallCheck(this, Runner);

    var me = this;

    // TODO handles the stream of files
    return new Promise(function (resolve) {
        glob(pattern, function (err, files) {
            return resolve(files);
        });
    }).then(function (files) {
        var proms = [];

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = files[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var file = _step2.value;

                var prom = _systemjs2['default']['import'](file);

                prom.then(function (f) {
                    return console.log(f);
                });
                proms.push(prom);
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                    _iterator2['return']();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        return Promise.all(proms);
    });
};

function evalFn(argumentsArr, args, type, expression, value) {

    var argString = '',
        result = {};
    for (var i = 0; i < args.length; ++i) {
        var arg = args[i];
        argString += 'var ' + argumentsArr[i].name + ' = ' + arg + '; ';
    }

    // TODO return expected value && value
    try {
        result.arguments = args;
        result.expectedType = type;
        result.expectedValue = eval(argString + ' var semantiaValue = ' + expression + '; semantiaValue;');
        result.finalResult = eval('\n            ' + argString + ' var semantiaValue = ' + expression + ';\n            semantiaValue === ' + value + ' && typeof semantiaValue === \'' + type + '\';\n        ');
    } catch (e) {}

    return result;
}

exports['default'] = Semantia;
exports.Runner = Runner;

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