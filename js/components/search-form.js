/** @jsx hJSX */
import {Observable} from 'rx';
/*eslint-disable no-unused-vars*/
import {hJSX} from '@cycle/dom';
/*eslint-enable no-unused-vars*/

function intent(DOM) {
    const submitForm$ = DOM.select('#repo')
        .events('submit')
        .do(ev => ev.preventDefault());

    const input$ = DOM.select('.repo-name')
        .events('input')
        .map(ev => ev.target.value);

    return {submitForm$, input$};
}

function model(actions) {
    return actions.submitForm$.withLatestFrom(actions.input$, (sf$, name) => name);
}

function view() {
    return Observable.of(
        <form id="repo" className="form-inline">
            <div className="form-group">
                <label for="repo-name">Full Repo Name</label>
                <input type="text" name="repo-name" className="form-control repo-name" />
            </div>
            <input type="submit" className="btn btn-default" value="Get repo filesystem!" />
        </form>
    );
}

export default function SearchForm ({DOM}) {
    const actions = intent(DOM);
    const state$ = model(actions);
    const vtree$ = view();

    return {
        DOM: vtree$,
        value$: state$
    };
}
