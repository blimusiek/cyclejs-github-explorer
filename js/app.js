/** @jsx hJSX */
import Cycle from '@cycle/core';
/*eslint-disable no-unused-vars*/
import {makeDOMDriver, hJSX} from '@cycle/dom';
/*eslint-enable no-unused-vars*/

function main({DOM}) {
    const submitForm$ = DOM.select('#repo')
        .events('submit')
        .do(ev => ev.preventDefault());

    const repo$ = DOM.select('.repo-name')
        .events('input')
        .map(ev => ev.target.value);

    const changeRepo$ = submitForm$.withLatestFrom(repo$, (sf, repo) => repo);

    const vtree$ = changeRepo$
        .startWith('')
        .map((repo) =>
            <div>
                <form id="repo" className="form-inline">
                    <div className="form-group">
                        <label for="repo-name">Full Repo Name</label>
                        <input type="text" name="repo-name" className="form-control repo-name" />
                    </div>
                    <input type="submit" className="btn btn-default" value="Get repo filesystem!" />
                </form>
                <hr />
                {repo}
            </div>
        );
    return {
        DOM: vtree$
    };
}

const drivers = {
     DOM: makeDOMDriver('#app')
};

Cycle.run(main, drivers);
