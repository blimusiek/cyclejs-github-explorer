/** @jsx hJSX */
import Cycle from '@cycle/core';
/*eslint-disable no-unused-vars*/
import {makeDOMDriver, hJSX} from '@cycle/dom';
/*eslint-enable no-unused-vars*/
import {makeHTTPDriver} from '@cycle/http';

import FileList from './components/files-list';

function main({DOM, HTTP}) {
    const submitForm$ = DOM.select('#repo')
        .events('submit')
        .do(ev => ev.preventDefault());

    const input$ = DOM.select('.repo-name')
        .events('input')
        .map(ev => ev.target.value);

    const repoName$ = submitForm$.withLatestFrom(input$, (sf$, name) => name);

    const fileList = FileList({HTTP: HTTP, props$: repoName$});


    const vtree$ = fileList.HTTP
        .flatMap(x => x)
        .map(res => res.body)
        .startWith([])
        .map(() =>
            <div>
                <form id="repo" className="form-inline">
                    <div className="form-group">
                        <label for="repo-name">Full Repo Name</label>
                        <input type="text" name="repo-name" className="form-control repo-name" />
                    </div>
                    <input type="submit" className="btn btn-default" value="Get repo filesystem!" />
                </form>
                <hr />
                {fileList.DOM}
            </div>
        );
    return {
        DOM: vtree$,
        HTTP: fileList.HTTP
    };
}

const drivers = {
     DOM: makeDOMDriver('#app'),
     HTTP: makeHTTPDriver()
};

Cycle.run(main, drivers);
