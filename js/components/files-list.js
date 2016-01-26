/** @jsx hJSX */
/*eslint-disable no-unused-vars*/
import {Observable} from 'rx';
import {hJSX} from '@cycle/dom';
/*eslint-enable no-unused-vars*/
import Navigation from './navigation';

export default function FilesList ({DOM, HTTP, props}) {
    const GITHUB_SEARCH_API = 'https://api.github.com/repos/';

    const dirClick$ = DOM.select('.enter-dir')
        .events('click')
        .do(ev => ev.preventDefault())
        .map(ev => ev.target.textContent);

    const navigation = Navigation({
        DOM: DOM,
        props: { dirClick$: dirClick$.merge(props.name$.map(() => null)) }
    });

    const request$ = navigation.path$
        .withLatestFrom(props.name$.map(name => `${GITHUB_SEARCH_API}${name}/contents`), (path, url) => `${url}${path}`);

    const response$ = HTTP.flatMap(rawResponse$ => rawResponse$.catch(() => Observable.empty()));

    const vtree$ = response$
        .map(res => res.body)
        .map(files => files.sort((a, b) => {
            if (a.type > b.type) return 1;
            if (a.type < b.type) return -1;
            return 0;
        }))
        .startWith([])
        .withLatestFrom(navigation.DOM, (files, Path) => { return {files, Path} })
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
    return {
        DOM: vtree$,
        HTTP: request$
    };
}
