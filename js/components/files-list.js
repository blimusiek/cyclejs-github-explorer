/** @jsx hJSX */
/*eslint-disable no-unused-vars*/
import {hJSX} from '@cycle/dom';
/*eslint-enable no-unused-vars*/

export default function FilesList ({DOM, HTTP, props$}) {
    const GITHUB_SEARCH_API = 'https://api.github.com/repos/';
    const ROOT_REPO_PATH = '/';
    const PATH_SEPARATOR = '/';
    const BACK_SIGNAL = '..';

    /*eslint-disable no-unused-vars*/
    const backClick$ = DOM.select('.go-back')
        .events('click')
        .do(ev => ev.preventDefault())
    /*eslint-enable no-unused-vars*/

    const dirClick$ = DOM.select('.enter-dir')
        .events('click')
        .do(ev => ev.preventDefault())
        .map(ev => ev.target.textContent);

    const path$ = dirClick$
        .merge(props$.map(() => null))
        .merge(backClick$.map(() => BACK_SIGNAL))
        .scan((p, c) => {
            // we need to reset path when someone changed repo
            if (null === c) return ROOT_REPO_PATH;
            if (BACK_SIGNAL === c) return p.split(PATH_SEPARATOR).slice(0, -1).join(PATH_SEPARATOR);
            return `${p}${PATH_SEPARATOR}${c}`;
        }, '')
        .map(path => path.replace('//', ROOT_REPO_PATH))
        .do(x => console.log(x))
        .startWith(ROOT_REPO_PATH);

    const request$ = path$
        .withLatestFrom(props$.map(name => `${GITHUB_SEARCH_API}${name}/contents`), (path, url) => `${url}${path}`);

    const vtree$ = HTTP
        .flatMap(x => x)
        .map(res => res.body)
        .map(files => files.sort((a, b) => {
            if (a.type > b.type) return 1;
            if (a.type < b.type) return -1;
            return 0;
        }))
        .withLatestFrom(path$, (files, path) => { return {files: files, path: path} })
        .startWith({path: ROOT_REPO_PATH, files: []})
        .map(dir =>
            <div className="row">
                <div className="col-md-12">
                    <table className="table">
                        <caption>{dir.path}</caption>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th className="text-right">
                                    {ROOT_REPO_PATH !== dir.path ? <button className="btn btn-default btn-xs go-back">Go Back</button> : ''}
                                </th>
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
