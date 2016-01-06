/** @jsx hJSX */
import Cycle from '@cycle/core';
/*eslint-disable no-unused-vars*/
import {makeDOMDriver, hJSX} from '@cycle/dom';
/*eslint-enable no-unused-vars*/
import {makeHTTPDriver} from '@cycle/http';

function main({DOM, HTTP}) {
    const submitForm$ = DOM.select('#repo')
        .events('submit')
        .do(ev => ev.preventDefault());

    const input$ = DOM.select('.repo-name')
        .events('input')
        .map(ev => ev.target.value);

    const changeRepo$ = submitForm$.withLatestFrom(input$, (sf$, name) => name);

    const GITHUB_SEARCH_API = 'https://api.github.com/repos/';

    const request$ =  changeRepo$.map(name => `${GITHUB_SEARCH_API}${name}/contents`);

    const vtree$ = HTTP
        .flatMap(x => x)
        .map(res => res.body)
        .startWith([])
        .map(files =>
            <div>
                <form id="repo" className="form-inline">
                    <div className="form-group">
                        <label for="repo-name">Full Repo Name</label>
                        <input type="text" name="repo-name" className="form-control repo-name" />
                    </div>
                    <input type="submit" className="btn btn-default" value="Get repo filesystem!" />
                </form>
                <hr />
                <div className="row">
                    <div className="col-md-12">
                        {JSON.stringify(files)}
                    </div>
                </div>
            </div>
        );
    return {
        DOM: vtree$,
        HTTP: request$
    };
}

const drivers = {
     DOM: makeDOMDriver('#app'),
     HTTP: makeHTTPDriver()
};

Cycle.run(main, drivers);
