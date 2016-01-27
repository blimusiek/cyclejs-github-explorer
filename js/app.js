/** @jsx hJSX */
import {Observable} from 'rx';
import Cycle from '@cycle/core';
/*eslint-disable no-unused-vars*/
import {makeDOMDriver, hJSX} from '@cycle/dom';
/*eslint-enable no-unused-vars*/
import {makeHTTPDriver} from '@cycle/http';

import SearchForm from './components/search-form';
import FilesList from './components/files-list';

function main({DOM, HTTP}) {
    const searchForm = SearchForm({DOM});
    const fileList = FilesList({DOM: DOM, HTTP: HTTP, props: { name$: searchForm.value$ }});

    const vtree$ = Observable.combineLatest(
        fileList.DOM, searchForm.DOM,
        ((FilesList, SearchForm) =>
            <div>
                {SearchForm}
                <hr />
                {FilesList}
            </div>
        )
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
