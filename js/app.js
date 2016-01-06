/** @jsx hJSX */
import Cycle from '@cycle/core';
import {Observable} from 'rx';
/*eslint-disable no-unused-vars*/
import {makeDOMDriver, hJSX} from '@cycle/dom';
/*eslint-enable no-unused-vars*/

function main() {
    return {
        DOM: Observable.timer(0, 1000)
            .map(i => <div>Seconds elapsed {i}</div>)
    };
}

const drivers = {
     DOM: makeDOMDriver('#app')
};

Cycle.run(main, drivers);
