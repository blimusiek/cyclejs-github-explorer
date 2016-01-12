/** @jsx hJSX */
/*eslint-disable no-unused-vars*/
import {hJSX} from '@cycle/dom';
/*eslint-enable no-unused-vars*/

export default function FilesList ({DOM, HTTP, props$}) {
    const GITHUB_SEARCH_API = 'https://api.github.com/repos/';


    const dirClick$ = DOM.select('.enter-dir')
        .events('click')
        .do(ev => ev.preventDefault())
        .map(ev => ev.target.textContent);

    const path$ = dirClick$
        .scan((p, c) => { return `${p}/${c}` }, '')
        .startWith('');

    const request$ = props$.map(name => `${GITHUB_SEARCH_API}${name}/contents`)
        .combineLatest(path$, (url, path) => `${url}${path}`);

    const vtree$ = HTTP
        .flatMap(x => x)
        .map(res => res.body)
        .map(files => files.sort((a, b) => {
            if (a.type > b.type) return 1;
            if (a.type < b.type) return -1;
            return 0;
        }))
        .withLatestFrom(path$, (files, path) => { return {files: files, path: path} })
        .startWith({path: '/', files: []})
        .map(dir =>
            <div className="row">
                <div className="col-md-12">
                    <table className="table">
                        <caption>{dir.path}</caption>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th className="text-right"></th>
                            </tr>
                        </thead>
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
