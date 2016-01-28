/** @jsx hJSX */
import {Observable} from 'rx';
/*eslint-disable no-unused-vars*/
import {hJSX} from '@cycle/dom';
/*eslint-enable no-unused-vars*/
import Navigation from './navigation';

function intent (DOM, HTTP) {
    const dirClick$ = DOM.select('.enter-dir')
        .events('click')
        .do(ev => ev.preventDefault())
        .map(ev => ev.target.textContent);

    const response$ = HTTP;

    return { dirClick$, response$ };
}

function model (actions) {
    const response$ = actions.response$
        .flatMap(rawResponse$ => rawResponse$.catch(() => Observable.empty()))
        .map(res => res.body)
        .map(files => files.sort((a, b) => {
            if (a.type > b.type) return 1;
            if (a.type < b.type) return -1;
            return 0;
        }))
        .startWith([]);

    return {
        response$
    }
}

function view (state$, navigationDOM) {
    const vtree$ = state$
        .withLatestFrom(navigationDOM, (files, Path) => { return {files, Path} })
        .map(dir =>
            <div className="row">
                <div className="col-md-12">
                    <table className="table">
                        {dir.Path}
                        <tbody>
                            {dir.files
                                .map(file =>
                                    <tr>
                                        <td>{file.type === 'dir' ? <a className="enter-dir" href="#">{file.name}</a> : file.name}</td>
                                        <td className="text-right"></td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );

    return vtree$;
}

function http(props) {
    const GITHUB_SEARCH_API = 'https://api.github.com/repos/';

    const base$ = props.name$.map(name => `${GITHUB_SEARCH_API}${name}/contents`);

    const url$ = props.path$
        .withLatestFrom(base$, (path, url) => `${url}${path}`);

    return url$;
}

export default function FilesList ({DOM, HTTP, props}) {

    const actions = intent(DOM, HTTP);

    const navigation = Navigation({
        DOM: DOM,
        props: { dirClick$: Observable.merge(actions.dirClick$, props.name$.map(() => null)) }
    });
    const request$ = http({path$: navigation.path$, name$: props.name$});

    const state = model(actions, props);
    const vtree$ = view(state.response$, navigation.DOM);

    return {
        DOM: vtree$,
        HTTP: request$
    };
}
